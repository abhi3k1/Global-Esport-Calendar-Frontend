import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Calendar from './pages/Calendar'
import Tournaments from './pages/Tournaments'
import RegionalViews from './pages/RegionalViews'
import SubmitEvent from './pages/SubmitEvent'
import Signup from './pages/Signup'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/regional-views" element={<RegionalViews />} />
          <Route path="/submit-event" element={<SubmitEvent />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
