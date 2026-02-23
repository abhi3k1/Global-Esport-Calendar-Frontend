import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_BASE = 'http://localhost:8080/api/users'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

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
      const res = await axios.post(`${API_BASE}/login`, { email, password })

      // Normalize token and user from different backend shapes
      const token = res?.data?.token || res?.data?.accessToken || res?.data?.authToken
      if (token) localStorage.setItem('authToken', token)

      // Try common shapes: { user: {...} } or direct user object in res.data
      const userObj = res?.data?.user ?? (res?.data && typeof res.data === 'object' ? res.data : null)
      if (userObj) {
        localStorage.setItem('user', JSON.stringify(userObj))
        // notify other components (Navbar) that auth changed
        try { window.dispatchEvent(new Event('authChanged')) } catch (e) {}
        const id = userObj.id || userObj._id || userObj.userId || userObj.userid
        setSubmitting(false)
        if (id) {
          navigate(`/profile/${id}`)
        } else {
          navigate('/')
        }
      } else {
        // fallback: still clear submitting and go home
        setSubmitting(false)
        navigate('/')
      }
    } catch (err) {
      setErrors({ form: err?.response?.data?.message || 'Failed to sign in' })
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-6 bg-[var(--bg)] text-gray-200">
      <div className="max-w-md mx-auto bg-[var(--panel)] p-6 rounded border border-[#272526] shadow-lg">
        <h1 className="text-2xl font-heading font-bold text-white mb-1">Sign In</h1>
        <p className="text-sm text-gray-400 mb-6">Sign in to continue to your account.</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            <Link to="/signup" className="text-sm text-[var(--brand-cyan)]">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
