import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'

export default function Homepage() {
  return (
    <div>
      <Hero />
      {/* Slanted white feature band */}
      <section className="slanted-band">
        <div className="band-inner container">
          <Features />
        </div>
      </section>

      {/* Dark CTA section below features */}
      <section className="section">
        <div className="container" style={{textAlign:'center'}}>
          <h2 className="section-title">Ready to Join?</h2>
          <p style={{fontSize:'1.25rem', color:'var(--text-secondary)', marginBottom:'2rem'}}>
            Sign up today and start tracking your favorite esports tournaments
          </p>
          <a href="/signup" className="btn-primary"><span className="btn-inner">Get Started Now</span></a>
        </div>
      </section>
    </div>
  )
}
