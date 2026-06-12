import { useMemo, useState, useEffect } from 'react'
import { Bell, Building2, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, Circle, IdCard, Inbox, Mail, Phone, RotateCcw, UserRound, X } from 'lucide-react'
import { listMembers, listNotifications, markNotificationAsRead, markAllNotificationsRead, type Member, type NotificationItem } from '../lib/tauriApi'

type NotificationsPageProps = {
  isDarkMode: boolean
  initialNotificationId?: number | null
  onInitialNotificationConsumed?: () => void
  onNotificationsChanged?: () => void
}

function NotificationsPage({
  isDarkMode,
  initialNotificationId = null,
  onInitialNotificationConsumed,
  onNotificationsChanged,
}: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null)
  const [notificationMembers, setNotificationMembers] = useState<Member[]>([])
  const [isLoadingNotificationDetails, setIsLoadingNotificationDetails] = useState(false)

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
    const timer = window.setTimeout(() => {
      void loadAllNotifications()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id)
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      onNotificationsChanged?.()
    } catch (error) {
      console.error('Failed to mark read:', error)
    }
  }

  const handleOpenNotification = async (item: NotificationItem) => {
    setSelectedNotification(item)
    if (!item.isRead) {
      await handleMarkAsRead(item.id)
      setSelectedNotification({ ...item, isRead: true })
    }
  }

  useEffect(() => {
    if (isLoading || initialNotificationId === null) return

    const item = notifications.find((notification) => notification.id === initialNotificationId)
    const timer = window.setTimeout(() => {
      onInitialNotificationConsumed?.()
      if (item) {
        setSelectedNotification(item)
        if (!item.isRead) {
          void markNotificationAsRead(item.id)
            .then(() => {
              setNotifications((prev) => prev.map((notification) => (
                notification.id === item.id ? { ...notification, isRead: true } : notification
              )))
              setSelectedNotification({ ...item, isRead: true })
              onNotificationsChanged?.()
            })
            .catch((error) => {
              console.error('Failed to mark read:', error)
            })
        }
      }
    }, 0)

    return () => window.clearTimeout(timer)
  }, [initialNotificationId, isLoading, notifications, onInitialNotificationConsumed, onNotificationsChanged])

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead()
      setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })))
      onNotificationsChanged?.()
    } catch (error) {
      console.error('Failed to mark all read:', error)
    }
  }

  useEffect(() => {
    if (selectedNotification?.notificationType !== 'member') return

    let cancelled = false
    const timer = window.setTimeout(() => {
      setIsLoadingNotificationDetails(true)
      listMembers(500)
        .then((members) => {
          if (cancelled) return
          const today = new Date().toISOString().slice(0, 10)
          setNotificationMembers(
            members
              .filter((member) => member.createdAt.slice(0, 10) === today)
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
          )
        })
        .catch((error) => {
          console.error('Failed to load notification member details:', error)
          if (!cancelled) setNotificationMembers([])
        })
        .finally(() => {
          if (!cancelled) setIsLoadingNotificationDetails(false)
        })
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [selectedNotification])

  const formatNotificationTime = (isoDate: string) => {
    const dt = new Date(isoDate)
    if (Number.isNaN(dt.getTime())) return ''
    return dt.toLocaleString()
  }
  const unreadCount = notifications.filter((item) => !item.isRead).length
  const filteredNotifications = useMemo(
    () => activeFilter === 'unread' ? notifications.filter((item) => !item.isRead) : notifications,
    [activeFilter, notifications],
  )
  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / itemsPerPage))
  const visiblePage = Math.min(currentPage, totalPages)
  const paginatedNotifications = filteredNotifications.slice((visiblePage - 1) * itemsPerPage, visiblePage * itemsPerPage)

  useEffect(() => {
    const timer = window.setTimeout(() => setCurrentPage(1), 0)
    return () => window.clearTimeout(timer)
  }, [activeFilter, itemsPerPage])

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <section className="p-5 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Notifications</h1>
            <p className={`mt-1 text-base ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Review library alerts and recent system activity.</p>
          </div>
          <button 
            type="button" 
            onClick={() => void handleMarkAllRead()} 
            className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-bold ${isDarkMode ? 'border-zinc-800 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'} hover:opacity-80 transition-opacity`}
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className={`rounded-2xl border p-5 ${cardClass}`}>
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"><Bell size={19} /></span>
              <div><p className={subLabelClass}>All notifications</p><p className="text-3xl font-black">{notifications.length}</p></div>
            </div>
          </div>
          <div className={`rounded-2xl border p-5 ${cardClass}`}>
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"><Circle size={19} fill="currentColor" /></span>
              <div><p className={subLabelClass}>Unread</p><p className="text-3xl font-black">{unreadCount}</p></div>
            </div>
          </div>
        </div>

        <div className={`overflow-hidden rounded-2xl border ${cardClass}`}>
          <div className={`flex items-center justify-between gap-3 border-b p-3 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <div className="flex gap-2">
              {(['all', 'unread'] as const).map((filter) => (
                <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`rounded-lg px-4 py-2 text-sm font-bold capitalize ${activeFilter === filter ? 'bg-emerald-600 text-white' : isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-50'}`}>
                  {filter} {filter === 'unread' ? `(${unreadCount})` : `(${notifications.length})`}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => void loadAllNotifications()} className={`grid h-9 w-9 place-items-center rounded-lg ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-800' : 'text-zinc-500 hover:bg-zinc-100'}`} aria-label="Refresh notifications">
              <RotateCcw size={16} />
            </button>
          </div>
          {isLoading ? (
            <div className={`px-6 py-10 text-center ${subLabelClass}`}>Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className={`flex flex-col items-center px-6 py-14 text-center ${subLabelClass}`}>
              <Inbox size={32} className="mb-3 opacity-40" />
              <p className="font-semibold">{activeFilter === 'unread' ? 'No unread notifications.' : 'No notifications found.'}</p>
            </div>
          ) : (
            <div className={`divide-y ${isDarkMode ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
              {paginatedNotifications.map((item) => (
                <div 
                  key={item.id} 
                  role="button"
                  tabIndex={0}
                  onClick={() => void handleOpenNotification(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      void handleOpenNotification(item)
                    }
                  }}
                  className={`flex cursor-pointer items-start justify-between gap-4 p-5 transition-colors ${item.isRead ? (isDarkMode ? 'bg-transparent' : 'bg-transparent') : (isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50')} ${isDarkMode ? 'hover:bg-[#27272A]/50' : 'hover:bg-zinc-50'}`}
                >
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{item.title}</p>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{item.message}</p>
                    <p className={`mt-2 text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{formatNotificationTime(item.createdAt)}</p>
                  </div>
                  {!item.isRead && (
                    <button 
                      onClick={(event) => {
                        event.stopPropagation()
                        void handleMarkAsRead(item.id)
                      }}
                      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${isDarkMode ? 'bg-zinc-800 text-emerald-400 hover:bg-zinc-700' : 'bg-white text-emerald-600 border hover:bg-zinc-50'}`}
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className={`relative z-0 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm ${isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-600'}`}>
            <p>
              Showing {filteredNotifications.length > 0 ? (visiblePage - 1) * itemsPerPage + 1 : 0} to {Math.min(visiblePage * itemsPerPage, filteredNotifications.length)} of {filteredNotifications.length} notifications
            </p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className={`h-10 min-w-[150px] appearance-none rounded-lg border py-2 pl-4 pr-10 text-sm font-medium outline-none transition-colors ${
                    isDarkMode
                      ? 'border-zinc-700 bg-[#27272A] text-zinc-200 hover:bg-zinc-800 focus:border-emerald-500'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus:border-emerald-500'
                  }`}
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={visiblePage === 1}
                className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:border-zinc-800 disabled:text-zinc-600 disabled:hover:bg-transparent'
                    : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:border-zinc-100 disabled:text-zinc-300 disabled:hover:bg-white'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={page === visiblePage
                      ? 'grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                      : `grid h-10 w-10 place-items-center rounded-lg border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={visiblePage === totalPages || filteredNotifications.length === 0}
                className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:border-zinc-800 disabled:text-zinc-600 disabled:hover:bg-transparent'
                    : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:border-zinc-100 disabled:text-zinc-300 disabled:hover:bg-white'
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNotification(null)} />
          <div className={`relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl ${isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className={`flex items-center justify-between border-b px-6 py-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Bell size={20} />
                </span>
                <div>
                  <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Notification Details</h2>
                  <p className={`text-sm capitalize ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{selectedNotification.notificationType}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedNotification(null)} className={`rounded-full p-2 transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`} aria-label="Close notification">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className={`rounded-xl border p-4 ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-zinc-50'}`}>
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{selectedNotification.title}</h3>
                <p className={`mt-3 whitespace-pre-wrap text-sm leading-6 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{selectedNotification.message}</p>
              </div>
              {selectedNotification.notificationType === 'member' && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h4 className={`text-sm font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Registered Members</h4>
                      <p className={`mt-0.5 text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Members added today with their contact and account details.</p>
                    </div>
                    {!isLoadingNotificationDetails && (
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">
                        {notificationMembers.length}
                      </span>
                    )}
                  </div>

                  {isLoadingNotificationDetails ? (
                    <div className={`rounded-xl border px-4 py-8 text-center text-sm ${isDarkMode ? 'border-zinc-700 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                      Loading member details...
                    </div>
                  ) : notificationMembers.length === 0 ? (
                    <div className={`rounded-xl border px-4 py-8 text-center text-sm ${isDarkMode ? 'border-zinc-700 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                      No matching member records were found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notificationMembers.map((member) => (
                        <article key={member.id} className={`rounded-xl border p-4 ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-white'}`}>
                          <div className="flex items-start gap-3">
                            {member.profilePhotoData ? (
                              <img src={member.profilePhotoData} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                            ) : (
                              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                                <UserRound size={19} />
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <p className={`font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{member.fullName}</p>
                                  <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{member.memberType}</p>
                                </div>
                                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-300">
                                  {member.status}
                                </span>
                              </div>
                              <div className={`mt-3 grid gap-2 text-xs ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                <p className="flex items-center gap-2"><IdCard size={14} className="text-zinc-400" />{member.memberId}</p>
                                {member.department && <p className="flex items-center gap-2"><Building2 size={14} className="text-zinc-400" />{member.department}</p>}
                                {member.email && <p className="flex items-center gap-2 break-all"><Mail size={14} className="shrink-0 text-zinc-400" />{member.email}</p>}
                                {member.contactNumber && <p className="flex items-center gap-2"><Phone size={14} className="text-zinc-400" />{member.contactNumber}</p>}
                              </div>
                              <p className={`mt-3 text-[11px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                Registered {formatNotificationTime(member.createdAt)}
                              </p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{formatNotificationTime(selectedNotification.createdAt)}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <CheckCheck size={14} />
                  Read
                </span>
              </div>
            </div>
            <div className={`flex justify-end border-t px-6 py-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <button type="button" onClick={() => setSelectedNotification(null)} className="rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-white transition-colors hover:bg-emerald-600">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
