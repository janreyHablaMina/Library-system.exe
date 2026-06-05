import { useState, useEffect } from 'react'
import { Search, RotateCcw } from 'lucide-react'
import { listSmsLogs, type SmsLog } from '../lib/tauriApi'

type SmsLogsPageProps = {
  isDarkMode: boolean
}

function SmsLogsPage({ isDarkMode }: SmsLogsPageProps) {
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([])
  const [smsLogSearch, setSmsLogSearch] = useState('')
  const [smsLogStatus, setSmsLogStatus] = useState('')

  const cardClass = isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const labelClass = isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
  const subLabelClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
  const inputClass = isDarkMode
    ? 'border-zinc-800 bg-[#27272A] text-zinc-200'
    : 'border-zinc-200 bg-white text-zinc-700'

  const loadSmsLogs = async () => {
    try {
      const rows = await listSmsLogs(smsLogSearch, smsLogStatus, 200)
      setSmsLogs(rows)
    } catch (error) {
      console.error('Failed to load sms logs:', error)
      setSmsLogs([])
    }
  }

  useEffect(() => {
    void loadSmsLogs()
  }, [smsLogSearch, smsLogStatus])

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <section className="p-5 space-y-6">
        <header>
          <h1 className={`text-4xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>System SMS Messages</h1>
          <p className={`mt-1 text-base ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>View and manage all outbound SMS text messages.</p>
        </header>

        <section className={`overflow-hidden rounded-2xl border ${cardClass}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4 dark:border-zinc-800">
            <div className="flex flex-1 items-center gap-3">
              <div className={`flex h-11 min-w-64 items-center rounded-xl border px-3 ${inputClass}`}>
                <Search size={16} className={subLabelClass} />
                <input 
                  value={smsLogSearch} 
                  onChange={(event) => setSmsLogSearch(event.target.value)} 
                  placeholder="Search borrower, phone, or book..." 
                  className="ml-2 w-full bg-transparent text-sm outline-none" 
                />
              </div>
              <select 
                value={smsLogStatus} 
                onChange={(event) => setSmsLogStatus(event.target.value)} 
                className={`h-11 rounded-xl border px-3 text-sm outline-none ${inputClass}`}
              >
                <option value="">All statuses</option>
                <option value="Sent">Sent</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <button 
              type="button" 
              onClick={() => void loadSmsLogs()} 
              className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold ${inputClass} hover:opacity-80 transition-opacity`}
            >
              <RotateCcw size={15} /> Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={isDarkMode ? 'bg-[#27272A]/50 text-zinc-300' : 'bg-zinc-50 text-zinc-600'}>
                <tr>
                  <th className="px-6 py-3 font-semibold">Borrower</th>
                  <th className="px-6 py-3 font-semibold">Phone Number</th>
                  <th className="px-6 py-3 font-semibold">Book</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Sent Date</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
                {smsLogs.length === 0 ? (
                  <tr><td colSpan={6} className={`px-6 py-10 text-center ${subLabelClass}`}>No messages found.</td></tr>
                ) : smsLogs.map((log) => (
                  <tr key={log.id} className={isDarkMode ? 'hover:bg-[#3F3F46]' : 'hover:bg-zinc-50'}>
                    <td className={`px-6 py-4 font-semibold ${labelClass}`}>{log.borrowerName}</td>
                    <td className={`px-6 py-4 ${subLabelClass}`}>{log.phoneNumber}</td>
                    <td className={`px-6 py-4 ${labelClass}`}>{log.bookTitle}</td>
                    <td className={`px-6 py-4 ${subLabelClass}`}>{log.smsType}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${log.status === 'Sent' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : log.status === 'Failed' ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right ${subLabelClass}`}>{new Date(log.sentAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  )
}

export default SmsLogsPage
