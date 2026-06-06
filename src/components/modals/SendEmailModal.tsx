import React from 'react'
import { X, Send, Mail } from 'lucide-react'
import { sendEmailSmtp } from '../../lib/tauriApi'

interface SendEmailModalProps {
  isOpen: boolean
  onClose: () => void
  member: {
    id: number
    fullName: string
    email: string | null
  }
  onSuccess: () => void
  isDarkMode: boolean
  initialSubject?: string
  initialBody?: string
}

export function SendEmailModal({ isOpen, onClose, member, onSuccess, isDarkMode, initialSubject = '', initialBody = '' }: SendEmailModalProps) {
  const [subject, setSubject] = React.useState(initialSubject)
  const [body, setBody] = React.useState(initialBody)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (isOpen) {
      setSubject(initialSubject)
      setBody(initialBody)
      setError('')
    }
  }, [isOpen, initialSubject, initialBody])

  if (!isOpen) return null

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!member.email) {
      setError('Member does not have an email address.')
      return
    }
    if (!subject.trim() || !body.trim()) {
      setError('Subject and message are required.')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      await sendEmailSmtp(member.email, subject, body)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl ${isDarkMode ? 'bg-[#18181B] border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className={`flex items-center justify-between border-b px-6 py-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Mail size={20} />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Send Email</h2>
              <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>To: {member.fullName} {member.email ? `(${member.email})` : '(No Email)'}</p>
            </div>
          </div>
          <button onClick={onClose} className={`rounded-full p-2 transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'}`}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-6">
          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className={`mb-1.5 block text-sm font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Important Library Update"
                className={`w-full rounded-xl border px-4 py-2.5 outline-none transition-colors ${isDarkMode ? 'bg-[#27272A] border-zinc-700 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-emerald-500'}`}
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-sm font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type your message here..."
                rows={6}
                className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition-colors ${isDarkMode ? 'bg-[#27272A] border-zinc-700 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-emerald-500'}`}
              />
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
              disabled={isSubmitting || !member.email}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
