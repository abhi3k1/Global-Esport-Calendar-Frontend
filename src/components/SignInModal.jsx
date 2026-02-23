import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignInModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [render, setRender] = useState(false)
  const [closing, setClosing] = useState(false)
  const modalRef = useRef(null)

  // mount/unmount with animation
  useEffect(() => {
    if (open) {
      setRender(true)
      setClosing(false)
    } else if (render) {
      setClosing(true)
      const t = setTimeout(() => { setRender(false); setClosing(false) }, 260)
      return () => clearTimeout(t)
    }
    return undefined
  }, [open])

  // lock background scroll while modal is shown
  useEffect(() => {
    if (!render) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [render])

  // focus trap and ESC handler
  useEffect(() => {
    if (!render) return undefined
    const node = modalRef.current
    if (!node) return undefined

    const focusable = node.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (first) first.focus()

    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key === 'Tab') {
        if (focusable.length === 0) { e.preventDefault(); return }
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [render, onClose])

  function validate() {
    const out = {}
    if (!email) out.email = 'Email is required'
    else if (!emailRegex.test(email)) out.email = 'Enter a valid email'
    if (!password) out.password = 'Password is required'
    else if (password.length < 6) out.password = 'Password must be at least 6 characters'
    setErrors(out)
    return Object.keys(out).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      // Expected backend: POST `${API_BASE}/auth/login` with { email, password }
      // Expected success response: { token: 'jwt', user: { id, username, ... } }
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password })
      const token = res?.data?.token || res?.data?.accessToken
      if (token) localStorage.setItem('authToken', token)
      if (res?.data?.user) localStorage.setItem('user', JSON.stringify(res.data.user))
      setSubmitting(false)
      onClose()
    } catch (err) {
      setErrors({ form: err?.response?.data?.message || 'Failed to sign in' })
      setSubmitting(false)
    }
  }

  if (!render) return null

  return (
    <div className={`modal-root fixed inset-0 z-60 flex items-center justify-center ${closing ? 'modal-exit' : 'modal-enter'}`}>
      <div className={`modal-backdrop absolute inset-0 ${closing ? 'opacity-0' : 'opacity-100'}`} onClick={onClose} />

      <div ref={modalRef} className={`modal-panel relative w-full max-w-lg bg-[var(--panel)] rounded-lg p-6 z-70 shadow-lg border border-[#272526] ${closing ? 'modal-panel-exit' : 'modal-panel-enter'}`} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-heading font-bold text-white">Sign In</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-400">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && <div className="text-sm text-red-400">{errors.form}</div>}

          <div>
            <label className="text-sm text-gray-300 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-[#0b0b0c] rounded text-gray-200 border border-transparent focus:border-[var(--accent-cyan)] outline-none focus:ring-2 focus:ring-[var(--brand-cyan)]"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
            />
            {errors.email && <div id="login-email-error" className="text-xs text-red-400 mt-1">{errors.email}</div>}
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-[#0b0b0c] rounded text-gray-200 border border-transparent focus:border-[var(--accent-cyan)] outline-none focus:ring-2 focus:ring-[var(--brand-cyan)]"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
            />
            {errors.password && <div id="login-password-error" className="text-xs text-red-400 mt-1">{errors.password}</div>}
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" disabled={submitting} className="bg-[var(--brand-orange)] text-black px-4 py-2 rounded font-semibold disabled:opacity-60">{submitting ? 'Signing in...' : 'Sign In'}</button>
            <Link to="/signup" onClick={onClose} className="text-sm text-[var(--brand-cyan)]">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
