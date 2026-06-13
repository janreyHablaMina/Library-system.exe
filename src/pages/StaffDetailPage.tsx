import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Mail,
  Phone,
  Send,
  Smartphone,
  Calendar,
  Briefcase,
  MapPin,
  Hash,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { listActivityLogs, listStaff, type ActivityLogRow, type Staff as DbStaffMember } from '../lib/tauriApi'
import { SendEmailModal } from '../components/modals/SendEmailModal'
import { SendSmsModal } from '../components/modals/SendSmsModal'
import { Toast } from '../components/ui/Toast'

interface StaffDetailPageProps {
  isDarkMode: boolean
  onBack: () => void
  staffId?: number
}

const getRoleStyle = (role: string) => {
  switch (role) {
    case 'Administrator':
      return 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400'
    case 'Librarian':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400'
    default:
      return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
  }
}

export function StaffDetailPage({ isDarkMode, onBack, staffId }: StaffDetailPageProps) {
  const [dbStaff, setDbStaff] = useState<DbStaffMember | null>(null)
  const [activityLogs, setActivityLogs] = useState<ActivityLogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [historyPage, setHistoryPage] = useState(1)
  const [historyPerPage, setHistoryPerPage] = useState(10)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const rows = await listStaff(1000)
        const found = typeof staffId === 'number' ? rows.find((row) => row.id === staffId) ?? null : null
        if (mounted) {
          setDbStaff(found)
          if (found) {
            const logs = await listActivityLogs(found.fullName, 100)
            if (mounted) setActivityLogs(logs)
          } else {
            setActivityLogs([])
          }
        }
      } catch {
        if (mounted) {
          setDbStaff(null)
          setActivityLogs([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [staffId])

  const surface = isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const muted = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
  const primary = isDarkMode ? 'text-zinc-100' : 'text-zinc-900'

  if (loading) {
    return (
      <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
        <div className="p-5">
          <button onClick={onBack} className={`flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors`}>
            <ArrowLeft size={16} /> Back to Staff
          </button>
          <p className={`mt-8 text-sm ${muted}`}>Loading staff details...</p>
        </div>
      </div>
    )
  }

  if (!dbStaff) {
    return (
      <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
        <div className="p-5">
          <button onClick={onBack} className={`flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors`}>
            <ArrowLeft size={16} /> Back to Staff
          </button>
          <p className={`mt-8 text-sm ${muted}`}>Staff member not found.</p>
        </div>
      </div>
    )
  }

  const dateJoined = dbStaff.createdAt ? new Date(dbStaff.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'
  
  const statusClass = dbStaff.status === 'Active' 
    ? isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
    : isDarkMode ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-50 text-amber-700'

  const historyTotalPages = Math.ceil(activityLogs.length / historyPerPage)
  const safeHistoryPage = Math.max(1, Math.min(historyPage, Math.max(1, historyTotalPages)))
  const paginatedLogs = activityLogs.slice((safeHistoryPage - 1) * historyPerPage, safeHistoryPage * historyPerPage)

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <div className="space-y-5 p-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
          >
            <ArrowLeft size={16} />
            Back to Staff
          </button>
        </header>

        <section className={`overflow-hidden rounded-2xl border ${surface}`}>
          <div className={`h-1.5 w-full ${dbStaff.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <div className="grid gap-7 p-5 md:p-7 xl:grid-cols-[210px_minmax(0,1fr)_330px]">
            <div className="mx-auto h-[294px] w-[210px] overflow-hidden rounded-xl shadow-[0_20px_35px_-18px_rgba(15,23,42,0.55)] xl:mx-0">
              {dbStaff.profilePhotoData ? (
                <img src={dbStaff.profilePhotoData} alt={dbStaff.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className={`h-full w-full flex items-center justify-center text-6xl font-black ${isDarkMode ? 'bg-zinc-800 text-zinc-600' : 'bg-zinc-200 text-zinc-400'}`}>
                  {dbStaff.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 self-center">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>{dbStaff.status}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(dbStaff.role)}`}>
                      {dbStaff.role}
                    </span>
                  </div>

                  <h2 className={`mt-4 max-w-3xl text-2xl font-bold leading-tight tracking-tight md:text-[30px] ${primary}`}>{dbStaff.fullName}</h2>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsEmailModalOpen(true)}
                    className={`flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors ${
                      isDarkMode
                        ? 'bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/20'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100'
                    }`}
                  >
                    <Send size={15} />
                    Send Email
                  </button>
                  <button
                    onClick={() => setIsSmsModalOpen(true)}
                    disabled={!dbStaff.phone}
                    className={`flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkMode
                        ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'
                    }`}
                  >
                    <Smartphone size={15} />
                    Send SMS
                  </button>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Staff Code', value: dbStaff.staffCode, icon: Hash },
                  { label: 'Email', value: dbStaff.email || 'N/A', icon: Mail },
                  { label: 'Phone', value: dbStaff.phone || 'N/A', icon: Phone },
                  { label: 'Branch Location', value: dbStaff.branch || 'N/A', icon: MapPin },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className={`flex items-start gap-3 rounded-xl border p-3.5 ${isDarkMode ? 'border-zinc-700 bg-zinc-900/30' : 'border-zinc-100 bg-zinc-50/70'}`}>
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${isDarkMode ? 'bg-zinc-800 text-emerald-400' : 'bg-white text-emerald-600'}`}>
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[11px] font-bold uppercase tracking-wide ${muted}`}>{item.label}</p>
                        <p className={`mt-1 truncate text-sm font-bold ${primary}`}>{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <aside className={`self-stretch rounded-2xl border p-5 flex flex-col ${isDarkMode ? 'border-zinc-700 bg-zinc-900/35' : 'border-zinc-100 bg-zinc-50/70'}`}>
              <div className="flex items-center gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${isDarkMode ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-100 text-sky-700'}`}>
                  <Briefcase size={21} />
                </div>
                <div>
                  <h3 className={`font-black ${primary}`}>Employment Profile</h3>
                  <p className={`text-xs ${muted}`}>System & HR Details</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {[
                  { label: 'Employee Type', value: dbStaff.employeeType || 'Full-time', color: 'text-violet-500' },
                  { label: 'System Username', value: dbStaff.username || 'N/A', color: 'text-sky-500' },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl border px-2 py-4 text-center flex flex-col items-center justify-center ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
                    <p className={`text-sm font-black truncate w-full px-1 ${item.color}`}>{item.value}</p>
                    <p className={`mt-1 text-[10px] font-bold uppercase tracking-wide ${muted}`}>{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex-1 flex flex-col justify-end">
                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${isDarkMode ? 'bg-zinc-800/50' : 'bg-zinc-100'}`}>
                  <Calendar size={18} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                  <div>
                    <p className={`text-xs font-bold ${primary}`}>Member Since</p>
                    <p className={`text-xs ${muted}`}>{dateJoined}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>



        <section className={`overflow-hidden rounded-2xl border ${surface}`}>
          <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 md:px-6 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${isDarkMode ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-50 text-sky-600'}`}>
                <Activity size={19} />
              </div>
              <div>
                <h3 className={`font-black ${primary}`}>System Activity Logs</h3>
                <p className={`text-xs ${muted}`}>{activityLogs.length} activities recorded</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className={isDarkMode ? 'bg-zinc-900/45 text-zinc-400' : 'bg-zinc-50 text-zinc-500'}>
                <tr>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide">Timestamp</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Action Taken</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Module/Area</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Performed By</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide">Target</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => {
                  const timestamp = new Date(log.createdAt)
                  const formattedTimestamp = Number.isNaN(timestamp.getTime())
                    ? log.createdAt
                    : timestamp.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit' })
                    
                  return (
                    <tr key={log.id} className={`border-t ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800/50' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                      <td className={`px-6 py-4 font-medium ${primary}`}>{formattedTimestamp}</td>
                      <td className={`px-4 py-4 font-bold ${primary}`}>{log.action}</td>
                      <td className={`px-4 py-4 ${muted}`}>{log.module}</td>
                      <td className={`px-4 py-4 ${muted}`}>{log.actor}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>{log.target}</span>
                      </td>
                    </tr>
                  )
                })}
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={`px-6 py-10 text-center text-sm ${muted}`}>
                      No recorded activity for this staff member yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm ${isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-600'}`}>
            <p>
              Showing {activityLogs.length > 0 ? (safeHistoryPage - 1) * historyPerPage + 1 : 0} to {Math.min(safeHistoryPage * historyPerPage, activityLogs.length)} of {activityLogs.length} activities
            </p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={historyPerPage}
                  onChange={(event) => {
                    setHistoryPerPage(Number(event.target.value))
                    setHistoryPage(1)
                  }}
                  className={`h-10 min-w-[150px] appearance-none rounded-lg border py-2 pl-4 pr-10 text-sm font-medium outline-none transition-colors ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200 hover:bg-zinc-800 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus:border-emerald-500'}`}
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${muted}`} />
              </div>
              <button
                type="button"
                onClick={() => setHistoryPage((page) => Math.max(1, page - 1))}
                disabled={safeHistoryPage === 1}
                className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800 disabled:text-zinc-600' : 'border-zinc-200 hover:bg-zinc-50 disabled:text-zinc-300'}`}
                aria-label="Previous history page"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: historyTotalPages || 1 }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setHistoryPage(page)}
                    className={page === safeHistoryPage
                      ? 'grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                      : `grid h-10 w-10 place-items-center rounded-lg border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setHistoryPage((page) => Math.min(historyTotalPages, page + 1))}
                disabled={safeHistoryPage === historyTotalPages || historyTotalPages === 0}
                className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800 disabled:text-zinc-600' : 'border-zinc-200 hover:bg-zinc-50 disabled:text-zinc-300'}`}
                aria-label="Next history page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {isEmailModalOpen && (
          <SendEmailModal
            isOpen
            onClose={() => setIsEmailModalOpen(false)}
            member={{ id: dbStaff.id, fullName: dbStaff.fullName, email: dbStaff.email || null }}
            isDarkMode={isDarkMode}
            onSuccess={() => setToast('Email sent successfully')}
          />
        )}

        {isSmsModalOpen && (
          <SendSmsModal
            isOpen
            onClose={() => setIsSmsModalOpen(false)}
            member={{ id: dbStaff.id, fullName: dbStaff.fullName, phone: dbStaff.phone || null }}
            isDarkMode={isDarkMode}
            onSuccess={() => setToast('SMS sent successfully')}
          />
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
