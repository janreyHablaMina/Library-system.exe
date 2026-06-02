import { useState, useRef, useEffect } from 'react'
import { Calendar, Clock3, CheckCircle2, XCircle, MapPin, Eye, Trash2, Download, Plus, Search, ChevronDown, Filter, ChevronLeft, ChevronRight, MoreHorizontal, BookOpen, UserRound, ArrowLeft, Info, X, Check, Mail, Smartphone, Printer, Pencil, AlertTriangle , Zap } from 'lucide-react'
import { createReservation, deleteReservation, listBooks, listMembers, listReservations, updateReservation, updateReservationStatus } from '../lib/tauriApi'

type ReservationStatus = 'Reserved' | 'Ready for Pickup' | 'Expired' | 'Cancelled'

type ReservationRow = {
  id: string
  bookId?: number
  memberId?: number
  reservationDateRaw?: string
  expiresOnRaw?: string
  statusRaw?: string
  priority?: string
  notes?: string | null
  notifyEmail?: boolean
  notifySms?: boolean
  book: {
    title: string
    author: string
    cover: string
    coverUrl?: string | null
  }
  member: {
    name: string
    id: string
    avatar: string
    profilePhotoData?: string | null
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
  onOpenTransactionDetail: (id: string) => void
  onNavigateToBorrow?: (memberId: number, bookId: number) => void
}

const stats = [
  { label: 'Total Reservations', value: '56', subValue: '↑ 12 this month', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Reserved', value: '24', subValue: '42.9% of total', icon: Clock3, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Ready for Pickup', value: '18', subValue: '32.1% of total', icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Expired', value: '12', subValue: '21.4% of total', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Cancelled', value: '2', subValue: '3.6% of total', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
]

const reservationsData: ReservationRow[] = [
  { id: 'RES-00056', book: { title: 'The Alchemist', author: 'Paulo Coelho', cover: '📙' }, member: { name: 'Maria Santos', id: 'MS-00125', avatar: '👩🏽' }, pickupBranch: 'Central Library', reservedOn: 'May 14, 2026', reservedTime: '10:15 AM', status: 'Reserved', expiresOn: 'May 21, 2026', expiresTime: '10:15 AM' },
  { id: 'RES-00055', book: { title: 'Atomic Habits', author: 'James Clear', cover: '📕' }, member: { name: 'Juan Dela Cruz', id: 'JD-00098', avatar: '👨🏻' }, pickupBranch: 'North Branch', reservedOn: 'May 14, 2026', reservedTime: '09:45 AM', status: 'Ready for Pickup', expiresOn: 'May 17, 2026', expiresTime: '09:45 AM' },
  { id: 'RES-00054', book: { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', cover: '📘' }, member: { name: 'Ana Lim', id: 'AL-00076', avatar: '👩🏻' }, pickupBranch: 'Central Library', reservedOn: 'May 13, 2026', reservedTime: '04:30 PM', status: 'Ready for Pickup', expiresOn: 'May 16, 2026', expiresTime: '04:30 PM' },
  { id: 'RES-00053', book: { title: 'The 5 AM Club', author: 'Robin Sharma', cover: '📗' }, member: { name: 'Pedro Reyes', id: 'PR-00045', avatar: '👨🏼' }, pickupBranch: 'West Branch', reservedOn: 'May 13, 2026', reservedTime: '11:20 AM', status: 'Reserved', expiresOn: 'May 20, 2026', expiresTime: '11:20 AM' },
  { id: 'RES-00052', book: { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', cover: '📒' }, member: { name: 'Sarah Wilson', id: 'SW-00102', avatar: '👩🏼' }, pickupBranch: 'Central Library', reservedOn: 'May 12, 2026', reservedTime: '03:10 PM', status: 'Expired', expiresOn: 'May 13, 2026', expiresTime: '(Picked up)' },
  { id: 'RES-00051', book: { title: 'The Power of Habit', author: 'Charles Duhigg', cover: '📙' }, member: { name: 'Carlo Garcia', id: 'CG-00063', avatar: '👨🏻' }, pickupBranch: 'South Branch', reservedOn: 'May 12, 2026', reservedTime: '10:05 AM', status: 'Cancelled', expiresOn: 'May 12, 2026', expiresTime: '10:30 AM' },
  { id: 'RES-00050', book: { title: 'Sapiens', author: 'Yuval Noah Harari', cover: '📓' }, member: { name: 'Alicia H.', id: 'AH-00055', avatar: '👩🏻' }, pickupBranch: 'North Branch', reservedOn: 'May 11, 2026', reservedTime: '02:25 PM', status: 'Ready for Pickup', expiresOn: 'May 14, 2026', expiresTime: '02:25 PM' },
  { id: 'RES-00049', book: { title: 'The Subtle Art of Not Caring', author: 'Mark Manson', cover: '📙' }, member: { name: 'John Doe', id: 'JD-00012', avatar: '👨🏼' }, pickupBranch: 'Central Library', reservedOn: 'May 11, 2026', reservedTime: '09:15 AM', status: 'Reserved', expiresOn: 'May 18, 2026', expiresTime: '09:15 AM' },
]

type MemberItem = {
  id: number
  name: string
  memberId: string
  type: string
  phone: string
  email: string
  borrowedCount: number
  limit: string
  avatar: string
  profilePhotoData?: string | null
  outstandingFines: string
}

type BookItem = {
  id: number
  title: string
  author: string
  isbn: string
  availableCopies: number
  category: string
  publisher: string
  coverUrl: string
  copyId: string
}

const mockMembers: MemberItem[] = [
  { id: 1, name: 'Maria Santos', memberId: 'MS-00125', type: 'Student', phone: '0917 123 4567', email: 'maria.santos@email.com', borrowedCount: 2, limit: '3 / 5', avatar: 'MS', profilePhotoData: null, outstandingFines: '$0.00', status: 'Active' },
  { id: 2, name: 'Juan Dela Cruz', memberId: 'JD-00098', type: 'Student', phone: '0912 345 6789', email: 'juan.delacruz@email.com', borrowedCount: 2, limit: '3 / 5', avatar: 'JD', profilePhotoData: null, outstandingFines: '$0.00', status: 'Active' },
  { id: 3, name: 'Ana Lim', memberId: 'AL-00076', type: 'Student', phone: '0934 567 8901', email: 'ana.lim@email.com', borrowedCount: 3, limit: '2 / 5', avatar: 'AL', profilePhotoData: null, outstandingFines: '$0.00', status: 'Active' },
  { id: 4, name: 'Carlo Garcia', memberId: 'CG-00063', type: 'Student', phone: '0945 678 9012', email: 'carlo.garcia@email.com', borrowedCount: 1, limit: '4 / 5', avatar: 'CG', profilePhotoData: null, outstandingFines: '$120.00', status: 'Suspended' },
]
const mockBooks: BookItem[] = [
  { 
    id: 1,
    title: 'The Alchemist', 
    author: 'Paulo Coelho', 
    isbn: '978-0061122415', 
    availableCopies: 1, 
    category: 'Fiction', 
    publisher: 'HarperOne', 
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&auto=format&fit=crop&q=80',
    copyId: 'BK-2026-0007'
  },
  { 
    id: 2,
    title: 'Atomic Habits', 
    author: 'James Clear', 
    isbn: '978-0735211292', 
    availableCopies: 5, 
    category: 'Self-Help', 
    publisher: 'Avery', 
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80',
    copyId: 'BK-2026-0001'
  },
  { 
    id: 3,
    title: 'Thinking, Fast and Slow', 
    author: 'Daniel Kahneman', 
    isbn: '978-0374275631', 
    availableCopies: 2, 
    category: 'Psychology', 
    publisher: 'Farrar, Straus and Giroux', 
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=150&auto=format&fit=crop&q=80',
    copyId: 'BK-2026-0005'
  },
  { 
    id: 4,
    title: 'Deep Work', 
    author: 'Cal Newport', 
    isbn: '978-1455586691', 
    availableCopies: 4, 
    category: 'Productivity', 
    publisher: 'Grand Central Publishing', 
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&auto=format&fit=crop&q=80',
    copyId: 'BK-2026-0002'
  },
]

type ReservationActionsMenuProps = {
  isDarkMode: boolean
  onViewDetails: () => void
  onEdit: () => void
  onComplete: () => void
  onCancel: () => void
  onDelete: () => void
}

function ReservationActionsMenu({ isDarkMode, onViewDetails, onEdit, onComplete, onCancel, onDelete }: ReservationActionsMenuProps) {
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
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onComplete(); }}
          >
            <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
            Check Out Book
          </button>
          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(); }}
          >
            <Pencil size={15} className="shrink-0 text-indigo-500" />
            Edit Reservation
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
          <button
            type="button"
            className={`${itemBase} ${itemDanger}`}
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(); }}
          >
            <Trash2 size={15} className="shrink-0 text-rose-500" />
            Delete Reservation
          </button>
        </div>
      )}
    </div>
  )
}

