import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
