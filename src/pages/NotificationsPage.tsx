import { useState, useEffect } from 'react'
import { CheckCheck } from 'lucide-react'
import { listNotifications, markNotificationAsRead, markAllNotificationsRead, type Notification } from '../lib/tauriApi'

type NotificationsPageProps = {
  isDarkMode: boolean
}

function NotificationsPage({ isDarkMode }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const cardClass = isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const subLabelClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'

  const loadAllNotifications = async () => {
    setIsLoading(true)
    try {
      const rows = await listNotifications(500)
      setNotifications(rows)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadAllNotifications()
  }, [])

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id)
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (error) {
      console.error('Failed to mark read:', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead()
      setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Failed to mark all read:', error)
    }
  }

  const formatNotificationTime = (isoDate: string) => {
    const dt = new Date(isoDate)
    if (Number.isNaN(dt.getTime())) return ''
    return dt.toLocaleString()
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <section className="p-5 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>System Notifications</h1>
            <p className={`mt-1 text-base ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>View all alerts and system events.</p>
          </div>
          <button 
            type="button" 
            onClick={() => void handleMarkAllRead()} 
            className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-bold ${isDarkMode ? 'border-zinc-800 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'} hover:opacity-80 transition-opacity`}
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        </header>

        <div className={`overflow-hidden rounded-2xl border ${cardClass}`}>
          {isLoading ? (
            <div className={`px-6 py-10 text-center ${subLabelClass}`}>Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className={`px-6 py-10 text-center ${subLabelClass}`}>No notifications found.</div>
          ) : (
            <div className={`divide-y ${isDarkMode ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
              {notifications.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-start justify-between gap-4 p-5 transition-colors ${item.isRead ? (isDarkMode ? 'bg-transparent' : 'bg-transparent') : (isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50')} ${isDarkMode ? 'hover:bg-[#27272A]/50' : 'hover:bg-zinc-50'}`}
                >
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{item.title}</p>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{item.message}</p>
                    <p className={`mt-2 text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{formatNotificationTime(item.createdAt)}</p>
                  </div>
                  {!item.isRead && (
                    <button 
                      onClick={() => void handleMarkAsRead(item.id)}
                      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${isDarkMode ? 'bg-zinc-800 text-emerald-400 hover:bg-zinc-700' : 'bg-white text-emerald-600 border hover:bg-zinc-50'}`}
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default NotificationsPage