type ReservationDetailsViewProps = {
  reservation: ReservationRow
  isDarkMode: boolean
  onBack: () => void
  onCheckOut?: (reservation: any) => void
}

function ReservationDetailsViewNew({ reservation, isDarkMode, onBack, onCheckOut }: ReservationDetailsViewProps) {
  const book = reservation.book
  const member = reservation.member

  const getStatusStyle = (status: ReservationStatus) => {
    switch (status) {
      case 'Reserved': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
      case 'Ready for Pickup': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
      case 'Expired': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
      case 'Cancelled': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
    }
  }

  const sectionSurface = isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'
  const sectionBorder = isDarkMode ? 'border-slate-700' : 'border-slate-100'
  const primaryText = isDarkMode ? 'text-slate-100' : 'text-slate-900'

  return (
    <section className="mx-auto w-full max-w-[1400px] px-2 pt-6 pb-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors ${
              isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}`}>Reservation Details</h2>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <button type="button" className="hover:underline" onClick={onBack}>Reservations</button>
              <ChevronRight size={12} />
              <span>{reservation.id}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-xs font-bold ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><Printer size={14} />Print</button>
          <button type="button" className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-xs font-bold ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><Pencil size={14} />Edit</button>
          <button type="button" className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-xs font-bold ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><MoreHorizontal size={14} />More</button>
        </div>
      </div>

      {/* Top Summary Card */}
      <article className={`mb-6 rounded-2xl border p-5 sm:p-6 ${sectionSurface}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400`}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 className={`text-xl font-bold tracking-tight ${primaryText}`}>{reservation.id}</h3>
              <span className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold ${getStatusStyle(reservation.status)}`}>{reservation.status}</span>
            </div>
          </div>
          
          <div className={`hidden h-10 w-px lg:block ${sectionBorder}`} />
          
          <div className="flex items-start gap-3">
             <Calendar size={18} className="mt-0.5 shrink-0 text-slate-400" />
             <div>
                <p className="text-[11px] font-bold text-slate-400">Reserved On</p>
                <p className={`mt-0.5 text-sm font-bold ${primaryText}`}>{reservation.reservedOn}</p>
                <p className="text-xs font-semibold text-slate-500">{reservation.reservedTime}</p>
             </div>
          </div>
          
          <div className={`hidden h-10 w-px lg:block ${sectionBorder}`} />

          <div className="flex items-start gap-3">
             <Calendar size={18} className="mt-0.5 shrink-0 text-amber-500" />
             <div>
                <p className="text-[11px] font-bold text-slate-400">Expires On</p>
                <p className={`mt-0.5 text-sm font-bold ${primaryText}`}>{reservation.expiresOn}</p>
                <p className="text-xs font-semibold text-slate-500">{reservation.expiresTime}</p>
             </div>
          </div>

          <div className={`hidden h-10 w-px lg:block ${sectionBorder}`} />

          <div className="flex items-start gap-3">
             <MapPin size={18} className="mt-0.5 shrink-0 text-emerald-500" />
             <div>
                <p className="text-[11px] font-bold text-slate-400">Pickup Branch</p>
                <p className={`mt-0.5 text-sm font-bold ${primaryText}`}>{reservation.pickupBranch}</p>
             </div>
          </div>
        </div>
      </article>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Book Information */}
        <article className={`rounded-2xl border p-6 ${sectionSurface}`}>
          <div className="mb-6 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <BookOpen size={16} />
            </div>
            <h3 className={`text-base font-bold ${primaryText}`}>Book Information</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <img src={book.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&auto=format&fit=crop&q=80'} alt={`${book.title} cover`} className={`aspect-[2/3] w-full max-w-[140px] rounded-xl border object-cover shadow-sm ${sectionBorder}`} />
            <div className="flex-1">
              <h4 className={`text-xl font-bold leading-tight ${primaryText}`}>{book.title}</h4>
              <p className="mt-1 text-sm font-semibold text-emerald-600">{book.author}</p>
              
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between pb-1">
                  <span className="font-medium text-slate-500">Category</span>
                  <span className={`font-semibold ${primaryText}`}>Fiction</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="font-medium text-slate-500">ISBN</span>
                  <span className={`font-semibold ${primaryText}`}>978-0061122415</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="font-medium text-slate-500">Available Copies</span>
                  <span className={`font-bold text-emerald-600`}>1 copy</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="font-medium text-slate-500">Total Copies</span>
                  <span className={`font-semibold ${primaryText}`}>4 copies</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="font-medium text-slate-500">Reservations / Queue</span>
                  <span className={`font-semibold ${primaryText}`}>2 people</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Member Information */}
        <article className={`rounded-2xl border p-6 ${sectionSurface}`}>
          <div className="mb-6 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <UserRound size={16} />
            </div>
            <h3 className={`text-base font-bold ${primaryText}`}>Member Information</h3>
          </div>
          
          <div className="flex items-center gap-5">
            <img
              src={member.profilePhotoData || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
              alt={member.name}
              className={`h-24 w-24 rounded-full border-4 object-cover shadow-sm ${isDarkMode ? 'border-slate-800' : 'border-white'}`}
            />
            <div>
              <h4 className={`text-xl font-bold leading-tight ${primaryText}`}>{member.name}</h4>
              <span className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Active Member
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Member ID</span>
              <span className={`font-semibold ${primaryText}`}>{member.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Member since</span>
              <span className={`font-semibold ${primaryText}`}>Jan 15, 2023</span>
            </div>
          </div>

          <div className={`mt-6 space-y-3 border-t pt-5 ${sectionBorder}`}>
            <div className={`flex items-center gap-3 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <Smartphone size={16} className="text-slate-400" />
              <span>0917 123 4567</span>
            </div>
            <div className={`flex items-center gap-3 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <Mail size={16} className="text-slate-400" />
              <span>{member.name.toLowerCase().replace(' ', '.')}@example.com</span>
            </div>
          </div>

        </article>

      </div>

      {/* Quick Actions */}
      <article className={`mt-6 rounded-2xl border p-6 ${sectionSurface}`}>
        <div className="mb-5 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            <Zap size={16} />
          </div>
          <h3 className={`text-base font-bold ${primaryText}`}>Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <button type="button" className={`flex w-full flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${isDarkMode ? 'border-blue-500/30 bg-blue-950/20 hover:bg-blue-950/40' : 'border-blue-100 bg-blue-50 hover:bg-blue-100/70'}`}>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-blue-600 shadow-sm dark:bg-blue-900/50 dark:text-blue-400`}>
                   <Clock3 size={18} />
                </div>
                <span className={`font-bold text-blue-700 dark:text-blue-400`}>Mark Ready for Pickup</span>
              </div>
              <ChevronRight size={16} className="text-blue-400" />
            </div>
            <p className="text-xs font-medium text-blue-600/80 dark:text-blue-400/80">Prepare this book for member pickup.</p>
          </button>

          <button type="button" onClick={() => onCheckOut && onCheckOut(reservation)} className={`flex w-full flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${isDarkMode ? 'border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40' : 'border-emerald-100 bg-emerald-50 hover:bg-emerald-100/70'}`}>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-emerald-600 shadow-sm dark:bg-emerald-900/50 dark:text-emerald-400`}>
                   <BookOpen size={18} />
                </div>
                <span className={`font-bold text-emerald-700 dark:text-emerald-400`}>Check Out Book</span>
              </div>
              <ChevronRight size={16} className="text-emerald-400" />
            </div>
            <p className="text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80">Convert this reservation into a borrow transaction.</p>
          </button>

          <button type="button" className={`flex w-full flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${isDarkMode ? 'border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40' : 'border-rose-100 bg-rose-50 hover:bg-rose-100/70'}`}>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-rose-600 shadow-sm dark:bg-rose-900/50 dark:text-rose-400`}>
                   <XCircle size={18} />
                </div>
                <span className={`font-bold text-rose-700 dark:text-rose-400`}>Cancel Reservation</span>
              </div>
              <ChevronRight size={16} className="text-rose-400" />
            </div>
            <p className="text-xs font-medium text-rose-600/80 dark:text-rose-400/80">Cancel this reservation. The book will be released.</p>
          </button>

        </div>
      </article>

    </section>
  )
}

export function ReservationsPage({ isDarkMode, onOpenTransactionDetail, onNavigateToBorrow }: ReservationsPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeViewReservationId, setActiveViewReservationId] = useState<string | null>(null)
  const [reservationSearch, setReservationSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | ReservationStatus>('All')
  const [branchFilter, setBranchFilter] = useState<'All Branches' | string>('All Branches')
  const [reservationDate, setReservationDate] = useState('2026-05-21')
  const [expiresOn, setExpiresOn] = useState('2026-05-28')
  const [notes, setNotes] = useState('')
  const [priority, setPriority] = useState('Normal')
  
  // Custom checked states for checkboxes
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySMS, setNotifySMS] = useState(true)
  const [isSavingReservation, setIsSavingReservation] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [reservationToDelete, setReservationToDelete] = useState<ReservationRow | null>(null)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [reservationSearch, statusFilter, branchFilter, itemsPerPage])
  const [editingReservation, setEditingReservation] = useState<ReservationRow | null>(null)
  const [books, setBooks] = useState<BookItem[]>([])
  const [members, setMembers] = useState<MemberItem[]>([])
  const [reservations, setReservations] = useState<ReservationRow[]>([])

    
  

  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null)
  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null)

  const [bookSearchQuery, setBookSearchQuery] = useState('')
  const [showBookDropdown, setShowBookDropdown] = useState(false)

  const [memberSearchQuery, setMemberSearchQuery] = useState('')
  const [showMemberDropdown, setShowMemberDropdown] = useState(false)

  const bookDropdownRef = useRef<HTMLDivElement>(null)
  const memberDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target as Node)) {
        setShowMemberDropdown(false)
      }
      if (bookDropdownRef.current && !bookDropdownRef.current.contains(event.target as Node)) {
        setShowBookDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const formatDate = (value: string) => {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) {
        return 'N/A'
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    const formatTime = (value: string) => {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) {
        return '--'
      }
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
    const statusFromDb = (status: string): ReservationStatus => {
      if (status === 'Ready for Pickup' || status === 'Completed' || status === 'Cancelled') {
        return status
      }
      return 'Reserved'
    }
    const avatarFromName = (name: string) => {
      const parts = name.trim().split(/\s+/).filter(Boolean)
      const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('')
      return initials || 'M'
    }

    const loadData = async () => {
      try {
        const [bookRows, memberRows, reservationRows] = await Promise.all([
          listBooks(1000),
          listMembers(1000),
          listReservations('All', 1000),
        ])

        setBooks(
          bookRows.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            isbn: book.isbn ?? `N/A-${book.id}`,
            availableCopies: book.available,
            totalCopies: book.totalCopies,
            shelfLocation: book.shelfLocation || 'Central Library - Fiction Section',
            category: book.category ?? 'General',
            publisher: 'N/A',
            coverUrl: book.coverData ?? 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&auto=format&fit=crop&q=80',
            copyId: `BK-${String(book.id).padStart(6, '0')}`,
          })),
        )

        setMembers(
          memberRows.map((member) => ({
            id: member.id,
            name: member.fullName,
            memberId: member.memberId,
            type: member.memberType,
            phone: member.contactNumber ?? 'N/A',
            email: member.email ?? 'N/A',
            borrowedCount: member.borrowed,
            limit: `${Math.max(0, 5 - member.borrowed)} / 5`,
            avatar: avatarFromName(member.fullName),
            profilePhotoData: member.profilePhotoData || null,
            outstandingFines: '$0.00',
          })),
        )

        const mappedReservations = reservationRows.map((reservation) => {
          const matchedBook = bookRows.find((book) => book.id === reservation.bookId)
          const matchedMember = memberRows.find((member) => member.id === reservation.memberId)
          return {
            id: `RES-${String(reservation.id).padStart(5, '0')}`,
            bookId: reservation.bookId,
            memberId: reservation.memberId,
            reservationDateRaw: reservation.reservationDate,
            expiresOnRaw: reservation.expiresOn,
            statusRaw: reservation.status,
            priority: reservation.priority,
            notes: reservation.notes ?? '',
            notifyEmail: reservation.notifyEmail,
            notifySms: reservation.notifySms,
            book: {
              title: reservation.bookTitle,
              author: reservation.bookAuthor,
              cover: '📘',
              coverUrl: matchedBook?.coverData ?? null,
            },
            member: {
              name: reservation.memberName,
              id: reservation.memberCode,
              avatar: avatarFromName(reservation.memberName),
              profilePhotoData: matchedMember?.profilePhotoData ?? null,
            },
            pickupBranch: reservation.branch,
            reservedOn: formatDate(reservation.reservationDate),
            reservedTime: formatTime(reservation.reservationDate),
            status: statusFromDb(reservation.status),
            expiresOn: formatDate(reservation.expiresOn),
            expiresTime: formatTime(reservation.expiresOn),
          } as ReservationRow
        })
        setReservations(mappedReservations)
      } catch (error) {
        console.error('Failed to load reservation page data:', error)
      }
    }

    loadData()
  }, [])

  // Derived state to keep compatibility with existing card conditional renders:
  const isBookSelected = !!selectedBook
  const isMemberSelected = !!selectedMember

  const filteredMembersList = members.filter(m => 
    m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || 
    m.memberId.toLowerCase().includes(memberSearchQuery.toLowerCase())
  )

  const filteredBooksList = books.filter(b => 
    b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) || 
    b.isbn.includes(bookSearchQuery)
  )

  const formatExpiresDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return 'May 28, 2026 (10:30 AM)'
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
      return `${date.toLocaleDateString('en-US', options)} (10:30 AM)`
    } catch {
      return 'May 28, 2026 (10:30 AM)'
    }
  }

  const formatReservationDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return 'May 21, 2026 (10:30 AM)'
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
      return `${date.toLocaleDateString('en-US', options)} (10:30 AM)`
    } catch {
      return 'May 21, 2026 (10:30 AM)'
    }
  }

  const getStatusStyle = (status: ReservationStatus) => {
    switch (status) {
      case 'Reserved': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
      case 'Ready for Pickup': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
      case 'Expired': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
      case 'Cancelled': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    const normalizedSearch = reservationSearch.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch.length === 0 ||
      reservation.id.toLowerCase().includes(normalizedSearch) ||
      reservation.book.title.toLowerCase().includes(normalizedSearch) ||
      reservation.book.author.toLowerCase().includes(normalizedSearch) ||
      reservation.member.name.toLowerCase().includes(normalizedSearch) ||
      reservation.member.id.toLowerCase().includes(normalizedSearch)

    const matchesStatus = statusFilter === 'All' || reservation.status === statusFilter
    const matchesBranch = branchFilter === 'All Branches' || reservation.pickupBranch === branchFilter

    return matchesSearch && matchesStatus && matchesBranch
  })

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)
  const paginatedReservations = filteredReservations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const mapReservationsToRows = (
    rows: Awaited<ReturnType<typeof listReservations>>,
    loadedBooks: BookItem[],
    loadedMembers: MemberItem[],
  ): ReservationRow[] => {
    const toDate = (value: string) => new Date(value)
    const toStatus = (status: string): ReservationStatus =>
      status === 'Ready for Pickup' || status === 'Expired' || status === 'Cancelled' ? status : 'Reserved'

    return rows.map((item) => {
      const matchedBook = loadedBooks.find((book) => book.id === item.bookId)
      const matchedMember = loadedMembers.find((member) => member.id === item.memberId)
      return {
        id: `RES-${String(item.id).padStart(5, '0')}`,
        bookId: item.bookId,
        memberId: item.memberId,
        reservationDateRaw: item.reservationDate,
        expiresOnRaw: item.expiresOn,
        statusRaw: item.status,
        priority: item.priority,
        notes: item.notes ?? '',
        notifyEmail: item.notifyEmail,
        notifySms: item.notifySms,
        book: {
          title: item.bookTitle,
          author: item.bookAuthor,
          cover: '📘',
          coverUrl: matchedBook?.coverUrl ?? null,
        },
        member: {
          name: item.memberName,
          id: item.memberCode,
          avatar:
            item.memberName
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() ?? '')
              .join('') || 'M',
          profilePhotoData: matchedMember?.profilePhotoData ?? null,
        },
        pickupBranch: item.branch,
        reservedOn: toDate(item.reservationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        reservedTime: toDate(item.reservationDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        status: toStatus(item.status),
        expiresOn: toDate(item.expiresOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        expiresTime: toDate(item.expiresOn).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }
    })
  }

  const refreshReservations = async () => {
    const rows = await listReservations('All', 1000)
    setReservations(mapReservationsToRows(rows, books, members))
  }

  const handleCreateReservation = async () => {
    if (!selectedBook || !selectedMember) {
      setFormError('Please select both a book and a member before creating a reservation.')
      return
    }
    if (!reservationDate || !expiresOn) {
      setFormError('Reservation date and expiration date are required.')
      return
    }

    try {
      setFormError(null)
      setIsSavingReservation(true)
      if (editingReservation) {
        const numericId = Number.parseInt(editingReservation.id.replace('RES-', ''), 10)
        if (Number.isNaN(numericId)) {
          throw new Error('Invalid reservation id')
        }
        if (!selectedMember || !selectedBook) {
          throw new Error('Please select both a member and a book before saving.')
        }
        await updateReservation({
          id: numericId,
          memberId: selectedMember.id,
          bookId: selectedBook.id,
          reservationDate: new Date(`${reservationDate}T10:30:00`).toISOString(),
          expiresOn: new Date(`${expiresOn}T10:30:00`).toISOString(),
          status: editingReservation.statusRaw || editingReservation.status,
          branch: editingReservation.pickupBranch || 'Central Library',
          priority,
          notes,
          notifyEmail,
          notifySms: notifySMS,
        })
      } else {
        await createReservation({
          memberId: selectedMember.id,
          bookId: selectedBook.id,
          reservationDate: new Date(`${reservationDate}T10:30:00`).toISOString(),
          expiresOn: new Date(`${expiresOn}T10:30:00`).toISOString(),
          branch: branchFilter === 'All Branches' ? 'Central Library' : branchFilter,
          priority,
          notes,
          notifyEmail,
          notifySms: notifySMS,
        })
      }
      await refreshReservations()
      setIsAddModalOpen(false)
      setEditingReservation(null)
      setSelectedBook(null)
      setSelectedMember(null)
      setNotes('')
      setPriority('Normal')
      setNotifyEmail(true)
      setNotifySMS(true)
    } catch (error) {
      console.error('Failed to save reservation:', error)
      setFormError(typeof error === 'string' ? error : 'Failed to save reservation. Please try again.')
    } finally {
      setIsSavingReservation(false)
    }
  }

  const updateReservationActionStatus = async (reservationId: string, nextStatus: ReservationStatus) => {
    const numericId = Number.parseInt(reservationId.replace('RES-', ''), 10)
    if (Number.isNaN(numericId)) return
    try {
      setActionError(null)
      await updateReservationStatus({ id: numericId, status: nextStatus })
      await refreshReservations()
    } catch (error) {
      console.error(`Failed to update reservation ${reservationId}:`, error)
      setActionError('Failed to update reservation status. Please try again.')
    }
  }

  const deleteReservationAction = async (reservationId: string) => {
    const numericId = Number.parseInt(reservationId.replace('RES-', ''), 10)
    if (Number.isNaN(numericId)) return
    try {
      setActionError(null)
      await deleteReservation(numericId)
      await refreshReservations()
      setReservationToDelete(null)
    } catch (error) {
      console.error(`Failed to delete reservation ${reservationId}:`, error)
      setActionError('Failed to delete reservation. Please try again.')
    }
  }

  const openEditReservation = (reservation: ReservationRow) => {
    const toInputDate = (value?: string) => {
      const parsed = value ? new Date(value) : null
      if (!parsed || Number.isNaN(parsed.getTime())) {
        return new Date().toISOString().slice(0, 10)
      }
      return parsed.toISOString().slice(0, 10)
    }
    setEditingReservation(reservation)
    setReservationDate(toInputDate(reservation.reservationDateRaw))
    setExpiresOn(toInputDate(reservation.expiresOnRaw))
    setPriority(reservation.priority || 'Normal')
    setNotes(reservation.notes || '')
    setNotifyEmail(reservation.notifyEmail ?? true)
    setNotifySMS(reservation.notifySms ?? true)
    const matchedBook = books.find((book) => book.id === reservation.bookId) || null
    const matchedMember = members.find((member) => member.id === reservation.memberId) || null
    setSelectedBook(matchedBook)
    setSelectedMember(matchedMember)
    setBookSearchQuery('')
    setMemberSearchQuery('')
    setFormError(null)
    setIsAddModalOpen(true)
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto ${isAddModalOpen || activeViewReservationId ? 'px-4 pt-4 pb-0' : 'p-4'} ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      {reservationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-6">Delete Reservation</h3>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Are you sure you want to delete <span className="font-semibold text-rose-500">"{reservationToDelete.id}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReservationToDelete(null)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteReservationAction(reservationToDelete.id)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Yes, Delete Reservation
              </button>
            </div>
          </div>
        </div>
      )}
      {activeViewReservationId ? (
        <ReservationDetailsViewNew
            reservation={reservations.find(r => r.id === activeViewReservationId)!} 
            isDarkMode={isDarkMode} 
            onBack={() => setActiveViewReservationId(null)}
            onCheckOut={(res) => onNavigateToBorrow && onNavigateToBorrow(res.memberId, res.bookId)}
          />
      ) : !isAddModalOpen ? (
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
              <button type="button" onClick={() => { setIsAddModalOpen(true); setEditingReservation(null); setSelectedBook(null); setSelectedMember(null); const now = new Date(); setReservationDate(now.toISOString().slice(0, 10)); now.setDate(now.getDate() + 7); setExpiresOn(now.toISOString().slice(0, 10)); setNotes(''); setPriority('Normal'); setNotifyEmail(true); setNotifySMS(true); setFormError(null); }} className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-sm">
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
                <input
                  value={reservationSearch}
                  onChange={(event) => setReservationSearch(event.target.value)}
                  className={`w-full bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`}
                  placeholder="Search by book title, member name..."
                />
              </label>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Status</span>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as 'All' | ReservationStatus)}
                      className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}
                    >
                      <option value="All">All</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="Expired">Expired</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>

                

                <button
                  type="button"
                  onClick={() => {
                    setReservationSearch('')
                    setStatusFilter('All')
                    setBranchFilter('All Branches')
                  }}
                  className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-white'}`}
                >
                  <Filter size={16} />
                  Reset
                </button>
              </div>
            </div>
            {actionError ? (
              <div className={`border-b px-4 py-2 text-xs font-semibold ${isDarkMode ? 'border-slate-700 bg-rose-500/10 text-rose-300' : 'border-slate-200 bg-rose-50 text-rose-600'}`}>
                {actionError}
              </div>
            ) : null}

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
                  {paginatedReservations.map((res) => (
                    <tr key={res.id} onClick={() => setActiveViewReservationId(res.id)} className={`cursor-pointer border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{res.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`grid h-12 w-9 place-items-center overflow-hidden rounded border bg-slate-100 text-base dark:border-slate-700 dark:bg-slate-800`}>
                            {res.book.coverUrl ? (
                              <img src={res.book.coverUrl} alt={`${res.book.title} cover`} className="h-full w-full object-cover" />
                            ) : (
                              res.book.cover
                            )}
                          </span>
                          <div>
                            <p className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{res.book.title}</p>
                            <p className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{res.book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`grid h-9 w-9 place-items-center overflow-hidden rounded-full text-xs font-bold ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
                            {res.member.profilePhotoData ? (
                              <img src={res.member.profilePhotoData} alt={`${res.member.name} profile`} className="h-full w-full object-cover" />
                            ) : (
                              res.member.avatar
                            )}
                          </span>
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
                          onViewDetails={() => setActiveViewReservationId(res.id)}
                          onEdit={() => openEditReservation(res)}
                          onComplete={() => onNavigateToBorrow && onNavigateToBorrow(res.memberId, res.bookId)}
                          onCancel={() => updateReservationActionStatus(res.id, 'Cancelled')}
                          onDelete={() => setReservationToDelete(res)}
                        />
                      </td>
                    </tr>
                  ))}
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={`px-6 py-12 text-center text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        No reservations match your current filters.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className={`relative z-0 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
            <p>Showing {filteredReservations.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredReservations.length)} of {filteredReservations.length} reservations</p>
            <div className="flex items-center gap-2">
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className={`h-9 rounded-lg border px-3 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <button type="button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={`grid h-9 w-9 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 disabled:opacity-50' : 'border-slate-200 hover:bg-slate-50 disabled:opacity-50'}`}>{'<'}</button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} type="button" onClick={() => setCurrentPage(page)} className={page === currentPage ? "grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : `grid h-9 w-9 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                    {page}
                  </button>
                ))}
              </div>

              <button type="button" onClick={() => setCurrentPage(p => Math.min(totalPages, p - -1))} disabled={currentPage === totalPages || totalPages === 0} className={`grid h-9 w-9 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 disabled:opacity-50' : 'border-slate-200 hover:bg-slate-50 disabled:opacity-50'}`}>{'>'}</button>
            </div>
          </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto w-full max-w-[1650px] px-2 pt-2 pb-0">
          {/* Form Header with Circular Back Button */}
          <div className="mb-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setIsAddModalOpen(false); setEditingReservation(null) }}
              className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${
                isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}`}>{editingReservation ? 'Edit Reservation' : 'Add New Reservation'}</h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>{editingReservation ? `Update reservation ${editingReservation.id}` : 'Create a reservation for a book'}</p>
            </div>
          </div>

          <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
            {/* 60 / 40 Responsive Desktop Grid */}
            <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
              <div className="space-y-4">
                <article className={`rounded-2xl border p-5 sm:p-6 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
                  
                  {/* 1. Select Book */}
                  <div className="relative space-y-2" ref={bookDropdownRef}>
                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}`}>1. Select Book</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>Search and select a book to reserve.</p>
                    
                    <div className="mt-3.5">
                      <label className={`group flex h-11 items-center rounded-xl border px-3 transition-all ${
                        selectedBook 
                          ? (isDarkMode ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-emerald-500 bg-emerald-50/50')
                          : (isDarkMode ? 'border-slate-700 focus-within:border-emerald-500 bg-[#0f1f49]/30' : 'border-slate-200 focus-within:border-emerald-500 bg-white')
                      }`}>
                        {selectedBook ? (
                          <Check size={16} className="mr-2 text-emerald-500 animate-[scaleIn_0.2s_ease-out]" />
                        ) : (
                          <Search size={16} className={`mr-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        )}
                        <input
                          value={selectedBook ? selectedBook.title : bookSearchQuery}
                          onChange={(e) => {
                            setBookSearchQuery(e.target.value)
                            setShowBookDropdown(true)
                            if (selectedBook) {
                              setSelectedBook(null)
                            }
                          }}
                          onFocus={() => setShowBookDropdown(true)}
                          placeholder="Search by title, author, or ISBN..."
                          className={`w-full bg-transparent text-xs outline-none ${selectedBook ? 'font-semibold text-emerald-600 dark:text-emerald-400' : (isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400')}`}
                        />
                        {selectedBook && (
                          <span className="mr-2 shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-[fadeIn_0.15s_ease-out]">
                            Selected
                          </span>
                        )}
                        <ChevronDown size={16} className={selectedBook ? 'text-emerald-500' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')} />
                      </label>
                    </div>

                    {showBookDropdown && (
                      <div className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border p-1.5 shadow-xl ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                        {filteredBooksList.length > 0 ? (
                          filteredBooksList.map((b) => (
                            <button
                              key={b.isbn}
                              type="button"
                              onClick={() => {
                                setSelectedBook(b)
                                setShowBookDropdown(false)
                                setBookSearchQuery('')
                              }}
                              className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                            >
                              <img src={b.coverUrl} alt={b.title} className="w-8 h-11 rounded object-cover border shrink-0" />
                              <div className="flex-1">
                                <p className={isDarkMode ? 'text-slate-100' : 'text-slate-900'}>{b.title}</p>
                                <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{b.author} • {b.isbn}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className={`p-3 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No books found</p>
                        )}
                      </div>
                    )}

                    {selectedBook && (
                      <div className={`relative rounded-xl border p-3 animate-[fadeIn_0.15s_ease-out] ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50/40'}`}>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-11 h-16 rounded object-cover border border-slate-200 dark:border-slate-800 shrink-0" />
                            <div>
                              <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedBook.title}</p>
                              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Author: {selectedBook.author}</p>
                              <p className={`mt-1 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>ISBN: {selectedBook.isbn} • Copy ID: {selectedBook.copyId}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 md:gap-6">
                            <div className="text-right text-xs">
                              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Available Copies</p>
                              <p className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{selectedBook.availableCopies}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedBook(null)}
                              className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className={`my-5 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`} />

                  {/* 2. Select Member */}
                  <div className="relative space-y-2" ref={memberDropdownRef}>
                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}`}>2. Select Member</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>Search and select a member.</p>
                    
                    <div className="mt-3.5">
                      <label className={`group flex h-11 items-center rounded-xl border px-3 transition-all ${
                        selectedMember 
                          ? (isDarkMode ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-emerald-500 bg-emerald-50/50')
                          : (isDarkMode ? 'border-slate-700 focus-within:border-emerald-500 bg-[#0f1f49]/30' : 'border-slate-200 focus-within:border-emerald-500 bg-white')
                      }`}>
                        {selectedMember ? (
                          <Check size={16} className="mr-2 text-emerald-500 animate-[scaleIn_0.2s_ease-out]" />
                        ) : (
                          <Search size={16} className={`mr-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        )}
                        <input
                          value={selectedMember ? selectedMember.name : memberSearchQuery}
                          onChange={(e) => {
                            setMemberSearchQuery(e.target.value)
                            setShowMemberDropdown(true)
                            if (selectedMember) {
                              setSelectedMember(null)
                            }
                          }}
                          onFocus={() => setShowMemberDropdown(true)}
                          placeholder="Search by name or member ID..."
                          className={`w-full bg-transparent text-xs outline-none ${selectedMember ? 'font-semibold text-emerald-600 dark:text-emerald-400' : (isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400')}`}
                        />
                        {selectedMember && (
                          <span className="mr-2 shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-[fadeIn_0.15s_ease-out]">
                            Selected
                          </span>
                        )}
                        <ChevronDown size={16} className={selectedMember ? 'text-emerald-500' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')} />
                      </label>
                    </div>

                    {showMemberDropdown && (
                      <div className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border p-1.5 shadow-xl ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                        {filteredMembersList.length > 0 ? (
                          filteredMembersList.map((m) => (
                            <button
                              key={m.memberId}
                              type="button"
                              onClick={() => {
                                setSelectedMember(m)
                                setShowMemberDropdown(false)
                                setMemberSearchQuery('')
                              }}
                              className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                            >
                              <span className={`grid h-8 w-8 place-items-center overflow-hidden rounded-full text-[11px] font-bold ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
                                {m.profilePhotoData ? (
                                  <img src={m.profilePhotoData} alt={`${m.name} profile`} className="h-full w-full object-cover" />
                                ) : (
                                  m.avatar
                                )}
                              </span>
                              <div className="flex-1">
                                <p className={isDarkMode ? 'text-slate-100' : 'text-slate-900'}>{m.name}</p>
                                <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{m.memberId} • {m.type}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className={`p-3 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No members found</p>
                        )}
                      </div>
                    )}

                    {selectedMember && (
                      <div className={`relative rounded-xl border p-3 animate-[fadeIn_0.15s_ease-out] ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50/40'}`}>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full text-base ${isDarkMode ? 'bg-slate-800' : 'bg-white border'}`}>
                              {selectedMember.profilePhotoData ? (
                                <img src={selectedMember.profilePhotoData} alt={`${selectedMember.name} profile`} className="h-full w-full object-cover" />
                              ) : (
                                selectedMember.avatar
                              )}
                            </span>
                            <div className="min-w-0">
                              <p className={`truncate font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedMember.name}</p>
                              <p className={`truncate text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedMember.memberId} • {selectedMember.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 md:gap-6">
                            <div className="text-xs md:text-center">
                              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Borrowed Books</p>
                              <p className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{selectedMember.borrowedCount}</p>
                            </div>
                            <div className="text-xs md:text-center">
                              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Available Limit</p>
                              <p className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{selectedMember.limit}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedMember(null)}
                              className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className={`my-5 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`} />

                  {/* 3. Reservation Details */}
                  <div>
                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}`}>3. Reservation Details</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>Provide reservation information.</p>
                    
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Reservation Date</label>
                        <div className={`mt-1.5 flex h-11 items-center gap-2 rounded-xl border px-3.5 focus-within:border-emerald-500 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                          <Calendar size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                          <input 
                            type="date" 
                            value={reservationDate} 
                            onChange={(e) => setReservationDate(e.target.value)} 
                            className={`w-full bg-transparent outline-none text-xs font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`} 
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Expires On *</label>
                        <div className={`mt-1.5 flex h-11 items-center gap-2 rounded-xl border px-3.5 focus-within:border-emerald-500 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                          <Calendar size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                          <input type="date" value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} className={`w-full bg-transparent outline-none text-xs font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`} />
                        </div>
                        <p className={`mt-1 text-[10px] leading-tight ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Member will be notified before this date.</p>
                      </div>


                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <div>
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Notify Member Via</label>
                        <div className="mt-3 grid gap-3">
                          {/* Email Notification Card */}
                          <button
                            type="button"
                            onClick={() => setNotifyEmail(!notifyEmail)}
                            className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer ${
                              notifyEmail
                                ? isDarkMode
                                  ? 'border-emerald-500/70 bg-emerald-950/20 shadow-[0_4px_20px_rgba(16,185,129,0.15)]'
                                  : 'border-emerald-500 bg-emerald-50/50 shadow-[0_4px_16px_rgba(16,185,129,0.08)]'
                                : isDarkMode
                                  ? 'border-slate-700 bg-[#0f1f49]/30 hover:border-slate-500 hover:bg-[#0f1f49]/50'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`grid h-9 w-9 place-items-center rounded-lg transition-all ${
                                notifyEmail
                                  ? isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                                  : isDarkMode ? 'bg-[#0f1f49] text-slate-400' : 'bg-slate-100 text-slate-500'
                              }`}>
                                <Mail size={16} />
                              </div>
                              <div>
                                <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Email Notification</p>
                                <p className={`text-[10px] font-medium leading-normal mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Send receipt and updates via email</p>
                              </div>
                            </div>
                            <div className={`grid h-5 w-5 place-items-center rounded-md border transition-all ${
                              notifyEmail
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : isDarkMode ? 'border-slate-600' : 'border-slate-300'
                            }`}>
                              {notifyEmail && <Check size={12} strokeWidth={3} />}
                            </div>
                          </button>

                          {/* SMS Notification Card */}
                          <button
                            type="button"
                            onClick={() => setNotifySMS(!notifySMS)}
                            className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer ${
                              notifySMS
                                ? isDarkMode
                                  ? 'border-emerald-500/70 bg-emerald-950/20 shadow-[0_4px_20px_rgba(16,185,129,0.15)]'
                                  : 'border-emerald-500 bg-emerald-50/50 shadow-[0_4px_16px_rgba(16,185,129,0.08)]'
                                : isDarkMode
                                  ? 'border-slate-700 bg-[#0f1f49]/30 hover:border-slate-500 hover:bg-[#0f1f49]/50'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`grid h-9 w-9 place-items-center rounded-lg transition-all ${
                                notifySMS
                                  ? isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                                  : isDarkMode ? 'bg-[#0f1f49] text-slate-400' : 'bg-slate-100 text-slate-500'
                              }`}>
                                <Smartphone size={16} />
                              </div>
                              <div>
                                <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>SMS Notification</p>
                                <p className={`text-[10px] font-medium leading-normal mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Send pickup alert via mobile text</p>
                              </div>
                            </div>
                            <div className={`grid h-5 w-5 place-items-center rounded-md border transition-all ${
                              notifySMS
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : isDarkMode ? 'border-slate-600' : 'border-slate-300'
                            }`}>
                              {notifySMS && <Check size={12} strokeWidth={3} />}
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between">
                          <label className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Notes (Optional)</label>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            notes.length >= 180 
                              ? 'bg-rose-500/10 text-rose-500'
                              : isDarkMode ? 'bg-[#0f1f49] text-slate-400' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {notes.length} / 200
                          </span>
                        </div>
                        <div className="relative mt-3 flex flex-1 h-full">
                          <textarea 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value.slice(0, 200))} 
                            className={`w-full h-full rounded-xl border pl-10 pr-4 py-3.5 outline-none transition-all duration-200 focus:border-emerald-500 text-xs resize-none leading-relaxed flex-1 ${
                              isDarkMode 
                                ? 'border-slate-700 bg-[#0f1f49]/30 text-slate-100 placeholder:text-slate-500 focus:bg-[#0f1f49]/50' 
                                : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:shadow-[0_4px_16px_rgba(16,185,129,0.05)]'
                            }`} 
                            placeholder="Add any internal library staff notes, pickup instructions, or special requests..." 
                          />
                          <BookOpen size={14} className={`absolute left-3.5 top-3.5 transition-colors duration-200 ${
                            notes.length > 0 
                              ? 'text-emerald-500' 
                              : isDarkMode ? 'text-slate-500' : 'text-slate-400'
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons inside the card container at the bottom */}
                  <div className={`mt-6 pt-5 border-t flex justify-end gap-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    {formError ? (
                      <p className="mr-auto self-center text-xs font-semibold text-rose-500">{formError}</p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => { setIsAddModalOpen(false); setEditingReservation(null) }}
                      className={`h-10 rounded-xl border px-6 text-xs font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCreateReservation}
                      disabled={isSavingReservation}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-700 px-6 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Calendar size={14} />
                      {isSavingReservation ? 'Saving...' : editingReservation ? 'Save Changes' : 'Create Reservation'}
                    </button>
                  </div>

                </article>
              </div>

              {/* Right Column Summary (40% width) */}
              <aside className="space-y-4">
                <article className={`rounded-2xl border p-5 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
                  <h3 className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}`}>Reservation Summary</h3>
                  <hr className={`my-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`} />
                  
                  {/* Book Information Card */}
                  <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200/80 bg-white'}`}>
                    <div className={`px-4 py-2.5 flex items-center gap-2 border-b font-bold text-xs ${isDarkMode ? 'bg-emerald-950/30 border-emerald-900/30 text-emerald-400' : 'bg-emerald-50/70 border-emerald-100/80 text-emerald-800'}`}>
                      <BookOpen size={14} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                      <span>Book Information</span>
                    </div>
                    {isBookSelected ? (
                      <div className="p-4 grid grid-cols-10 gap-4">
                        <div className="col-span-3 flex flex-col items-center justify-start shrink-0">
                          <div className="relative group w-full aspect-[2/3] max-w-[120px]">
                            <img 
                              src={selectedBook?.coverUrl} 
                              alt={`${selectedBook?.title} cover`} 
                              className={`w-full h-full object-cover border transition-transform duration-300 group-hover:scale-[1.03] ${
                                isDarkMode ? 'border-slate-700/60' : 'border-slate-200'
                              }`} 
                            />
                          </div>
                        </div>
                        <div className="col-span-7 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className={`font-bold text-xs sm:text-sm leading-tight truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedBook?.title}</h4>
                            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{selectedBook?.author}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] leading-tight">
                            <div className={`p-2 rounded-lg border transition-all ${
                              isDarkMode ? 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/60 border-slate-100 hover:border-slate-200/80'
                            }`}>
                              <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-wider">Category</span>
                              <span className={`font-extrabold block mt-0.5 truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{selectedBook?.category}</span>
                            </div>
                            
                            <div className={`p-2 rounded-lg border transition-all ${
                              isDarkMode ? 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/60 border-slate-100 hover:border-slate-200/80'
                            }`}>
                              <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-wider">ISBN</span>
                              <span className={`font-mono font-extrabold block mt-0.5 truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{selectedBook?.isbn}</span>
                            </div>
                            
                            <div className={`col-span-2 p-2 rounded-lg border transition-all ${
                              isDarkMode ? 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/60 border-slate-100 hover:border-slate-200/80'
                            }`}>
                              <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-wider">Reservations</span>
                              <span className="font-extrabold block mt-0.5 text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse inline-block"></span>
                                {reservations.filter(r => r.bookId === selectedBook?.id && (r.status === 'Reserved' || r.status === 'Ready for Pickup')).length} waiting
                              </span>
                            </div>
                            

                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 flex flex-col items-center justify-center text-center">
                        <div className={`h-10 w-10 rounded-full grid place-items-center mb-2.5 transition-all ${
                          isDarkMode ? 'bg-[#0f1f49] text-emerald-400/70' : 'bg-emerald-50 text-emerald-600/70'
                        }`}>
                          <BookOpen size={16} className="animate-pulse" />
                        </div>
                        <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No Book Selected</p>
                        <p className={`text-[10px] font-semibold mt-1 max-w-[210px] leading-relaxed ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          Search and select a book from the list on the left to see details.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Member Information Card */}
                  <div className={`rounded-xl border overflow-hidden mt-4 ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200/80 bg-white'}`}>
                    <div className={`px-4 py-2.5 flex items-center gap-2 border-b font-bold text-xs ${isDarkMode ? 'bg-blue-950/30 border-blue-900/30 text-blue-400' : 'bg-blue-50/70 border-blue-100/80 text-blue-800'}`}>
                      <UserRound size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      <span>Member Information</span>
                    </div>
                    {isMemberSelected ? (
                      <div className="p-4 grid grid-cols-10 gap-4">
                        <div className="col-span-3 flex flex-col items-center justify-center shrink-0">
                          <div className="relative group w-full aspect-square max-w-[100px] flex items-center justify-center">
                            <span className={`grid w-full h-full place-items-center overflow-hidden rounded-full text-3xl border transition-all ${
                              isDarkMode 
                                ? 'bg-slate-900/80 border-slate-700/60 text-slate-100' 
                                : 'bg-slate-50 border-slate-200/80 text-slate-800'
                            }`}>
                              {selectedMember?.profilePhotoData ? (
                                <img src={selectedMember.profilePhotoData} alt={`${selectedMember.name} profile`} className="h-full w-full object-cover" />
                              ) : (
                                selectedMember?.avatar
                              )}
                            </span>
                            <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border whitespace-nowrap ${
                              isDarkMode 
                                ? 'bg-blue-950/90 border-blue-800 text-blue-400' 
                                : 'bg-blue-50/90 border-blue-200 text-blue-700'
                            }`}>
                              {selectedMember?.type || 'Student'}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-7 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className={`font-bold text-xs sm:text-sm leading-tight truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedMember?.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 font-mono">{selectedMember?.memberId}</p>
                          </div>
                          
                          <div className="space-y-2 mt-3 text-[11px] leading-tight">
                            <div className="grid grid-cols-2 gap-2">
                              <div className={`p-2 rounded-lg border flex items-center gap-1.5 transition-all ${
                                isDarkMode ? 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/60 border-slate-100 hover:border-slate-200/80'
                              }`}>
                                <Smartphone size={12} className="text-slate-400 shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-[7.5px] font-bold text-slate-400 block uppercase tracking-wider">Phone</span>
                                  <span className={`font-extrabold truncate block text-[10px] ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{selectedMember?.phone}</span>
                                </div>
                              </div>

                              <div className={`p-2 rounded-lg border flex items-center gap-1.5 transition-all ${
                                isDarkMode ? 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/60 border-slate-100 hover:border-slate-200/80'
                              }`}>
                                <Mail size={12} className="text-slate-400 shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-[7.5px] font-bold text-slate-400 block uppercase tracking-wider">Email</span>
                                  <span className={`font-extrabold truncate block text-[10px] ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`} title={selectedMember?.email}>{selectedMember?.email}</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className={`p-2 rounded-lg border transition-all ${
                                isDarkMode ? 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/60 border-slate-100 hover:border-slate-200/80'
                              }`}>
                                <span className="text-[7.5px] font-bold text-slate-400 block uppercase tracking-wider">Borrowed Count</span>
                                <span className={`font-extrabold block mt-0.5 text-[10px] ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                  {selectedMember?.borrowedCount} / 5 books
                                </span>
                              </div>

                              <div className={`p-2 rounded-lg border transition-all ${
                                isDarkMode ? 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/60 border-slate-100 hover:border-slate-200/80'
                              }`}>
                                <span className="text-[7.5px] font-bold text-slate-400 block uppercase tracking-wider">Membership Status</span>
                                <div className="mt-0.5">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                    <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                                    Active
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 flex flex-col items-center justify-center text-center">
                        <div className={`h-10 w-10 rounded-full grid place-items-center mb-2.5 transition-all ${
                          isDarkMode ? 'bg-[#0f1f49] text-blue-400/70' : 'bg-blue-50 text-blue-600/70'
                        }`}>
                          <UserRound size={16} className="animate-pulse" />
                        </div>
                        <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No Member Selected</p>
                        <p className={`text-[10px] font-semibold mt-1 max-w-[210px] leading-relaxed ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          Search and select a member from the list on the left to see details.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Reservation Info Card */}
                  <div className={`rounded-xl border overflow-hidden mt-4 ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200/80 bg-white'}`}>
                    <div className={`px-4 py-2.5 flex items-center gap-2 border-b font-bold text-xs ${isDarkMode ? 'bg-amber-950/35 border-amber-900/30 text-amber-400' : 'bg-amber-50/70 border-amber-100/80 text-amber-800'}`}>
                      <Calendar size={14} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                      <span>Reservation Overview</span>
                    </div>
                    <div className="p-4 flex flex-col gap-2.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400 font-bold">Reservation Date</span>
                        <span className={`font-extrabold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{formatReservationDate(reservationDate)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400 font-bold">Expires On</span>
                        <span className={`font-extrabold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{formatExpiresDate(expiresOn)}</span>
                      </div>


                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400 font-bold">Estimated Wait Time</span>
                        <span className={`font-extrabold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {!selectedBook ? '-' : selectedBook.availableCopies > 0 ? 'Available immediately' : `~ ${(reservations.filter(r => r.bookId === selectedBook.id && (r.status === 'Reserved' || r.status === 'Ready for Pickup')).length * 3) + 2} days`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notice Alert Banner */}
                  <div className={`mt-4 flex items-start gap-2.5 rounded-xl p-3 text-[11px] font-semibold border ${
                    isDarkMode 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-blue-50/70 text-blue-800 border-blue-100'
                  }`}>
                    <Info size={16} className="shrink-0 mt-0.5 text-blue-500" />
                    <span>The member will be notified when the book becomes available for pickup.</span>
                  </div>
                </article>
              </aside>
            </div>
          </form>
        </section>
      )}
    </div>
  )
}
