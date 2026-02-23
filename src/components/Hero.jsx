import React, { useEffect, useRef } from 'react'

export default function Hero() {
  const blobA = useRef(null)
  const blobB = useRef(null)

  useEffect(() => {
    function onScroll() {
      const t = window.scrollY || window.pageYOffset
      if (blobA.current) blobA.current.style.transform = `translateY(${t * -0.08}px)`
      if (blobB.current) blobB.current.style.transform = `translateY(${t * -0.05}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="hero">
      <div ref={blobA} style={{position:'absolute', left:'6%', top:'6%', width:520, height:520, borderRadius:'50%', background: 'linear-gradient(120deg, var(--accent-magenta), var(--accent-purple))', filter:'blur(120px)', opacity:0.9, pointerEvents:'none'}} />
      <div ref={blobB} style={{position:'absolute', right:'6%', bottom:'6%', width:640, height:640, borderRadius:'50%', background: 'linear-gradient(120deg, var(--accent-purple), var(--accent-magenta))', filter:'blur(140px)', opacity:0.85, pointerEvents:'none'}} />

      <div className="container">
        <h1>
          Never Miss a Match — All Tournaments, One Place
        </h1>

        <p>
          Track grassroots to pro esports across PC, console and mobile. Find live streams, schedules, and local cups — discover events you care about and get notified when they go live.
        </p>

        <div style={{display:'flex', gap:'1rem', justifyContent:'center', marginTop:'2rem'}}>
          <a href="/tournaments" className="btn-primary"><span className="btn-inner">Find Tournaments</span></a>
          <a href="/calendar" className="btn-primary"><span className="btn-inner">View Calendar</span></a>
        </div>
      </div>
    </section>
  )
}
