import { useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Copy,
  Check,
  GraduationCap,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  MapPin,
  Trash2,
  SquarePen,
  FileText,
  UserCheck,
  Award,
  BookMarked,
  Activity,
  User
} from 'lucide-react'
import bookCoverPlaceholder from '../assets/login.avif'

type MemberDetailPageProps = {
  isDarkMode: boolean
  onBack: () => void
  memberId?: number
}

type LoanItem = {
  id: number
  title: string
  author: string
  dueDate: string
  status: 'Overdue' | 'Due Soon' | 'Normal'
  statusLabel: string
}

type ReservationItem = {
  id: number
  title: string
  author: string
  reservedOn: string
  status: 'Ready' | 'Pending'
  statusLabel: string
}

type ActivityItem = {
  dateTime: string
  activity: string
  description: string
  performedBy: string
}

type MemberDetailData = {
  name: string
  memberId: string
  email: string
  phone: string
  address: string
  avatar: string
  type: string
  department: string
  status: 'Active' | 'Inactive' | 'Overdue'
  dateJoined: string
  memberSince: string
  lastUpdated: string
  totalLoans: number
  currentLoans: number
  reservationsCount: number
  fines: string
  loansList: LoanItem[]
  reservationsList: ReservationItem[]
  notes: string[]
  activities: ActivityItem[]
}

