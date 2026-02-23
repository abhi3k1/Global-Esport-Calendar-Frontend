import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import SignInModal from './SignInModal'
import { useLocation } from 'react-router-dom'

export default function Layout({ children }){
  const [signInOpen, setSignInOpen] = useState(false)
  const { pathname } = useLocation()

  // close modal on route change (e.g., clicking home)
  useEffect(() => {
    if (signInOpen) setSignInOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen text-white">
      <Navbar onOpenSignIn={() => setSignInOpen(true)} />
      <main aria-hidden={signInOpen}>
        {children}
      </main>
      <Footer />

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  )
}
