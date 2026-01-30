import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Tournaments from '../components/Tournaments'

export default function Homepage() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800">
      <Hero />
      <Tournaments />
      <Features />

      {/* CTA Section */}
      <section className="py-20 px-4 text-center border-t border-purple-500 border-opacity-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Sign up today and start tracking your favorite esports tournaments
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition duration-300">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  )
}
