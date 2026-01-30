import React, { useState } from 'react'

const sample = [
  { id: 1, tier: 'Tier 2', status: 'LIVE', game: 'BGMI', title: 'BGMI College Championship 2026 - North Zone Qualifiers', date: '2026-02-15', region: 'India', prize: '₹5,00,000', organizer: 'Skyesports' },
  { id: 2, tier: 'Tier 3', status: '', game: 'Free Fire', title: 'Free Fire Regional Masters - Mumbai Edition', date: '2026-02-18', region: 'India', prize: '₹2,50,000', organizer: 'Galaxy Racer' },
  { id: 3, tier: 'Tier 2', status: '', game: 'Valorant', title: 'Valorant City Series - Bangalore Open', date: '2026-02-20', region: 'India', prize: '₹7,50,000', organizer: 'Nodwin Gaming' },
  { id: 4, tier: 'Tier 2', status: '', game: 'Dota 2', title: 'Dota 2 Regional League - India Division', date: '2026-02-28', region: 'India', prize: '₹6,00,000', organizer: 'Villager Esports' },
]

export default function RegionalViews() {
  const [filters, setFilters] = useState({ tier: 'All', game: 'All', region: 'India' })

  const filtered = sample.filter((s) => (filters.tier === 'All' || s.tier === filters.tier) && (filters.game === 'All' || s.game === filters.game))

  return (
    <div className="min-h-screen py-12 px-6 bg-[var(--bg)] text-gray-200">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2 bg-[var(--panel)] p-6 rounded border border-[#272526]">
          <h1 className="text-2xl font-heading font-bold text-white mb-2">Regional Tournament Views</h1>
          <p className="text-sm text-gray-400 mb-6">Discover grassroots and professional esports tournaments across regions. Filter by tier, game, and region.</p>

          <div className="flex gap-3 mb-6">
            <select value={filters.tier} onChange={(e) => setFilters((s) => ({ ...s, tier: e.target.value }))} className="p-2 bg-[#0b0b0c] rounded">
              <option>All</option>
              <option>Tier 1</option>
              <option>Tier 2</option>
              <option>Tier 3</option>
            </select>
            <select value={filters.game} onChange={(e) => setFilters((s) => ({ ...s, game: e.target.value }))} className="p-2 bg-[#0b0b0c] rounded">
              <option>All</option>
              <option>Valorant</option>
              <option>CS:GO</option>
              <option>Dota 2</option>
              <option>BGMI</option>
              <option>Free Fire</option>
            </select>
            <select value={filters.region} onChange={(e) => setFilters((s) => ({ ...s, region: e.target.value }))} className="p-2 bg-[#0b0b0c] rounded">
              <option>India</option>
              <option>APAC</option>
              <option>SEA</option>
              <option>Global</option>
            </select>
          </div>

          <div className="grid gap-4">
            <div className="text-sm text-gray-400 mb-2">{filtered.length} Tournaments Found</div>
            {filtered.map((t) => (
              <div key={t.id} className="p-4 bg-[#0f0f10] rounded border border-[#272526]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-300">{t.tier} {t.status && <span className="ml-2 text-[var(--brand-orange)] font-semibold">{t.status}</span>}</div>
                    <h3 className="text-lg font-semibold text-white">{t.title}</h3>
                    <div className="text-sm text-gray-400">{t.organizer} • {t.date} • {t.region} • Prize {t.prize}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <a href="/event-detail" className="bg-[var(--brand-orange)] text-black px-3 py-1 rounded font-semibold">View</a>
                    <div className="text-xs text-gray-400">Teams {Math.floor(Math.random()*120)+8}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="bg-[var(--panel)] p-6 rounded border border-[#272526]">
          <h3 className="text-lg font-semibold text-white mb-3">Trending Tournaments</h3>
          <div className="space-y-3 mb-6">
            <div className="p-3 bg-[#0b0b0c] rounded">
              <div className="text-sm font-semibold">BGMI College Championship</div>
              <div className="text-xs text-gray-400">+145% • 2,847 teams</div>
            </div>
            <div className="p-3 bg-[#0b0b0c] rounded">
              <div className="text-sm font-semibold">Free Fire Regional Qualifiers</div>
              <div className="text-xs text-gray-400">+98% • 1,923 teams</div>
            </div>
            <div className="p-3 bg-[#0b0b0c] rounded">
              <div className="text-sm font-semibold">Valorant City Series</div>
              <div className="text-xs text-gray-400">+76% • 1,456 teams</div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white mb-3">Top Organizers</h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="p-2 bg-[#0b0b0c] rounded flex justify-between items-center"> <div>Skyesports</div> <div>47 • ₹84L</div></div>
            <div className="p-2 bg-[#0b0b0c] rounded flex justify-between items-center"> <div>Nodwin Gaming</div> <div>38 • ₹67L</div></div>
            <div className="p-2 bg-[#0b0b0c] rounded flex justify-between items-center"> <div>Galaxy Racer</div> <div>32 • ₹52L</div></div>
            <div className="p-2 bg-[#0b0b0c] rounded flex justify-between items-center"> <div>Villager Esports</div> <div>28 • ₹45L</div></div>
          </div>
        </aside>
      </div>
    </div>
  )
}