// Full rich mock database mapped by member ID
const mockMembersData: Record<number, MemberDetailData> = {
  1: {
    name: 'Juan Dela Cruz',
    memberId: 'MEM-2024-0001',
    email: 'juan.delacruz@email.com',
    phone: '0917 123 4567',
    address: '123 Rizal Street, Barangay 10 Manila, Metro Manila, 1000',
    avatar: '👨🏻',
    type: 'Regular Member',
    department: 'BS Information Technology',
    status: 'Active',
    dateJoined: 'May 15, 2024',
    memberSince: '1 year',
    lastUpdated: 'May 15, 2024 by Admin User',
    totalLoans: 12,
    currentLoans: 2,
    reservationsCount: 1,
    fines: '₱0.00',
    loansList: [
      { id: 101, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', dueDate: 'May 28, 2025', status: 'Overdue', statusLabel: '7 days overdue' },
      { id: 102, title: 'Atomic Habits', author: 'James Clear', dueDate: 'Jun 05, 2025', status: 'Due Soon', statusLabel: 'Due in 2 days' }
    ],
    reservationsList: [
      { id: 201, title: 'The Psychology of Money', author: 'Morgan Housel', reservedOn: 'May 18, 2025', status: 'Ready', statusLabel: 'Ready for pickup' }
    ],
    notes: [],
    activities: [
      { dateTime: 'May 18, 2025 10:24 AM', activity: 'Reservation Placed', description: 'Reserved "The Psychology of Money"', performedBy: 'Juan Dela Cruz' },
      { dateTime: 'May 15, 2025 03:15 PM', activity: 'Book Borrowed', description: 'Borrowed "The Great Gatsby"', performedBy: 'Admin User' },
      { dateTime: 'May 15, 2025 03:14 PM', activity: 'Book Borrowed', description: 'Borrowed "Atomic Habits"', performedBy: 'Admin User' },
      { dateTime: 'May 15, 2025 02:30 PM', activity: 'Member Registered', description: 'New member account created', performedBy: 'Admin User' }
    ]
  },
  2: {
    name: 'Maria Santos',
    memberId: 'MEM-2024-0002',
    email: 'maria.santos@email.com',
    phone: '0921 456 7890',
    address: '456 Mabini St, Ermita, Manila, 1000',
    avatar: '👩🏻',
    type: 'Regular Member',
    department: 'BS Education',
    status: 'Active',
    dateJoined: 'Jun 12, 2024',
    memberSince: '11 months',
    lastUpdated: 'Jun 12, 2024 by Admin User',
    totalLoans: 8,
    currentLoans: 1,
    reservationsCount: 0,
    fines: '₱0.00',
    loansList: [
      { id: 103, title: 'Sosyolohiya sa Filipino', author: 'Kahayon, Alicia H.', dueDate: 'Jun 18, 2025', status: 'Normal', statusLabel: 'On Time' }
    ],
    reservationsList: [],
    notes: ['Excellent reading student. Prefers textbooks.'],
    activities: [
      { dateTime: 'Jun 01, 2025 11:20 AM', activity: 'Book Borrowed', description: 'Borrowed "Sosyolohiya sa Filipino"', performedBy: 'Admin User' },
      { dateTime: 'Jun 12, 2024 09:30 AM', activity: 'Member Registered', description: 'New member account created', performedBy: 'Admin User' }
    ]
  },
  3: {
    name: 'Pedro Reyes',
    memberId: 'MEM-2024-0003',
    email: 'pedro.reyes@email.com',
    phone: '0999 555 1212',
    address: '789 Taft Avenue, Malate, Manila, 1000',
    avatar: '👨🏽',
    type: 'Regular Member',
    department: 'BS Information Tech',
    status: 'Active',
    dateJoined: 'Aug 04, 2024',
    memberSince: '9 months',
    lastUpdated: 'Aug 04, 2024 by Admin User',
    totalLoans: 5,
    currentLoans: 0,
    reservationsCount: 1,
    fines: '₱0.00',
    loansList: [],
    reservationsList: [
      { id: 202, title: 'Understanding Philippine social realities', author: 'Ramirez, Mina M.', reservedOn: 'May 16, 2025', status: 'Pending', statusLabel: 'Pending arrival' }
    ],
    notes: [],
    activities: [
      { dateTime: 'May 16, 2025 04:10 PM', activity: 'Reservation Placed', description: 'Reserved "Understanding Philippine social realities"', performedBy: 'Pedro Reyes' },
      { dateTime: 'Aug 04, 2024 10:15 AM', activity: 'Member Registered', description: 'New member account created', performedBy: 'Admin User' }
    ]
  },
  4: {
    name: 'Ana Lim',
    memberId: 'MEM-2024-0004',
    email: 'ana.lim@email.com',
    phone: '0916 888 3434',
    address: '321 Aurora Blvd, Cubao, Quezon City, 1100',
    avatar: '👩🏽',
    type: 'Regular Member',
    department: 'BS Psychology',
    status: 'Overdue',
    dateJoined: 'Sep 22, 2024',
    memberSince: '8 months',
    lastUpdated: 'Sep 22, 2024 by Admin User',
    totalLoans: 15,
    currentLoans: 3,
    reservationsCount: 0,
    fines: '₱120.00',
    loansList: [
      { id: 104, title: 'Filipino values today', author: 'Timberza, Florentino T.', dueDate: 'May 10, 2025', status: 'Overdue', statusLabel: '15 days overdue' },
      { id: 105, title: 'Deep Work', author: 'Cal Newport', dueDate: 'May 12, 2025', status: 'Overdue', statusLabel: '13 days overdue' },
      { id: 106, title: 'Sociology in the Philippine setting', author: 'Hunt, Chester L.', dueDate: 'May 20, 2025', status: 'Overdue', statusLabel: '5 days overdue' }
    ],
    reservationsList: [],
    notes: ['Has a pending warning for overdue books.'],
    activities: [
      { dateTime: 'May 03, 2025 09:05 AM', activity: 'Book Borrowed', description: 'Borrowed "Filipino values today"', performedBy: 'Admin User' },
      { dateTime: 'May 05, 2025 02:14 PM', activity: 'Book Borrowed', description: 'Borrowed "Deep Work"', performedBy: 'Admin User' },
      { dateTime: 'May 06, 2025 04:30 PM', activity: 'Book Borrowed', description: 'Borrowed "Sociology in the Philippine setting"', performedBy: 'Admin User' }
    ]
  }
}

// Fallback details if member is not fully mocked
const getFallbackMemberData = (name: string, id: string, type: string, dept: string, avatar: string, status: 'Active' | 'Inactive' | 'Overdue'): MemberDetailData => ({
  name,
  memberId: id || 'MEM-2024-XXXX',
  email: `${name.toLowerCase().replace(/\s+/g, '')}@email.com`,
  phone: '0917 000 0000',
  address: 'General Library Registered Address, Metro Manila',
  avatar: avatar || '🧑🏻',
  type: type || 'Regular Member',
  department: dept || 'General Education',
  status: status || 'Active',
  dateJoined: 'May 10, 2025',
  memberSince: '1 week',
  lastUpdated: 'May 10, 2025 by Admin User',
  totalLoans: 2,
  currentLoans: 0,
  reservationsCount: 0,
  fines: '₱0.00',
  loansList: [],
  reservationsList: [],
  notes: [],
  activities: [
    { dateTime: 'May 10, 2025 02:30 PM', activity: 'Member Registered', description: 'New member account created', performedBy: 'Admin User' }
  ]
})

export function MemberDetailPage({ isDarkMode, onBack, memberId }: MemberDetailPageProps) {
  const [copied, setCopied] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [showAddNote, setShowAddNote] = useState(false)

  // Retrieve matching mock data, fallback to Juan Dela Cruz (id: 1)
  const activeId = memberId && mockMembersData[memberId] ? memberId : 1
  const detailData = mockMembersData[activeId]
  const [notesList, setNotesList] = useState<string[]>(detailData.notes)

  const cardClass = isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'
  const subCardClass = isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-100 bg-slate-50'
  const labelClass = isDarkMode ? 'text-slate-400' : 'text-slate-500'
  const valueClass = isDarkMode ? 'text-slate-100' : 'text-slate-800'
  const borderClass = isDarkMode ? 'border-slate-800' : 'border-slate-200'

  const handleCopyId = () => {
    navigator.clipboard.writeText(detailData.memberId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    setNotesList(prev => [...prev, newNote.trim()])
    setNewNote('')
    setShowAddNote(false)
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 md:p-6 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="space-y-6 max-w-7xl mx-auto">
        {/* Back navigation header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowLeft size={16} />
            Back to Members
          </button>
        </div>

        {/* Member Header Card */}
        <div className={`rounded-2xl border shadow-sm p-6 overflow-hidden ${cardClass}`}>
          <div className="flex flex-col xl:flex-row gap-8 justify-between">
            {/* Left Section: Photo and Personal Information */}
            <div className="flex flex-col md:flex-row gap-6 items-start flex-1">
              <div className="flex flex-col items-center gap-3 self-center md:self-start">
                <span className={`grid h-24 w-24 place-items-center rounded-full text-5xl border shadow-inner ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  {detailData.avatar}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  detailData.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : detailData.status === 'Overdue'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {detailData.status}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-3xl font-extrabold tracking-tight">{detailData.name}</h2>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-medium ${labelClass}`}>Member ID: {detailData.memberId}</span>
                      <button
                        onClick={handleCopyId}
                        className={`p-1 rounded-md transition-colors ${
                          isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        title="Copy Member ID"
                      >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="opacity-60 shrink-0 text-emerald-600" />
                    <span className={valueClass}>{detailData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="opacity-60 shrink-0 text-emerald-600" />
                    <span className={valueClass}>{detailData.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={16} className="opacity-60 shrink-0 mt-0.5 text-emerald-600" />
                    <span className={`leading-relaxed ${valueClass}`}>{detailData.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Vertical Divider */}
            <div className={`hidden xl:block w-px self-stretch ${borderClass}`} />

            {/* Right Section: Metadata Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 xl:w-[480px]">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0 mt-0.5">
                  <User size={15} />
                </span>
                <div>
                  <p className={`text-xs font-semibold ${labelClass}`}>Member Type</p>
                  <p className={`text-sm font-bold mt-0.5 ${valueClass}`}>{detailData.type}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Calendar size={15} />
                </span>
                <div>
                  <p className={`text-xs font-semibold ${labelClass}`}>Date Joined</p>
                  <p className={`text-sm font-bold mt-0.5 ${valueClass}`}>{detailData.dateJoined}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0 mt-0.5">
                  <GraduationCap size={15} />
                </span>
                <div>
                  <p className={`text-xs font-semibold ${labelClass}`}>Department / Course</p>
                  <p className={`text-sm font-bold mt-0.5 ${valueClass}`}>{detailData.department}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Clock size={15} />
                </span>
                <div>
                  <p className={`text-xs font-semibold ${labelClass}`}>Member Since</p>
                  <p className={`text-sm font-bold mt-0.5 ${valueClass}`}>{detailData.memberSince}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Award size={15} />
                </span>
                <div>
                  <p className={`text-xs font-semibold ${labelClass}`}>Status</p>
                  <p className="mt-0.5"><span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">{detailData.status}</span></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0 mt-0.5">
                  <RefreshCw size={15} />
                </span>
                <div>
                  <p className={`text-xs font-semibold ${labelClass}`}>Last Updated</p>
                  <p className={`text-xs font-bold mt-0.5 leading-snug ${valueClass}`}>{detailData.lastUpdated}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions (Buttons) */}
            <div className="flex xl:flex-col gap-2 shrink-0 self-stretch justify-start xl:justify-start">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <SquarePen size={15} />
                Edit Member
              </button>
              <button
                type="button"
                className={`grid h-11 w-11 place-items-center rounded-xl border transition-colors ${
                  isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid Layout */}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          {/* Left Hand Column: Loans and Reservations */}
          <div className="space-y-6">
            {/* Current Loans Card */}
            <div className={`rounded-2xl border shadow-sm p-6 ${cardClass}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <BookMarked size={18} />
                  </span>
                  <h3 className="text-lg font-bold">Current Loans</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {detailData.loansList.length} Item(s)
                </span>
              </div>

              {detailData.loansList.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {detailData.loansList.map(loan => (
                    <div key={loan.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-10 shrink-0 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50">
                          <img src={bookCoverPlaceholder} alt={loan.title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-snug">{loan.title}</p>
                          <p className={`text-xs mt-0.5 ${labelClass}`}>{loan.author}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 justify-between md:justify-end">
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>Due Date</p>
                          <p className={`text-xs font-bold mt-0.5 ${
                            loan.status === 'Overdue' ? 'text-rose-600' : loan.status === 'Due Soon' ? 'text-amber-600' : valueClass
                          }`}>{loan.dueDate}</p>
                        </div>
                        <span className={`rounded-md px-2.5 py-1 text-xs font-bold text-center min-w-[110px] ${
                          loan.status === 'Overdue'
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                            : loan.status === 'Due Soon'
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                        }`}>
                          {loan.statusLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm opacity-60">No active loans.</div>
              )}

              <div className={`mt-5 pt-4 border-t flex justify-end ${borderClass}`}>
                <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 hover:underline">
                  View all loans →
                </button>
              </div>
            </div>

            {/* Recent Reservations Card */}
            <div className={`rounded-2xl border shadow-sm p-6 ${cardClass}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <Calendar size={18} />
                  </span>
                  <h3 className="text-lg font-bold">Recent Reservations</h3>
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {detailData.reservationsList.length} Item(s)
                </span>
              </div>

              {detailData.reservationsList.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {detailData.reservationsList.map(res => (
                    <div key={res.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-10 shrink-0 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50">
                          <img src={bookCoverPlaceholder} alt={res.title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-snug">{res.title}</p>
                          <p className={`text-xs mt-0.5 ${labelClass}`}>{res.author}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 justify-between md:justify-end">
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>Reserved On</p>
                          <p className={`text-xs font-bold mt-0.5 ${valueClass}`}>{res.reservedOn}</p>
                        </div>
                        <span className={`rounded-md px-2.5 py-1 text-xs font-bold text-center min-w-[110px] ${
                          res.status === 'Ready'
                            ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {res.statusLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm opacity-60">No recent reservations.</div>
              )}

              <div className={`mt-5 pt-4 border-t flex justify-end ${borderClass}`}>
                <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 hover:underline">
                  View all reservations →
                </button>
              </div>
            </div>
          </div>

          {/* Right Hand Column: Summary and Notes */}
          <div className="space-y-6">
            {/* Membership Summary Card */}
            <div className={`rounded-2xl border shadow-sm p-6 ${cardClass}`}>
              <div className="flex items-center gap-2.5 mb-6">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Sparkles size={18} />
                </span>
                <h3 className="text-lg font-bold">Membership Summary</h3>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-xl border p-4 flex items-center gap-3.5 ${subCardClass}`}>
                  <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                    <BookOpen size={16} />
                  </span>
                  <div>
                    <p className="text-xl font-extrabold leading-none">{detailData.totalLoans}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${labelClass}`}>Total Loans</p>
                  </div>
                </div>

                <div className={`rounded-xl border p-4 flex items-center gap-3.5 ${subCardClass}`}>
                  <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                    <BookMarked size={16} />
                  </span>
                  <div>
                    <p className="text-xl font-extrabold leading-none">{detailData.currentLoans}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${labelClass}`}>Currently Borrowed</p>
                  </div>
                </div>

                <div className={`rounded-xl border p-4 flex items-center gap-3.5 ${subCardClass}`}>
                  <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                    <Calendar size={16} />
                  </span>
                  <div>
                    <p className="text-xl font-extrabold leading-none">{detailData.reservationsCount}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${labelClass}`}>Reservations</p>
                  </div>
                </div>

                <div className={`rounded-xl border p-4 flex items-center gap-3.5 ${subCardClass}`}>
                  <span className={`p-2.5 rounded-lg shrink-0 ${
                    detailData.fines !== '₱0.00' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-600'
                  }`}>
                    <FileText size={16} />
                  </span>
                  <div>
                    <p className={`text-xl font-extrabold leading-none ${
                      detailData.fines !== '₱0.00' ? 'text-rose-500' : ''
                    }`}>{detailData.fines}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${labelClass}`}>Fines & Penalties</p>
                  </div>
                </div>
              </div>

              {/* Payments Section */}
              <div className={`mt-6 pt-5 border-t flex items-center justify-between text-sm ${borderClass}`}>
                <span className={`font-semibold ${labelClass}`}>Payments Made</span>
                <span className="font-extrabold text-base">₱0.00</span>
              </div>
            </div>

            {/* Notes Card */}
            <div className={`rounded-2xl border shadow-sm p-6 ${cardClass}`}>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <FileText size={18} />
                </span>
                <h3 className="text-lg font-bold">Notes</h3>
              </div>

              <div className="space-y-3.5 max-h-[170px] overflow-y-auto">
                {notesList.length > 0 ? (
                  notesList.map((note, index) => (
                    <div key={index} className={`p-3.5 rounded-xl border text-sm leading-relaxed ${subCardClass}`}>
                      {note}
                    </div>
                  ))
                ) : (
                  <p className={`text-center py-4 text-sm ${labelClass}`}>No notes added yet.</p>
                )}
              </div>

              {showAddNote ? (
                <form onSubmit={handleAddNoteSubmit} className="mt-4 space-y-3">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type member note..."
                    rows={3}
                    className={`w-full rounded-xl border p-3 text-sm outline-none ${
                      isDarkMode
                        ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500'
                        : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'
                    }`}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddNote(false)}
                      className={`h-9 px-4 rounded-lg border text-xs font-semibold ${
                        isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      Save Note
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-5 flex justify-center">
                  <button
                    onClick={() => setShowAddNote(true)}
                    className="inline-flex items-center gap-1.5 h-10 border border-emerald-600 rounded-xl px-5 text-sm font-semibold text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                  >
                    <Plus size={14} />
                    Add Note
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Activity Table Card */}
        <div className={`rounded-2xl border shadow-sm p-6 ${cardClass}`}>
          <div className="flex items-center gap-2.5 mb-5">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Activity size={18} />
            </span>
            <h3 className="text-lg font-bold">Recent Activity</h3>
          </div>

          <div className="overflow-x-auto border rounded-xl dark:border-slate-800">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'bg-[#0f1f49] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                  <th className="px-4 py-3 font-semibold">Date & Time</th>
                  <th className="px-4 py-3 font-semibold">Activity</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {detailData.activities.map((act, index) => (
                  <tr key={index} className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-[#12244f]/30`}>
                    <td className={`px-4 py-3 text-xs font-semibold ${labelClass}`}>{act.dateTime}</td>
                    <td className="px-4 py-3 font-bold text-xs">
                      <span className={`inline-block rounded-md px-2.5 py-0.5 ${
                        act.activity.includes('Borrowed')
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                          : act.activity.includes('Reservation')
                            ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                      }`}>
                        {act.activity}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-xs font-medium ${valueClass}`}>{act.description}</td>
                    <td className={`px-4 py-3 text-xs font-bold ${valueClass}`}>{act.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex justify-end">
            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 hover:underline">
              View full activity log →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
