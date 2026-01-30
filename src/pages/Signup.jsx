import React, { useState } from 'react'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', org: '' })
  const handle = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))

  return (
    <div className="min-h-screen py-20 px-6 bg-[var(--bg)] text-gray-200">
      <div className="max-w-md mx-auto bg-[var(--panel)] p-6 rounded border border-[#272526]">
        <h1 className="text-2xl font-heading font-bold text-white mb-3">Create an account</h1>
        <p className="text-sm text-gray-400 mb-6">Sign up to submit and manage your tournaments.</p>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input value={form.name} onChange={handle('name')} placeholder="Full Name" className="w-full p-2 bg-[#0b0b0c] rounded" />
          <input value={form.email} onChange={handle('email')} placeholder="Email" className="w-full p-2 bg-[#0b0b0c] rounded" />
          <input type="password" value={form.password} onChange={handle('password')} placeholder="Password" className="w-full p-2 bg-[#0b0b0c] rounded" />
          <input value={form.org} onChange={handle('org')} placeholder="Organization (optional)" className="w-full p-2 bg-[#0b0b0c] rounded" />

          <div className="flex items-center justify-between">
            <button className="bg-[var(--brand-orange)] text-black px-4 py-2 rounded font-semibold">Sign Up</button>
            <a href="/" className="text-sm text-[var(--brand-cyan)]">Back to homepage</a>
          </div>
        </form>
      </div>
    </div>
  )
}
