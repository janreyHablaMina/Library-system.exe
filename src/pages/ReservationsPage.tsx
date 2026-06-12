import { useState, useRef, useEffect, useMemo } from 'react'
import { Calendar, Clock3, CheckCircle2, XCircle, Eye, Trash2, Download, Plus, Search, ChevronDown, Filter, ChevronLeft, ChevronRight, MoreHorizontal, BookOpen, UserRound, ArrowLeft, Info, X, Check, Mail, Smartphone, Pencil, AlertTriangle , Zap } from 'lucide-react'
import { createReservation, deleteReservation, getSetting, listBooks, listMembers, listReservations, updateReservation, updateReservationStatus } from '../lib/tauriApi'

type ReservationStatus = 'Queued' | 'Notified' | 'Claimed' | 'Expired' | 'Cancelled'

type ReservationRow = {
  id: string
  bookId?: number
  memberId?: number
  reservationDateRaw?: string
  expiresOnRaw?: string
  queueDateRaw?: string
  notificationSentAtRaw?: string | null
  claimExpiresAtRaw?: string | null
  queuePosition?: number | null
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
    category: string
    isbn: string
    availableCopies: number
    totalCopies: number
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
  notificationSentAt: string
  daysRemaining: string
  activeQueueCount: number
}

type ReservationsPageProps = {
  isDarkMode: boolean
  onOpenTransactionDetail: (id: string) => void
  onNavigateToBorrow?: (memberId: number, bookId: number) => void
  initialBookId?: number | null
  onInitialBookConsumed?: () => void
}
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
  totalCopies: number
  shelfLocation: string
  category: string
  publisher: string
  coverUrl: string
  copyId: string
}

type ReservationActionsMenuProps = {
  isDarkMode: boolean
  status: ReservationStatus
  onViewDetails: () => void
  onEdit: () => void
  onNotify: () => void
  onComplete: () => void
  onCancel: () => void
  onDelete: () => void
}

