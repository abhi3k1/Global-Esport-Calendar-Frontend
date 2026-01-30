import React, { useState } from 'react'

export default function SubmitEvent() {
  const [form, setForm] = useState({
    name: '', game: '', tier: 'Tier 2', region: '', startDate: '', endDate: '', regDeadline: '', prize: '', currency: 'USD', format: '', maxParticipants: '', regLink: '', streamPlatform: '', streamLink: '', organizer: '', email: '', phone: '', description: '', rules: ''
  })
  const handle = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))

  return (
    <div className="min-h-screen py-12 px-6 bg-[var(--bg)] text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white">Submit Tournament</h1>
            <p className="text-gray-300 mt-2">Help grow the esports community by sharing your event</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2">
            <div className="bg-[#0b0b0c] p-6 rounded-xl border border-[#232326] shadow-sm">
              {/* Basic Info */}
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-[var(--brand-orange)] rounded flex items-center justify-center text-black">＋</div>
                  <h2 className="text-lg font-heading font-semibold">Basic Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Event Name <span className="text-[var(--brand-orange)]">*</span></label>
                    <input value={form.name} onChange={handle('name')} placeholder="e.g., Summer Championship 2026" className="w-full p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100 placeholder:text-gray-500" />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Game Title <span className="text-[var(--brand-orange)]">*</span></label>
                    <select value={form.game} onChange={handle('game')} className="w-full p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100">
                      <option value="">Select Game Title</option>
                      <option>Valorant</option>
                      <option>CS:GO</option>
                      <option>Dota 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Tournament Tier <span className="text-[var(--brand-orange)]">*</span></label>
                    <select value={form.tier} onChange={handle('tier')} className="w-full p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100">
                      <option>Tier 1</option>
                      <option>Tier 2</option>
                      <option>Tier 3</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Region <span className="text-[var(--brand-orange)]">*</span></label>
                    <select value={form.region} onChange={handle('region')} className="w-full p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100">
                      <option value="">Select Region</option>
                      <option>India</option>
                      <option>APAC</option>
                      <option>SEA</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Schedule */}
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-[#f59e0b] rounded flex items-center justify-center text-black">📅</div>
                  <h3 className="text-lg font-heading font-semibold">Schedule</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Start Date <span className="text-[var(--brand-orange)]">*</span></label>
                    <input type="date" value={form.startDate} onChange={handle('startDate')} className="w-full p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 block mb-2">End Date <span className="text-[var(--brand-orange)]">*</span></label>
                    <input type="date" value={form.endDate} onChange={handle('endDate')} className="w-full p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Registration Deadline</label>
                    <input type="date" value={form.regDeadline} onChange={handle('regDeadline')} className="w-full p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                  </div>
                </div>
              </section>

              {/* Prize & Format */}
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-[#ffd166] rounded flex items-center justify-center text-black">🏆</div>
                  <h3 className="text-lg font-heading font-semibold">Prize & Format</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <input value={form.prize} onChange={handle('prize')} placeholder="Prize Pool" className="p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                  <select value={form.currency} onChange={handle('currency')} className="p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100">
                    <option>USD ($)</option>
                    <option>INR (₹)</option>
                    <option>EUR (€)</option>
                  </select>
                  <input value={form.format} onChange={handle('format')} placeholder="Tournament Format" className="p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <input value={form.maxParticipants} onChange={handle('maxParticipants')} placeholder="Max Participants" className="p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                </div>
              </section>

              {/* Registration & Streaming */}
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-[#8b5cf6] rounded flex items-center justify-center text-black">🔗</div>
                  <h3 className="text-lg font-heading font-semibold">Registration & Streaming</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input value={form.regLink} onChange={handle('regLink')} placeholder="Registration Link" className="p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                  <input value={form.streamPlatform} onChange={handle('streamPlatform')} placeholder="Streaming Platform" className="p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                </div>

                <div className="mt-4">
                  <input value={form.streamLink} onChange={handle('streamLink')} placeholder="Streaming Link" className="w-full p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                </div>
              </section>

              {/* Organizer Details */}
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-[#34d399] rounded flex items-center justify-center text-black">👥</div>
                  <h3 className="text-lg font-heading font-semibold">Organizer Details</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <input value={form.organizer} onChange={handle('organizer')} placeholder="Organizer Name" className="p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                  <input value={form.email} onChange={handle('email')} placeholder="Email*" className="p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                  <input value={form.phone} onChange={handle('phone')} placeholder="Phone" className="p-3 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100" />
                </div>
              </section>

              {/* Details */}
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-[#60a5fa] rounded flex items-center justify-center text-black">📄</div>
                  <h3 className="text-lg font-heading font-semibold">Details</h3>
                </div>

                <textarea value={form.description} onChange={handle('description')} placeholder="Tournament Description" className="w-full p-4 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100 h-36" />
                <textarea value={form.rules} onChange={handle('rules')} placeholder="Rules & Eligibility" className="w-full p-4 bg-[#0f0f10] rounded-lg border border-[#262628] text-gray-100 h-36 mt-4" />
              </section>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">* Required fields</div>
                <button className="bg-[var(--brand-orange)] text-black px-6 py-3 rounded-full flex items-center gap-2 font-semibold">
                  <span>➤</span> Submit Tournament
                </button>
              </div>
            </div>
          </main>

          <aside className="space-y-6">
            <div className="bg-[var(--panel)] p-6 rounded-xl border border-[#232326]">
              <h4 className="text-lg font-heading font-semibold text-white mb-3">Submission Guidelines</h4>
              <ul className="text-sm text-gray-300 space-y-3">
                <li><strong>Accurate Information:</strong> Provide complete and accurate tournament details including dates, times, and prize pools.</li>
                <li><strong>Advance Notice:</strong> Submit events at least 7 days before start date for better visibility.</li>
                <li><strong>Valid Links:</strong> Ensure registration and streaming links are active.</li>
                <li><strong>Clear Rules:</strong> Include tournament format, rules, and eligibility criteria.</li>
                <li><strong>Verification:</strong> Submissions are reviewed within 24-48 hours.</li>
              </ul>
            </div>

            <div className="bg-[var(--panel)] p-6 rounded-xl border border-[#232326]">
              <h4 className="text-lg font-heading font-semibold text-white mb-4">Community Impact</h4>
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="text-sm text-gray-300">Events Submitted</div>
                <div className="text-2xl font-heading font-bold text-[var(--brand-orange)] text-right">1,247</div>

                <div className="text-sm text-gray-300">Active Organizers</div>
                <div className="text-2xl font-heading font-bold text-[var(--brand-cyan)] text-right">342</div>

                <div className="text-sm text-gray-300">Avg. Review Time</div>
                <div className="text-2xl font-heading font-bold text-white text-right">36h</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
