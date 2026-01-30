import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignInModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!open) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-[var(--panel)] rounded-lg p-6 z-70 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-bold text-white">Sign In</h3>
          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 bg-[#0b0b0c] rounded text-gray-200" placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 bg-[#0b0b0c] rounded text-gray-200" placeholder="••••••••" />
          </div>

          <div className="flex items-center justify-between">
            <button className="bg-[var(--brand-orange)] text-black px-4 py-2 rounded font-semibold">Sign In</button>
            <Link to="/signup" onClick={onClose} className="text-sm text-[var(--brand-cyan)]">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
