import { useState, useEffect, useMemo } from 'react'
import { Search, Plus, FileText, BarChart2, RotateCcw, Send, CheckCircle2, XCircle, Clock, CreditCard, MoreVertical, Calendar, Copy, User } from 'lucide-react'
import { listSmsLogs, type SmsLog } from '../lib/tauriApi'

type SmsLogsPageProps = {
  isDarkMode: boolean
}

function SmsLogsPage({ isDarkMode }: SmsLogsPageProps) {
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedLog, setSelectedLog] = useState<SmsLog | null>(null)

  const loadSmsLogs = async () => {
    try {
      const rows = await listSmsLogs('', '', 1000)
      setSmsLogs(rows)
    } catch (error) {
      console.error('Failed to load sms logs:', error)
      setSmsLogs([])
    }
  }

  useEffect(() => {
    void loadSmsLogs()
  }, [])

  const filteredLogs = useMemo(() => {
    return smsLogs.filter(log => {
      const q = search.toLowerCase()
      const matchesSearch = log.borrowerName.toLowerCase().includes(q) || log.phoneNumber.toLowerCase().includes(q) || log.bookTitle?.toLowerCase().includes(q)
      const matchesType = typeFilter === '' || log.smsType === typeFilter
      const matchesStatus = statusFilter === '' || log.status === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
  }, [smsLogs, search, typeFilter, statusFilter])

  // Mock Stats
  const sentToday = 25
  const delivered = 22
  const failed = 2
  const pending = 1
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
            <button className={`inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white transition-colors hover:bg-emerald-700`}>
              <Plus size={14} /> Send SMS
            </button>
            <button className={`inline-flex h-9 items-center gap-2 rounded-lg border px-4 text-xs font-bold transition-colors ${isDarkMode ? 'border-zinc-700 bg-[#18181B] hover:bg-zinc-800 text-zinc-300' : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'}`}>
              <FileText size={14} className="text-emerald-600" /> Templates
            </button>
            <button className={`inline-flex h-9 items-center gap-2 rounded-lg border px-4 text-xs font-bold transition-colors ${isDarkMode ? 'border-zinc-700 bg-[#18181B] hover:bg-zinc-800 text-zinc-300' : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'}`}>
              <BarChart2 size={14} className="text-emerald-600" /> SMS Reports
            </button>
            <button className={`inline-flex h-9 items-center gap-2 rounded-lg border px-4 text-xs font-bold transition-colors ${isDarkMode ? 'border-zinc-700 bg-[#18181B] hover:bg-zinc-800 text-zinc-300' : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'}`}>
              <RotateCcw size={14} className="text-purple-600" /> Retry Failed SMS
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className={`flex items-center gap-4 rounded-xl border p-4 shadow-sm ${cardClass}`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <Send size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className={`text-xs ${textSecondary}`}>SMS Sent Today</p>
              <h3 className={`text-2xl font-black ${textPrimary}`}>{sentToday}</h3>
            </div>
            <div className="text-[10px] font-bold text-emerald-600 self-end mb-1 cursor-pointer hover:underline">View all</div>
          </div>
          <div className={`flex items-center gap-4 rounded-xl border p-4 shadow-sm ${cardClass}`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className={`text-xs ${textSecondary}`}>Delivered</p>
              <h3 className={`text-2xl font-black ${textPrimary}`}>{delivered}</h3>
            </div>
            <div className="text-[10px] font-bold text-emerald-600 self-end mb-1 cursor-pointer hover:underline">View all</div>
          </div>
          <div className={`flex items-center gap-4 rounded-xl border p-4 shadow-sm ${cardClass}`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
              <XCircle size={24} className="text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex-1">
              <p className={`text-xs ${textSecondary}`}>Failed</p>
              <h3 className={`text-2xl font-black ${textPrimary}`}>{failed}</h3>
            </div>
            <div className="text-[10px] font-bold text-rose-600 self-end mb-1 text-center">8%</div>
          </div>
          <div className={`flex items-center gap-4 rounded-xl border p-4 shadow-sm ${cardClass}`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
              <Clock size={24} className="text-amber-500 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className={`text-xs ${textSecondary}`}>Pending</p>
              <h3 className={`text-2xl font-black ${textPrimary}`}>{pending}</h3>
            </div>
            <div className="text-[10px] font-bold text-amber-500 self-end mb-1">4%</div>
          </div>
          <div className={`flex items-center gap-4 rounded-xl border p-4 shadow-sm ${cardClass}`}>
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
          <div className={`flex-1 rounded-xl border shadow-sm ${cardClass}`}>
            <div className={`border-b p-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <h2 className={`font-bold ${textPrimary}`}>SMS History</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-4">
              <div className={`flex h-9 flex-1 min-w-[200px] items-center rounded-lg border px-3 ${inputClass}`}>
                <Search size={14} className={textSecondary} />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search member name or phone number..." 
                  className="ml-2 w-full bg-transparent text-xs outline-none" 
                />
              </div>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`h-9 rounded-lg border px-3 text-xs outline-none ${inputClass}`}
              >
                <option value="">All Types</option>
                <option value="Overdue Notice">Overdue Notice</option>
                <option value="Due Reminder">Due Reminder</option>
                <option value="Reservation Alert">Reservation Alert</option>
                <option value="Announcement">Announcement</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`h-9 rounded-lg border px-3 text-xs outline-none ${inputClass}`}
              >
                <option value="">All Status</option>
                <option value="Sent">Delivered</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
              </select>
              <div className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-xs ${inputClass}`}>
                <span>Jun 1, 2026 - Jun 5, 2026</span>
                <Calendar size={14} className={textSecondary} />
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
                  {filteredLogs.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-zinc-500">No logs found.</td></tr>
                  ) : filteredLogs.map((log) => {
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
                          <button className={`p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 ${textSecondary}`}><MoreVertical size={16} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className={`flex items-center justify-between border-t p-4 text-xs ${isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-100 text-zinc-500'}`}>
              <div>Showing 1 to {Math.min(10, filteredLogs.length)} of {filteredLogs.length} entries</div>
              <div className="flex gap-1">
                <button className={`flex h-7 w-7 items-center justify-center rounded border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>&lt;</button>
                <button className="flex h-7 w-7 items-center justify-center rounded bg-emerald-600 font-bold text-white">1</button>
                <button className={`flex h-7 w-7 items-center justify-center rounded border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>2</button>
                <button className={`flex h-7 w-7 items-center justify-center rounded border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>&gt;</button>
              </div>
            </div>
          </div>

          {/* Right Details Panel */}
          {selectedLog && (
            <div className={`w-full shrink-0 rounded-xl border shadow-sm lg:w-[380px] ${cardClass}`}>
              <div className={`flex items-center justify-between border-b p-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <h2 className={`font-bold ${textPrimary}`}>SMS Details</h2>
                <button onClick={() => setSelectedLog(null)} className={`text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-200`}><XCircle size={18} className="opacity-0 hidden" /> {/* Hidden X to balance layout, or use standard icon if preferred */} <RotateCcw size={14} className="opacity-0" /> <Search size={18} className="opacity-0 absolute" />  <span className="font-bold text-lg cursor-pointer">&times;</span> </button>
              </div>
              
              <div className="p-5">
                {/* Profile Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-black text-white text-lg ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-400'}`}>
                    {selectedLog.borrowerName.charAt(0)}
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
                    <span className={textSecondary}>Gateway</span>
                    <span className={`font-medium ${textPrimary}`}>TxtBox</span>
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
                <div className="mt-6 space-y-2">
                  <div className="flex gap-2">
                    <button className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border text-xs font-bold transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${isDarkMode ? 'border-zinc-700 text-zinc-300' : 'border-zinc-200 text-zinc-700'}`}>
                      <Send size={14} className="text-emerald-600" /> Send Again
                    </button>
                    <button className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border text-xs font-bold transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${isDarkMode ? 'border-zinc-700 text-zinc-300' : 'border-zinc-200 text-zinc-700'}`}>
                      <Copy size={14} className="text-emerald-600" /> Copy Message
                    </button>
                  </div>
                  <button className={`flex h-9 w-full items-center justify-center gap-2 rounded-lg border text-xs font-bold transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${isDarkMode ? 'border-zinc-700 text-zinc-300' : 'border-zinc-200 text-zinc-700'}`}>
                    <User size={14} className="text-emerald-600" /> View Member
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default SmsLogsPage
