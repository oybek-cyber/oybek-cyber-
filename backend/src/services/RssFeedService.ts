import { XMLParser } from 'fast-xml-parser';
import fetch from 'node-fetch';
import logger from '@config/logger.js';

// ─── Kiberxavfsizlik yangiliklari uchun RSS manbalari ─────────────────────────
const CYBER_FEEDS = [
  {
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    severity: 'high' as const,
  },
  {
    name: 'BleepingComputer',
    url: 'https://www.bleepingcomputer.com/feed/',
    severity: 'high' as const,
  },
  {
    name: 'CISA Alerts',
    url: 'https://www.cisa.gov/news.xml',
    severity: 'critical' as const,
  },
  {
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    severity: 'high' as const,
  },
  {
    name: 'Security Affairs',
    url: 'https://securityaffairs.com/feed',
    severity: 'medium' as const,
  },
  {
    name: 'Dark Reading',
    url: 'https://www.darkreading.com/rss.xml',
    severity: 'medium' as const,
  },
];

// Keywords → severity mapping
const CRITICAL_KEYWORDS = ['zero-day', '0-day', 'critical', 'rce', 'remote code', 'ransomware', 'exploit', 'backdoor', 'apt'];
const HIGH_KEYWORDS = ['vulnerability', 'cve', 'patch', 'breach', 'attack', 'malware', 'phishing', 'trojan'];

export interface FeedArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  publishedAt: string;
  imageUrl?: string;
}

// ─── In-memory cache (30 daqiqa) ──────────────────────────────────────────────
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
let cachedArticles: FeedArticle[] = [];
let lastFetched: number = 0;
let isFetching = false;

// ─── Severity hisoblash ────────────────────────────────────────────────────────
function detectSeverity(text: string, defaultSeverity: FeedArticle['severity']): FeedArticle['severity'] {
  const lower = text.toLowerCase();
  if (CRITICAL_KEYWORDS.some((kw) => lower.includes(kw))) return 'critical';
  if (HIGH_KEYWORDS.some((kw) => lower.includes(kw))) return 'high';
  return defaultSeverity;
}

// ─── HTML taglarni tozalash ───────────────────────────────────────────────────
function stripHtml(html: string): string {
  return (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim()
    .slice(0, 300);
}

// ─── Bitta feed parse qilish ──────────────────────────────────────────────────
async function parseFeed(
  feedUrl: string,
  sourceName: string,
  defaultSeverity: FeedArticle['severity']
): Promise<FeedArticle[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const response = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      logger.warn(`RSS fetch failed for ${sourceName}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const result = parser.parse(xml);

    // RSS 2.0 format
    const channel = result?.rss?.channel || result?.feed;
    let items: any[] = channel?.item || channel?.entry || [];
    
    // Ensure items is an array (fast-xml-parser returns object for single item)
    if (!Array.isArray(items)) {
      items = [items];
    }

    const articles: FeedArticle[] = [];

    for (const item of items.slice(0, 8)) {
      // Only take 8 per source
      const title = (item.title?.['#text'] || item.title || '').toString().trim();
      const description = stripHtml(
        item.description?.['#text'] || item.description || item.summary?.['#text'] || item.summary || ''
      );
      const link = (item.link?.['@_href'] || item.link || item.guid?.['#text'] || item.guid || '').toString();
      const pubDate = item.pubDate || item.published || item.updated || new Date().toISOString();

      if (!title || !link) continue;

      const severity = detectSeverity(title + ' ' + description, defaultSeverity);

      // Try to get image
      const imageUrl =
        item['media:content']?.['@_url'] ||
        item['media:thumbnail']?.['@_url'] ||
        item.enclosure?.['@_url'] ||
        undefined;

      articles.push({
        id: `${sourceName}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
        title,
        description,
        link,
        source: sourceName,
        severity,
        publishedAt: new Date(pubDate).toISOString(),
        imageUrl,
      });
    }

    logger.info(`✅ ${sourceName}: ${articles.length} yangilik yuklandi`);
    return articles;
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      logger.warn(`⏱️ ${sourceName}: timeout`);
    } else {
      logger.warn(`❌ ${sourceName}: ${err.message}`);
    }
    return [];
  }
}

// ─── Barcha feedlardan yangiliklar tortish ─────────────────────────────────────
async function fetchAllFeeds(): Promise<FeedArticle[]> {
  logger.info('🔄 RSS feedlardan yangiliklar yuklanmoqda...');

  const results = await Promise.allSettled(
    CYBER_FEEDS.map((feed) => parseFeed(feed.url, feed.name, feed.severity))
  );

  const articles: FeedArticle[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  }

  // Sanasi bo'yicha tartiblash (yangi → eski)
  articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Dublikatlarni olib tashlash
  const seen = new Set<string>();
  const unique = articles.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  logger.info(`📰 Jami ${unique.length} ta yangilik yuklandi`);
  return unique;
}

// ─── Public API ───────────────────────────────────────────────────────────────
export const RssFeedService = {
  async getLiveNews(forceRefresh = false): Promise<FeedArticle[]> {
    const now = Date.now();
    const cacheValid = now - lastFetched < CACHE_TTL_MS && cachedArticles.length > 0;

    if (cacheValid && !forceRefresh) {
      logger.debug(`Cache ishlatilmoqda: ${cachedArticles.length} yangilik`);
      return cachedArticles;
    }

    // Agar hozir ham yuklanayotgan bo'lsa, cache qaytarish
    if (isFetching && cachedArticles.length > 0) {
      return cachedArticles;
    }

    isFetching = true;
    try {
      const articles = await fetchAllFeeds();
      if (articles.length > 0) {
        cachedArticles = articles;
        lastFetched = now;
      }
      return cachedArticles;
    } finally {
      isFetching = false;
    }
  },

  getCacheStatus() {
    return {
      cached: cachedArticles.length,
      lastFetched: lastFetched ? new Date(lastFetched).toISOString() : null,
      nextRefresh: lastFetched
        ? new Date(lastFetched + CACHE_TTL_MS).toISOString()
        : null,
    };
  },
};
