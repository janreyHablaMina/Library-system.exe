import { useState } from 'react'
import { AlertTriangle, Lock, X } from 'lucide-react'
import { changePassword } from '../lib/tauriApi'

type ChangePasswordModalProps = {
  isDarkMode: boolean
  onClose: () => void
  onSuccess: (message: string) => void
}

export function ChangePasswordModal({ isDarkMode, onClose, onSuccess }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      await changePassword({
        currentPassword,
        newPassword
      })
      onSuccess('Password changed successfully')
      onClose()
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'Failed to change password. Please check your current password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const cardClass = isDarkMode ? 'border-zinc-800 bg-[#18181B] text-zinc-100' : 'border-zinc-200 bg-white text-zinc-900'
  const inputClass = isDarkMode ? 'border-zinc-700 bg-zinc-900 focus:border-emerald-500' : 'border-zinc-200 bg-zinc-50 focus:border-emerald-500'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl animate-in zoom-in-95 duration-200 ${cardClass}`}>
        <div className={`flex items-center justify-between border-b px-6 py-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
              <Lock size={18} />
            </div>
            <h2 className="text-lg font-bold">Change Password</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm ${isDarkMode ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
              <AlertTriangle size={16} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className={`mb-1.5 block text-xs font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${inputClass}`}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-xs font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${inputClass}`}
                placeholder="Enter new password (min. 8 characters)"
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-xs font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${inputClass}`}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors ${
                isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Lock size={15} />
              )}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
