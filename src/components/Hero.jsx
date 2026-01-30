import React from 'react'

export default function Hero() {
  return (
    <section className="min-h-96 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-12 left-8 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-8 right-12 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-white">
          The Heartbeat of Competitive Gaming
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Discover grassroots and professional esports tournaments across Asia-Pacific. From university cups to regional
          championships, never miss your moment to compete or watch.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a href="/homepage" className="inline-block bg-[var(--brand-orange)] px-6 py-3 rounded-lg font-semibold text-black shadow-md hover:opacity-95 transition">Find Tournaments</a>
          <a href="/calendar" className="inline-block border border-[var(--brand-orange)] px-6 py-3 rounded-lg font-semibold text-gray-200 hover:bg-[#0f0f10] transition">View Calendar</a>
        </div>

        <div className="flex justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white">1,247</div>
            <div className="text-sm text-gray-400">Active Tournaments</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">247</div>
            <div className="text-sm text-gray-400">Live Now</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">892</div>
            <div className="text-sm text-gray-400">Upcoming This Week</div>
          </div>
        </div>
      </div>
    </section>
  )
}
