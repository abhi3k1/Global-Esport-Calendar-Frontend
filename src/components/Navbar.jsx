import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar({ onOpenSignIn }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (raw) {
      try { setUser(JSON.parse(raw)) } catch (e) { setUser(null) }
    } else setUser(null)

    // listen for auth changes triggered elsewhere (login/logout)
    function onAuth() {
      const r = localStorage.getItem('user')
      if (r) {
        try { setUser(JSON.parse(r)) } catch (e) { setUser(null) }
      } else setUser(null)
    }
    window.addEventListener('authChanged', onAuth)
    window.addEventListener('storage', onAuth)
    return () => { window.removeEventListener('authChanged', onAuth); window.removeEventListener('storage', onAuth) }
  }, [pathname])

  // close dropdown when clicking outside
  useEffect(() => {
    function onDoc(e) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const NavBtn = ({ to, children, active, onClick }) => {
    const classes = `nav-btn ${active ? 'nav-btn--active' : ''}`
    const content = <span className="btn-inner">{children}</span>
    if (!to) {
      return <button onClick={onClick} className={classes}>{content}</button>
    }
    return <Link to={to} onClick={onClick} className={classes}>{content}</Link>
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo" onClick={() => navigate('/') }>
          ⚡ Global Esports Calendar
        </Link>

        <ul className="navbar-nav" style={{display:'flex', gap:'1rem', alignItems:'center'}}>
          <li><NavBtn to="/tournaments" active={pathname === '/tournaments'}>TOURNAMENTS</NavBtn></li>
          <li><NavBtn to="/regional-views" active={pathname === '/regional-views'}>REGIONAL VIEWS</NavBtn></li>
          <li><NavBtn to="/calendar" active={pathname === '/calendar'}>CALENDAR</NavBtn></li>
          <li><NavBtn to="/submit-event" active={pathname === '/submit-event'}>SUBMIT EVENT</NavBtn></li>

          {user ? (
            <li ref={menuRef} style={{position:'relative'}}>
              <button onClick={() => setMenuOpen((s) => !s)} className={`nav-btn ${pathname.startsWith('/profile') ? 'nav-btn--active' : ''}`}>
                <span className="btn-inner">{user.displayName || user.username}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-[var(--panel)] border border-[#272526] rounded shadow-lg py-2 w-44 z-50">
                  <Link to={`/profile/${user.id}`} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#0b0b0c]">Profile</Link>
                  <button onClick={() => { localStorage.removeItem('authToken'); localStorage.removeItem('user'); try { window.dispatchEvent(new Event('authChanged')) } catch (e) {} ; setMenuOpen(false); setUser(null); navigate('/'); }} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#0b0b0c]">Logout</button>
                </div>
              )}
            </li>
          ) : (
            <li><NavBtn onClick={onOpenSignIn}>LOGIN</NavBtn></li>
          )}
        </ul>
      </nav>
    </>
  )
}
