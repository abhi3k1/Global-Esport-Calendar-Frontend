import React from 'react'

export default function Features() {
  const features = [
    {
      icon: '📅',
      title: 'Live Calendar',
      description: 'Real-time tournament schedules and match updates'
    },
    {
      icon: '🎮',
      title: 'Multiple Games',
      description: 'Coverage of all major esports titles and events'
    },
    {
      icon: '🏆',
      title: 'Rankings',
      description: 'Team rankings, player stats, and leaderboards'
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description: 'Get alerts for your favorite tournaments and teams'
    },
  ]

  return (
    <section className="py-20 px-4 bg-[var(--panel)] bg-opacity-60">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-heading font-bold text-center mb-16 text-white">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-gray-700 bg-opacity-50 p-6 rounded-lg border border-purple-500 border-opacity-20 hover:border-opacity-50 transition duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
