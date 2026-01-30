import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 bg-opacity-95 backdrop-blur-sm sticky top-0 z-50 border-b border-purple-500 border-opacity-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              ⚡ ESPORTS CALENDAR
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-purple-400 transition duration-300">Home</Link>
            <Link to="/calendar" className="hover:text-purple-400 transition duration-300">Calendar</Link>
            <a href="#" className="hover:text-purple-400 transition duration-300">Tournaments</a>
            <a href="#" className="hover:text-purple-400 transition duration-300">Teams</a>
          </div>

          <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition duration-300">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  )
}
