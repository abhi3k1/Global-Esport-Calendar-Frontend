import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SignInModal from './SignInModal'

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const NavLink = ({ to, children, active }) => (
    <Link to={to} className={`hidden md:inline-flex items-center gap-2 px-3 py-2 rounded ${active ? 'bg-[var(--brand-orange)] text-black font-semibold' : 'text-gray-300 hover:text-[var(--brand-cyan)]'} transition`}>{children}</Link>
  )

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-[var(--panel)] border-b border-[#191919]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded flex items-center justify-center bg-[var(--brand-orange)] text-black font-bold">⚡</div>
              <div className="leading-tight">
                <div className="text-white font-heading text-lg">Global Esports</div>
                <div className="text-[var(--brand-orange)] text-xs tracking-wider">CALENDAR</div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <NavLink to="/tournaments" active={pathname === '/tournaments'}>🏆 <span className="hidden sm:inline">Tournaments</span></NavLink>
              <NavLink to="/regional-views" active={pathname === '/regional-views'}>🌐 <span className="hidden sm:inline">Regional Views</span></NavLink>
              <NavLink to="/calendar" active={pathname === '/calendar'}>📅 <span className="hidden sm:inline">Calendar</span></NavLink>
              <Link to="/submit-event" className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded text-gray-300 hover:text-[var(--brand-cyan)]">➕ <span className="hidden sm:inline">Submit Event</span></Link>

              <button onClick={() => setOpen(true)} className="ml-4 px-4 py-2 rounded bg-[var(--brand-orange)] text-black font-semibold">Sign In</button>
            </div>
          </div>
        </div>
      </nav>

      {/* thin live strip below nav */}
      <div className="nav-strip py-2">
        <div className="max-w-7xl mx-auto text-center text-[var(--brand-cyan)] text-sm tracking-wide">
          <span className="text-[var(--brand-cyan)]">●</span> 247 LIVE TOURNAMENTS
        </div>
      </div>

      <SignInModal open={open} onClose={() => setOpen(false)} />
    </header>
  )
}
