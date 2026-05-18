import { useState, useRef, useEffect } from 'react'
import { Calendar, Clock3, CheckCircle2, XCircle, MapPin, Eye, Trash2, Download, Plus, Search, ChevronDown, Filter, ChevronLeft, ChevronRight, X, MoreHorizontal, AlertTriangle } from 'lucide-react'

type ReservationStatus = 'Pending' | 'Ready for Pickup' | 'Completed' | 'Cancelled'

type ReservationRow = {
  id: string
  book: {
    title: string
    author: string
    cover: string
  }
  member: {
    name: string
    id: string
    avatar: string
  }
  pickupBranch: string
  reservedOn: string
  reservedTime: string
  status: ReservationStatus
  expiresOn: string
  expiresTime: string
}

type ReservationsPageProps = {
  isDarkMode: boolean
}

const stats = [
  { label: 'Total Reservations', value: '56', subValue: '↑ 12 this month', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Pending', value: '24', subValue: '42.9% of total', icon: Clock3, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Ready for Pickup', value: '18', subValue: '32.1% of total', icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Completed', value: '12', subValue: '21.4% of total', icon: CheckCircle2, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Cancelled', value: '2', subValue: '3.6% of total', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
]

const reservationsData: ReservationRow[] = [
  { id: 'RES-00056', book: { title: 'The Alchemist', author: 'Paulo Coelho', cover: '📙' }, member: { name: 'Maria Santos', id: 'MS-00125', avatar: '👩🏽' }, pickupBranch: 'Central Library', reservedOn: 'May 14, 2026', reservedTime: '10:15 AM', status: 'Pending', expiresOn: 'May 21, 2026', expiresTime: '10:15 AM' },
  { id: 'RES-00055', book: { title: 'Atomic Habits', author: 'James Clear', cover: '📕' }, member: { name: 'Juan Dela Cruz', id: 'JD-00098', avatar: '👨🏻' }, pickupBranch: 'North Branch', reservedOn: 'May 14, 2026', reservedTime: '09:45 AM', status: 'Ready for Pickup', expiresOn: 'May 17, 2026', expiresTime: '09:45 AM' },
  { id: 'RES-00054', book: { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', cover: '📘' }, member: { name: 'Ana Lim', id: 'AL-00076', avatar: '👩🏻' }, pickupBranch: 'Central Library', reservedOn: 'May 13, 2026', reservedTime: '04:30 PM', status: 'Ready for Pickup', expiresOn: 'May 16, 2026', expiresTime: '04:30 PM' },
  { id: 'RES-00053', book: { title: 'The 5 AM Club', author: 'Robin Sharma', cover: '📗' }, member: { name: 'Pedro Reyes', id: 'PR-00045', avatar: '👨🏼' }, pickupBranch: 'West Branch', reservedOn: 'May 13, 2026', reservedTime: '11:20 AM', status: 'Pending', expiresOn: 'May 20, 2026', expiresTime: '11:20 AM' },
  { id: 'RES-00052', book: { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', cover: '📒' }, member: { name: 'Sarah Wilson', id: 'SW-00102', avatar: '👩🏼' }, pickupBranch: 'Central Library', reservedOn: 'May 12, 2026', reservedTime: '03:10 PM', status: 'Completed', expiresOn: 'May 13, 2026', expiresTime: '(Picked up)' },
  { id: 'RES-00051', book: { title: 'The Power of Habit', author: 'Charles Duhigg', cover: '📙' }, member: { name: 'Carlo Garcia', id: 'CG-00063', avatar: '👨🏻' }, pickupBranch: 'South Branch', reservedOn: 'May 12, 2026', reservedTime: '10:05 AM', status: 'Cancelled', expiresOn: 'May 12, 2026', expiresTime: '10:30 AM' },
  { id: 'RES-00050', book: { title: 'Sapiens', author: 'Yuval Noah Harari', cover: '📓' }, member: { name: 'Alicia H.', id: 'AH-00055', avatar: '👩🏻' }, pickupBranch: 'North Branch', reservedOn: 'May 11, 2026', reservedTime: '02:25 PM', status: 'Ready for Pickup', expiresOn: 'May 14, 2026', expiresTime: '02:25 PM' },
  { id: 'RES-00049', book: { title: 'The Subtle Art of Not Caring', author: 'Mark Manson', cover: '📙' }, member: { name: 'John Doe', id: 'JD-00012', avatar: '👨🏼' }, pickupBranch: 'Central Library', reservedOn: 'May 11, 2026', reservedTime: '09:15 AM', status: 'Pending', expiresOn: 'May 18, 2026', expiresTime: '09:15 AM' },
]

type ReservationActionsMenuProps = {
  isDarkMode: boolean
  onViewDetails: () => void
  onCancel: () => void
}

function ReservationActionsMenu({ isDarkMode, onViewDetails, onCancel }: ReservationActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpward(spaceBelow < 185)
    }
    setOpen(v => !v)
  }

  const surface = isDarkMode
    ? 'bg-[#0f172a] border-slate-700 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-slate-200'
    : 'bg-white border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-slate-700'

  const itemBase =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-100 text-left'
  const itemNormal = isDarkMode
    ? 'text-slate-200 hover:bg-slate-800'
    : 'text-slate-700 hover:bg-slate-50'
  const itemDanger = isDarkMode
    ? 'text-rose-400 hover:bg-rose-500/10'
    : 'text-rose-600 hover:bg-rose-50'

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 ${
          open
            ? isDarkMode
              ? 'border-slate-500 bg-slate-700 text-slate-100'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : isDarkMode
              ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-48 rounded-xl border p-1.5 ${surface} ${
            openUpward 
              ? 'bottom-full mb-1.5 origin-bottom-right' 
              : 'top-full mt-1.5 origin-top-right'
          }`}
          role="menu"
          style={{ animation: openUpward ? 'resMenuInUp 0.13s cubic-bezier(0.16,1,0.3,1)' : 'resMenuInDown 0.13s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <style>{`
            @keyframes resMenuInDown {
              from { opacity: 0; transform: scale(0.95) translateY(-6px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
            @keyframes resMenuInUp {
              from { opacity: 0; transform: scale(0.95) translateY(6px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
          `}</style>

          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onViewDetails(); }}
          >
            <Eye size={15} className="shrink-0 text-sky-500" />
            View Details
          </button>
          
          <button
            type="button"
            className={`${itemBase} ${itemDanger}`}
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onCancel(); }}
          >
            <Trash2 size={15} className="shrink-0 text-rose-500" />
            Cancel Reservation
          </button>
        </div>
      )}
    </div>
  )
}

export function ReservationsPage({ isDarkMode }: ReservationsPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedRes, setSelectedRes] = useState<ReservationRow | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [resToCancel, setResToCancel] = useState<ReservationRow | null>(null)
  const [isCancelOpen, setIsCancelOpen] = useState(false)

  const handleOpenDetails = (res: ReservationRow) => {
    setSelectedRes(res)
    setIsDetailsOpen(true)
  }

  const handleOpenCancel = (res: ReservationRow) => {
    setResToCancel(res)
    setIsCancelOpen(true)
  }

  const handleCancelConfirm = () => {
    setIsCancelOpen(false)
    setResToCancel(null)
  }

  const getStatusStyle = (status: ReservationStatus) => {
    switch (status) {
      case 'Pending': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
      case 'Ready for Pickup': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
      case 'Completed': return 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400'
      case 'Cancelled': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
    }
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Reservations</h2>
            <p className={`mt-1 text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>View and manage all book reservations.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <Download size={16} />
              Export
            </button>
            <button type="button" onClick={() => setIsAddModalOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-sm">
              <Plus size={18} />
              New Reservation
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <article key={stat.label} className={`rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode ? 'border-slate-700 bg-[#0b1738] hover:border-emerald-500/60 hover:shadow-[0_12px_24px_-16px_rgba(16,185,129,0.45)]' : 'border-slate-200 bg-white hover:border-emerald-200 hover:shadow-[0_12px_24px_-16px_rgba(15,23,42,0.35)]'}`}>
                <div className="flex items-center gap-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.bg} ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex flex-col">
                    <p className={`text-xs font-bold text-slate-500 dark:text-slate-400`}>{stat.label}</p>
                    <p className={`text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{stat.value}</p>
                  </div>
                </div>
                <p className={`mt-3 text-[11px] font-bold ${stat.color === 'text-rose-600' || stat.color === 'text-violet-600' ? 'text-slate-500 dark:text-slate-400' : stat.color}`}>
                  {stat.subValue}
                </p>
              </article>
            )
          })}
        </section>

        <div className={`mt-5 overflow-hidden lg:overflow-visible rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
          <div className={`flex flex-wrap items-center gap-3 border-b p-3 rounded-t-xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <label className={`group flex h-12 min-w-[320px] flex-1 items-center rounded-xl border px-3 transition-all ${isDarkMode ? 'border-slate-700 focus-within:border-emerald-500 bg-[#0f1f49]' : 'border-slate-200 focus-within:border-emerald-500 bg-slate-50'}`}>
              <Search size={18} className={`mr-2 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
              <input className={`w-full bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} placeholder="Search by book title, member name..." />
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status</span>
                <div className="relative">
                  <select className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <option>All</option>
                    <option>Pending</option>
                    <option>Ready for Pickup</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Branch</span>
                <div className="relative">
                  <select className={`h-11 min-w-[140px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <option>All Branches</option>
                    <option>Central Library</option>
                    <option>North Branch</option>
                    <option>West Branch</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <button className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-white'}`}>
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto lg:overflow-visible relative z-10">
            <table className="w-full text-left text-sm border-collapse">
              <thead className={isDarkMode ? 'bg-[#0f1f49]/50 text-slate-400' : 'bg-slate-50/50 text-slate-500'}>
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Book Details</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Reserved On</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Expires On</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservationsData.map((res) => (
                  <tr key={res.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{res.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-10 w-7 place-items-center rounded bg-slate-100 text-base dark:bg-slate-800`}>{res.book.cover}</span>
                        <div>
                          <p className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{res.book.title}</p>
                          <p className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{res.book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{res.member.avatar}</span>
                        <div>
                          <p className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{res.member.name}</p>
                          <p className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{res.member.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{res.pickupBranch}</td>
                    <td className="px-6 py-4">
                      <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{res.reservedOn}</p>
                      <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{res.reservedTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-md px-3 py-1 text-[11px] font-semibold tracking-wide ${getStatusStyle(res.status)}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{res.expiresOn}</p>
                      <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{res.expiresTime}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ReservationActionsMenu
                        isDarkMode={isDarkMode}
                        onViewDetails={() => handleOpenDetails(res)}
                        onCancel={() => handleOpenCancel(res)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
            <p>Showing 1 to 8 of 56 reservations</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm">1</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>2</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>3</button>
                <span className="px-1 text-slate-300">...</span>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>7</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="relative">
                <select className={`h-8 min-w-[100px] appearance-none rounded-lg border pl-3 pr-8 text-[11px] font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                  <option>10 / page</option>
                  <option>20 / page</option>
                </select>
                <ChevronDown size={12} className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cancellation Confirmation Modal */}
      {isCancelOpen && resToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200 ${isDarkMode ? 'border-slate-800 bg-[#0a1633] text-slate-100' : 'border-slate-200 bg-white text-slate-900'}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-6">Cancel Reservation</h3>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Are you sure you want to cancel the reservation for <span className="font-semibold text-rose-500">"{resToCancel.book.title}"</span> reserved by <span className="font-medium">{resToCancel.member.name}</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setIsCancelOpen(false); setResToCancel(null); }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold border transition-all ${
                  isDarkMode
                    ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition-all"
              >
                Yes, Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Details Modal */}
      {isDetailsOpen && selectedRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <section className={`w-full max-w-lg rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-8 py-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <h3 className={`text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedRes.id}</h3>
                <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Reservation Record Details</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-md px-3 py-1 text-xs font-semibold ${getStatusStyle(selectedRes.status)}`}>
                  {selectedRes.status}
                </span>
                <button type="button" onClick={() => { setIsDetailsOpen(false); setSelectedRes(null); }} className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-8 py-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Book Details */}
                <div className={`rounded-2xl border p-4 ${isDarkMode ? 'border-slate-800 bg-[#0f1f49]/30' : 'border-slate-100 bg-slate-50/50'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Book Details</h4>
                  <div className="mt-3 flex items-start gap-3">
                    <span className="grid h-14 w-10 place-items-center rounded bg-slate-200 text-2xl dark:bg-slate-850 shrink-0">{selectedRes.book.cover}</span>
                    <div>
                      <p className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedRes.book.title}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedRes.book.author}</p>
                      <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-600">
                        <MapPin size={12} />
                        {selectedRes.pickupBranch}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member Details */}
                <div className={`rounded-2xl border p-4 ${isDarkMode ? 'border-slate-800 bg-[#0f1f49]/30' : 'border-slate-100 bg-slate-50/50'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Member Details</h4>
                  <div className="mt-3 flex items-start gap-3">
                    <span className="text-3xl shrink-0">{selectedRes.member.avatar}</span>
                    <div>
                      <p className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedRes.member.name}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ID: {selectedRes.member.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Details */}
              <div className={`rounded-2xl border p-4 ${isDarkMode ? 'border-slate-800 bg-[#0f1f49]/30' : 'border-slate-105 bg-slate-50/50'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Reservation Schedule</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
                      <Clock3 size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reserved On</p>
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{selectedRes.reservedOn} at {selectedRes.reservedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
                      <Calendar size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expires On</p>
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{selectedRes.expiresOn} {selectedRes.expiresTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => { setIsDetailsOpen(false); setSelectedRes(null); }} className={`h-12 flex-1 rounded-xl border font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Close</button>
                {selectedRes.status === 'Pending' && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleOpenCancel(selectedRes);
                    }} 
                    className="h-12 flex-1 rounded-xl bg-rose-600 font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Cancel Reservation
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-2xl rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-8 py-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>New Reservation</h3>
                <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Create a new book reservation record.</p>
              </div>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <X size={18} />
              </button>
            </div>

            <form className="space-y-6 px-8 py-8">
               <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Select Book <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`}>
                      <option>Select a book</option>
                      <option>The Alchemist</option>
                      <option>Atomic Habits</option>
                    </select>
                    <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Select Member <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`}>
                      <option>Select a member</option>
                      <option>Maria Santos</option>
                      <option>Juan Dela Cruz</option>
                    </select>
                    <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Pickup Branch</label>
                  <div className="relative">
                    <select className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`}>
                      <option>Central Library</option>
                      <option>North Branch</option>
                      <option>West Branch</option>
                    </select>
                    <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Expiration Date</label>
                  <input type="date" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`} />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className={`h-12 flex-1 rounded-xl border font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Cancel</button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="h-12 flex-1 rounded-xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all">Create Reservation</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
