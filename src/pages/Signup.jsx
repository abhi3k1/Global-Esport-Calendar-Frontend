import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:8080/api/users'

const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Signup() {
  const [form, setForm] = useState({ username: '', displayName: '', email: '', password: '', org: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const navigate = useNavigate()

  const handle = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))

  function validate() {
    const fe = {}
    if (!form.username) fe.username = 'Username is required'
    else if (!usernameRegex.test(form.username)) fe.username = '3–30 chars: letters, numbers, _ or -'

    if (!form.displayName) fe.displayName = 'Display name is required'
    else if (form.displayName.length > 50) fe.displayName = 'Display name is too long'

    if (form.email && !emailRegex.test(form.email)) fe.email = 'Enter a valid email or leave blank'

    if (!form.password) fe.password = 'Password is required'
    else if (form.password.length < 8) fe.password = 'Password must be at least 8 characters'
    else {
      // simple complexity check
      const checks = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/]
      const passed = checks.reduce((c, rx) => c + (rx.test(form.password) ? 1 : 0), 0)
      if (passed < 3) fe.password = 'Use upper, lower, number and/or symbol (3 of 4)'
    }

    setFieldErrors(fe)
    return Object.keys(fe).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    setLoading(true)
    try {
      const payload = {
        username: form.username,
        displayName: form.displayName,
        email: form.email || undefined,
        password: form.password,
        org: form.org || undefined,
        bio: '',
        games: '',
        careerHistory: '',
      }

      const res = await axios.post(`${API_BASE}/signup`, payload)
      const id = res.data.id || res.data?.user?.id
      const token = res.data?.token || res.data?.accessToken
      if (token) localStorage.setItem('authToken', token)
      if (res?.data?.user) localStorage.setItem('user', JSON.stringify(res.data.user))
      if (id) navigate(`/profile/${id}`)
    } catch (err) {
      // prefer structured server message when available
      const server = err?.response?.data?.message || err?.response?.data || err.message
      setError(typeof server === 'string' ? server : 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-6 bg-[var(--bg)] text-gray-200">
      <div className="max-w-md mx-auto bg-[var(--panel)] p-6 rounded border border-[#272526] shadow-lg">
        <h1 className="text-2xl font-heading font-bold text-white mb-1">Create an account</h1>
        <p className="text-sm text-gray-400 mb-6">Create your esports passport to track and share your career.</p>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Username</label>
            <input value={form.username} onChange={handle('username')} placeholder="Username" className="w-full p-2 bg-[#0b0b0c] rounded border border-transparent focus:border-[var(--accent-cyan)]" aria-invalid={!!fieldErrors.username} aria-describedby={fieldErrors.username ? 'err-username' : undefined} />
            {fieldErrors.username && <div id="err-username" className="text-xs text-red-400 mt-1">{fieldErrors.username}</div>}
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Display Name</label>
            <input value={form.displayName} onChange={handle('displayName')} placeholder="Display Name" className="w-full p-2 bg-[#0b0b0c] rounded border border-transparent focus:border-[var(--accent-cyan)]" aria-invalid={!!fieldErrors.displayName} aria-describedby={fieldErrors.displayName ? 'err-displayName' : undefined} />
            {fieldErrors.displayName && <div id="err-displayName" className="text-xs text-red-400 mt-1">{fieldErrors.displayName}</div>}
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Email <span className="text-xs text-gray-500">(optional)</span></label>
            <input value={form.email} onChange={handle('email')} placeholder="Email (optional)" className="w-full p-2 bg-[#0b0b0c] rounded border border-transparent focus:border-[var(--accent-cyan)]" aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'err-email' : undefined} />
            {fieldErrors.email && <div id="err-email" className="text-xs text-red-400 mt-1">{fieldErrors.email}</div>}
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Password</label>
            <input type="password" value={form.password} onChange={handle('password')} placeholder="Password (at least 8 chars)" className="w-full p-2 bg-[#0b0b0c] rounded border border-transparent focus:border-[var(--accent-cyan)]" aria-invalid={!!fieldErrors.password} aria-describedby={fieldErrors.password ? 'err-password' : undefined} />
            {fieldErrors.password && <div id="err-password" className="text-xs text-red-400 mt-1">{fieldErrors.password}</div>}
            <div className="text-xs text-gray-500 mt-1">Use at least 8 characters — mix upper/lowercase, numbers, or symbols.</div>
          </div>

          {error && <div className="text-sm text-red-400">{String(error)}</div>}

          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="bg-[var(--brand-orange)] text-black px-4 py-2 rounded font-semibold disabled:opacity-60">{loading ? 'Creating...' : 'Sign Up'}</button>
            <a href="/" className="text-sm text-[var(--brand-cyan)]">Back to homepage</a>
          </div>
        </form>
      </div>
    </div>
  )
}
