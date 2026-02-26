import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api/users'

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ bio: '', primaryGames: '', careerHistory: '', updateDate: null })
  const [user, setUser] = useState({ username: '', displayName: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)

    const uReq = axios.get(`${API_BASE}/${id}`).catch(() => null)
    const pReq = axios.get(`${API_BASE}/${id}/profile`).catch(() => null)

    Promise.all([uReq, pReq])
      .then(([uRes, pRes]) => {
        if (uRes && uRes.data) setUser(uRes.data)
        if (pRes && pRes.data) {
          setProfile({
            bio: pRes.data.bio || '',
            primaryGames: pRes.data.primaryGames || '',
            careerHistory: pRes.data.careerHistory || '',
            updateDate: pRes.data.updateDate || null,
            id: pRes.data.id || null,
          })
          setEditing(false)
        } else {
          setEditing(true)
        }
      })
      .catch((e) => setError(e?.message || String(e)))
      .finally(() => setLoading(false))
  }, [id])

  const handle = (key) => (e) => setProfile((s) => ({ ...s, [key]: e.target.value }))

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        bio: profile.bio,
        primaryGames: profile.primaryGames,
        careerHistory: profile.careerHistory,
        user: { id: Number(id) },
      }

      if (profile.id) await axios.put(`${API_BASE}/${id}/profile`, payload)
      else {
        const res = await axios.post(`${API_BASE}/${id}/profile`, payload)
        if (res?.data) setProfile((s) => ({ ...s, id: res.data.id }))
      }

      const r = await axios.get(`${API_BASE}/${id}/profile`)
      if (r?.data) setProfile((s) => ({ ...s, bio: r.data.bio || '', primaryGames: r.data.primaryGames || '', careerHistory: r.data.careerHistory || '', updateDate: r.data.updateDate || null }))
      setEditing(false)
    } catch (e) {
      setError(e?.response?.data || e.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!window.confirm('Delete your profile? This cannot be undone.')) return
    try {
      await axios.delete(`${API_BASE}/${id}/profile`)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data || e.message)
    }
  }

  if (loading) return <div className="p-6">Loading profile...</div>

  const initials = (user.displayName || user.username || 'U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
  const games = (profile.primaryGames || '').split(',').map(g => g.trim()).filter(Boolean)

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-b from-[#07070a] to-[#0b0b0d] text-gray-200">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-[#0f0f10] rounded-xl p-6 border border-[#272526] shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#ff7a2d] to-[#ff3b7a] flex items-center justify-center text-2xl font-bold text-white mb-4">{initials}</div>
              <h2 className="text-xl font-semibold">{user.displayName || user.username || 'Unnamed'}</h2>
              <div className="text-sm text-gray-400 mb-3">@{user.username || 'unknown'}</div>

              <div className="w-full mt-3">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Primary games</div>
                <div className="flex flex-wrap gap-2">
                  {games.length ? games.map((g, i) => <span key={i} className="px-3 py-1 text-sm bg-[#121213] border border-[#222223] rounded-full">{g}</span>) : <div className="text-sm text-gray-500">No games listed</div>}
                </div>
              </div>

              <div className="w-full mt-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Esports Passport</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-[#0b0b0c] rounded text-center border border-[#1f1f20]"><div className="text-xs text-gray-400">Events</div><div className="font-semibold">—</div></div>
                  <div className="p-2 bg-[#0b0b0c] rounded text-center border border-[#1f1f20]"><div className="text-xs text-gray-400">Teams</div><div className="font-semibold">—</div></div>
                </div>
              </div>

              <div className="w-full mt-4 text-xs text-gray-400">Last updated: {profile.updateDate ? new Date(profile.updateDate).toLocaleString() : '—'}</div>
            </div>
          </div>

          <div className="md:col-span-2 bg-[#0f0f10] rounded-xl p-6 border border-[#272526] shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-white">Profile</h1>
                <div className="text-sm text-gray-400">Esports passport — professional summary & career</div>
              </div>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button onClick={save} disabled={saving} className="px-4 py-2 bg-[#ff7a2d] text-black rounded font-medium">{saving ? 'Saving...' : 'Save'}</button>
                    <button onClick={() => setEditing(false)} className="px-4 py-2 bg-[#1f1f21] text-gray-300 rounded">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditing(true)} className="px-4 py-2 bg-[#1f2937] text-gray-200 rounded">Edit</button>
                    <button onClick={remove} className="px-4 py-2 bg-[#2a2a2b] text-gray-300 rounded">Delete</button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-400 mb-2">Bio</div>
                {editing ? (
                  <textarea value={profile.bio} onChange={handle('bio')} rows={4} className="w-full p-3 bg-[#0b0b0c] rounded border border-[#1f1f20]"></textarea>
                ) : (
                  <div className="p-3 bg-[#080808] rounded min-h-[80px]">{profile.bio || <span className="text-gray-500">No bio provided.</span>}</div>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Primary Games</div>
                {editing ? (
                  <input value={profile.primaryGames} onChange={handle('primaryGames')} placeholder="e.g. Valorant, CS:GO, Dota 2" className="w-full p-3 bg-[#0b0b0c] rounded border border-[#1f1f20]" />
                ) : (
                  <div className="flex flex-wrap gap-2">{games.length ? games.map((g,i) => <span key={i} className="px-3 py-1 bg-[#0b0b0c] rounded-full border border-[#1f1f20]">{g}</span>) : <span className="text-gray-500">No games listed</span>}</div>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Career History</div>
                {editing ? (
                  <textarea value={profile.careerHistory} onChange={handle('careerHistory')} rows={6} className="w-full p-3 bg-[#0b0b0c] rounded border border-[#1f1f20]"></textarea>
                ) : (
                  <div className="p-3 bg-[#080808] rounded min-h-[120px]">{profile.careerHistory || <span className="text-gray-500">No career history provided.</span>}</div>
                )}
              </div>

              {error && <div className="text-sm text-red-400">{String(error)}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
