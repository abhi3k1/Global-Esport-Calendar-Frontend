import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addWeeks, subWeeks, addMonths, subMonths,
  format, isSameMonth, isSameDay, isToday, parseISO
} from 'date-fns'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

/* ── Constants ─────────────────────────────────────────────────────────────── */

const API = 'http://localhost:8080/api/tournaments'

const GAMES   = ['All Games', 'Valorant', 'BGMI', 'Free Fire', 'CS:GO', 'Dota 2']
const REGIONS = ['All Regions', 'India', 'SEA', 'APAC', 'Global']
const TIERS   = ['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3']

const TIER_DOT  = { 'Tier 1': '#ffd166', 'Tier 2': '#9fc5e8', 'Tier 3': '#f4a261' }
const TIER_BADGE = { 'Tier 1': 'bg-blue-600 text-white', 'Tier 2': 'bg-gray-500 text-white', 'Tier 3': 'bg-orange-500 text-white' }

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function parseTournamentDate(t) {
  for (const raw of [t.startDate, t.startDateTime, t.date, t.eventDate, t.dateTime].filter(Boolean)) {
    if (typeof raw === 'number') { const d = new Date(raw); if (!isNaN(d.getTime())) return d }
    if (typeof raw === 'string') {
      if (/^\d{4}-\d{2}/.test(raw)) { const d = parseISO(raw); if (!isNaN(d.getTime())) return d }
      const d = new Date(raw); if (!isNaN(d.getTime()) && d.getFullYear() >= 2020) return d
    }
  }
  if (typeof t.date === 'string') {
    const M = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 }
    const m = t.date.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})/i)
    if (m) {
      const k = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase()
      if (M[k] !== undefined) return new Date(new Date().getFullYear(), M[k], +m[2])
    }
  }
  return null
}

function buildCalendar(month) {
  const s = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
  const e = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
  const rows = []; let d = s
  while (d <= e) { const w = []; for (let i = 0; i < 7; i++) { w.push(d); d = addDays(d, 1) } rows.push(w) }
  return rows
}

function makeICS(events) {
  const l = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GEC//EN']
  events.forEach(ev => {
    if (!ev._date) return
    l.push('BEGIN:VEVENT',
      `DTSTART:${format(ev._date, "yyyyMMdd'T'HHmmss")}`,
      `SUMMARY:${ev._name}`,
      `DESCRIPTION:${ev.game || ''} - ${ev.region || ''} - ${ev.tier || ''}`,
      'END:VEVENT')
  })
  l.push('END:VCALENDAR')
  return l.join('\r\n')
}

function dlICS(content, name) {
  const b = new Blob([content], { type: 'text/calendar' })
  const u = URL.createObjectURL(b)
  const a = document.createElement('a')
  a.href = u; a.download = name; a.click()
  URL.revokeObjectURL(u)
}

/* ── FilterDropdown ────────────────────────────────────────────────────────── */

function Dropdown({ icon, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer ${
          open ? 'border-[#ff7a2d] bg-[#1a1410]' : 'border-[#272526] bg-[#111015] hover:border-[#3a3a3c]'
        }`}
      >
        <span className="text-gray-400">{icon}</span>
        <span className="text-gray-200">{value}</span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 min-w-[180px] bg-[#1a1a1c] border border-[#272526] rounded-lg shadow-xl z-50 py-1">
          {options.map(o => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false) }}
              className={`block w-full text-left px-4 py-2 text-sm cursor-pointer transition-colors ${
                value === o ? 'bg-[#2a2a2c] text-[#ff7a2d] font-medium' : 'text-gray-300 hover:bg-[#222224]'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── SVG Icons ─────────────────────────────────────────────────────────────── */

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="6" height="6" rx="1" />
    <rect x="11" y="1" width="6" height="6" rx="1" />
    <rect x="1" y="11" width="6" height="6" rx="1" />
    <rect x="11" y="11" width="6" height="6" rx="1" />
  </svg>
)

const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="1" y1="4" x2="17" y2="4" />
    <line x1="1" y1="9" x2="17" y2="9" />
    <line x1="1" y1="14" x2="17" y2="14" />
  </svg>
)

const TimelineIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="10" width="4" height="7" rx="0.5" />
    <rect x="7" y="5" width="4" height="12" rx="0.5" />
    <rect x="13" y="1" width="4" height="16" rx="0.5" />
  </svg>
)

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 2v8M4 7l4 4 4-4M2 13v1h12v-1" />
  </svg>
)

const CalendarExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="2" width="12" height="11" rx="1.5" />
    <line x1="1" y1="5.5" x2="13" y2="5.5" />
    <line x1="4.5" y1="0.5" x2="4.5" y2="3.5" />
    <line x1="9.5" y1="0.5" x2="9.5" y2="3.5" />
  </svg>
)

/* ── Main Component ────────────────────────────────────────────────────────── */

export default function Calendar() {
  const navigate = useNavigate()

  const [viewMode, setViewMode]     = useState('grid')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [weekStart, setWeekStart]   = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [game, setGame]             = useState('All Games')
  const [region, setRegion]         = useState('All Regions')
  const [tierFilter, setTierFilter] = useState('All Tiers')
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading]       = useState(true)

  /* ── Fetch ── */
  const loadTournaments = useCallback(() => {
    setLoading(true)
    const p = { page: 0, size: 200 }
    if (game !== 'All Games')     p.game   = game
    if (region !== 'All Regions') p.region = region
    if (tierFilter !== 'All Tiers')     p.tier   = tierFilter

    axios.get(API, { params: p })
      .then(r => {
        const d = r?.data
        if (d?.content)         setTournaments(d.content)
        else if (Array.isArray(d)) setTournaments(d)
        else                       setTournaments([])
      })
      .catch(() => setTournaments([]))
      .finally(() => setLoading(false))
  }, [game, region, tierFilter])

  useEffect(() => { loadTournaments() }, [loadTournaments])

  /* ── Derived ── */
  const items = useMemo(() =>
    tournaments.map(t => ({
      ...t,
      _date:  parseTournamentDate(t),
      _name:  t.title || t.name || 'Tournament',
      _time:  t.time || t.startTime || '',
      _img:   t.image || t.logo || t.imageUrl || '',
      _teams: t.participants?.max || t.teams || null,
    })).filter(t => t._date),
    [tournaments]
  )

  const dayEvents = useCallback(d => items.filter(t => isSameDay(t._date, d)), [items])

  const grid     = useMemo(() => buildCalendar(currentMonth), [currentMonth])
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])
  const isThisWeek = weekDays.some(d => isToday(d))
  const selEvents  = dayEvents(selectedDate)

  /* ── Actions ── */
  const goToday = () => {
    const t = new Date()
    setCurrentMonth(t)
    setSelectedDate(t)
    setWeekStart(startOfWeek(t, { weekStartsOn: 0 }))
  }

  const exportAll = () => dlICS(makeICS(items), 'esport-calendar.ics')
  const exportDayICS = () => { if (selEvents.length) dlICS(makeICS(selEvents), `esport-${format(selectedDate, 'yyyy-MM-dd')}.ics`) }

  /* ── Render ── */
  return (
    <div className="min-h-screen py-8 px-4 md:px-6 bg-[#09080a] text-gray-200">
      <div className="max-w-7xl mx-auto">

        {/* ═══ Header ═══ */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Tournament Calendar</h1>
            <p className="text-sm text-gray-400 mt-1">Plan your esports schedule with comprehensive tournament visibility</p>
          </div>
          <div className="flex items-center gap-1 bg-[#111015] p-1 rounded-lg border border-[#272526]">
            {[['grid', GridIcon], ['list', ListIcon], ['timeline', TimelineIcon]].map(([m, Icon]) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`w-9 h-9 rounded-md grid place-items-center transition-colors cursor-pointer ${
                  viewMode === m ? 'bg-[#ff7a2d] text-black' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1c]'
                }`}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>

        {/* ═══ Filter Bar ═══ */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Dropdown icon="🎮" options={GAMES}   value={game}       onChange={setGame} />
            <Dropdown icon="🌐" options={REGIONS} value={region}     onChange={setRegion} />
            <Dropdown icon="🏆" options={TIERS}   value={tierFilter} onChange={setTierFilter} />
          </div>
          <button
            onClick={exportAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#ff7a2d] hover:bg-[#ff9a4d] text-black font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            <DownloadIcon /> Export Calendar
          </button>
        </div>

        {/* ═══ Loading ═══ */}
        {loading && (
          <div className="text-center py-20 text-gray-500">
            <div className="animate-spin w-8 h-8 border-2 border-[#ff7a2d] border-t-transparent rounded-full mx-auto mb-4" />
            <div className="text-lg font-semibold text-gray-400">Loading tournaments…</div>
          </div>
        )}

        {!loading && (
          <>
            {/* ═══════════════ GRID VIEW ═══════════════ */}
            {viewMode === 'grid' && (
              <div className="grid md:grid-cols-3 gap-6">

                {/* ── Calendar Grid ── */}
                <div className="md:col-span-2 bg-[#0f0f10] rounded-xl p-5 md:p-6 border border-[#272526]">

                  {/* Month header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xl font-bold text-white">{format(currentMonth, 'MMMM yyyy')}</h2>
                      <button onClick={goToday} className="text-sm text-[#ff7a2d] font-semibold hover:text-[#ff9a4d] cursor-pointer">Today</button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="w-8 h-8 rounded-md bg-[#111015] border border-[#272526] grid place-items-center text-gray-400 hover:text-white cursor-pointer">‹</button>
                      <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="w-8 h-8 rounded-md bg-[#111015] border border-[#272526] grid place-items-center text-gray-400 hover:text-white cursor-pointer">›</button>
                    </div>
                  </div>

                  {/* Day-of-week headers */}
                  <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2 font-medium">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                      <div key={d} className="text-center">{d}</div>
                    ))}
                  </div>

                  {/* Calendar cells */}
                  <div className="grid gap-2">
                    {grid.map((wk, wi) => (
                      <div key={wi} className="grid grid-cols-7 gap-2">
                        {wk.map((day, di) => {
                          const inM = isSameMonth(day, currentMonth)
                          const td  = isToday(day)
                          const sel = isSameDay(day, selectedDate)
                          const de  = dayEvents(day)
                          return (
                            <button
                              key={di}
                              onClick={() => setSelectedDate(day)}
                              className={`h-[88px] rounded-lg border p-2 text-left flex flex-col transition-all cursor-pointer ${
                                sel
                                  ? 'border-[#ff7a2d] bg-[#1a1410]/30'
                                  : 'border-[#1f1f21] hover:border-[#3a3a3c]'
                              }`}
                            >
                              <span className={`text-sm font-medium ${
                                !inM ? 'text-gray-600' : td ? 'text-[#ff7a2d] font-bold' : 'text-gray-200'
                              }`}>
                                {format(day, 'd')}
                              </span>
                              {de.length > 0 && (
                                <div className="flex items-center gap-1 mt-auto">
                                  {de.slice(0, 3).map((ev, idx) => (
                                    <span
                                      key={idx}
                                      className="w-2 h-2 rounded-full flex-shrink-0"
                                      style={{ background: TIER_DOT[ev.tier] || '#666' }}
                                    />
                                  ))}
                                  <span
                                    className="text-[11px] font-medium ml-0.5"
                                    style={{ color: TIER_DOT[de[0]?.tier] || '#888' }}
                                  >
                                    {de.length}
                                  </span>
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Tier legend */}
                  <div className="mt-5 pt-4 border-t border-[#272526] flex items-center gap-6 text-sm text-gray-400">
                    {Object.entries(TIER_DOT).map(([tier, color]) => (
                      <div key={tier} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                        <span>{tier}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Side Panel ── */}
                <aside className="bg-[#0f0f10] rounded-xl p-5 md:p-6 border border-[#272526] h-fit">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="text-lg font-bold text-white leading-snug">{format(selectedDate, 'EEEE, MMMM d,')}</h3>
                      <h3 className="text-lg font-bold text-white">{format(selectedDate, 'yyyy')}</h3>
                    </div>
                    <button
                      onClick={exportDayICS}
                      className="flex items-center gap-2 px-3 py-2 bg-[#ff7a2d] hover:bg-[#ff9a4d] text-black text-xs font-bold rounded-lg cursor-pointer flex-shrink-0"
                    >
                      <CalendarExportIcon />
                      <span className="leading-tight text-center">Export<br/>Day</span>
                    </button>
                  </div>

                  <p className="text-sm text-gray-400 mb-5">
                    {selEvents.length} tournament{selEvents.length !== 1 ? 's' : ''} scheduled
                  </p>

                  {selEvents.length === 0 ? (
                    <div className="text-center py-8 border-t border-[#272526]">
                      <div className="text-4xl mb-3">📅</div>
                      <div className="font-semibold text-white mb-2">No Tournaments Scheduled</div>
                      <div className="text-sm text-gray-400">
                        There are no tournaments scheduled for this date. Check other dates or adjust your filters.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 border-t border-[#272526] pt-5">
                      {selEvents.map(ev => (
                        <div key={ev.id} className="bg-[#111015] rounded-xl border border-[#1f1f21] p-4">
                          {/* Header row */}
                          <div className="flex items-start gap-3 mb-3">
                            {ev._img && (
                              <img
                                src={ev._img}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-[#1a1a1c]"
                                onError={e => { e.target.style.display = 'none' }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-sm font-bold text-white truncate">{ev._name}</h4>
                                {ev.status === 'live' && (
                                  <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 flex-shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">{ev.game || ev.gameTag} • {ev.region}</p>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            {ev.tier && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded ${TIER_BADGE[ev.tier] || 'bg-gray-600 text-white'}`}>
                                🏆 {ev.tier}
                              </span>
                            )}
                            {ev._time && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-300 rounded-full border border-[#3a3a3c]">
                                🕐 {ev._time}
                              </span>
                            )}
                            {ev.prizePool && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-300 rounded-full border border-[#3a3a3c]">
                                💰 {ev.prizePool}
                              </span>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Organizer: {ev.organizer || 'TBA'}</span>
                            <button
                              onClick={() => navigate('/tournaments')}
                              className="text-xs text-[#ff7a2d] font-semibold hover:text-[#ff9a4d] cursor-pointer transition-colors"
                            >
                              → View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </aside>

              </div>
            )}

            {/* ═══════════════ LIST VIEW ═══════════════ */}
            {viewMode === 'list' && (
              <div className="bg-[#0f0f10] rounded-xl border border-[#272526] p-5 md:p-6">
                <h2 className="text-xl font-bold text-white mb-5 tracking-wide uppercase">
                  All Tournaments ({items.length})
                </h2>

                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">🎮</div>
                    <div className="text-lg font-semibold text-gray-400">No tournaments found</div>
                    <div className="text-sm text-gray-500 mt-1">Try adjusting your filters</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map(ev => (
                      <div
                        key={ev.id}
                        className="flex items-center gap-4 bg-[#111015] rounded-xl border border-[#1f1f21] p-4 hover:border-[#3a3a3c] transition-colors"
                      >
                        {/* Logo */}
                        {ev._img && (
                          <img
                            src={ev._img}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-[#1a1a1c]"
                            onError={e => { e.target.style.display = 'none' }}
                          />
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-white mb-0.5 truncate">{ev._name}</h3>
                          <p className="text-xs text-gray-400 mb-2">
                            {ev.game || ev.gameTag} • {ev.region} • {ev.organizer || 'TBA'}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {ev.tier && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded ${TIER_BADGE[ev.tier] || 'bg-gray-600 text-white'}`}>
                                🏆 {ev.tier}
                              </span>
                            )}
                            {ev._date && (
                              <span className="px-2 py-0.5 text-[10px] text-gray-300 bg-[#1a1a1c] rounded">
                                📅 {format(ev._date, 'EEE, MMM d')}
                              </span>
                            )}
                            {ev._time && (
                              <span className="px-2 py-0.5 text-[10px] text-gray-300 bg-[#1a1a1c] rounded">
                                🕐 {ev._time}
                              </span>
                            )}
                            {ev.prizePool && (
                              <span className="px-2 py-0.5 text-[10px] text-gray-300 bg-[#1a1a1c] rounded">
                                💰 {ev.prizePool}
                              </span>
                            )}
                            {ev._teams && (
                              <span className="px-2 py-0.5 text-[10px] text-gray-300 bg-[#1a1a1c] rounded">
                                👥 {ev._teams} Teams
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status + Action */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          {ev.status === 'live' && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              LIVE
                            </span>
                          )}
                          <button
                            onClick={() => navigate('/tournaments')}
                            className="flex items-center gap-1 px-4 py-2 bg-[#ff7a2d] hover:bg-[#ff9a4d] text-black text-xs font-bold rounded-lg cursor-pointer transition-colors"
                          >
                            → View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════ TIMELINE VIEW ═══════════════ */}
            {viewMode === 'timeline' && (
              <div className="bg-[#0f0f10] rounded-xl border border-[#272526] p-5 md:p-6">

                {/* Week navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setWeekStart(w => subWeeks(w, 1))}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>‹</span> Previous Week
                  </button>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white">
                      {format(weekStart, 'EEE, MMM d')} – {format(addDays(weekStart, 6), 'EEE, MMM d')}
                    </h2>
                    {isThisWeek && (
                      <span className="text-sm text-[#ff7a2d] font-semibold">Current Week</span>
                    )}
                  </div>
                  <button
                    onClick={() => setWeekStart(w => addWeeks(w, 1))}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors"
                  >
                    Next Week <span>›</span>
                  </button>
                </div>

                {/* Day-by-day rows */}
                <div>
                  {weekDays.map((day, i) => {
                    const de = dayEvents(day)
                    const td = isToday(day)
                    return (
                      <div key={i} className="py-4">
                        <div className="mb-2">
                          <h3 className={`text-sm font-bold ${td ? 'text-[#ff7a2d]' : 'text-white'}`}>
                            {format(day, 'EEE, MMM d')}
                          </h3>
                          {td && <span className="text-xs text-[#ff7a2d] font-semibold">Today</span>}
                        </div>
                        <div className="border-t border-[#272526] pt-3">
                          {de.length === 0 ? (
                            <p className="text-sm text-gray-500 italic ml-4">No tournaments scheduled</p>
                          ) : (
                            <div className="space-y-3 ml-4">
                              {de.map(ev => (
                                <div
                                  key={ev.id}
                                  className="flex items-center gap-4 bg-[#111015] rounded-lg border border-[#1f1f21] border-l-4 border-l-[#ff7a2d] p-3"
                                >
                                  {ev._img && (
                                    <img
                                      src={ev._img}
                                      alt=""
                                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-[#1a1a1c]"
                                      onError={e => { e.target.style.display = 'none' }}
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate">{ev._name}</h4>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {ev._time && <>🕐 {ev._time} • </>}
                                      {ev.game || ev.gameTag} • {ev.region}
                                      {ev.prizePool && <> • 💰 {ev.prizePool}</>}
                                    </p>
                                  </div>
                                  {ev.status === 'live' && (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 flex-shrink-0">
                                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                      LIVE
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
