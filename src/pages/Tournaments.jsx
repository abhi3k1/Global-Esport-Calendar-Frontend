import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API = 'http://localhost:8080/api/tournaments'

const GAMES       = ['All Games', 'Valorant', 'BGMI', 'Free Fire', 'CS:GO', 'Dota 2']
const REGIONS     = ['All Regions', 'India', 'Southeast Asia', 'APAC', 'Global']
const TIERS       = ['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3']
const DATE_RANGES = ['All', 'Today', 'Upcoming', 'This Week', 'This Month']

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  if (status === 'live') {
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
        Live
      </span>
    )
  }
  if (status === 'registration') {
    return (
      <span className="px-2 py-0.5 bg-[#ff7a2d] text-black text-[10px] font-bold rounded uppercase tracking-wider">
        Registration Open
      </span>
    )
  }
  return (
    <span className="px-2 py-0.5 bg-[#1f2937] text-cyan-300 text-[10px] font-bold rounded uppercase tracking-wider border border-cyan-800">
      Upcoming
    </span>
  )
}

function TierBadge({ tier }) {
  const colors = {
    'Tier 1': 'bg-yellow-500 text-black',
    'Tier 2': 'bg-blue-500 text-white',
    'Tier 3': 'bg-gray-500 text-white',
  }
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${colors[tier] || 'bg-gray-600 text-white'}`}>
      {tier}
    </span>
  )
}

function TournamentCard({ t, onRegister, onNotify }) {
  return (
    <div className="bg-[#0f0f10] rounded-xl border border-[#1f1f21] overflow-hidden flex flex-col hover:border-[#ff7a2d]/50 transition-all duration-200 hover:-translate-y-0.5 shadow-lg">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-[#111]">
        <img
          src={t.image}
          alt={t.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-2 left-2"><TierBadge tier={t.tier} /></div>
        <div className="absolute top-2 right-2"><StatusBadge status={t.status} /></div>

        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[11px] text-gray-300 font-semibold border border-white/10">
          {t.gameTag || t.game}
        </div>

        {t.status === 'live' && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-red-700/80 rounded text-[10px] text-white font-semibold">
            {t.participants.current}/{t.participants.max}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">{t.title}</h3>

        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <span>🏢</span><span>{t.organizer}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-400 text-xs">
          <span className="flex items-center gap-1"><span>📅</span>{t.date}</span>
          <span className="flex items-center gap-1"><span>🌐</span>{t.region}</span>
        </div>

        <div className="flex items-end justify-between mt-auto pt-2 border-t border-[#1f1f21]">
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Prize Pool</div>
            <div className="text-sm font-bold text-[#ff7a2d]">{t.prizePool}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Participants</div>
            <div className="text-sm font-semibold text-gray-200">{t.participants.current}/{t.participants.max}</div>
          </div>
        </div>

        <div className="mt-2">
          {t.status === 'live' ? (
            <button className="w-full py-1.5 bg-transparent border border-[#ff7a2d] text-[#ff7a2d] text-xs font-bold rounded hover:bg-[#ff7a2d]/10 flex items-center justify-center gap-1 transition-colors">
              ▶ Watch
            </button>
          ) : t.status === 'registration' ? (
            <button onClick={() => onRegister(t.id)} className="w-full py-1.5 bg-[#ff7a2d] text-black text-xs font-bold rounded hover:bg-[#ff9a4d] flex items-center justify-center gap-1 transition-colors">
              ● Register
            </button>
          ) : (
            <button onClick={() => onNotify(t.id)} className="w-full py-1.5 bg-[#1f2937] text-cyan-300 text-xs font-bold rounded hover:bg-[#243447] transition-colors">
              Notify Me
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function Tournaments() {
  const [search, setSearch]       = useState('')
  const [game, setGame]           = useState('All Games')
  const [region, setRegion]       = useState('All Regions')
  const [tier, setTier]           = useState('All Tiers')
  const [dateRange, setDateRange] = useState('All')

  const [tournaments, setTournaments] = useState([])
  const [totalCount, setTotalCount]   = useState(0)
  const [loading, setLoading]         = useState(true)

  const [stats, setStats] = useState({
    liveTournaments: 0,
    upcomingThisWeek: 0,
    activeRegions: 0,
    totalPrizePool: '$0',
    activeTournaments: 0,
    tier2Events: 0,
    tier3Events: 0,
  })

  // ── Fetch stats on mount ──
  useEffect(() => {
    axios.get(`${API}/stats`).then((res) => {
      if (res?.data) setStats(res.data)
    }).catch(() => {})
  }, [])

  // ── Fetch tournaments when filters change ──
  const fetchTournaments = useCallback(() => {
    setLoading(true)
    const params = { page: 0, size: 50 }
    if (search) params.search = search
    if (game !== 'All Games') params.game = game
    if (region !== 'All Regions') params.region = region
    if (tier !== 'All Tiers') params.tier = tier
    if (dateRange && dateRange !== 'All') params.dateRange = dateRange

    axios.get(API, { params }).then((res) => {
      // Spring Page object: { content: [...], totalElements: N, ... }
      const data = res?.data
      if (data?.content) {
        setTournaments(data.content)
        setTotalCount(data.totalElements ?? data.content.length)
      } else if (Array.isArray(data)) {
        setTournaments(data)
        setTotalCount(data.length)
      } else {
        setTournaments([])
        setTotalCount(0)
      }
    }).catch(() => {
      setTournaments([])
      setTotalCount(0)
    }).finally(() => setLoading(false))
  }, [search, game, region, tier, dateRange])

  useEffect(() => {
    const t = setTimeout(fetchTournaments, 300) // debounce search
    return () => clearTimeout(t)
  }, [fetchTournaments])

  // ── Register / Notify actions ──
  const getUser = () => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  }

  const handleRegister = async (tournamentId) => {
    const user = getUser()
    if (!user?.id) { alert('Please sign in to register.'); return }
    try {
      await axios.post(`${API}/${tournamentId}/register?userId=${user.id}`)
      alert('Registered successfully!')
      fetchTournaments()
    } catch (err) {
      alert(err?.response?.data?.message || err?.response?.data || 'Registration failed.')
    }
  }

  const handleNotify = async (tournamentId) => {
    const user = getUser()
    if (!user?.id) { alert('Please sign in to get notifications.'); return }
    try {
      await axios.post(`${API}/${tournamentId}/notify?userId=${user.id}`)
      alert('You will be notified when this tournament goes live!')
    } catch (err) {
      alert(err?.response?.data?.message || err?.response?.data || 'Could not subscribe.')
    }
  }

  // ── Derived header stats from the stats API response ──
  const headerStats = [
    { label: 'Active Tournaments', value: (stats.activeTournaments ?? 0).toLocaleString(), color: '#ff7a2d' },
    { label: 'Live Now',           value: (stats.liveTournaments ?? 0).toLocaleString(),   color: '#ff7a2d' },
    { label: 'Tier-2 Events',      value: (stats.tier2Events ?? 0).toLocaleString(),       color: '#e0e0e0' },
    { label: 'Tier-3 Events',      value: (stats.tier3Events ?? 0).toLocaleString(),       color: '#ff7a2d' },
  ]

  const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`

  return (
    <div className="min-h-screen bg-[#07070a] text-gray-200">

      {/* ── Live ticker ── */}
      <div className="border-b border-[#111] py-2 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#ff7a2d] uppercase">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          {stats.liveTournaments} Live Tournaments
        </span>
      </div>

      {/* ── Header stats ── */}
      <div className="border-b border-[#111]">
        <div className="max-w-6xl mx-auto px-6 py-7 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1a1a1c]">
          {headerStats.map((s) => (
            <div key={s.label} className="text-center px-4">
              <div className="text-3xl md:text-4xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="max-w-6xl mx-auto px-6 pt-7 pb-4">
        <div className="relative mb-5">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tournaments, games, or organizers..."
            className="w-full bg-[#0f0f10] border border-[#272526] rounded-lg pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#ff7a2d] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Game',       value: game,      setter: setGame,      options: GAMES },
            { label: 'Region',     value: region,    setter: setRegion,    options: REGIONS },
            { label: 'Tier',       value: tier,      setter: setTier,      options: TIERS },
            { label: 'Date Range', value: dateRange, setter: setDateRange, options: DATE_RANGES },
          ].map(({ label, value, setter, options }) => (
            <div key={label}>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">{label}</div>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full bg-[#0f0f10] border border-[#272526] rounded text-sm text-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#ff7a2d] cursor-pointer appearance-none pr-8 transition-colors"
                style={{ backgroundImage: chevron, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Stats panel ── */}
      <div className="max-w-6xl mx-auto px-6 pb-6">
        <div className="bg-[#0d0d0f] rounded-xl border border-[#1a1a1c] p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Quick Stats</h2>
            <span className="text-[#ff7a2d] text-lg leading-none">📊</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                <span className="text-cyan-400 text-base">▶</span> Live Tournaments
              </div>
              <div className="text-3xl font-black text-cyan-400">{stats.liveTournaments}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                <span className="text-base">📅</span> Upcoming This Week
              </div>
              <div className="text-3xl font-black text-[#ff7a2d]">{stats.upcomingThisWeek}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                <span className="text-base">🌐</span> Active Regions
              </div>
              <div className="text-3xl font-black text-white">{stats.activeRegions}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                <span className="text-yellow-400 text-base">💰</span> Total Prize Pool
              </div>
              <div className="text-3xl font-black text-yellow-400">{stats.totalPrizePool}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Discover Tournaments ── */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Discover Tournaments</h2>
          <span className="text-sm text-gray-500">{totalCount} tournament{totalCount !== 1 ? 's' : ''} found</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-lg font-semibold text-gray-400">Loading tournaments...</div>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-3">🎮</div>
            <div className="text-lg font-semibold text-gray-400">No tournaments found</div>
            <div className="text-sm mt-1">Try adjusting your filters or search query</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tournaments.map((t) => <TournamentCard key={t.id} t={t} onRegister={handleRegister} onNotify={handleNotify} />)}
          </div>
        )}
      </div>
    </div>
  )
}
