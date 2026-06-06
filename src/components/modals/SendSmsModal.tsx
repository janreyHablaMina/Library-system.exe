import React, { useState, type FormEvent } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import { invoke } from '@tauri-apps/api/core'

type SendSmsModalProps = {
  isOpen: boolean
  onClose: () => void
  member: {
    id: number
    fullName: string
    phone: string | null
  }
  onSuccess: () => void
  isDarkMode: boolean
  initialBody?: string
}

export function SendSmsModal({ isOpen, onClose, member, onSuccess, isDarkMode, initialBody = '' }: SendSmsModalProps) {
  const [message, setMessage] = useState(initialBody)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    if (isOpen) {
      setMessage(initialBody)
      setError(null)
    }
  }, [isOpen, initialBody])

  if (!isOpen) return null

  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSending(true)
    setError(null)

    try {
      await invoke('send_manual_sms', {
        phoneNumber: member.phone,
        memberName: member.fullName,
        message: message.trim(),
      })
      setMessage('')
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl ${isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
        <div className={`flex items-center justify-between border-b px-6 py-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Send SMS</h2>
              <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                To: {member.fullName} ({member.phone || 'No phone number'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`rounded-full p-2 transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
              {error}
            </div>
          )}

          {!member.phone ? (
            <div className={`mb-4 rounded-xl border p-4 text-sm ${isDarkMode ? 'border-amber-500/20 bg-amber-500/10 text-amber-300' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
              This member does not have a contact number on file. You cannot send an SMS to them.
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <label className={`mb-1.5 block text-sm font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your text message here..."
                rows={6}
                className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition-colors ${
                  isDarkMode
                    ? 'border-zinc-700 bg-[#27272A] text-white placeholder:text-zinc-500 focus:border-emerald-500'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500'
                }`}
                disabled={isSending || !member.phone}
                maxLength={160}
              />
              <div className="mt-1.5 flex justify-end">
                <span className={`text-xs ${message.length === 160 ? 'font-semibold text-rose-500' : isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {message.length} / 160 characters
                </span>
              </div>
            </div>
          </div>

          <div className={`mt-6 flex justify-end gap-3 border-t pt-6 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl px-5 py-2.5 font-semibold transition-colors ${isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-100'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || !message.trim() || !member.phone}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Send size={18} />
                  <span>Send SMS</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
