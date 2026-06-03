import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Copy,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Send,
  User,
  UserCheck,
  X,
} from 'lucide-react'
import bookCover from '../assets/login.avif'
import { SendEmailModal } from '../components/modals/SendEmailModal'
import { mockMembersData } from './memberDetailData'
import { listBorrowTransactions, listMembers, sendManualEmailReminder, updateMember, type Member as DbMember } from '../lib/tauriApi'
import type { LoanItem } from './memberDetailData'

type Props = {
  isDarkMode: boolean
  onBack: () => void
  memberId?: number
}

export function MemberDetailPage({ isDarkMode, onBack, memberId }: Props) {
  const [dbMember, setDbMember] = useState<DbMember | null>(null)
  const [currentLoans, setCurrentLoans] = useState<LoanItem[]>([])
  const [toast, setToast] = useState('')
  const [loadingMember, setLoadingMember] = useState(true)
  const d = useMemo(() => {
    if (dbMember) {
      const dateJoined = dbMember.createdAt
        ? new Date(dbMember.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : 'N/A'
      return {
        name: dbMember.fullName,
        memberId: dbMember.memberId,
        email: dbMember.email || 'n/a',
        phone: dbMember.contactNumber || 'n/a',
        address: dbMember.address || 'n/a',
        initials: dbMember.fullName
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() || '')
          .join('') || 'MB',
        avatarColor: 'bg-emerald-500',
        type: dbMember.memberType,
        department: dbMember.department || 'General',
        status: (dbMember.status as 'Active' | 'Inactive' | 'Suspended') || 'Active',
        dateJoined,
        memberSince: 'N/A',
        lastUpdated: 'Synced from database',
        totalLoans: dbMember.borrowed,
        currentLoans: currentLoans.length,
        reservationsCount: 0,
        fines: 'PHP 0.00',
        loansList: currentLoans,
        reservationsList: [],
        notes: [],
        activities: [
          {
            dateTime: dbMember.createdAt
              ? new Date(dbMember.createdAt).toLocaleString('en-US')
              : 'N/A',
            activity: 'Member Registered',
            description: 'Member profile stored in database',
            performedBy: 'System',
          },
        ],
      }
    }
    return mockMembersData[memberId && mockMembersData[memberId] ? memberId : 1]
  }, [currentLoans, dbMember, memberId])

  const [member, setMember] = useState({ ...d, profileImage: bookCover })
  const [copied, setCopied] = useState(false)
  const [notes, setNotes] = useState(member.notes)
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: d.name,
    email: d.email,
    phone: d.phone,
    address: d.address,
    type: d.type,
    department: d.department,
    status: d.status,
  })
  const [editPhotoPreview, setEditPhotoPreview] = useState<string>(bookCover)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoadingMember(true)
      try {
        const rows = await listMembers(1000)
        const found = typeof memberId === 'number' ? rows.find((row) => row.id === memberId) ?? null : null
        if (mounted) {
          setDbMember(found)
        }
      } catch {
        if (mounted) {
          setDbMember(null)
        }
      } finally {
        if (mounted) {
          setLoadingMember(false)
        }
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [memberId])

  useEffect(() => {
    let mounted = true
    const loadLoans = async () => {
      if (!dbMember) {
        setCurrentLoans([])
        return
      }
      try {
        const rows = await listBorrowTransactions('Active', 500)
        const today = new Date()
        const loans = rows
          .filter((row) => row.memberId === dbMember.id && !row.returnDate)
          .map((row) => {
            const due = new Date(row.dueDate)
            const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86400000)
            const status = diffDays < 0 ? 'Overdue' : diffDays <= 2 ? 'Due Soon' : 'Normal'
            const statusLabel = diffDays < 0 ? `${Math.abs(diffDays)} day(s) overdue` : diffDays === 0 ? 'Due today' : diffDays <= 2 ? `Due in ${diffDays} day(s)` : 'On Time'
            return {
              id: row.id,
              title: row.bookTitle,
              author: 'Library collection',
              dueDate: due.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
              status,
              statusLabel,
            } as LoanItem
          })
        if (mounted) setCurrentLoans(loans)
      } catch {
        if (mounted) setCurrentLoans([])
      }
    }
    void loadLoans()
    return () => {
      mounted = false
    }
  }, [dbMember])

  useEffect(() => {
    setMember({
      ...d,
      profileImage: dbMember?.profilePhotoData || bookCover,
    })
    setNotes(d.notes)
  }, [d, dbMember])

  const copyId = async () => {
    await navigator.clipboard.writeText(member.memberId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const handleSendLoanReminder = async (loan: LoanItem) => {
    try {
      const message = await sendManualEmailReminder(loan.id)
      setToast(message)
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'Failed to send email reminder.')
    }
    window.setTimeout(() => setToast(''), 3000)
  }

  const saveNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    setNotes((p) => [...p, newNote.trim()])
    setNewNote('')
    setAddingNote(false)
  }

  const openEditModal = () => {
    setEditError(null)
    setEditForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      type: member.type,
      department: member.department,
      status: member.status,
    })
    setEditPhotoPreview(member.profileImage ?? bookCover)
    setIsEditOpen(true)
  }

  const saveEditMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dbMember) {
      setMember((prev) => ({
        ...prev,
        name: editForm.name.trim() || prev.name,
        email: editForm.email.trim() || prev.email,
        phone: editForm.phone.trim() || prev.phone,
        address: editForm.address.trim() || prev.address,
        type: editForm.type.trim() || prev.type,
        department: editForm.department.trim() || prev.department,
        status: editForm.status,
        profileImage: editPhotoPreview,
        lastUpdated: 'Updated just now by Admin User',
      }))
      setIsEditOpen(false)
      return
    }

    setIsSavingEdit(true)
    setEditError(null)
    try {
      await updateMember({
        id: dbMember.id,
        fullName: editForm.name.trim() || dbMember.fullName,
        memberType: editForm.type.trim() || dbMember.memberType,
        department: editForm.department.trim() || null,
        contactNumber: editForm.phone.trim() || null,
        email: editForm.email.trim() || null,
        address: editForm.address.trim() || null,
        profilePhotoData: editPhotoPreview || null,
        status: editForm.status,
      })

      const rows = await listMembers(1000)
      const updated = rows.find((row) => row.id === dbMember.id) ?? null
      if (updated) {
        setDbMember(updated)
      }
      setIsEditOpen(false)
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Failed to save profile.')
    } finally {
      setIsSavingEdit(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditPhotoPreview(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const cardClass = isDarkMode
    ? 'rounded-2xl border border-zinc-800 bg-[#18181B]/80'
    : 'rounded-2xl border border-zinc-200 bg-white'

  return (
    <div className={`flex-1 overflow-y-auto min-h-0 w-full ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <div className="max-w-[1600px] mx-auto p-6 space-y-5">
        {toast ? (
          <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${isDarkMode ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
            {toast}
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className={`inline-flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
          >
            <ArrowLeft size={16} />
            Back to Members
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-2 rounded-xl h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
            >
              <Pencil size={15} />
              Edit Member
            </button>
          </div>
        </div>

        <section className={cardClass}>
          <div className="p-6 xl:p-8 grid grid-cols-1 xl:grid-cols-[1.33fr_1fr_1fr] gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-8 min-w-0">
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="h-32 w-32 rounded-full bg-zinc-200 overflow-hidden">
                  <img src={member.profileImage ?? bookCover} alt={member.name} className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className={`text-[35px] font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{member.name}</h2>
                {loadingMember ? (
                  <p className={`mt-1 text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Loading member details...</p>
                ) : null}
                <div className="mt-1 flex items-center gap-1.5">
                  <p className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}>Member ID: {member.memberId}</p>
                  <button onClick={copyId} className={isDarkMode ? 'text-zinc-400 hover:text-emerald-400' : 'text-zinc-500 hover:text-emerald-600'}>
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>

                <div className={`mt-5 space-y-2 text-sm ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  <p className="flex items-center gap-2.5"><Mail size={15} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />{member.email}</p>
                  <p className="flex items-center gap-2.5"><Phone size={15} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />{member.phone}</p>
                  <p className="flex items-start gap-2.5"><MapPin size={15} className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} mt-0.5`} /><span>{member.address}</span></p>
                </div>
              </div>
            </div>

            <div className={`space-y-4 xl:px-8 ${isDarkMode ? 'xl:border-x xl:border-zinc-800' : 'xl:border-x xl:border-zinc-200'}`}>
              <Meta icon={<User size={15} className="text-emerald-500" />} label="Member Type" value={member.type} isDarkMode={isDarkMode} />
              <Meta icon={<GraduationCap size={15} className="text-emerald-500" />} label="Department / Course" value={member.department} isDarkMode={isDarkMode} />
              <Meta icon={<UserCheck size={15} className="text-emerald-500" />} label="Status" value={member.status} isDarkMode={isDarkMode} asBadge />
            </div>
            <div className="space-y-4">
              <Meta icon={<Calendar size={15} className="text-emerald-500" />} label="Date Joined" value={member.dateJoined} isDarkMode={isDarkMode} />
              <Meta icon={<Clock size={15} className="text-emerald-500" />} label="Member Since" value={member.memberSince} isDarkMode={isDarkMode} />
              <Meta icon={<RefreshCw size={15} className="text-emerald-500" />} label="Last Updated" value={member.lastUpdated} isDarkMode={isDarkMode} />
            </div>

          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <section className={cardClass}>
            <CardHeader title="Current Loans" count={`${d.loansList.length} Item(s)`} isDarkMode={isDarkMode} />
            <div className="px-6 pb-5">
              {d.loansList.length > 0 ? (
                d.loansList.map((loan) => (
                  <div key={loan.id} className={`py-3 flex items-center gap-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'} border-b last:border-b-0`}>
                    <img src={bookCover} alt={loan.title} className="h-16 w-12 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{loan.title}</p>
                      <p className={isDarkMode ? 'text-xs text-zinc-400' : 'text-xs text-zinc-500'}>{loan.author}</p>
                    </div>
                    <div className="text-right mr-2">
                      <p className={isDarkMode ? 'text-xs text-zinc-400' : 'text-xs text-zinc-500'}>Due Date</p>
                      <p className={`text-sm font-semibold ${loan.status === 'Overdue' ? 'text-rose-500' : ''}`}>{loan.dueDate}</p>
                    </div>
                    <span className={`text-xs font-semibold rounded-lg px-3 py-1.5 ${loan.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{loan.statusLabel}</span>
                    <button
                      type="button"
                      onClick={() => { void handleSendLoanReminder(loan) }}
                      className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
                    >
                      <Send size={13} />
                      Email
                    </button>
                  </div>
                ))
              ) : (
                <div className={`mt-4 overflow-hidden rounded-2xl border ${isDarkMode ? 'border-emerald-900/45 bg-[radial-gradient(circle_at_18%_22%,rgba(16,185,129,0.14),transparent_44%),linear-gradient(145deg,#0a162b_0%,#0b1220_100%)]' : 'border-emerald-100 bg-[radial-gradient(circle_at_18%_22%,rgba(16,185,129,0.12),transparent_44%),linear-gradient(145deg,#f8fffc_0%,#f1f5f9_100%)]'}`}>
                  <div className={`flex items-start gap-4 p-6 ${isDarkMode ? 'backdrop-blur-[1px]' : ''}`}>
                    <div className={`grid h-12 w-12 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/35' : 'bg-white text-emerald-600 ring-1 ring-emerald-200'}`}>
                      <BookOpen size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>No current loans</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>All clear</span>
                      </div>
                      <p className={`mt-1 text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        This member does not have any borrowed books right now.
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button className={`inline-flex h-8 items-center rounded-lg px-3 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                          Start New Borrow
                        </button>
                        <span className={`text-[11px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>No overdue items detected</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="pt-3 text-right">
                <button className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700">View all loans <ArrowUpRight size={14} /></button>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <CardHeader title="Membership Summary" isDarkMode={isDarkMode} />
            <div className="px-6 pb-5">
              <div className={`grid grid-cols-2 sm:grid-cols-4 ${isDarkMode ? 'divide-zinc-800' : 'divide-zinc-200'} divide-x`}>
                <Summary icon={<BookOpen size={17} className="text-emerald-500" />} value={String(d.totalLoans)} label="Total Loans" sub="(All Time)" />
                <Summary icon={<Bookmark size={17} className="text-indigo-500" />} value={String(d.currentLoans)} label="Books Currently" sub="Borrowed" />
                <Summary icon={<Calendar size={17} className="text-amber-500" />} value={String(d.reservationsCount)} label="Reservations" />
                <Summary icon={<Activity size={17} className="text-rose-500" />} value={d.fines} label="Fines & Penalties" />
              </div>
              <div className={`mt-5 rounded-xl border px-4 py-3 flex justify-between ${isDarkMode ? 'border-zinc-800 text-zinc-300' : 'border-zinc-200 text-zinc-600'}`}>
                <span className="text-sm">Payments Made</span>
                <span className="text-sm font-bold">PHP 0.00</span>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <CardHeader title="Recent Reservations" count={`${d.reservationsList.length} Item(s)`} isDarkMode={isDarkMode} />
            <div className="px-6 pb-5">
              {d.reservationsList.length > 0 ? (
                d.reservationsList.map((reservation) => (
                  <div key={reservation.id} className={`py-3 flex items-center gap-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'} border-b last:border-b-0`}>
                    <img src={bookCover} alt={reservation.title} className="h-16 w-12 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{reservation.title}</p>
                      <p className={isDarkMode ? 'text-xs text-zinc-400' : 'text-xs text-zinc-500'}>{reservation.author}</p>
                    </div>
                    <div className="text-right mr-2">
                      <p className={isDarkMode ? 'text-xs text-zinc-400' : 'text-xs text-zinc-500'}>Reserved On</p>
                      <p className="text-sm font-semibold">{reservation.reservedOn}</p>
                    </div>
                    <span className="text-xs font-semibold rounded-lg px-3 py-1.5 bg-indigo-100 text-indigo-700">{reservation.statusLabel}</span>
                  </div>
                ))
              ) : (
                <div className={`mt-4 overflow-hidden rounded-2xl border ${isDarkMode ? 'border-indigo-900/45 bg-[radial-gradient(circle_at_18%_22%,rgba(99,102,241,0.16),transparent_44%),linear-gradient(145deg,#0a162b_0%,#0b1220_100%)]' : 'border-indigo-100 bg-[radial-gradient(circle_at_18%_22%,rgba(99,102,241,0.12),transparent_44%),linear-gradient(145deg,#f8fbff_0%,#f1f5f9_100%)]'}`}>
                  <div className={`flex items-start gap-4 p-6 ${isDarkMode ? 'backdrop-blur-[1px]' : ''}`}>
                    <div className={`grid h-12 w-12 place-items-center rounded-xl ${isDarkMode ? 'bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/35' : 'bg-white text-indigo-600 ring-1 ring-indigo-200'}`}>
                      <Bookmark size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>No recent reservations</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>Quiet</span>
                      </div>
                      <p className={`mt-1 text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        This member has not placed any reservations yet.
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button className={`inline-flex h-8 items-center rounded-lg px-3 text-xs font-semibold ${isDarkMode ? 'bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}>
                          Create Reservation
                        </button>
                        <span className={`text-[11px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>No pending queue requests</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="pt-3 text-right">
                <button className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700">View all reservations <ArrowUpRight size={14} /></button>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <CardHeader title="Notes" isDarkMode={isDarkMode} />
            <div className="px-6 pt-5 pb-5">
              {notes.length === 0 && !addingNote ? (
                <div className={`rounded-xl border p-5 ${isDarkMode ? 'border-emerald-950 bg-emerald-950/20' : 'border-emerald-100 bg-emerald-50/60'}`}>
                  <p className={isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}>No notes added yet.</p>
                  <button
                    onClick={() => setAddingNote(true)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl px-4 h-9 text-sm font-semibold border border-emerald-500/35 text-emerald-600 bg-white"
                  >
                    <Plus size={14} />
                    Add Note
                  </button>
                </div>
              ) : null}

              {notes.length > 0 ? (
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {notes.map((note, index) => (
                    <div key={`${note}-${index}`} className={`p-3 rounded-xl border text-sm ${isDarkMode ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-50'}`}>
                      {note}
                    </div>
                  ))}
                </div>
              ) : null}

              {addingNote ? (
                <form onSubmit={saveNote} className="mt-3 space-y-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    className={`w-full rounded-xl border p-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-zinc-900 text-zinc-100' : 'border-zinc-200 bg-white text-zinc-700'}`}
                    placeholder="Type your note here..."
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setAddingNote(false)} className={`h-9 px-4 rounded-xl border text-sm ${isDarkMode ? 'border-zinc-700 text-zinc-300' : 'border-zinc-200 text-zinc-600'}`}>Cancel</button>
                    <button type="submit" className="h-9 px-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold">Save Note</button>
                  </div>
                </form>
              ) : null}
            </div>
          </section>
        </div>

        <section className={cardClass}>
          <CardHeader title="Recent Activity" isDarkMode={isDarkMode} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className={isDarkMode ? 'bg-zinc-900/40 text-zinc-400' : 'bg-zinc-50 text-zinc-600'}>
                  <th className="text-left px-6 py-3 font-semibold">Date & Time</th>
                  <th className="text-left px-6 py-3 font-semibold">Activity</th>
                  <th className="text-left px-6 py-3 font-semibold">Description</th>
                  <th className="text-left px-6 py-3 font-semibold">Performed By</th>
                </tr>
              </thead>
              <tbody>
                {d.activities.map((act, i) => (
                  <tr key={`${act.activity}-${i}`} className={isDarkMode ? 'border-t border-zinc-800' : 'border-t border-zinc-100'}>
                    <td className={isDarkMode ? 'px-6 py-3 text-zinc-400' : 'px-6 py-3 text-zinc-500'}>{act.dateTime}</td>
                    <td className="px-6 py-3">{act.activity}</td>
                    <td className="px-6 py-3">{act.description}</td>
                    <td className="px-6 py-3">{act.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 text-right">
            <button className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700">View full activity log <ArrowUpRight size={14} /></button>
          </div>
        </section>
      </div>
      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        member={{ id: memberId || 0, fullName: member.name, email: member.email !== 'n/a' ? member.email : null }}
        onSuccess={() => setToast('Email sent successfully!')}
        isDarkMode={isDarkMode}
      />

      {isEditOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-900/45 p-4">
          <section className={`w-full max-w-5xl rounded-2xl border shadow-2xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-6 py-5 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Edit Member</h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Update this library member profile.</p>
              </div>
              <button type="button" onClick={() => setIsEditOpen(false)} className={`grid h-10 w-10 place-items-center rounded-xl border ${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveEditMember} className="space-y-5 px-6 py-5">
              {editError ? (
                <div className={`rounded-xl border px-3 py-2 text-xs font-semibold ${isDarkMode ? 'border-rose-500/35 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                  {editError}
                </div>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Full Name <span className="text-rose-500">*</span></label>
                  <input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} placeholder="Enter full name" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Member Type <span className="text-rose-500">*</span></label>
                  <input value={editForm.type} onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))} placeholder="Select member type" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Member ID / Student ID <span className="text-rose-500">*</span></label>
                  <input value={member.memberId} disabled className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#101b3f] text-zinc-400' : 'border-zinc-200 bg-zinc-50 text-zinc-500'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Course / Department</label>
                  <input value={editForm.department} onChange={(e) => setEditForm((p) => ({ ...p, department: e.target.value }))} placeholder="Select course / department" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Contact Number</label>
                  <input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Enter contact number" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Email Address</label>
                  <input value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} placeholder="Enter email address" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'}`} />
                </div>
              </div>

              <div>
                <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Address</label>
                <textarea value={editForm.address} onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))} maxLength={200} placeholder="Enter complete address" className={`min-h-24 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'}`} />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{editForm.address.length} / 200</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Profile Photo</label>
                  <div className="flex items-center gap-3">
                    <img src={editPhotoPreview} alt="Profile preview" className={`h-10 w-10 rounded-full object-cover ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
                    <label className={`h-10 rounded-lg border px-4 text-sm font-semibold inline-flex items-center cursor-pointer ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
                      Upload Photo
                      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoChange} className="hidden" />
                    </label>
                    <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>JPG, PNG (Max 2MB)</span>
                  </div>
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Status <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value as 'Active' | 'Inactive' | 'Suspended' }))} className={`h-11 w-full appearance-none rounded-xl border pl-3 pr-10 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100' : 'border-zinc-200 bg-white text-zinc-700'}`}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                <button type="button" disabled={isSavingEdit} onClick={() => setIsEditOpen(false)} className={`h-11 rounded-xl border text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'} disabled:opacity-60 disabled:cursor-not-allowed`}>Cancel</button>
                <button type="submit" disabled={isSavingEdit} className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed">{isSavingEdit ? 'Saving...' : 'Save Member'}</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  )
}

function CardHeader({ title, count, isDarkMode }: { title: string; count?: string; isDarkMode: boolean }) {
  return (
    <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
      <h3 className={`text-[20px] font-medium ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{title}</h3>
      {count ? <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">{count}</span> : null}
    </div>
  )
}

function Meta({
  icon,
  label,
  value,
  isDarkMode,
  asBadge,
}: {
  icon: React.ReactNode
  label: string
  value: string
  isDarkMode: boolean
  asBadge?: boolean
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="h-7 w-7 rounded-lg bg-emerald-500/10 grid place-items-center mt-0.5">{icon}</div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</p>
        {asBadge ? (
          <span className="inline-flex mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700">
            {value}
          </span>
        ) : (
          <p className={`text-sm font-bold mt-0.5 ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{value}</p>
        )}
      </div>
    </div>
  )
}

function Summary({
  icon,
  value,
  label,
  sub,
}: {
  icon: React.ReactNode
  value: string
  label: string
  sub?: string
}) {
  return (
    <div className="px-4 py-2">
      <div className="h-9 w-9 rounded-full bg-zinc-100 grid place-items-center">{icon}</div>
      <p className="mt-2 text-3xl font-semibold text-zinc-900">{value}</p>
      <p className="text-sm font-semibold text-zinc-600">{label}</p>
      <p className="text-xs text-zinc-400">{sub ?? '\u00A0'}</p>
    </div>
  )
}


