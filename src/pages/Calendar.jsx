import React, { useState, useEffect } from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

const sampleEvents = [
  { id: 1, name: 'VCT Champions 2026 - APAC Qualifier', game: 'Valorant', date: '2026-01-29', tier: 'Tier 1', region: 'APAC' },
  { id: 2, name: 'BGMI Pro Series S4 - Regional Finals', game: 'BGMI', date: '2026-01-30', tier: 'Tier 2', region: 'India' },
  { id: 3, name: 'Free Fire University Cup 2026', game: 'Free Fire', date: '2026-02-02', tier: 'Tier 3', region: 'SEA' },
]

function generateCalendar(month) {
  const startMonth = startOfMonth(month)
  const endMonth = endOfMonth(month)
  const startDate = startOfWeek(startMonth, { weekStartsOn: 0 })
  const endDate = endOfWeek(endMonth, { weekStartsOn: 0 })

  const rows = []
  let day = startDate
  while (day <= endDate) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push(day)
      day = addDays(day, 1)
    }
    rows.push(week)
  }
  return rows
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1))
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 29))
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // try backend, else fallback
    axios.get(`${API_BASE}/events`).then((res) => setEvents(res.data)).catch(() => setEvents(sampleEvents)).finally(() => setLoading(false))
  }, [])

  const calendar = generateCalendar(currentMonth)

  const eventsForDay = (date) => events.filter((e) => isSameDay(new Date(e.date), date))

  const prevMonth = () => setCurrentMonth((m) => subMonths(m, 1))
  const nextMonth = () => setCurrentMonth((m) => addMonths(m, 1))

  return (
    <div className="min-h-screen py-12 px-6 bg-[#09080a] text-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Tournament Calendar</h1>
            <p className="text-sm text-gray-400">Plan your esports schedule with comprehensive tournament visibility</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#111015] px-3 py-2 rounded">
              <button className="p-2 rounded bg-[#ff7a2d] text-black font-semibold">Export Calendar</button>
            </div>
            <div className="bg-[#0f0e10] rounded p-2 flex items-center gap-2">
              <button className="w-8 h-8 bg-[#0b0b0c] rounded grid place-items-center text-gray-400">▦</button>
              <button className="w-8 h-8 bg-[#0b0b0c] rounded grid place-items-center text-gray-400">≡</button>
              <button className="w-8 h-8 bg-[#0b0b0c] rounded grid place-items-center text-gray-400">⇶</button>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <button className="text-sm bg-[#111015] px-3 py-2 rounded flex items-center gap-2">All Games ▾</button>
          <button className="text-sm bg-[#111015] px-3 py-2 rounded flex items-center gap-2">All Regions ▾</button>
          <button className="text-sm bg-[#111015] px-3 py-2 rounded flex items-center gap-2">All Tiers ▾</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#0f0f10] rounded-lg p-6 shadow-sm border border-[#272526]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</div>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="px-3 py-1 bg-[#111015] rounded">‹</button>
                <button onClick={nextMonth} className="px-3 py-1 bg-[#111015] rounded">›</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-sm text-gray-400 mb-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-left pl-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-rows-6 gap-3">
              {calendar.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-3">
                  {week.map((day, di) => {
                    const inMonth = isSameMonth(day, currentMonth)
                    const dayEvents = eventsForDay(day)
                    const isSelected = isSameDay(day, selectedDate)
                    return (
                      <button
                        key={di}
                        onClick={() => setSelectedDate(day)}
                        className={`h-24 rounded border ${isSelected ? 'border-[#ff7a2d] shadow-md' : 'border-[#2a2a2b]'} p-2 bg-transparent text-left w-full`}
                        aria-current={isSelected}
                      >
                        <div className={`text-sm ${inMonth ? 'text-gray-200' : 'text-gray-600'}`}>{format(day, 'd')}</div>
                        <div className="flex gap-1 mt-2 items-end">
                          {dayEvents.slice(0,3).map((e) => (
                            <span key={e.id} className="w-2 h-2 rounded-full" style={{ background: e.tier === 'Tier 1' ? '#ffd166' : e.tier === 'Tier 2' ? '#9fc5e8' : '#f4a261' }}></span>
                          ))}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#272526] pt-4 text-sm text-gray-400 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ffd166]" /> Tier1</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#9fc5e8]" /> Tier2</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f4a261]" /> Tier3</div>
              </div>
              <div className="text-xs text-gray-500">{events.length} tournaments</div>
            </div>
          </div>

          <aside className="bg-[#0f0f10] rounded-lg p-6 border border-[#272526] h-fit">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</div>
                <h3 className="text-lg font-semibold text-white mt-2">{eventsForDay(selectedDate).length} tournaments scheduled</h3>
              </div>
              <button className="bg-[#ff7a2d] text-black px-3 py-2 rounded">Export Day</button>
            </div>

            <div className="pt-6 border-t border-[#272526] text-center text-gray-400">
              {eventsForDay(selectedDate).length === 0 ? (
                <div>
                  <div className="mb-4 text-4xl">📅</div>
                  <div className="font-semibold text-white mb-2">No Tournaments Scheduled</div>
                  <div className="text-sm">There are no tournaments scheduled for this date. Check other dates or adjust your filters.</div>
                </div>
              ) : (
                eventsForDay(selectedDate).map((e) => (
                  <div key={e.id} className="text-left mb-4">
                    <div className="font-semibold text-white">{e.name}</div>
                    <div className="text-sm text-gray-400">{e.game} • {e.tier}</div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