function ReservationActionsMenu({ isDarkMode, status, onViewDetails, onEdit, onNotify, onComplete, onCancel, onDelete }: ReservationActionsMenuProps) {
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
    ? 'bg-[#18181B] border-zinc-700 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-zinc-200'
    : 'bg-white border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-zinc-700'

  const itemBase =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-100 text-left'
  const itemNormal = isDarkMode
    ? 'text-zinc-200 hover:bg-zinc-800'
    : 'text-zinc-700 hover:bg-zinc-50'
  const itemDanger = isDarkMode
    ? 'text-rose-400 hover:bg-rose-500/10'
    : 'text-rose-600 hover:bg-rose-50'
  const divider = isDarkMode ? 'border-zinc-700/60' : 'border-zinc-100'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150 ${
          open
            ? isDarkMode
              ? 'bg-zinc-700 text-zinc-100'
              : 'bg-emerald-50 text-emerald-700'
            : isDarkMode
              ? 'text-zinc-300 hover:bg-zinc-800'
              : 'text-zinc-600 hover:bg-zinc-50'
        }`}
        aria-label="Reservation actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-52 rounded-xl border p-1.5 ${surface} animate-[fadeIn_0.12s_ease] ${
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
          {status === 'Queued' && (
            <button
              type="button"
              className={`${itemBase} ${itemNormal}`}
              role="menuitem"
              onClick={(e) => { e.stopPropagation(); setOpen(false); onNotify(); }}
            >
              <Mail size={15} className="shrink-0 text-amber-500" />
              Notify Next Member
            </button>
          )}

          {status === 'Notified' && (
            <button
              type="button"
              className={`${itemBase} ${itemNormal}`}
              role="menuitem"
              onClick={(e) => { e.stopPropagation(); setOpen(false); onComplete(); }}
            >
              <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
              Mark Claimed
            </button>
          )}
          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(); }}
          >
            <Pencil size={15} className="shrink-0 text-indigo-500" />
            Edit Reservation
          </button>

          <div className={`my-1.5 border-t ${divider}`} />

          {(status === 'Queued' || status === 'Notified') && (
            <button
              type="button"
              className={`${itemBase} ${itemDanger}`}
              role="menuitem"
              onClick={(e) => { e.stopPropagation(); setOpen(false); onCancel(); }}
            >
              <Trash2 size={15} className="shrink-0 text-rose-500" />
              Cancel Reservation
            </button>
          )}
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
  onEdit?: (reservation: ReservationRow) => void
  onCancel?: () => void
}

function ReservationDetailsViewNew({ reservation, isDarkMode, onBack, onCheckOut, onEdit, onCancel }: ReservationDetailsViewProps) {
  const book = reservation.book
  const member = reservation.member

  const getStatusStyle = (status: ReservationStatus) => {
    switch (status) {
      case 'Queued': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
      case 'Notified': return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
      case 'Claimed': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
      case 'Expired': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
      case 'Cancelled': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
    }
  }

  const sectionSurface = isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const primaryText = isDarkMode ? 'text-zinc-100' : 'text-zinc-900'

  return (
    <section className="mx-auto w-full max-w-[1400px] px-2 pt-6 pb-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors ${
              isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}`}>Reservation Details</h2>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
              <button type="button" className="hover:underline" onClick={onBack}>Reservations</button>
              <ChevronRight size={12} />
              <span>{reservation.id}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Top Summary Card */}
      <article className={`mb-6 overflow-hidden rounded-2xl border ${sectionSurface}`}>
        <div className={`h-1.5 w-full ${
          reservation.status === 'Notified'
            ? 'bg-emerald-500'
            : reservation.status === 'Claimed'
              ? 'bg-emerald-500'
              : reservation.status === 'Queued'
                ? 'bg-blue-500'
                : 'bg-rose-500'
        }`} />
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.15fr_1fr_1fr]">
          <div className={`flex items-center gap-4 rounded-xl border p-4 ${isDarkMode ? 'border-zinc-700 bg-zinc-800/40' : 'border-zinc-100 bg-zinc-50/70'}`}>
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Calendar size={23} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`text-xl font-black tracking-tight ${primaryText}`}>{reservation.id}</h3>
                <span className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(reservation.status)}`}>{reservation.status}</span>
              </div>
              <p className={`mt-2 text-xs font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Queue position
                <span className={`ml-2 text-sm font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {reservation.queuePosition ? `#${reservation.queuePosition}` : 'Completed'}
                </span>
              </p>
            </div>
          </div>

          <div className={`rounded-xl border p-4 ${isDarkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-zinc-100 bg-white'}`}>
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar size={16} />
              <p className="text-[10px] font-bold uppercase tracking-[0.12em]">Queue Date</p>
            </div>
            <p className={`mt-3 text-base font-black ${primaryText}`}>{reservation.reservedOn}</p>
            <p className={`mt-1 text-xs font-semibold ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{reservation.reservedTime}</p>
          </div>

          <div className={`rounded-xl border p-4 ${
            reservation.status === 'Notified'
              ? isDarkMode ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-100 bg-emerald-50/50'
              : isDarkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-zinc-100 bg-white'
          }`}>
            <div className={`flex items-center gap-2 ${reservation.status === 'Notified' ? 'text-emerald-500' : 'text-zinc-400'}`}>
              <Clock3 size={16} />
              <p className="text-[10px] font-bold uppercase tracking-[0.12em]">Claim Expiry</p>
            </div>
            <p className={`mt-3 text-base font-black ${primaryText}`}>{reservation.expiresOn}</p>
            <p className={`mt-1 text-xs font-semibold ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{reservation.expiresTime}</p>
            {reservation.status === 'Notified' && (
              <p className="mt-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Notification sent {reservation.notificationSentAt}
              </p>
            )}
          </div>
        </div>
      </article>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Book Information */}
        <article className={`overflow-hidden rounded-2xl border ${sectionSurface}`}>
          <div className={`flex items-center justify-between border-b px-5 py-4 ${isDarkMode ? 'border-zinc-700 bg-emerald-500/5' : 'border-zinc-100 bg-emerald-50/50'}`}>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                <BookOpen size={17} />
              </div>
              <div>
                <h3 className={`text-sm font-black ${primaryText}`}>Book Information</h3>
                <p className="mt-0.5 text-[10px] font-semibold text-zinc-400">Reserved library material</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">BOOK</span>
          </div>
          
          <div className="p-5">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className={`shrink-0 rounded-xl border p-2 ${isDarkMode ? 'border-zinc-700 bg-zinc-800/50' : 'border-zinc-100 bg-zinc-50'}`}>
                <img src={book.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&auto=format&fit=crop&q=80'} alt={`${book.title} cover`} className="aspect-[2/3] w-full max-w-[120px] rounded-lg object-cover shadow-sm" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xl font-black leading-tight ${primaryText}`}>{book.title}</h4>
                <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">{book.author}</p>

                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Category', value: book.category },
                    { label: 'ISBN', value: book.isbn },
                    { label: 'Available', value: `${book.availableCopies} ${book.availableCopies === 1 ? 'copy' : 'copies'}`, accent: true },
                    { label: 'Total Copies', value: `${book.totalCopies} ${book.totalCopies === 1 ? 'copy' : 'copies'}` },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-xl border p-3 ${isDarkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-zinc-100 bg-zinc-50/70'}`}>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">{item.label}</p>
                      <p className={`mt-1 truncate text-xs font-black ${item.accent ? 'text-emerald-600 dark:text-emerald-400' : primaryText}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`mt-4 flex items-center justify-between rounded-xl border px-4 py-3 ${isDarkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-zinc-100 bg-white'}`}>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Reservations / Queue</p>
                <p className={`mt-1 text-xs font-bold ${primaryText}`}>
                  {reservation.activeQueueCount} {reservation.activeQueueCount === 1 ? 'person' : 'people'} waiting
                </p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-sm font-black text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">{reservation.activeQueueCount}</span>
            </div>
          </div>
        </article>

        {/* Member Information */}
        <article className={`overflow-hidden rounded-2xl border ${sectionSurface}`}>
          <div className={`flex items-center justify-between border-b px-5 py-4 ${isDarkMode ? 'border-zinc-700 bg-blue-500/5' : 'border-zinc-100 bg-blue-50/50'}`}>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                <UserRound size={17} />
              </div>
              <div>
                <h3 className={`text-sm font-black ${primaryText}`}>Member Information</h3>
                <p className="mt-0.5 text-[10px] font-semibold text-zinc-400">Reservation owner</p>
              </div>
            </div>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">MEMBER</span>
          </div>
          
          <div className="p-5">
            <div className={`flex items-center gap-4 rounded-xl border p-4 ${isDarkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-zinc-100 bg-zinc-50/70'}`}>
              <div className="relative shrink-0">
                <img
                  src={member.profilePhotoData || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
                  alt={member.name}
                  className={`h-20 w-20 rounded-2xl border-2 object-cover shadow-sm ${isDarkMode ? 'border-zinc-700' : 'border-white'}`}
                />
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-800" />
              </div>
              <div className="min-w-0">
                <h4 className={`truncate text-xl font-black leading-tight ${primaryText}`}>{member.name}</h4>
                <p className="mt-1 text-xs font-semibold text-zinc-500">{member.id}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  Active Member
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className={`rounded-xl border p-3 ${isDarkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-zinc-100 bg-white'}`}>
                <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Member ID</p>
                <p className={`mt-1 truncate text-xs font-black ${primaryText}`}>{member.id}</p>
              </div>
              <div className={`rounded-xl border p-3 ${isDarkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-zinc-100 bg-white'}`}>
                <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Member Since</p>
                <p className={`mt-1 text-xs font-black ${primaryText}`}>Jan 15, 2023</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2.5">
              <div className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-xs font-semibold ${isDarkMode ? 'border-zinc-700 bg-zinc-800/30 text-zinc-300' : 'border-zinc-100 bg-zinc-50/70 text-zinc-700'}`}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Smartphone size={15} />
                </span>
                <span className="truncate">0917 123 4567</span>
              </div>
              <div className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-xs font-semibold ${isDarkMode ? 'border-zinc-700 bg-zinc-800/30 text-zinc-300' : 'border-zinc-100 bg-zinc-50/70 text-zinc-700'}`}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Mail size={15} />
                </span>
                <span className="truncate">{member.name.toLowerCase().replace(' ', '.')}@example.com</span>
              </div>
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
          
          <button type="button" onClick={() => onEdit && onEdit(reservation)} className={`flex w-full flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${isDarkMode ? 'border-blue-500/30 bg-blue-950/20 hover:bg-blue-950/40' : 'border-blue-100 bg-blue-50 hover:bg-blue-100/70'}`}>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-sm ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-white text-blue-600'}`}>
                   <Pencil size={18} />
                </div>
                <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>Edit Reservation</span>
              </div>
              <ChevronRight size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            </div>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-blue-400/80' : 'text-blue-600/80'}`}>Modify reservation details, dates, or branch.</p>
          </button>

          {reservation.status === 'Notified' && (
            <button type="button" onClick={() => onCheckOut && onCheckOut(reservation)} className={`flex w-full flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${isDarkMode ? 'border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40' : 'border-emerald-100 bg-emerald-50 hover:bg-emerald-100/70'}`}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-sm ${isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-white text-emerald-600'}`}>
                    <BookOpen size={18} />
                  </div>
                  <span className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Mark Claimed</span>
                </div>
                <ChevronRight size={16} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
              </div>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-emerald-400/80' : 'text-emerald-600/80'}`}>Convert this reservation into a borrow transaction.</p>
            </button>
          )}

          {(reservation.status === 'Queued' || reservation.status === 'Notified') && (
            <button type="button" onClick={() => onCancel && onCancel()} className={`flex w-full flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${isDarkMode ? 'border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40' : 'border-rose-100 bg-rose-50 hover:bg-rose-100/70'}`}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-sm ${isDarkMode ? 'bg-rose-900/50 text-rose-400' : 'bg-white text-rose-600'}`}>
                    <XCircle size={18} />
                  </div>
                  <span className={`font-bold ${isDarkMode ? 'text-rose-400' : 'text-rose-700'}`}>Cancel Reservation</span>
                </div>
                <ChevronRight size={16} className={isDarkMode ? 'text-rose-400' : 'text-rose-600'} />
              </div>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-rose-400/80' : 'text-rose-600/80'}`}>Cancel this reservation. The book will be released.</p>
            </button>
          )}

        </div>
      </article>

    </section>
  )
}

export function ReservationsPage({ isDarkMode, onOpenTransactionDetail: _onOpenTransactionDetail, onNavigateToBorrow, initialBookId = null, onInitialBookConsumed }: ReservationsPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeViewReservationId, setActiveViewReservationId] = useState<string | null>(null)
  const [reservationSearch, setReservationSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | ReservationStatus>('All')
  const [branchFilter, setBranchFilter] = useState<'All Branches' | string>('All Branches')
  const getInitialDateTime = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const [reservationDate, setReservationDate] = useState(() => getInitialDateTime(0));
  const [claimPeriodDays, setClaimPeriodDays] = useState(3)
  const [notes, setNotes] = useState('')
  const [priority, setPriority] = useState('Normal')
  
  // Custom checked states for checkboxes
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySMS, setNotifySMS] = useState(true)
  const [isSavingReservation, setIsSavingReservation] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [reservationToDelete, setReservationToDelete] = useState<ReservationRow | null>(null)
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)
  const [selectedReservationIds, setSelectedReservationIds] = useState<Set<string>>(() => new Set())
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [reservationSearch, statusFilter, branchFilter, itemsPerPage])
  const [editingReservation, setEditingReservation] = useState<ReservationRow | null>(null)
  const [books, setBooks] = useState<BookItem[]>([])
  const [members, setMembers] = useState<MemberItem[]>([])
  const [reservations, setReservations] = useState<ReservationRow[]>([])

  useEffect(() => {
    void getSetting('reservations.claim_period_days').then((value) => {
      const parsed = Number.parseInt(value ?? '', 10)
      if (Number.isFinite(parsed) && parsed > 0) {
        setClaimPeriodDays(parsed)
      }
    })
  }, [])

  useEffect(() => {
    if (!isAddModalOpen || editingReservation) return

    const syncQueueTime = () => setReservationDate(getInitialDateTime(0))
    syncQueueTime()
    const timer = window.setInterval(syncQueueTime, 30_000)
    return () => window.clearInterval(timer)
  }, [isAddModalOpen, editingReservation])

  const dynamicStats = useMemo(() => {
    const total = reservations.length
    const queued = reservations.filter(r => r.status === 'Queued').length
    const notified = reservations.filter(r => r.status === 'Notified').length
    const expired = reservations.filter(r => r.status === 'Expired').length
    const cancelled = reservations.filter(r => r.status === 'Cancelled').length

    const getPercentage = (count: number) => total > 0 ? ((count / total) * 100).toFixed(1) + '% of total' : '0% of total'

    return [
      { label: 'Total Reservations', value: total.toString(), subValue: 'All time', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Queued', value: queued.toString(), subValue: getPercentage(queued), icon: Clock3, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Notified', value: notified.toString(), subValue: getPercentage(notified), icon: Mail, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Expired / Cancelled', value: (expired + cancelled).toString(), subValue: getPercentage(expired + cancelled), icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    ]
  }, [reservations])
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null)
  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null)

  const [bookSearchQuery, setBookSearchQuery] = useState('')
  const [showBookDropdown, setShowBookDropdown] = useState(false)

  const [memberSearchQuery, setMemberSearchQuery] = useState('')
  const [showMemberDropdown, setShowMemberDropdown] = useState(false)

  const bookDropdownRef = useRef<HTMLDivElement>(null)
  const memberDropdownRef = useRef<HTMLDivElement>(null)
  const selectAllRef = useRef<HTMLInputElement>(null)

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
    if (!initialBookId || books.length === 0) return
    const book = books.find((item) => item.id === initialBookId)
    if (!book) return

    setSelectedBook(book)
    setBookSearchQuery(book.title)
    setSelectedMember(null)
    setReservationDate(getInitialDateTime(0))
    setNotes('')
    setPriority('Normal')
    setNotifyEmail(true)
    setNotifySMS(true)
    setFormError(null)
    setEditingReservation(null)
    setIsAddModalOpen(true)
    onInitialBookConsumed?.()
  }, [books, initialBookId, onInitialBookConsumed])

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
    const statusFromDb = (status: string): ReservationStatus =>
      status === 'Notified' || status === 'Claimed' || status === 'Expired' || status === 'Cancelled'
        ? status
        : 'Queued'
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
            queueDateRaw: reservation.queueDate,
            queuePosition: reservation.queuePosition,
            notificationSentAtRaw: reservation.notificationSentAt,
            claimExpiresAtRaw: reservation.claimExpiresAt,
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
              category: matchedBook?.category ?? 'Uncategorized',
              isbn: matchedBook?.isbn ?? 'Not provided',
              availableCopies: matchedBook?.available ?? 0,
              totalCopies: matchedBook?.totalCopies ?? 0,
            },
            member: {
              name: reservation.memberName,
              id: reservation.memberCode,
              avatar: avatarFromName(reservation.memberName),
              profilePhotoData: matchedMember?.profilePhotoData ?? null,
            },
            pickupBranch: reservation.branch,
            reservedOn: formatDate(reservation.queueDate),
            reservedTime: formatTime(reservation.queueDate),
            status: statusFromDb(reservation.status),
            expiresOn: reservation.claimExpiresAt ? formatDate(reservation.claimExpiresAt) : 'Not started',
            expiresTime: reservation.claimExpiresAt ? formatTime(reservation.claimExpiresAt) : '--',
            notificationSentAt: reservation.notificationSentAt ? `${formatDate(reservation.notificationSentAt)} ${formatTime(reservation.notificationSentAt)}` : 'Not sent',
            daysRemaining: reservation.claimExpiresAt
              ? `${Math.max(0, Math.ceil((new Date(reservation.claimExpiresAt).getTime() - Date.now()) / 86400000))} day(s)`
              : '--',
            activeQueueCount: reservationRows.filter(
              (item) => item.bookId === reservation.bookId && (item.status === 'Queued' || item.status === 'Notified'),
            ).length,
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

  const formatReservationDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    } catch {
      return 'Invalid Date'
    }
  }

  const immediateClaimExpiry = useMemo(() => {
    if (!selectedBook || selectedBook.availableCopies < 1) return null
    const queueDate = new Date(reservationDate)
    if (Number.isNaN(queueDate.getTime())) return null
    queueDate.setDate(queueDate.getDate() + claimPeriodDays)
    return formatReservationDate(queueDate.toISOString())
  }, [selectedBook, reservationDate, claimPeriodDays])

  const getStatusStyle = (status: ReservationStatus) => {
    switch (status) {
      case 'Queued': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
      case 'Notified': return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
      case 'Claimed': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
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
  const paginatedReservationIds = paginatedReservations.map((reservation) => reservation.id)
  const selectedCount = selectedReservationIds.size
  const allPageReservationsSelected = paginatedReservationIds.length > 0 && paginatedReservationIds.every((id) => selectedReservationIds.has(id))
  const somePageReservationsSelected = paginatedReservationIds.some((id) => selectedReservationIds.has(id))

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = somePageReservationsSelected && !allPageReservationsSelected
    }
  }, [allPageReservationsSelected, somePageReservationsSelected])

  useEffect(() => {
    setSelectedReservationIds((prev) => {
      const existingIds = new Set(reservations.map((reservation) => reservation.id))
      const next = new Set([...prev].filter((id) => existingIds.has(id)))
      return next.size === prev.size ? prev : next
    })
  }, [reservations])

  const handleTogglePageSelection = () => {
    setSelectedReservationIds((prev) => {
      const next = new Set(prev)
      if (allPageReservationsSelected) {
        paginatedReservationIds.forEach((id) => next.delete(id))
      } else {
        paginatedReservationIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  const handleToggleReservationSelection = (reservationId: string) => {
    setSelectedReservationIds((prev) => {
      const next = new Set(prev)
      if (next.has(reservationId)) {
        next.delete(reservationId)
      } else {
        next.add(reservationId)
      }
      return next
    })
  }

  const mapReservationsToRows = (
    rows: Awaited<ReturnType<typeof listReservations>>,
    loadedBooks: BookItem[],
    loadedMembers: MemberItem[],
  ): ReservationRow[] => {
    const toDate = (value: string) => new Date(value)
    const toStatus = (status: string): ReservationStatus =>
      status === 'Notified' || status === 'Claimed' || status === 'Expired' || status === 'Cancelled' ? status : 'Queued'
    const formatOptionalDateTime = (value: string | null) => {
      if (!value) return 'Not sent'
      const date = toDate(value)
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    }

    return rows.map((item) => {
      const matchedBook = loadedBooks.find((book) => book.id === item.bookId)
      const matchedMember = loadedMembers.find((member) => member.id === item.memberId)
      return {
        id: `RES-${String(item.id).padStart(5, '0')}`,
        bookId: item.bookId,
        memberId: item.memberId,
        reservationDateRaw: item.reservationDate,
        expiresOnRaw: item.expiresOn,
        queueDateRaw: item.queueDate,
        queuePosition: item.queuePosition,
        notificationSentAtRaw: item.notificationSentAt,
        claimExpiresAtRaw: item.claimExpiresAt,
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
          category: matchedBook?.category ?? 'Uncategorized',
          isbn: matchedBook?.isbn ?? 'Not provided',
          availableCopies: matchedBook?.availableCopies ?? 0,
          totalCopies: matchedBook?.totalCopies ?? 0,
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
        reservedOn: toDate(item.queueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        reservedTime: toDate(item.queueDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        status: toStatus(item.status),
        expiresOn: item.claimExpiresAt
          ? toDate(item.claimExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Not started',
        expiresTime: item.claimExpiresAt
          ? toDate(item.claimExpiresAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : '--',
        notificationSentAt: formatOptionalDateTime(item.notificationSentAt),
        daysRemaining: item.claimExpiresAt
          ? `${Math.max(0, Math.ceil((toDate(item.claimExpiresAt).getTime() - Date.now()) / 86400000))} day(s)`
          : '--',
        activeQueueCount: rows.filter(
          (reservation) => reservation.bookId === item.bookId && (reservation.status === 'Queued' || reservation.status === 'Notified'),
        ).length,
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
    if (!reservationDate) {
      setFormError('Queue date is required.')
      return
    }

    try {
      setFormError(null)
      setIsSavingReservation(true)
      const queueDateIso = editingReservation
        ? new Date(reservationDate).toISOString()
        : new Date().toISOString()
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
          reservationDate: queueDateIso,
          expiresOn: queueDateIso,
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
          reservationDate: queueDateIso,
          expiresOn: queueDateIso,
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
      setActionError(typeof error === 'string' ? error : 'Failed to update reservation status. Please try again.')
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

  const handleBulkDeleteConfirm = async () => {
    const selectedReservations = reservations.filter((reservation) => selectedReservationIds.has(reservation.id))
    if (selectedReservations.length === 0) return

    try {
      setActionError(null)
      await Promise.all(selectedReservations.map((reservation) => {
        const numericId = Number.parseInt(reservation.id.replace('RES-', ''), 10)
        if (Number.isNaN(numericId)) {
          throw new Error(`Invalid reservation id: ${reservation.id}`)
        }
        return deleteReservation(numericId)
      }))
      await refreshReservations()
      setSelectedReservationIds(new Set())
      setShowBulkDeleteConfirm(false)
    } catch (error) {
      console.error('Failed to delete selected reservations:', error)
      setActionError('Failed to delete selected reservations. Please try again.')
    }
  }

  const openEditReservation = (reservation: ReservationRow) => {
    const toInputDateTime = (value?: string) => {
      const parsed = value ? new Date(value) : null
      if (!parsed || Number.isNaN(parsed.getTime())) {
        return getInitialDateTime(0)
      }
      const offset = parsed.getTimezoneOffset()
      return new Date(parsed.getTime() - offset * 60_000).toISOString().slice(0, 16)
    }
    setEditingReservation(reservation)
    setReservationDate(toInputDateTime(reservation.reservationDateRaw))
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
  const handleExport = () => {
    const headers = ['ID', 'Book Title', 'Book Author', 'Member Name', 'Member ID', 'Queue Position', 'Queue Date', 'Notification Sent At', 'Claim Expiry', 'Status', 'Days Remaining', 'Pickup Branch']
    const csvContent = [
      headers.join(','),
      ...filteredReservations.map(res => [
        res.id,
        `"${res.book.title.replace(/"/g, '""')}"`,
        `"${res.book.author.replace(/"/g, '""')}"`,
        `"${res.member.name.replace(/"/g, '""')}"`,
        res.member.id,
        res.queuePosition ?? '',
        `"${res.reservedOn}"`,
        `"${res.notificationSentAt}"`,
        `"${res.expiresOn}"`,
        res.status,
        `"${res.daysRemaining}"`,
        `"${res.pickupBranch}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `reservations_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto ${isAddModalOpen || activeViewReservationId ? 'px-4 pt-4 pb-0' : 'p-4'} ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      {reservationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-6">Delete Reservation</h3>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Are you sure you want to delete <span className="font-semibold text-rose-500">"{reservationToDelete.id}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReservationToDelete(null)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
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
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-6">Delete Selected Reservations</h3>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Delete {selectedCount} selected reservation{selectedCount === 1 ? '' : 's'}? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(false)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDeleteConfirm}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Yes, Delete Selected
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
            onEdit={(res) => {
              openEditReservation(res);
              setActiveViewReservationId(null);
            }}
            onCancel={() => {
              updateReservationActionStatus(activeViewReservationId, 'Cancelled');
              setActiveViewReservationId(null);
            }}
          />
      ) : !isAddModalOpen ? (
        <section className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className={`text-4xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Reservations</h2>
              <p className={`mt-1 text-base font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>View and manage all book reservations.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => { setIsAddModalOpen(true); setEditingReservation(null); setSelectedBook(null); setSelectedMember(null); setReservationDate(getInitialDateTime(0)); setNotes(''); setPriority('Normal'); setNotifyEmail(true); setNotifySMS(true); setFormError(null); }} className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-sm">
                <Plus size={18} />
                New Reservation
              </button>
              <button type="button" onClick={handleExport} className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-bold transition-all ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {dynamicStats.map((stat) => {
              const Icon = stat.icon
              return (
                <article key={stat.label} className={`rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode ? 'border-zinc-700 bg-[#18181B] hover:border-emerald-500/60 hover:shadow-[0_12px_24px_-16px_rgba(16,185,129,0.45)]' : 'border-zinc-200 bg-white hover:border-emerald-200 hover:shadow-[0_12px_24px_-16px_rgba(15,23,42,0.35)]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.bg} ${stat.color}`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex flex-col">
                      <p className={`text-xs font-bold text-zinc-500 dark:text-zinc-400`}>{stat.label}</p>
                      <p className={`text-2xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{stat.value}</p>
                    </div>
                  </div>
                  <p className={`mt-3 text-[11px] font-bold ${stat.color === 'text-rose-600' || stat.color === 'text-violet-600' ? 'text-zinc-500 dark:text-zinc-400' : stat.color}`}>
                    {stat.subValue}
                  </p>
                </article>
              )
            })}
          </section>

          <div className={`mt-5 overflow-hidden lg:overflow-visible rounded-xl border ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className={`flex flex-wrap items-center gap-3 border-b p-3 rounded-t-xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
              <label className={`group flex h-12 min-w-[320px] flex-1 items-center rounded-xl border px-3 transition-all ${isDarkMode ? 'border-zinc-700 focus-within:border-emerald-500 bg-[#27272A]' : 'border-zinc-200 focus-within:border-emerald-500 bg-zinc-50'}`}>
                <Search size={18} className={`mr-2 transition-colors ${isDarkMode ? 'text-zinc-500 group-focus-within:text-emerald-400' : 'text-zinc-400 group-focus-within:text-emerald-600'}`} />
                <input
                  value={reservationSearch}
                  onChange={(event) => setReservationSearch(event.target.value)}
                  className={`w-full bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400'}`}
                  placeholder="Search by book title, member name..."
                />
              </label>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-500">Status</span>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as 'All' | ReservationStatus)}
                      className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}
                    >
                      <option value="All">All</option>
                      <option value="Queued">Queued</option>
                      <option value="Notified">Notified</option>
                      <option value="Claimed">Claimed</option>
                      <option value="Expired">Expired</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </div>

                

                <button
                  type="button"
                  onClick={() => {
                    setReservationSearch('')
                    setStatusFilter('All')
                    setBranchFilter('All Branches')
                  }}
                  className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-white'}`}
                >
                  <Filter size={16} />
                  Reset
                </button>
              </div>
            </div>
            {actionError ? (
              <div className={`border-b px-4 py-2 text-xs font-semibold ${isDarkMode ? 'border-zinc-700 bg-rose-500/10 text-rose-300' : 'border-zinc-200 bg-rose-50 text-rose-600'}`}>
                {actionError}
              </div>
            ) : null}

            {selectedCount > 0 && (
              <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 ${
                isDarkMode ? 'border-zinc-700 bg-emerald-500/10 text-zinc-200' : 'border-zinc-200 bg-emerald-50 text-zinc-700'
              }`}>
                <p className="text-sm font-semibold">{selectedCount} selected</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkDeleteConfirm(true)}
                    className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${
                      isDarkMode ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20' : 'border-rose-200 bg-white text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReservationIds(new Set())}
                    className={`grid h-9 w-9 place-items-center rounded-lg border ${
                      isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                    }`}
                    aria-label="Clear selection"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            )}

            <div className={`relative z-10 overflow-x-auto lg:overflow-visible ${isDarkMode ? 'bg-[#18181B]' : 'bg-white'}`}>
              <table className="w-full text-left text-sm border-collapse">
                <thead className={isDarkMode ? 'bg-[#27272A]/50 text-zinc-400' : 'bg-zinc-50/50 text-zinc-500'}>
                  <tr>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        className="app-choice-input"
                        checked={allPageReservationsSelected}
                        onChange={handleTogglePageSelection}
                        aria-label="Select all reservations on this page"
                      />
                    </th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Book Details</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Member</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Queue</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Expiration</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReservations.map((res) => (
                    <tr key={res.id} onClick={() => setActiveViewReservationId(res.id)} className={`cursor-pointer border-t transition-colors duration-150 ${isDarkMode ? 'border-zinc-800 hover:bg-zinc-800/30' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                      <td className="px-6 py-4 align-top" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="app-choice-input"
                          checked={selectedReservationIds.has(res.id)}
                          onChange={() => handleToggleReservationSelection(res.id)}
                          aria-label={`Select ${res.id}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`grid h-12 w-9 place-items-center overflow-hidden rounded border bg-zinc-100 text-base dark:border-zinc-700 dark:bg-zinc-800`}>
                            {res.book.coverUrl ? (
                              <img src={res.book.coverUrl} alt={`${res.book.title} cover`} className="h-full w-full object-cover" />
                            ) : (
                              res.book.cover
                            )}
                          </span>
                          <div>
                            <p className={`font-semibold text-sm ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{res.book.title}</p>
                            <p className={`text-[11px] font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{res.book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`grid h-9 w-9 place-items-center overflow-hidden rounded-full text-xs font-bold ${isDarkMode ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-700'}`}>
                            {res.member.profilePhotoData ? (
                              <img src={res.member.profilePhotoData} alt={`${res.member.name} profile`} className="h-full w-full object-cover" />
                            ) : (
                              res.member.avatar
                            )}
                          </span>
                          <div>
                            <p className={`font-semibold text-sm ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{res.member.name}</p>
                            <p className={`text-[11px] font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{res.member.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`grid h-9 min-w-9 place-items-center rounded-lg text-sm font-black ${
                            res.queuePosition
                              ? isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'
                              : isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-100 text-zinc-500'
                          }`}>
                            {res.queuePosition ? `#${res.queuePosition}` : '--'}
                          </span>
                          <div>
                            <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{res.reservedOn}</p>
                            <p className={`text-[10px] font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{res.reservedTime} - {res.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {res.status === 'Notified' ? (
                          <>
                            <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{res.expiresOn}</p>
                            <p className={`text-[10px] font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{res.expiresTime}</p>
                          </>
                        ) : (
                          <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{res.expiresOn}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-md px-3 py-1 text-[11px] font-semibold tracking-wide ${getStatusStyle(res.status)}`}>{res.status}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <ReservationActionsMenu
                          isDarkMode={isDarkMode}
                          status={res.status}
                          onViewDetails={() => setActiveViewReservationId(res.id)}
                          onEdit={() => openEditReservation(res)}
                          onNotify={() => updateReservationActionStatus(res.id, 'Notified')}
                          onComplete={() => {
                            if (onNavigateToBorrow && res.memberId && res.bookId) {
                              onNavigateToBorrow(res.memberId, res.bookId)
                            }
                          }}
                          onCancel={() => updateReservationActionStatus(res.id, 'Cancelled')}
                          onDelete={() => setReservationToDelete(res)}
                        />
                      </td>
                    </tr>
                  ))}
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={`px-6 py-12 text-center text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        No reservations match your current filters.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className={`relative z-0 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-600'}`}>
              <p>Showing {filteredReservations.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredReservations.length)} of {filteredReservations.length} reservations</p>
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
        </section>
      ) : (
        <section className="px-5 pt-5 pb-0">
          {/* Form Header with Circular Back Button */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setIsAddModalOpen(false); setEditingReservation(null) }}
                className={`inline-flex items-center gap-1.5 font-semibold ${isDarkMode ? 'text-zinc-300 hover:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                <ArrowLeft size={15} />
                Reservations
              </button>
              <span className={isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}>{'>'}</span>
              <span className={isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}>{editingReservation ? 'Edit Reservation' : 'Add New Reservation'}</span>
            </div>
          </div>

          <h2 className={`text-[38px] font-black leading-tight tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}`}>{editingReservation ? 'Edit Reservation' : 'Add New Reservation'}</h2>
          <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{editingReservation ? `Update reservation ${editingReservation.id}` : 'Create a reservation for a book'}</p>

          <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
            {/* 60 / 40 Responsive Desktop Grid */}
            <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
              <div className="space-y-4">
                <article className={`rounded-2xl border p-5 sm:p-6 ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
                  
                  {/* 1. Select Member */}
                  <div className="relative space-y-2" ref={memberDropdownRef}>
                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}`}>1. Select Member</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} mt-0.5`}>Search and select a member.</p>
                    
                    <div className="mt-3.5">
                      <label className={`group flex h-11 items-center rounded-xl border px-3 transition-all ${
                        selectedMember
                          ? (isDarkMode ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-emerald-500 bg-emerald-50/50')
                          : (isDarkMode ? 'border-zinc-700 focus-within:border-emerald-500 bg-[#27272A]/30' : 'border-zinc-200 focus-within:border-emerald-500 bg-white')
                      }`}>
                        {selectedMember ? (
                          <Check size={16} className="mr-2 text-emerald-500 animate-[scaleIn_0.2s_ease-out]" />
                        ) : (
                          <Search size={16} className={`mr-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
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
                          className={`w-full bg-transparent text-xs outline-none ${selectedMember ? 'font-semibold text-emerald-600 dark:text-emerald-400' : (isDarkMode ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400')}`}
                        />
                        {selectedMember && (
                          <span className="mr-2 shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-[fadeIn_0.15s_ease-out]">
                            Selected
                          </span>
                        )}
                        <ChevronDown size={16} className={selectedMember ? 'text-emerald-500' : (isDarkMode ? 'text-zinc-400' : 'text-zinc-500')} />
                      </label>
                    </div>

                    {showMemberDropdown && (
                      <div className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border p-1.5 shadow-xl ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}>
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
                              className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}
                            >
                              <span className={`grid h-8 w-8 place-items-center overflow-hidden rounded-full text-[11px] font-bold ${isDarkMode ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-700'}`}>
                                {m.profilePhotoData ? (
                                  <img src={m.profilePhotoData} alt={`${m.name} profile`} className="h-full w-full object-cover" />
                                ) : (
                                  m.avatar
                                )}
                              </span>
                              <div className="flex-1">
                                <p className={isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}>{m.name}</p>
                                <p className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{m.memberId} • {m.type}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className={`p-3 text-center text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>No members found</p>
                        )}
                      </div>
                    )}

                    {selectedMember && (
                      <div className={`relative rounded-xl border p-3 animate-[fadeIn_0.15s_ease-out] ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-zinc-50/40'}`}>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full text-base ${isDarkMode ? 'bg-zinc-800' : 'bg-white border'}`}>
                              {selectedMember.profilePhotoData ? (
                                <img src={selectedMember.profilePhotoData} alt={`${selectedMember.name} profile`} className="h-full w-full object-cover" />
                              ) : (
                                selectedMember.avatar
                              )}
                            </span>
                            <div className="min-w-0">
                              <p className={`truncate font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{selectedMember.name}</p>
                              <p className={`truncate text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{selectedMember.memberId} • {selectedMember.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 md:gap-6">
                            <div className="text-xs md:text-center">
                              <p className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}>Borrowed Books</p>
                              <p className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>{selectedMember.borrowedCount}</p>
                            </div>
                            <div className="text-xs md:text-center">
                              <p className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}>Available Limit</p>
                              <p className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>{selectedMember.limit}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedMember(null)}
                              className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'}`}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className={`my-5 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`} />

                  {/* 2. Select Book */}
                  <div className="relative space-y-2" ref={bookDropdownRef}>
                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}`}>2. Select Book</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} mt-0.5`}>Search and select a book to reserve.</p>
                    
                    <div className="mt-3.5">
                      <label className={`group flex h-11 items-center rounded-xl border px-3 transition-all ${
                        selectedBook
                          ? (isDarkMode ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-emerald-500 bg-emerald-50/50')
                          : (isDarkMode ? 'border-zinc-700 focus-within:border-emerald-500 bg-[#27272A]/30' : 'border-zinc-200 focus-within:border-emerald-500 bg-white')
                      }`}>
                        {selectedBook ? (
                          <Check size={16} className="mr-2 text-emerald-500 animate-[scaleIn_0.2s_ease-out]" />
                        ) : (
                          <Search size={16} className={`mr-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
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
                          className={`w-full bg-transparent text-xs outline-none ${selectedBook ? 'font-semibold text-emerald-600 dark:text-emerald-400' : (isDarkMode ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400')}`}
                        />
                        {selectedBook && (
                          <span className="mr-2 shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-[fadeIn_0.15s_ease-out]">
                            Selected
                          </span>
                        )}
                        <ChevronDown size={16} className={selectedBook ? 'text-emerald-500' : (isDarkMode ? 'text-zinc-400' : 'text-zinc-500')} />
                      </label>
                    </div>

                    {showBookDropdown && (
                      <div className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border p-1.5 shadow-xl ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}>
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
                              className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}
                            >
                              <img src={b.coverUrl} alt={b.title} className="w-8 h-11 rounded object-cover border shrink-0" />
                              <div className="flex-1">
                                <p className={isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}>{b.title}</p>
                                <p className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{b.author} • {b.isbn}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className={`p-3 text-center text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>No books found</p>
                        )}
                      </div>
                    )}

                    {selectedBook && (
                      <div className={`relative rounded-xl border p-3 animate-[fadeIn_0.15s_ease-out] ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-zinc-50/40'}`}>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-11 h-16 rounded object-cover border border-zinc-200 dark:border-zinc-800 shrink-0" />
                            <div>
                              <p className={`font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{selectedBook.title}</p>
                              <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Author: {selectedBook.author}</p>
                              <p className={`mt-1 text-xs ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>ISBN: {selectedBook.isbn} • Copy ID: {selectedBook.copyId}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 md:gap-6">
                            <div className="text-right text-xs">
                              <p className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}>Available Copies</p>
                              <p className={`text-xl font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>{selectedBook.availableCopies}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedBook(null)}
                              className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'}`}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className={`my-5 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`} />

                  {/* 3. Reservation Details */}
                  <div>
                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}`}>3. Reservation Details</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} mt-0.5`}>Provide reservation information.</p>
                    
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Queue Date</label>
                        <div className={`mt-1.5 flex h-11 items-center gap-2 rounded-xl border px-3.5 focus-within:border-emerald-500 ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-white'}`}>
                          <Calendar size={16} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                          <input type="datetime-local" value={reservationDate}
                            onChange={(e) => setReservationDate(e.target.value)}
                            readOnly={!editingReservation}
                            className={`w-full bg-transparent outline-none text-xs font-semibold ${!editingReservation ? 'cursor-default' : ''} ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Claim Period</label>
                        <div className={`mt-1.5 flex min-h-11 items-center gap-2 rounded-xl border px-3.5 ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-zinc-50'}`}>
                          <Clock3 size={16} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                          <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                            {selectedBook?.availableCopies
                              ? immediateClaimExpiry ?? 'Calculating expiration...'
                              : 'Starts only after the book becomes available and the member is notified.'}
                          </span>
                        </div>
                      </div>


                    </div>

                    <div className="mt-5 grid gap-5">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between">
                          <label className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Notes (Optional)</label>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            notes.length >= 180 
                              ? 'bg-rose-500/10 text-rose-500'
                              : isDarkMode ? 'bg-[#27272A] text-zinc-400' : 'bg-zinc-100 text-zinc-500'
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
                                ? 'border-zinc-700 bg-[#27272A]/30 text-zinc-100 placeholder:text-zinc-500 focus:bg-[#27272A]/50' 
                                : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400 focus:shadow-[0_4px_16px_rgba(16,185,129,0.05)]'
                            }`} 
                            placeholder="Add any internal library staff notes, pickup instructions, or special requests..." 
                          />
                          <BookOpen size={14} className={`absolute left-3.5 top-3.5 transition-colors duration-200 ${
                            notes.length > 0 
                              ? 'text-emerald-500' 
                              : isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>



                </article>
              </div>

              {/* Right Column Summary (40% width) */}
              <aside className="space-y-4">
                <article className={`rounded-2xl border p-5 ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
                  <h3 className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}`}>Reservation Summary</h3>
                  <hr className={`my-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`} />
                  
                  {/* Book Information Card */}
                  <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200/80 bg-white'}`}>
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
                                isDarkMode ? 'border-zinc-700/60' : 'border-zinc-200'
                              }`} 
                            />
                          </div>
                        </div>
                        <div className="col-span-7 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className={`font-bold text-xs sm:text-sm leading-tight truncate ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{selectedBook?.title}</h4>
                            <p className="text-[11px] font-semibold text-zinc-400 mt-0.5">{selectedBook?.author}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] leading-tight">
                            <div className={`p-2 rounded-lg border transition-all ${
                              isDarkMode ? 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700' : 'bg-zinc-50/60 border-zinc-100 hover:border-zinc-200/80'
                            }`}>
                              <span className="text-zinc-400 font-bold block text-[8px] uppercase tracking-wider">Category</span>
                              <span className={`font-extrabold block mt-0.5 truncate ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{selectedBook?.category}</span>
                            </div>
                            
                            <div className={`p-2 rounded-lg border transition-all ${
                              isDarkMode ? 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700' : 'bg-zinc-50/60 border-zinc-100 hover:border-zinc-200/80'
                            }`}>
                              <span className="text-zinc-400 font-bold block text-[8px] uppercase tracking-wider">ISBN</span>
                              <span className={`font-mono font-extrabold block mt-0.5 truncate ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{selectedBook?.isbn}</span>
                            </div>
                            
                            <div className={`col-span-2 p-2 rounded-lg border transition-all ${
                              isDarkMode ? 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700' : 'bg-zinc-50/60 border-zinc-100 hover:border-zinc-200/80'
                            }`}>
                              <span className="text-zinc-400 font-bold block text-[8px] uppercase tracking-wider">Reservations</span>
                              <span className="font-extrabold block mt-0.5 text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse inline-block"></span>
                                {reservations.filter(r => r.bookId === selectedBook?.id && (r.status === 'Queued' || r.status === 'Notified')).length} waiting
                              </span>
                            </div>
                            

                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 flex flex-col items-center justify-center text-center">
                        <div className={`h-10 w-10 rounded-full grid place-items-center mb-2.5 transition-all ${
                          isDarkMode ? 'bg-[#27272A] text-emerald-400/70' : 'bg-emerald-50 text-emerald-600/70'
                        }`}>
                          <BookOpen size={16} className="animate-pulse" />
                        </div>
                        <p className={`text-xs font-bold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>No Book Selected</p>
                        <p className={`text-[10px] font-semibold mt-1 max-w-[210px] leading-relaxed ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          Search and select a book from the list on the left to see details.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Member Information Card */}
                  <div className={`rounded-xl border overflow-hidden mt-4 ${isDarkMode ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200/80 bg-white'}`}>
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
                                ? 'bg-zinc-900/80 border-zinc-700/60 text-zinc-100' 
                                : 'bg-zinc-50 border-zinc-200/80 text-zinc-800'
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
                            <h4 className={`font-bold text-xs sm:text-sm leading-tight truncate ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{selectedMember?.name}</h4>
                            <p className="text-[10px] font-bold text-zinc-400 mt-0.5 font-mono">{selectedMember?.memberId}</p>
                          </div>
                          
                          <div className="space-y-2 mt-3 text-[11px] leading-tight">
                            <div className="grid grid-cols-2 gap-2">
                              <div className={`p-2 rounded-lg border flex items-center gap-1.5 transition-all ${
                                isDarkMode ? 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700' : 'bg-zinc-50/60 border-zinc-100 hover:border-zinc-200/80'
                              }`}>
                                <Smartphone size={12} className="text-zinc-400 shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-[7.5px] font-bold text-zinc-400 block uppercase tracking-wider">Phone</span>
                                  <span className={`font-extrabold truncate block text-[10px] ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{selectedMember?.phone}</span>
                                </div>
                              </div>

                              <div className={`p-2 rounded-lg border flex items-center gap-1.5 transition-all ${
                                isDarkMode ? 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700' : 'bg-zinc-50/60 border-zinc-100 hover:border-zinc-200/80'
                              }`}>
                                <Mail size={12} className="text-zinc-400 shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-[7.5px] font-bold text-zinc-400 block uppercase tracking-wider">Email</span>
                                  <span className={`font-extrabold truncate block text-[10px] ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`} title={selectedMember?.email}>{selectedMember?.email}</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className={`p-2 rounded-lg border transition-all ${
                                isDarkMode ? 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700' : 'bg-zinc-50/60 border-zinc-100 hover:border-zinc-200/80'
                              }`}>
                                <span className="text-[7.5px] font-bold text-zinc-400 block uppercase tracking-wider">Borrowed Count</span>
                                <span className={`font-extrabold block mt-0.5 text-[10px] ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                  {selectedMember?.borrowedCount} / 5 books
                                </span>
                              </div>

                              <div className={`p-2 rounded-lg border transition-all ${
                                isDarkMode ? 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700' : 'bg-zinc-50/60 border-zinc-100 hover:border-zinc-200/80'
                              }`}>
                                <span className="text-[7.5px] font-bold text-zinc-400 block uppercase tracking-wider">Membership Status</span>
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
                          isDarkMode ? 'bg-[#27272A] text-blue-400/70' : 'bg-blue-50 text-blue-600/70'
                        }`}>
                          <UserRound size={16} className="animate-pulse" />
                        </div>
                        <p className={`text-xs font-bold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>No Member Selected</p>
                        <p className={`text-[10px] font-semibold mt-1 max-w-[210px] leading-relaxed ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          Search and select a member from the list on the left to see details.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Reservation Info Card */}
                  <div className={`rounded-xl border overflow-hidden mt-4 ${isDarkMode ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200/80 bg-white'}`}>
                    <div className={`px-4 py-2.5 flex items-center gap-2 border-b font-bold text-xs ${isDarkMode ? 'bg-amber-950/35 border-amber-900/30 text-amber-400' : 'bg-amber-50/70 border-amber-100/80 text-amber-800'}`}>
                      <Calendar size={14} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                      <span>Reservation Overview</span>
                    </div>
                    <div className="p-4 flex flex-col gap-2.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400 font-bold">Queue Date</span>
                        <span className={`font-extrabold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{formatReservationDate(reservationDate)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400 font-bold">Claim Expiry</span>
                        <span className={`font-extrabold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          {immediateClaimExpiry ?? 'Starts after notification'}
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
                    <span>
                      {selectedBook?.availableCopies
                        ? `This book is available. The member will be notified immediately and has ${claimPeriodDays} day${claimPeriodDays === 1 ? '' : 's'} to claim it.`
                        : 'The member will be notified when the book becomes available for pickup.'}
                    </span>
                  </div>
                </article>
              </aside>
            </div>

            <div className={`-mx-9 sticky bottom-0 mt-5 border-t px-9 py-4 ${
              isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
            }`}>
              <div className="flex justify-end gap-3">
                {formError ? (
                  <p className="mr-auto self-center text-xs font-semibold text-rose-500">{formError}</p>
                ) : null}
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingReservation(null) }}
                  className={`h-11 rounded-lg border px-8 text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'}`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  onClick={handleCreateReservation}
                  disabled={isSavingReservation}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-700 px-8 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Calendar size={16} />
                  {isSavingReservation ? 'Saving...' : editingReservation ? 'Save Changes' : 'Create Reservation'}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}
    </div>
  )
}
