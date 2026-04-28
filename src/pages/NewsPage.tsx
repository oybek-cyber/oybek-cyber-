import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  AlertTriangle,
  AlertCircle,
  Info,
  Search,
  ExternalLink,
  Clock,
  Rss,
  ChevronRight,
  Filter,
  RefreshCw,
  Wifi,
  WifiOff,
  Loader2,
  Database,
} from 'lucide-react'
import { newsStore, NewsItem } from '@utils/adminStore'
import { CommunityChat } from '@components/organisms/CommunityChat'

// ─── Types ────────────────────────────────────────────────────────────────────
interface LiveArticle {
  id: string
  title: string
  description: string
  link: string
  source: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  publishedAt: string
  imageUrl?: string
  isLive?: boolean
}

type SeverityKey = 'critical' | 'high' | 'medium' | 'low'

// ─── Severity config ──────────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  critical: {
    label: 'KRITIK',
    icon: AlertCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/20 text-red-400 border border-red-500/40',
    dot: 'bg-red-500',
  },
  high: {
    label: 'YUQORI',
    icon: AlertTriangle,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
    dot: 'bg-orange-500',
  },
  medium: {
    label: "O'RTA",
    icon: Shield,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    badge: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
    dot: 'bg-yellow-500',
  },
  low: {
    label: 'PAST',
    icon: Info,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-400 border border-green-500/40',
    dot: 'bg-green-500',
  },
}

const FILTER_OPTIONS: { label: string; value: 'all' | SeverityKey }[] = [
  { label: 'Barchasi', value: 'all' },
  { label: 'Kritik', value: 'critical' },
  { label: 'Yuqori', value: 'high' },
  { label: "O'rta", value: 'medium' },
  { label: 'Past', value: 'low' },
]

