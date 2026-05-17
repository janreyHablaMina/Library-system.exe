import { useState } from 'react'
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
  User,
  UserCheck,
  X,
} from 'lucide-react'
import bookCover from '../assets/login.avif'
import { mockMembersData } from './memberDetailData'

type Props = {
  isDarkMode: boolean
  onBack: () => void
  memberId?: number
}

export function MemberDetailPage({ isDarkMode, onBack, memberId }: Props) {
  const d = mockMembersData[memberId && mockMembersData[memberId] ? memberId : 1]
  const [member, setMember] = useState({ ...d, profileImage: bookCover })
  const [copied, setCopied] = useState(false)
  const [notes, setNotes] = useState(member.notes)
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
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

  const copyId = async () => {
    await navigator.clipboard.writeText(d.memberId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const saveNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    setNotes((p) => [...p, newNote.trim()])
    setNewNote('')
    setAddingNote(false)
  }

  const openEditModal = () => {
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

  const saveEditMember = (e: React.FormEvent) => {
    e.preventDefault()
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
    ? 'rounded-2xl border border-slate-800 bg-[#0f172a]/80'
    : 'rounded-2xl border border-slate-200 bg-white'

  return (
    <div className={`flex-1 overflow-y-auto min-h-0 w-full ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <div className="max-w-[1600px] mx-auto p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className={`inline-flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
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
                <div className="h-32 w-32 rounded-full bg-slate-200 overflow-hidden">
                  <img src={member.profileImage ?? bookCover} alt={member.name} className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className={`text-[35px] font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{member.name}</h2>
                <div className="mt-1 flex items-center gap-1.5">
                  <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Member ID: {member.memberId}</p>
                  <button onClick={copyId} className={isDarkMode ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-500 hover:text-emerald-600'}>
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>

                <div className={`mt-5 space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <p className="flex items-center gap-2.5"><Mail size={15} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />{member.email}</p>
                  <p className="flex items-center gap-2.5"><Phone size={15} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />{member.phone}</p>
                  <p className="flex items-start gap-2.5"><MapPin size={15} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-0.5`} /><span>{member.address}</span></p>
                </div>
              </div>
            </div>

            <div className={`space-y-4 xl:px-8 ${isDarkMode ? 'xl:border-x xl:border-slate-800' : 'xl:border-x xl:border-slate-200'}`}>
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
              {d.loansList.map((loan) => (
                <div key={loan.id} className={`py-3 flex items-center gap-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} border-b last:border-b-0`}>
                  <img src={bookCover} alt={loan.title} className="h-16 w-12 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{loan.title}</p>
                    <p className={isDarkMode ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>{loan.author}</p>
                  </div>
                  <div className="text-right mr-2">
                    <p className={isDarkMode ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>Due Date</p>
                    <p className={`text-sm font-semibold ${loan.status === 'Overdue' ? 'text-rose-500' : ''}`}>{loan.dueDate}</p>
                  </div>
                  <span className={`text-xs font-semibold rounded-lg px-3 py-1.5 ${loan.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{loan.statusLabel}</span>
                </div>
              ))}
              <div className="pt-3 text-right">
                <button className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700">View all loans <ArrowUpRight size={14} /></button>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <CardHeader title="Membership Summary" isDarkMode={isDarkMode} />
            <div className="px-6 pb-5">
              <div className={`grid grid-cols-2 sm:grid-cols-4 ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'} divide-x`}>
                <Summary icon={<BookOpen size={17} className="text-emerald-500" />} value={String(d.totalLoans)} label="Total Loans" sub="(All Time)" />
                <Summary icon={<Bookmark size={17} className="text-indigo-500" />} value={String(d.currentLoans)} label="Books Currently" sub="Borrowed" />
                <Summary icon={<Calendar size={17} className="text-amber-500" />} value={String(d.reservationsCount)} label="Reservations" />
                <Summary icon={<Activity size={17} className="text-rose-500" />} value={d.fines} label="Fines & Penalties" />
              </div>
              <div className={`mt-5 rounded-xl border px-4 py-3 flex justify-between ${isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
                <span className="text-sm">Payments Made</span>
                <span className="text-sm font-bold">PHP 0.00</span>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <CardHeader title="Recent Reservations" count={`${d.reservationsList.length} Item(s)`} isDarkMode={isDarkMode} />
            <div className="px-6 pb-5">
              {d.reservationsList.map((reservation) => (
                <div key={reservation.id} className={`py-3 flex items-center gap-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} border-b last:border-b-0`}>
                  <img src={bookCover} alt={reservation.title} className="h-16 w-12 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{reservation.title}</p>
                    <p className={isDarkMode ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>{reservation.author}</p>
                  </div>
                  <div className="text-right mr-2">
                    <p className={isDarkMode ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>Reserved On</p>
                    <p className="text-sm font-semibold">{reservation.reservedOn}</p>
                  </div>
                  <span className="text-xs font-semibold rounded-lg px-3 py-1.5 bg-indigo-100 text-indigo-700">{reservation.statusLabel}</span>
                </div>
              ))}
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
                  <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>No notes added yet.</p>
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
                    <div key={`${note}-${index}`} className={`p-3 rounded-xl border text-sm ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
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
                    className={`w-full rounded-xl border p-3 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-700'}`}
                    placeholder="Type your note here..."
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setAddingNote(false)} className={`h-9 px-4 rounded-xl border text-sm ${isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}>Cancel</button>
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
                <tr className={isDarkMode ? 'bg-slate-900/40 text-slate-400' : 'bg-slate-50 text-slate-600'}>
                  <th className="text-left px-6 py-3 font-semibold">Date & Time</th>
                  <th className="text-left px-6 py-3 font-semibold">Activity</th>
                  <th className="text-left px-6 py-3 font-semibold">Description</th>
                  <th className="text-left px-6 py-3 font-semibold">Performed By</th>
                </tr>
              </thead>
              <tbody>
                {d.activities.map((act, i) => (
                  <tr key={`${act.activity}-${i}`} className={isDarkMode ? 'border-t border-slate-800' : 'border-t border-slate-100'}>
                    <td className={isDarkMode ? 'px-6 py-3 text-slate-400' : 'px-6 py-3 text-slate-500'}>{act.dateTime}</td>
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
      {isEditOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4">
          <section className={`w-full max-w-5xl rounded-2xl border shadow-2xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-6 py-5 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Edit Member</h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Update this library member profile.</p>
              </div>
              <button type="button" onClick={() => setIsEditOpen(false)} className={`grid h-10 w-10 place-items-center rounded-xl border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveEditMember} className="space-y-5 px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Full Name <span className="text-rose-500">*</span></label>
                  <input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} placeholder="Enter full name" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Member Type <span className="text-rose-500">*</span></label>
                  <input value={editForm.type} onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))} placeholder="Select member type" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Member ID / Student ID <span className="text-rose-500">*</span></label>
                  <input value={member.memberId} disabled className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#101b3f] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Course / Department</label>
                  <input value={editForm.department} onChange={(e) => setEditForm((p) => ({ ...p, department: e.target.value }))} placeholder="Select course / department" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Contact Number</label>
                  <input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Enter contact number" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Email Address</label>
                  <input value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} placeholder="Enter email address" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'}`} />
                </div>
              </div>

              <div>
                <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Address</label>
                <textarea value={editForm.address} onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))} maxLength={200} placeholder="Enter complete address" className={`min-h-24 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'}`} />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{editForm.address.length} / 200</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Profile Photo</label>
                  <div className="flex items-center gap-3">
                    <img src={editPhotoPreview} alt="Profile preview" className={`h-10 w-10 rounded-full object-cover ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />
                    <label className={`h-10 rounded-lg border px-4 text-sm font-semibold inline-flex items-center cursor-pointer ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                      Upload Photo
                      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoChange} className="hidden" />
                    </label>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>JPG, PNG (Max 2MB)</span>
                  </div>
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Status <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value as 'Active' | 'Inactive' | 'Overdue' }))} className={`h-11 w-full appearance-none rounded-xl border pl-3 pr-10 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100' : 'border-slate-200 bg-white text-slate-700'}`}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className={`h-11 rounded-xl border text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Cancel</button>
                <button type="submit" className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">Save Member</button>
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
    <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
      <h3 className={`text-[20px] font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
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
        <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
        {asBadge ? (
          <span className="inline-flex mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700">
            {value}
          </span>
        ) : (
          <p className={`text-sm font-bold mt-0.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{value}</p>
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
      <div className="h-9 w-9 rounded-full bg-slate-100 grid place-items-center">{icon}</div>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="text-xs text-slate-400">{sub ?? '\u00A0'}</p>
    </div>
  )
}

