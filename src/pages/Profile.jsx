import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axios
      .get(`${API_BASE}/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((e) => setError(e?.response?.data || e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handle = (k) => (e) => setUser((s) => ({ ...s, [k]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try {
      await axios.put(`${API_BASE}/users/${id}`, user)
      // reload
      const res = await axios.get(`${API_BASE}/users/${id}`)
      setUser(res.data)
    } catch (e) {
      setError(e?.response?.data || e.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    try {
      await axios.delete(`${API_BASE}/users/${id}`)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data || e.message)
    }
  }

  if (loading) return <div className="p-6">Loading profile...</div>
  if (!user) return <div className="p-6 text-red-400">Profile not found</div>

  return (
    <div className="min-h-screen py-12 px-6 bg-[#09080a] text-gray-200">
      <div className="max-w-3xl mx-auto bg-[#0f0f10] rounded-lg p-6 border border-[#272526]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">{user.displayName || user.username}</h1>
            <div className="text-sm text-gray-400">@{user.username}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="px-3 py-2 bg-[#ff7a2d] text-black rounded">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={remove} className="px-3 py-2 bg-[#2a2a2b] text-gray-300 rounded">Delete</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <label className="text-sm text-gray-400">Display Name</label>
          <input value={user.displayName || ''} onChange={handle('displayName')} className="w-full p-2 bg-[#0b0b0c] rounded" />

          <label className="text-sm text-gray-400">Bio</label>
          <textarea value={user.bio || ''} onChange={handle('bio')} className="w-full p-2 bg-[#0b0b0c] rounded" rows={4} />

          <label className="text-sm text-gray-400">Primary Games (comma separated)</label>
          <input value={user.games || ''} onChange={handle('games')} className="w-full p-2 bg-[#0b0b0c] rounded" />

          <label className="text-sm text-gray-400">Career History</label>
          <textarea value={user.careerHistory || ''} onChange={handle('careerHistory')} className="w-full p-2 bg-[#0b0b0c] rounded" rows={6} />

          {error && <div className="text-sm text-red-400">{String(error)}</div>}
        </div>
      </div>
    </div>
  )
}
