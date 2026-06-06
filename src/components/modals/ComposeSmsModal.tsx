import React, { useState, FormEvent, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Search, User } from 'lucide-react'
import { invoke } from '@tauri-apps/api/core'
import { listMembers, type Member } from '../../lib/tauriApi'

type ComposeSmsModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  isDarkMode: boolean
}

export function ComposeSmsModal({ isOpen, onClose, onSuccess, isDarkMode }: ComposeSmsModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [memberName, setMemberName] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Member search state
  const [searchQuery, setSearchQuery] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber('')
      setMemberName('')
      setMessage('')
      setSearchQuery('')
      setError(null)
      setShowDropdown(false)
    }
  }, [isOpen])

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!showDropdown) return
    const fetchMembers = async () => {
      setIsSearching(true)
      try {
        const allMembers = await listMembers(200)
        const filtered = allMembers.filter(m => 
          m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (m.contactNumber && m.contactNumber.includes(searchQuery))
        )
        setMembers(filtered)
      } catch (err) {
        console.error('Failed to search members:', err)
      } finally {
        setIsSearching(false)
      }
    }
    const timer = setTimeout(fetchMembers, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, showDropdown])

  if (!isOpen) return null

  const handleSelectMember = (member: Member) => {
    if (member.contactNumber) {
      setPhoneNumber(member.contactNumber)
      setMemberName(member.fullName)
      setSearchQuery(member.fullName)
      setShowDropdown(false)
    } else {
      setError(`Member ${member.fullName} does not have a contact number on file.`)
    }
  }

  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !phoneNumber.trim()) return

    setIsSending(true)
    setError(null)

    try {
      await invoke('send_manual_sms', {
        phoneNumber: phoneNumber.trim(),
        memberName: memberName.trim() || 'Manual Entry',
        message: message.trim(),
      })
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
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Compose SMS</h3>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Send a custom text message
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

        <form onSubmit={handleSend} className="p-6 space-y-4">
          {error && (
            <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${isDarkMode ? 'border-rose-500/20 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
              {error}
            </div>
          )}

          <div className="space-y-4 relative" ref={dropdownRef}>
            <label className={`block text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
              Recipient
            </label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                <input
                  type="text"
                  placeholder="Search member by name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${inputClass}`}
                />
              </div>

              {showDropdown && (
                <div className={`absolute z-10 top-[76px] left-0 right-0 max-h-60 overflow-y-auto rounded-xl border shadow-xl ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-white'}`}>
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-zinc-500">Searching...</div>
                  ) : members.length === 0 ? (
                    <div className="p-4 text-center text-sm text-zinc-500">No members found.</div>
                  ) : (
                    <ul className="py-2">
                      {members.map(m => (
                        <li 
                          key={m.id} 
                          onClick={() => handleSelectMember(m)}
                          className={`flex cursor-pointer flex-col px-4 py-2 transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}
                        >
                          <span className={`font-bold text-sm ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{m.fullName}</span>
                          <span className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            {m.contactNumber || 'No phone number'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Phone Number (e.g. 09123456789)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${inputClass}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Name (Optional)"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${inputClass}`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`mb-1.5 block text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your text message here..."
              className={`min-h-[120px] w-full resize-none rounded-xl border p-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${inputClass}`}
              disabled={isSending}
              maxLength={160}
              required
            />
            <div className="mt-1.5 flex justify-end">
              <span className={`text-xs font-semibold ${message.length === 160 ? 'text-rose-500' : isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {message.length} / 160 characters
              </span>
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
              disabled={isSending || !message.trim() || !phoneNumber.trim()}
              className={`inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-50`}
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
