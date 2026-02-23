import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Homepage from './pages/Homepage'
import Calendar from './pages/Calendar'
import Tournaments from './pages/Tournaments'
import RegionalViews from './pages/RegionalViews'
import SubmitEvent from './pages/SubmitEvent'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <RoutesWrapper />
      </Layout>
    </Router>
  )
}

function RoutesWrapper() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // if user is logged in and visiting homepage, check if they already have a profile
    // If profile is missing, force them to complete it once; otherwise don't redirect.
    const raw = localStorage.getItem('user')
    if (!raw) return
    try {
      const user = JSON.parse(raw)
      if (!user || !(location.pathname === '/' || location.pathname === '/homepage')) return

      // check profiles API for existing profile
      axios.get(`${API_BASE}/profiles/${user.id}`)
        .then((res) => {
          // profile exists: do nothing (allow homepage)
        })
        .catch((err) => {
          // if not found, redirect to profile completion page
          const status = err?.response?.status
          if (status === 404 || !err?.response) {
            navigate(`/profile/${user.id}`, { replace: true })
          }
        })
    } catch (e) {
      // ignore JSON parse errors
    }
  }, [location.pathname, navigate])

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/tournaments" element={<Tournaments />} />
      <Route path="/regional-views" element={<RegionalViews />} />
      <Route path="/submit-event" element={<SubmitEvent />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile/:id" element={<Profile />} />
    </Routes>
  )
}

export default App