// ─── Source filter options ────────────────────────────────────────────────────
const SOURCE_OPTIONS = [
  'Barchasi',
  'The Hacker News',
  'BleepingComputer',
  'CISA Alerts',
  'Krebs on Security',
  'Security Affairs',
  'Dark Reading',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Hozirgina'
  if (mins < 60) return `${mins} daqiqa oldin`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} soat oldin`
  const days = Math.floor(hours / 24)
  return `${days} kun oldin`
}

function adminNewsToLive(item: NewsItem): LiveArticle {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    link: '#',
    source: item.source,
    severity: item.severity as SeverityKey,
    publishedAt: item.publishedAt,
    isLive: false,
  }
}

// ─── NewsCard ──────────────────────────────────────────────────────────────────
const NewsCard: React.FC<{ item: LiveArticle; index: number }> = ({ item, index }) => {
  const cfg = SEVERITY_CONFIG[item.severity] || SEVERITY_CONFIG.low
  const Icon = cfg.icon
  const isExternal = item.link && item.link !== '#'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -3, scale: 1.005 }}
      className={`group relative rounded-2xl border ${cfg.border} ${cfg.bg} p-5
        hover:shadow-xl transition-all duration-300 overflow-hidden cursor-default`}
    >
      {/* Shine glow */}
      <div
        className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-0
          group-hover:opacity-20 transition-opacity duration-500 ${cfg.dot}`}
      />

      {/* Top bar */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`p-1.5 rounded-lg ${cfg.bg} border ${cfg.border}`}>
            <Icon size={15} className={cfg.color} />
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge} tracking-widest`}>
            {cfg.label}
          </span>
          {item.isLive !== false && (
            <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
            </span>
          )}
          {item.severity === 'critical' && (
            <span className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      {isExternal ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link block mb-2"
        >
          <h3 className="text-white font-bold text-base leading-snug group-hover/link:text-cyber-blue transition-colors line-clamp-2">
            {item.title}
            <ExternalLink size={12} className="inline ml-1.5 opacity-0 group-hover/link:opacity-60 transition-opacity" />
          </h3>
        </a>
      ) : (
        <h3 className="text-white font-bold text-base leading-snug mb-2 line-clamp-2">{item.title}</h3>
      )}

      {/* Description */}
      {item.description && (
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-xs">
          <Rss size={11} className="text-gray-500" />
          <span className="font-semibold text-gray-400">{item.source}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Clock size={11} />
          <span>{timeAgo(item.publishedAt)}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
const StatsBar: React.FC<{ items: LiveArticle[]; isLive: boolean }> = ({ items, isLive }) => {
  const counts = {
    critical: items.filter((n) => n.severity === 'critical').length,
    high: items.filter((n) => n.severity === 'high').length,
    medium: items.filter((n) => n.severity === 'medium').length,
    low: items.filter((n) => n.severity === 'low').length,
  }
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {(Object.entries(counts) as [SeverityKey, number][]).map(([key, count]) => {
        const cfg = SEVERITY_CONFIG[key]
        const Icon = cfg.icon
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className={`flex items-center gap-3 rounded-xl border ${cfg.border} ${cfg.bg} px-4 py-3`}
          >
            <Icon size={16} className={cfg.color} />
            <div>
              <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
              <p className="text-gray-500 text-xs">{cfg.label}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Main NewsPage ─────────────────────────────────────────────────────────────
export const NewsPage: React.FC = () => {
  const [liveArticles, setLiveArticles] = useState<LiveArticle[]>([])
  const [adminNews, setAdminNews] = useState<LiveArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [filter, setFilter] = useState<'all' | SeverityKey>('all')
  const [sourceFilter, setSourceFilter] = useState('Barchasi')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'live' | 'local'>('live')
  const [refreshing, setRefreshing] = useState(false)

  // Load admin (local) news
  useEffect(() => {
    const load = () => setAdminNews(newsStore.getAll().map(adminNewsToLive))
    load()
    window.addEventListener('admin_news_updated', load)
    return () => window.removeEventListener('admin_news_updated', load)
  }, [])

  // Fetch live news from backend
  const fetchLiveNews = useCallback(async (force = false) => {
    setRefreshing(true)
    setError(null)
    try {
      const url = `http://localhost:5000/api/news/live${force ? '?refresh=true' : ''}`
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
      if (!res.ok) throw new Error(`Server xatosi: ${res.status}`)
      const json = await res.json()
      if (json.success && json.data?.articles) {
        setLiveArticles(json.data.articles.map((a: any) => ({ ...a, isLive: true })))
        setLastUpdated(json.data.cache?.lastFetched || new Date().toISOString())
        setIsOnline(true)
      }
    } catch (err: any) {
      setError('Internet yoki backend bilan bog\'lanib bo\'lmadi. Oflayn rejimda ishlayapti.')
      setIsOnline(false)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchLiveNews()
    // Auto-refresh every 10 minutes
    const interval = setInterval(() => fetchLiveNews(), 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchLiveNews])

  const currentItems = tab === 'live' ? liveArticles : adminNews

  const filtered = currentItems.filter((item) => {
    const matchSeverity = filter === 'all' || item.severity === filter
    const matchSource = sourceFilter === 'Barchasi' || item.source === sourceFilter
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.source.toLowerCase().includes(search.toLowerCase())
    return matchSeverity && matchSource && matchSearch
  })

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          'radial-gradient(ellipse at 65% 0%, rgba(0,80,200,0.13) 0%, #020817 55%), #020817',
      }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-cyber-blue text-sm font-medium mb-3">
            <Rss size={14} />
            <span>Real-time Threat Intelligence</span>
            <ChevronRight size={14} className="text-gray-600" />
            <span className={`flex items-center gap-1 text-xs ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isOnline ? 'Jonli' : 'Oflayn'}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Xavfsizlik{' '}
            <span className="bg-gradient-to-r from-cyber-blue to-blue-400 bg-clip-text text-transparent">
              Yangiliklari
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-gray-400 text-base">
              The Hacker News, BleepingComputer, CISA, Krebs on Security va boshqa saytlardan har 30 daqiqada yangilanadi
            </p>
            {lastUpdated && (
              <span className="text-gray-600 text-xs flex items-center gap-1">
                <Clock size={11} />
                {timeAgo(lastUpdated)} yangilangan
              </span>
            )}
          </div>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setTab('live')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'live'
                ? 'bg-cyber-blue text-white shadow-lg shadow-cyber-blue/30'
                : 'text-gray-400 hover:text-white bg-cyber-navy/40 border border-cyber-blue/20'
              }`}
          >
            <div className="relative flex h-2 w-2">
              {tab === 'live' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              )}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
            </div>
            Jonli yangiliklar
            <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">{liveArticles.length}</span>
          </button>
          <button
            onClick={() => setTab('local')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'local'
                ? 'bg-cyber-blue text-white shadow-lg shadow-cyber-blue/30'
                : 'text-gray-400 hover:text-white bg-cyber-navy/40 border border-cyber-blue/20'
              }`}
          >
            <Database size={14} />
            Admin yangiliklari
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === 'local' ? 'bg-white/20' : 'bg-gray-700'}`}>
              {adminNews.length}
            </span>
          </button>
          <button
            onClick={() => fetchLiveNews(true)}
            disabled={refreshing}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              text-gray-400 hover:text-white bg-cyber-navy/40 border border-cyber-blue/20
              hover:border-cyber-blue/50 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Yangilash
          </button>
        </div>

        {/* Stats */}
        {!loading && <StatsBar items={currentItems} isLive={tab === 'live'} />}

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 mb-5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-sm"
          >
            <WifiOff size={16} className="shrink-0" />
            <span>{error} — Admin yangiliklari ko'rsatilmoqda.</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Search + Filter bar */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              {/* Search */}
              <div className="relative flex-1">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Yangiliklar qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-cyber-navy/40 border border-cyber-blue/20 text-white rounded-xl
                    pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-cyber-blue/60 transition-colors
                    placeholder-gray-600 backdrop-blur-sm"
                />
              </div>

              {/* Severity filter */}
              <div className="flex items-center gap-2 bg-cyber-navy/40 border border-cyber-blue/20
                rounded-xl px-3 py-2 backdrop-blur-sm flex-wrap"
              >
                <Filter size={13} className="text-gray-500 mr-1 shrink-0" />
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                      ${filter === opt.value
                        ? 'bg-cyber-blue text-white shadow-lg shadow-cyber-blue/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Source filter (only for live tab) */}
            {tab === 'live' && liveArticles.length > 0 && (
              <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                {SOURCE_OPTIONS.map((src) => (
                  <button
                    key={src}
                    onClick={() => setSourceFilter(src)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                      ${sourceFilter === src
                        ? 'border-cyber-blue/50 bg-cyber-blue/15 text-cyber-blue'
                        : 'border-cyber-blue/10 text-gray-500 hover:text-gray-300 hover:border-cyber-blue/30'
                      }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            )}

            {/* Results count */}
            <p className="text-gray-500 text-sm mb-5">
              {loading ? 'Yuklanmoqda...' : `${filtered.length} ta yangilik topildi`}
            </p>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 size={40} className="text-cyber-blue animate-spin" />
                <p className="text-gray-400 text-sm">
                  Kiberxavfsizlik yangiliklari yuklanmoqda...
                </p>
              </div>
            )}

            {/* Cards Grid */}
            {!loading && (
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-24"
                  >
                    <Shield size={48} className="text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">Yangilik topilmadi</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {filtered.map((item, idx) => (
                      <NewsCard key={item.id} item={item} index={idx} />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <CommunityChat />
            
            {/* Community stats or info can go here */}
            <div className="bg-cyber-blue/5 border border-cyber-blue/10 rounded-2xl p-5">
              <h4 className="text-white font-bold text-sm mb-3">HAMJAMIYAT QOIDALARI</h4>
              <ul className="text-xs text-gray-400 space-y-2">
                <li className="flex gap-2">• Bir-biringizga xushmuomala bo'ling</li>
                <li className="flex gap-2">• Spam yoki reklama taqiqlanadi</li>
                <li className="flex gap-2">• Kiberxavfsizlik mavzusida suhbatlashing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sources footer */}
        {!loading && tab === 'live' && liveArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 pt-6 border-t border-cyber-blue/10 text-center"
          >
            <p className="text-gray-600 text-xs mb-2">Yangiliklar manbalari</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['The Hacker News', 'BleepingComputer', 'CISA', 'Krebs on Security'].map(
                (src) => (
                  <span
                    key={src}
                    className="text-xs text-gray-500 bg-cyber-navy/40 border border-cyber-blue/10 px-3 py-1 rounded-full"
                  >
                    {src}
                  </span>
                )
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
