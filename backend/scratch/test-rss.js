import { XMLParser } from 'fast-xml-parser';
import fetch from 'node-fetch';

const CYBER_FEEDS = [
  { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
  { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/' },
  { name: 'CISA Alerts', url: 'https://www.cisa.gov/news.xml' },
  { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/' },
  { name: 'Security Affairs', url: 'https://securityaffairs.com/feed' },
  { name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml' },
];

async function testFeeds() {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  
  for (const feed of CYBER_FEEDS) {
    console.log(`\nTesting ${feed.name}...`);
    try {
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
      });

      if (!response.ok) {
        console.log(`Failed with status ${response.status}`);
        continue;
      }

      const xml = await response.text();
      const result = parser.parse(xml);
      
      const channel = result?.rss?.channel || result?.feed;
      const items = channel?.item || channel?.entry || [];
      const count = Array.isArray(items) ? items.length : (items ? 1 : 0);
      
      console.log(`Found ${count} items`);
      if (count > 0) {
          const first = Array.isArray(items) ? items[0] : items;
          console.log(`First title: ${first.title?.['#text'] || first.title || 'N/A'}`);
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
}

testFeeds();
