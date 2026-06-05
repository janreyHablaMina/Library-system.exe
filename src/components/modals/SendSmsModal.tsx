import React, { useState, FormEvent, useEffect } from 'react'
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
        memberId: member.id,
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

  const surface = isDarkMode
    ? 'border-zinc-700 bg-[#18181B] text-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
    : 'border-zinc-200 bg-white text-zinc-700 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'

  const inputClass = isDarkMode
    ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500'
    : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur-sm">
      <div className={`w-full max-w-lg overflow-hidden rounded-2xl border ${surface}`}>
        <div className={`flex items-center justify-between border-b px-6 py-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${isDarkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Send SMS</h3>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                To: {member.fullName} ({member.phone || 'No phone number'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'}`}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-6">
          {error && (
            <div className={`mb-5 rounded-xl border px-4 py-3 text-sm font-semibold ${isDarkMode ? 'border-rose-500/20 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
              {error}
            </div>
          )}

          {!member.phone ? (
            <div className={`mb-5 rounded-xl border px-4 py-3 text-sm font-semibold ${isDarkMode ? 'border-amber-500/20 bg-amber-500/10 text-amber-300' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
              This member does not have a contact number on file. You cannot send an SMS to them.
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <label className={`mb-1.5 block text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your text message here..."
                className={`min-h-[120px] w-full resize-none rounded-xl border p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 ${inputClass}`}
                disabled={isSending || !member.phone}
                maxLength={160}
              />
              <div className="mt-1.5 flex justify-end">
                <span className={`text-xs font-semibold ${message.length === 160 ? 'text-rose-500' : isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {message.length} / 160 characters
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`h-10 rounded-xl border px-4 text-sm font-bold transition-colors ${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || !message.trim() || !member.phone}
              className={`inline-flex h-10 items-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-bold text-white transition-colors hover:bg-sky-700 disabled:pointer-events-none disabled:opacity-50`}
            >
              <Send size={16} className={isSending ? 'animate-pulse' : ''} />
              {isSending ? 'Sending...' : 'Send SMS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
