import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ onOpenSignIn }) {
  const { pathname } = useLocation()

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
        <Link to="/" className="navbar-logo">
          ⚡ Global Esports Calendar
        </Link>

        <ul className="navbar-nav" style={{display:'flex', gap:'1rem', alignItems:'center'}}>
          <li><NavBtn to="/tournaments" active={pathname === '/tournaments'}>TOURNAMENTS</NavBtn></li>
          <li><NavBtn to="/regional-views" active={pathname === '/regional-views'}>REGIONAL VIEWS</NavBtn></li>
          <li><NavBtn to="/calendar" active={pathname === '/calendar'}>CALENDAR</NavBtn></li>
          <li><NavBtn to="/submit-event" active={pathname === '/submit-event'}>SUBMIT EVENT</NavBtn></li>
          <li><NavBtn onClick={onOpenSignIn}>LOGIN</NavBtn></li>
        </ul>
      </nav>
    </>
  )
}
