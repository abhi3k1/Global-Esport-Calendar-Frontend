import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'
const PROFILE_API = `${API_BASE}/profiles`

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    // Try to load profile from separate profiles API. If not found, allow editing (first-time)
    axios
      .get(`${PROFILE_API}/${id}`)
      .then((res) => {
        setProfile(res.data)
        setEditing(false)
      })
      .catch((e) => {
        // If 404 or no profile, set up empty profile for editing
        setProfile({ userId: id, username: '', displayName: '', bio: '', games: '', careerHistory: '' })
        setEditing(true)
        setIsFirstTime(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handle = (k) => (e) => setProfile((s) => ({ ...s, [k]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try {
      // If profile has an id (existing), update it; otherwise create a new profile
      if (profile && profile.id) {
        await axios.put(`${PROFILE_API}/${profile.id}`, profile)
      } else {
        // create profile; backend should link profile to user via userId
        const res = await axios.post(`${PROFILE_API}`, profile)
        // backend returns created profile
        if (res?.data) setProfile(res.data)
      }

      // After saving, if this was first-time, mark complete and navigate to profile view
      if (isFirstTime) {
        try { window.localStorage.setItem('profileCompleted', '1') } catch (e) {}
        setIsFirstTime(false)
        setEditing(false)
        navigate(`/profile/${id}`)
      } else {
        // reload profile from server to show latest
        const r = await axios.get(`${PROFILE_API}/${id}`)
        setProfile(r.data)
        setEditing(false)
      }
    } catch (e) {
      setError(e?.response?.data || e.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    try {
      // delete profile (not user account)
      if (profile && profile.id) await axios.delete(`${PROFILE_API}/${profile.id}`)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data || e.message)
    }
  }

  if (loading) return <div className="p-6">Loading profile...</div>
  if (!profile) return <div className="p-6 text-red-400">Profile not found</div>

  return (
    <div className="min-h-screen py-12 px-6 bg-[#09080a] text-gray-200">
      <div className="max-w-3xl mx-auto bg-[#0f0f10] rounded-lg p-6 border border-[#272526]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">{profile.displayName || profile.username}</h1>
            <div className="text-sm text-gray-400">@{profile.username}</div>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={save} disabled={saving} className="px-3 py-2 bg-[#ff7a2d] text-black rounded">{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => { setEditing(false); if (isFirstTime) navigate('/'); }} className="px-3 py-2 bg-[#2a2a2b] text-gray-300 rounded">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="px-3 py-2 bg-[#1f2937] text-gray-200 rounded">Edit</button>
                <button onClick={remove} className="px-3 py-2 bg-[#2a2a2b] text-gray-300 rounded">Delete</button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <label className="text-sm text-gray-400">Display Name</label>
          {editing ? (
            <input value={profile.displayName || ''} onChange={handle('displayName')} className="w-full p-2 bg-[#0b0b0c] rounded" />
          ) : (
            <div className="p-2">{profile.displayName}</div>
          )}

          <label className="text-sm text-gray-400">Bio</label>
          {editing ? (
            <textarea value={profile.bio || ''} onChange={handle('bio')} className="w-full p-2 bg-[#0b0b0c] rounded" rows={4} />
          ) : (
            <div className="p-2">{profile.bio}</div>
          )}

          <label className="text-sm text-gray-400">Primary Games (comma separated)</label>
          {editing ? (
            <input value={profile.games || ''} onChange={handle('games')} className="w-full p-2 bg-[#0b0b0c] rounded" />
          ) : (
            <div className="p-2">{profile.games}</div>
          )}

          <label className="text-sm text-gray-400">Career History</label>
          {editing ? (
            <textarea value={profile.careerHistory || ''} onChange={handle('careerHistory')} className="w-full p-2 bg-[#0b0b0c] rounded" rows={6} />
          ) : (
            <div className="p-2">{profile.careerHistory}</div>
          )}

          {error && <div className="text-sm text-red-400">{String(error)}</div>}
        </div>
      </div>
    </div>
  )
}
