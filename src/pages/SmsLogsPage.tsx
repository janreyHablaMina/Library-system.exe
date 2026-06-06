import { useState, useEffect, useMemo } from 'react'
import { Search, Plus, FileText, BarChart2, RotateCcw, Send, CheckCircle2, XCircle, Clock, CreditCard, Eye, Calendar, Copy, User, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { listSmsLogs, type SmsLog, listMembers, type Member } from '../lib/tauriApi'

import { ComposeSmsModal } from '../components/modals/ComposeSmsModal'

import { invoke } from '@tauri-apps/api/core'
import { Toast } from '../components/ui/Toast'

type SmsLogsPageProps = {
  isDarkMode: boolean
  onViewMember?: (memberId: number) => void
  initialStatusFilter?: string
}

function SmsLogsPage({ isDarkMode, onViewMember, initialStatusFilter = '' }: SmsLogsPageProps) {
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([])
  const [membersMap, setMembersMap] = useState<Map<string, Member>>(new Map())
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState(() => {
    const today = new Date()
    const offset = today.getTimezoneOffset()
    return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10)
  })
  const [selectedLog, setSelectedLog] = useState<SmsLog | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [showCompose, setShowCompose] = useState(false)
  const [composeData, setComposeData] = useState<{ phone?: string, name?: string, message?: string }>({})
  const [copied, setCopied] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleCloseDrawer = () => {
    setIsClosing(true)
    setTimeout(() => {
      setSelectedLog(null)
      setIsClosing(false)
    }, 300)
  }
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [search, typeFilter, statusFilter, fromDate, toDate, itemsPerPage])

  const loadSmsLogs = async () => {
    try {
      const rows = await listSmsLogs('', '', 1000)
      setSmsLogs(rows)
    } catch (error) {
      console.error('Failed to load sms logs:', error)
      setSmsLogs([])
    }
  }

  const loadMembers = async () => {
    try {
      const fetchedMembers = await listMembers(2000)
      const map = new Map<string, Member>()
      fetchedMembers.forEach(m => map.set(m.fullName, m))
      setMembersMap(map)
    } catch (error) {
      console.error('Failed to load members:', error)
    }
  }

  useEffect(() => {
    void loadSmsLogs()
    void loadMembers()
  }, [])

  const filteredLogs = useMemo(() => {
    return smsLogs.filter(log => {
      const q = search.toLowerCase()
      const matchesSearch = log.borrowerName.toLowerCase().includes(q) || 
                            log.phoneNumber.includes(q) ||
                            (log.bookTitle?.toLowerCase().includes(q) ?? false)
      const matchesType = typeFilter ? log.smsType === typeFilter : true
      const matchesStatus = statusFilter ? log.status === statusFilter : true
      
      let matchesDate = true
      if (fromDate || toDate) {
        const logDate = new Date(log.sentAt)
        logDate.setHours(0, 0, 0, 0)
        
        if (fromDate) {
          const fDate = new Date(fromDate)
          fDate.setHours(0, 0, 0, 0)
          if (logDate < fDate) matchesDate = false
        }
        if (toDate) {
          const tDate = new Date(toDate)
          tDate.setHours(0, 0, 0, 0)
          if (logDate > tDate) matchesDate = false
        }
      }

      return matchesSearch && matchesType && matchesStatus && matchesDate
    })
  }, [smsLogs, search, typeFilter, statusFilter, fromDate, toDate])

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Dynamic Stats
  const sentToday = smsLogs.filter(log => new Date(log.sentAt).toDateString() === new Date().toDateString()).length
  const delivered = smsLogs.filter(log => log.status === 'Sent' || log.status === 'Delivered').length
  const failed = smsLogs.filter(log => log.status === 'Failed').length
  const credits = "4,850"

  const cardClass = isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const textPrimary = isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
  const textSecondary = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
  const inputClass = isDarkMode ? 'border-zinc-800 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'

  const getTypeStyle = (type: string) => {
    if (type.toLowerCase().includes('overdue')) return isDarkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'
    if (type.toLowerCase().includes('due')) return isDarkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600'
    if (type.toLowerCase().includes('reservation')) return isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
    return isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 lg:p-6 ${isDarkMode ? 'bg-transparent text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <div className="mx-auto max-w-[1600px] space-y-6">
        
        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className={`text-2xl font-black ${textPrimary}`}>SMS Messages</h1>
            <p className={`mt-1 text-sm ${textSecondary}`}>View and manage all SMS notifications sent to library members.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
              onClick={() => setShowCompose(true)}
            >
              <span className="text-lg leading-none">+</span>
              Send SMS
            </button>
          </div>
        </header>

        {showCompose && (
          <ComposeSmsModal
            isOpen={showCompose}
            onClose={() => {
              setShowCompose(false)
              setComposeData({})
            }}
            onSuccess={() => {
              void loadSmsLogs()
              setToastMessage('Success: Message sent successfully!')
            }}
            isDarkMode={isDarkMode}
            initialPhoneNumber={composeData.phone}
            initialMemberName={composeData.name}
            initialMessage={composeData.message}
          />
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className={`flex items-center gap-4 rounded-xl border p-4 ${cardClass}`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <Send size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className={`text-xs ${textSecondary}`}>SMS Sent Today</p>
              <h3 className={`text-2xl font-black ${textPrimary}`}>{sentToday}</h3>
            </div>
          </div>
          <div className={`flex items-center gap-4 rounded-xl border p-4 ${cardClass}`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className={`text-xs ${textSecondary}`}>Delivered</p>
              <h3 className={`text-2xl font-black ${textPrimary}`}>{delivered}</h3>
            </div>
          </div>
          <div className={`flex items-center gap-4 rounded-xl border p-4 ${cardClass}`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
              <XCircle size={24} className="text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex-1">
              <p className={`text-xs ${textSecondary}`}>Failed</p>
              <h3 className={`text-2xl font-black ${textPrimary}`}>{failed}</h3>
            </div>
          </div>

          <div className={`flex items-center gap-4 rounded-xl border p-4 ${cardClass}`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
              <CreditCard size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className={`text-xs ${textSecondary}`}>SMS Credits</p>
              <h3 className={`text-2xl font-black ${textPrimary}`}>{credits}</h3>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          
          {/* Left Table Panel */}
          <div className={`flex-1 rounded-xl border ${cardClass}`}>
            <div className={`border-b p-4 rounded-t-xl ${isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
              <h2 className={`font-bold ${textPrimary}`}>SMS History</h2>
            </div>
            <div className={`flex flex-wrap items-center gap-3 border-b p-3 ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
              <label className={`group flex h-11 min-w-[280px] flex-1 items-center rounded-xl border px-3 ${isDarkMode ? 'border-zinc-700 focus-within:border-emerald-500' : 'border-zinc-200 focus-within:border-emerald-500'}`}>
                <Search size={16} className={`mr-2 ${isDarkMode ? 'text-zinc-500 group-focus-within:text-emerald-400' : 'text-zinc-400 group-focus-within:text-emerald-600'}`} />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search member name or phone number..." 
                  className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400'}`}
                />
              </label>
              
              <div className="relative">
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`h-11 appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm outline-none min-w-[150px] ${
                    isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'
                  }`}
                >
                  <option value="">All Types</option>
                  <option value="Overdue Notice">Overdue Notice</option>
                  <option value="Due Reminder">Due Reminder</option>
                  <option value="Reservation Alert">Reservation Alert</option>
                  <option value="Announcement">Announcement</option>
                </select>
                <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
              </div>
              
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`h-11 appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm outline-none min-w-[150px] ${
                    isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'
                  }`}
                >
                  <option value="">All Status</option>
                  <option value="Sent">Delivered</option>
                  <option value="Failed">Failed</option>
                </select>
                <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
              </div>
               
              <div className={`flex h-11 items-center gap-2 rounded-xl border px-3 text-sm ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>From</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                  className="w-[118px] bg-transparent text-sm outline-none"
                  aria-label="SMS logs start date"
                />
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>To</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                  className="w-[118px] bg-transparent text-sm outline-none"
                  aria-label="SMS logs end date"
                />
                <Calendar size={16} className={`shrink-0 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className={`border-b ${isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-100 text-zinc-500'}`}>
                  <tr>
                    <th className="whitespace-nowrap px-6 py-3 font-semibold">Date & Time</th>
                    <th className="whitespace-nowrap px-6 py-3 font-semibold">Member</th>
                    <th className="whitespace-nowrap px-6 py-3 font-semibold">Phone Number</th>
                    <th className="whitespace-nowrap px-6 py-3 font-semibold">Message Type</th>
                    <th className="whitespace-nowrap px-6 py-3 font-semibold">Status</th>
                    <th className="whitespace-nowrap px-6 py-3 font-semibold">Sent By</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-zinc-800/50' : 'divide-zinc-50'}`}>
                  {paginatedLogs.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-zinc-500">No logs found.</td></tr>
                  ) : paginatedLogs.map((log) => {
                    const isSelected = selectedLog?.id === log.id;
                    return (
                      <tr 
                        key={log.id} 
                        onClick={() => setSelectedLog(log)}
                        className={`cursor-pointer transition-colors ${isSelected ? (isDarkMode ? 'bg-zinc-800' : 'bg-emerald-50/50') : (isDarkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50')}`}
                      >
                        <td className={`whitespace-nowrap px-6 py-3.5 ${textPrimary}`}>{new Date(log.sentAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                        <td className={`whitespace-nowrap px-6 py-3.5 font-semibold ${textPrimary}`}>{log.borrowerName}</td>
                        <td className={`whitespace-nowrap px-6 py-3.5 ${textSecondary}`}>{log.phoneNumber}</td>
                        <td className="whitespace-nowrap px-6 py-3.5">
                          <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${getTypeStyle(log.smsType)}`}>
                            {log.smsType}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3.5">
                          {log.status === 'Sent' ? (
                            <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-500"><CheckCircle2 size={14} /> Delivered</span>
                          ) : log.status === 'Failed' ? (
                            <span className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-500"><XCircle size={14} /> Failed</span>
                          ) : (
                            <span className="flex items-center gap-1.5 font-bold text-amber-500 dark:text-amber-500"><Clock size={14} /> {log.status}</span>
                          )}
                        </td>
                        <td className={`whitespace-nowrap px-6 py-3.5 ${textSecondary}`}>Admin</td>
                        <td className="whitespace-nowrap px-6 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              setSelectedLog(log)
                            }}
                            className={`inline-grid h-8 w-8 place-items-center transition-colors ${
                              isDarkMode
                                ? 'text-zinc-400 hover:text-emerald-400'
                                : 'text-zinc-500 hover:text-emerald-600'
                            }`}
                            aria-label={`View SMS details for ${log.borrowerName}`}
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className={`relative z-0 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-600'}`}>
              <p>Showing {filteredLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries</p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className={`h-10 min-w-[150px] appearance-none rounded-lg border py-2 pl-4 pr-10 text-sm font-medium outline-none transition-colors ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200 hover:bg-zinc-800 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus:border-emerald-500'}`}>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} type="button" onClick={() => setCurrentPage(page)} className={page === currentPage ? "grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : `grid h-10 w-10 place-items-center rounded-lg border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
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

          {/* Right Details Drawer */}
          {selectedLog && (
            <div className={`fixed inset-0 z-50 flex justify-end bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleCloseDrawer}>
              <div 
                className={`h-full w-full max-w-md shadow-2xl border-l overflow-y-auto transition-transform duration-300 ease-in-out ${isClosing ? 'translate-x-full' : 'translate-x-0'} ${isDarkMode ? 'bg-[#18181B] border-zinc-800' : 'bg-white border-zinc-200'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`sticky top-0 flex items-center justify-between border-b p-4 z-10 ${isDarkMode ? 'bg-[#18181B] border-zinc-800' : 'bg-white border-zinc-100'}`}>
                  <h2 className={`font-bold text-lg ${textPrimary}`}>SMS Details</h2>
                  <button onClick={handleCloseDrawer} className={`text-zinc-400 transition-colors hover:text-rose-500`}>
                    <XCircle size={20} />
                  </button>
                </div>
                
                <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full font-black text-white text-lg ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-400'}`}>
                    {membersMap.get(selectedLog.borrowerName)?.profilePhotoData ? (
                      <img 
                        src={membersMap.get(selectedLog.borrowerName)?.profilePhotoData!} 
                        alt={selectedLog.borrowerName} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      selectedLog.borrowerName.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold ${textPrimary}`}>{selectedLog.borrowerName}</h3>
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Active Member</span>
                    </div>
                    <p className={`text-xs mt-0.5 ${textSecondary}`}>{selectedLog.phoneNumber}</p>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="space-y-3 text-xs mb-6">
                  <div className="flex justify-between">
                    <span className={textSecondary}>Message Type</span>
                    <span className={`rounded-md px-2 py-0.5 font-bold text-[10px] ${getTypeStyle(selectedLog.smsType)}`}>{selectedLog.smsType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={textSecondary}>Sent By</span>
                    <span className={`font-medium ${textPrimary}`}>Admin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={textSecondary}>Date Sent</span>
                    <span className={`font-medium ${textPrimary}`}>{new Date(selectedLog.sentAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={textSecondary}>Delivery Status</span>
                    {selectedLog.status === 'Sent' ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-500"><CheckCircle2 size={12} /> Delivered</span>
                    ) : selectedLog.status === 'Failed' ? (
                      <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-500"><XCircle size={12} /> Failed</span>
                    ) : (
                      <span className="flex items-center gap-1 font-bold text-amber-500 dark:text-amber-500"><Clock size={12} /> {selectedLog.status}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className={textSecondary}>Message ID</span>
                    <span className={`font-medium ${textPrimary}`}>MSG-{selectedLog.id.toString().padStart(7, '0')}</span>
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <h4 className={`mb-2 text-sm font-bold ${textPrimary}`}>Message Content</h4>
                  <div className={`rounded-xl p-4 text-sm leading-relaxed ${isDarkMode ? 'bg-emerald-950/30 text-emerald-100 border border-emerald-900/50' : 'bg-[#F0FAF4] text-emerald-900 border border-emerald-100'}`}>
                    <p className="whitespace-pre-wrap">{selectedLog.messageBody || `[System Event] ${selectedLog.smsType}`}</p>
                    {selectedLog.errorMessage && (
                      <p className="mt-3 text-xs font-bold text-rose-600 dark:text-rose-400">Error: {selectedLog.errorMessage}</p>
                    )}
                  </div>
                  <div className={`mt-2 text-[10px] ${textSecondary}`}>
                    Characters: {selectedLog.messageBody ? selectedLog.messageBody.length : 0} / 160
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <div className="flex gap-3">
                    <button 
                      onClick={async () => {
                        if (!selectedLog.messageBody) return
                        setIsResending(true)
                        try {
                          await invoke('send_manual_sms', {
                            phoneNumber: selectedLog.phoneNumber,
                            memberName: selectedLog.borrowerName,
                            message: selectedLog.messageBody,
                          })
                          void loadSmsLogs()
                          setToastMessage('Success: Message resent successfully!')
                        } catch (err) {
                          setToastMessage(`Error: Failed to resend: ${err instanceof Error ? err.message : String(err)}`)
                        } finally {
                          setIsResending(false)
                        }
                      }}
                      disabled={isResending || !selectedLog.messageBody}
                      className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none ${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
                    >
                      <Send size={16} className={`text-emerald-600 ${isResending ? 'animate-pulse' : ''}`} /> 
                      {isResending ? 'Sending...' : 'Send Again'}
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedLog.messageBody || '')
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors ${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
                    >
                      {copied ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Copy size={16} className="text-emerald-600" />}
                      {copied ? 'Copied!' : 'Copy Message'}
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      const member = membersMap.get(selectedLog.borrowerName)
                      if (member && onViewMember) {
                        onViewMember(member.id)
                      } else {
                        setToastMessage('Error: Could not locate member details.')
                      }
                    }}
                    className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors ${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
                  >
                    <User size={16} className="text-emerald-600" /> View Member
                  </button>
                </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage(null)} 
        isDarkMode={isDarkMode} 
      />
    </div>
  )
}

export default SmsLogsPage
