import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { RefreshCw, Mail, Phone, Search, Reply } from 'lucide-react'
import { Toast } from '../components/ui/Toast'

export type InboxMessage = {
  id: number
  message_type: string
  sender_address: string
  sender_name: string | null
  subject: string | null
  body: string | null
  received_at: string
  read: number
  thread_id: string | null
}

export default function InboxPage({ isDarkMode }: { isDarkMode: boolean }) {
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMsg, setSelectedMsg] = useState<InboxMessage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const loadMessages = async () => {
    try {
      const data: InboxMessage[] = await invoke('list_inbox_messages')
      setMessages(data)
    } catch (e: any) {
      setError(e.toString())
    }
  }

  const handleSync = async () => {
    setLoading(true)
    setError(null)
    try {
      const newCount: number = await invoke('sync_inbox')
      await loadMessages()
      if (newCount > 0) setToastMessage(`Synced ${newCount} new messages!`)
      else setToastMessage('No new messages found.')
    } catch (e: any) {
      setError(e.toString())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMessages()
  }, [])

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 lg:p-6 flex flex-col ${isDarkMode ? 'bg-transparent text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black">App Inbox</h1>
          <p className="text-sm text-zinc-500">Incoming replies from your library members</p>
        </div>
        <button 
          onClick={handleSync} 
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Sync Now
        </button>
      </div>

      {error && <div className="bg-rose-50 text-rose-600 p-3 mb-4 rounded-xl text-sm font-bold">{error}</div>}

      <div className="flex flex-1 overflow-hidden border rounded-2xl bg-white dark:bg-[#18181B] dark:border-zinc-800">
        <div className="w-1/3 border-r dark:border-zinc-800 flex flex-col">
          <div className="p-3 border-b dark:border-zinc-800">
             <div className="flex items-center gap-2 border rounded-xl px-3 py-2 dark:border-zinc-700 bg-zinc-50 dark:bg-[#27272A]">
               <Search size={16} className="text-zinc-400" />
               <input placeholder="Search inbox..." className="bg-transparent outline-none text-sm w-full" />
             </div>
          </div>
          <div className="flex-1 overflow-auto">
            {messages.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-sm">Inbox is empty. Click sync.</div>
            ) : messages.map(msg => (
              <div 
                key={msg.id} 
                onClick={() => setSelectedMsg(msg)}
                className={`p-4 border-b dark:border-zinc-800 cursor-pointer ${selectedMsg?.id === msg.id ? 'bg-emerald-50 dark:bg-zinc-800/80' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm truncate">{msg.sender_address}</span>
                  <span className="text-[10px] text-zinc-500">{new Date(msg.received_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate font-semibold mb-1">{msg.subject || 'No Subject'}</div>
                <div className="text-xs text-zinc-500 truncate">{msg.body}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 flex flex-col">
          {selectedMsg ? (
            <>
              <div className="p-6 border-b dark:border-zinc-800">
                 <h2 className="text-xl font-bold mb-2">{selectedMsg.subject || 'No Subject'}</h2>
                 <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center font-bold">
                     {selectedMsg.sender_address.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <div className="text-sm font-bold">{selectedMsg.sender_address}</div>
                     <div className="text-xs text-zinc-500">{new Date(selectedMsg.received_at).toLocaleString()}</div>
                   </div>
                 </div>
              </div>
              <div className="p-6 flex-1 overflow-auto text-sm whitespace-pre-wrap leading-relaxed">
                {selectedMsg.body}
              </div>
              <div className="p-4 border-t dark:border-zinc-800">
                <button className="flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <Reply size={16} /> Reply to Member
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
              Select a message to read
            </div>
          )}
        </div>
      </div>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} isDarkMode={isDarkMode} />}
    </div>
  )
}
