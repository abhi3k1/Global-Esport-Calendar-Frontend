import React from 'react'
import { Link } from 'react-router-dom'

export default function Features() {
  const features = [
    {
      icon: '📅',
      title: 'Live Calendar',
      description: 'Real-time tournament schedules and match updates',
      to: '/calendar'
    },
    {
      icon: '🎮',
      title: 'Multiple Games',
      description: 'Coverage of all major esports titles and events',
      to: '/tournaments'
    },
    {
      icon: '🏆',
      title: 'Rankings',
      description: 'Team rankings, player stats, and leaderboards',
      to: '/tournaments'
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description: 'Get alerts for your favorite tournaments and teams',
      to: '/profile'
    },
    {
      icon: '📺',
      title: 'Stream Highlights',
      description: 'Quick access to ongoing broadcasts and important moments',
      to: '/tournaments'
    },
  ]

  return (
    <section className="py-12 px-4">
      <div className="container">
        <h2 className="text-4xl font-heading font-bold text-center mb-8 text-white">Why Choose Us?</h2>

        <div className="features-row">
          {features.map((feature, idx) => (
            <Link key={idx} to={feature.to || '/'} className={`feature-item card-compact feature-link`}>
              <div className="feature-badge" aria-hidden>{feature.icon}</div>
              <div className="feature-body">
                <h3 className="text-lg font-semibold mb-1 feature-title">{feature.title}</h3>
                <p className="feature-text">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
