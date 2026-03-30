'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/apiClient'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/common/Toast'

const PREF_KEY = 'clinicmind-admin-prefs'

export default function AdminSettingsPage() {
  const user = useAuthStore(s => s.user)
  const { toast, toasts, removeToast } = useToast()

  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError,   setPwError]   = useState('')

  // Notification prefs from localStorage
  const [prefs, setPrefs] = useState({
    newHospitalAlert: true,
    weeklyReport:     false,
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREF_KEY)
      if (stored) setPrefs(JSON.parse(stored))
    } catch {}
  }, [])

  const togglePref = (key: keyof typeof prefs) => {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    localStorage.setItem(PREF_KEY, JSON.stringify(next))
    toast.success('Preferences saved')
  }

  const handleChangePassword = async () => {
    setPwError('')
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError('All fields are required')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters')
      return
    }
    setPwLoading(true)
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword })
      toast.success('Password changed successfully')
      setChangePasswordModal(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPwError(err?.response?.data?.error || 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="max-w-2xl space-y-5">
        {/* Platform info card */}
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
          <h3 className="font-syne font-bold text-base text-[#1A2420] mb-5">
            Platform Information
          </h3>
          {[
            { label: 'Platform name',   value: 'ClinicMind AI'                                    },
            { label: 'Version',         value: '1.0.0'                                             },
            { label: 'Support email',   value: 'support@clinicmind.in'                             },
            { label: 'API base URL',    value: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1' },
          ].map((item) => (
            <div key={item.label}
                 className="flex justify-between py-3 border-b border-[#E2E8E4] last:border-0">
              <span className="text-sm text-[#8A9E98]">{item.label}</span>
              <span className="text-sm font-medium text-[#1A2420] font-mono text-right max-w-xs truncate">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Superadmin account */}
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
          <h3 className="font-syne font-bold text-base text-[#1A2420] mb-5">
            Superadmin Account
          </h3>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-[#A32D2D] flex items-center justify-center
                            font-syne font-extrabold text-lg text-white">
              {user?.name?.charAt(0) ?? 'A'}
            </div>
            <div>
              <div className="font-semibold text-[#1A2420]">{user?.name ?? 'Super Admin'}</div>
              <div className="text-sm text-[#8A9E98]">{user?.email}</div>
            </div>
          </div>
          {[
            { label: 'Email',  value: user?.email },
            { label: 'Phone',  value: user?.phone || 'Not set' },
            { label: 'Role',   value: 'Super Admin'           },
          ].map(({ label, value }) => (
            <div key={label}
                 className="flex justify-between py-3 border-b border-[#E2E8E4] last:border-0">
              <span className="text-sm text-[#8A9E98]">{label}</span>
              <span className="text-sm font-medium text-[#1A2420]">{value}</span>
            </div>
          ))}
          <button
            onClick={() => setChangePasswordModal(true)}
            className="mt-5 px-4 py-2 border border-[#0F6E56] text-[#0F6E56] rounded-xl text-sm
                       font-semibold hover:bg-[#0F6E56] hover:text-white transition-all"
          >
            Change Password
          </button>
        </div>

        {/* Notification preferences */}
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
          <h3 className="font-syne font-bold text-base text-[#1A2420] mb-5">
            Notification Preferences
          </h3>
          {[
            { label: 'New hospital registration alert', key: 'newHospitalAlert' as const },
            { label: 'Weekly revenue report',           key: 'weeklyReport'     as const },
          ].map(({ label, key }) => (
            <div key={key}
                 className="flex items-center justify-between py-3 border-b border-[#E2E8E4] last:border-0">
              <span className="text-sm text-[#4A5E58]">{label}</span>
              <button
                onClick={() => togglePref(key)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  prefs[key] ? 'bg-[#0F6E56]' : 'bg-[#E2E8E4]'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                  prefs[key] ? 'left-5' : 'left-1'
                }`} />
              </button>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-[#FCEBEB] p-6">
          <h3 className="font-syne font-bold text-base text-[#A32D2D] mb-5">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#FCEBEB]">
              <div>
                <div className="text-sm font-medium text-[#1A2420]">Export All Data</div>
                <div className="text-xs text-[#8A9E98] mt-0.5">
                  Download a full export of platform data
                </div>
              </div>
              <button
                onClick={() => toast.info('Export feature coming soon')}
                className="px-3 py-1.5 border border-[#A32D2D] text-[#A32D2D] rounded-lg text-xs
                           font-semibold hover:bg-[#A32D2D] hover:text-white transition-all"
              >
                Export
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium text-[#1A2420]">Maintenance Mode</div>
                <div className="text-xs text-[#8A9E98] mt-0.5">
                  Temporarily disable all user access
                </div>
              </div>
              <button
                onClick={() => toast.info('Maintenance mode coming soon')}
                className="px-3 py-1.5 bg-[#FCEBEB] text-[#A32D2D] rounded-lg text-xs
                           font-semibold hover:bg-[#A32D2D] hover:text-white transition-all"
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {changePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h2 className="font-syne font-bold text-lg text-[#1A2420] mb-5">
              Change Password
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Current Password', value: currentPassword, onChange: setCurrentPassword },
                { label: 'New Password',      value: newPassword,     onChange: setNewPassword     },
                { label: 'Confirm Password',  value: confirmPassword,  onChange: setConfirmPassword },
              ].map(({ label, value, onChange }) => (
                <div key={label}>
                  <label className="text-xs font-medium text-[#1A2420] block mb-1.5">{label}</label>
                  <input
                    type="password"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2.5 text-sm
                               text-[#1A2420] outline-none focus:border-[#0F6E56]"
                  />
                </div>
              ))}
              {pwError && <p className="text-xs text-[#A32D2D]">{pwError}</p>}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setChangePasswordModal(false); setPwError('') }}
                disabled={pwLoading}
                className="flex-1 px-4 py-2.5 border border-[#E2E8E4] rounded-xl text-sm
                           font-medium text-[#8A9E98] hover:text-[#4A5E58] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={pwLoading}
                className="flex-1 px-4 py-2.5 bg-[#0F6E56] text-white rounded-xl text-sm
                           font-semibold hover:bg-[#0B5542] disabled:opacity-50 transition-colors"
              >
                {pwLoading ? 'Saving...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
