import React from 'react'

const sample = [
  {
    id: 1,
    tier: 'Tier 1',
    status: 'LIVE',
    game: 'Valorant',
    title: 'VCT Champions 2026 - Asia Pacific Qualifier',
    organizer: 'Riot Games',
    date: '2026-02-15',
    region: 'APAC',
    prize: 'USD 500,000',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a8b79ddc-1766511920437.png'
  },
  {
    id: 2,
    tier: 'Tier 2',
    status: 'REGISTRATION OPEN',
    game: 'BGMI',
    title: 'BGMI Pro Series Season 4 - Regional Finals',
    organizer: 'Krafton India',
    date: '2026-02-10',
    region: 'India',
    prize: 'INR 15,00,000',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1fe77cbfc-1767641432533.png'
  },
  {
    id: 3,
    tier: 'Tier 3',
    status: 'REGISTRATION OPEN',
    game: 'Free Fire',
    title: 'Free Fire University Cup 2026',
    organizer: 'Garena SEA',
    date: '2026-02-20',
    region: 'SEA',
    prize: 'USD 50,000',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1ad6ec656-1769685750996.png'
  },
]

export default function Tournaments() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-heading font-bold text-white">Discover Tournaments</h2>
          <a href="/homepage" className="text-sm text-[var(--brand-cyan)] hover:underline">View All</a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {sample.map((t) => (
            <div key={t.id} className="bg-[var(--panel)] p-4 rounded-lg border border-[#272526] hover:shadow-lg">
              <div className="h-40 rounded-md overflow-hidden mb-3">
                <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                <span className="px-2 py-1 bg-[var(--surface)] bg-opacity-40 rounded">{t.tier}</span>
                <span className="font-semibold text-sm text-white">{t.status}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{t.title}</h3>
              <div className="text-sm text-gray-400 mb-3">{t.organizer} • {t.region} • {t.date}</div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">Prize: <span className="font-semibold">{t.prize}</span></div>
                <a href="/event-detail" className="text-sm bg-[var(--brand-orange)] px-3 py-1 rounded text-black font-semibold">View</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
