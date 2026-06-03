import { Toast } from '../components/ui/Toast'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { SendEmailModal } from '../components/modals/SendEmailModal'
import { SendSmsModal } from '../components/modals/SendSmsModal'
import { AlertTriangle, Mail, ChevronDown, Download, Eye, Grid2x2, List, MoreHorizontal, Pencil, Phone, RotateCcw, Search, Smartphone, Trash2, UserPlus, Users, X } from 'lucide-react'
import { createMember, listMembers, type Member } from '../lib/tauriApi'

type MemberType = 'Student' | 'Teacher' | 'Staff' | 'Visitor'
type MemberStatus = 'Active' | 'Suspended' | 'Inactive'

type MemberRow = {
  id: number
  name: string
  email: string
  memberId: string
  type: MemberType
  department: string
  yearOrRole: string
  contact: string
  borrowed: number
  status: MemberStatus
  avatar: string
  profilePhotoData?: string | null
}

type MembersPageProps = {
  isDarkMode: boolean
  onOpenMemberDetail: (id: number) => void
  openAddModalTrigger?: number
}

type MemberFormState = {
  fullName: string
  memberType: string
  memberId: string
  courseDepartment: string
  contactNumber: string
  email: string
  address: string
  status: string
}

const initialFormState: MemberFormState = {
  fullName: '',
  memberType: '',
  memberId: '',
  courseDepartment: '',
  contactNumber: '',
  email: '',
  address: '',
  status: 'Active',
}



function getTypeClass(type: MemberType) {
  if (type === 'Student') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  if (type === 'Teacher') return 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
  if (type === 'Staff') return 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
}

function getStatusClass(status: MemberStatus) {
  if (status === 'Active') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  if (status === 'Suspended') return 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
  return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
}

function getAvatarByType(type: MemberType) {
  if (type === 'Student') return 'S'
  if (type === 'Teacher') return 'T'
  return 'M'
}

// â”€â”€â”€ Member Actions Dropdown Menu â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type MemberActionsMenuProps = {
  isDarkMode: boolean
  onViewDetails: () => void
  onEdit: () => void
  onDelete: () => void
}

function MemberActionsMenu({ isDarkMode, onViewDetails, onEdit, onDelete, onSendEmail, onSendSms }: MemberActionsMenuProps) {
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

  const handleToggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpward(spaceBelow < 185)
    }
    setOpen(v => !v)
  }

  const surface = isDarkMode
    ? 'bg-[#18181B] border-zinc-700 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
    : 'bg-white border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'

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
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        id={`member-actions-btn-${Math.random()}`}
        onClick={handleToggle}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 ${
          open
            ? isDarkMode
              ? 'border-zinc-500 bg-zinc-700 text-zinc-100'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : isDarkMode
              ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
        }`}
        aria-label="Member actions"
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
          style={{ animation: openUpward ? 'memberMenuInUp 0.13s cubic-bezier(0.16,1,0.3,1)' : 'memberMenuInDown 0.13s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <style>{`
            @keyframes memberMenuInDown {
              from { opacity: 0; transform: scale(0.95) translateY(-6px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
            @keyframes memberMenuInUp {
              from { opacity: 0; transform: scale(0.95) translateY(6px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
          `}</style>

          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={() => { setOpen(false); onViewDetails(); }}
          >
            <Eye size={15} className="shrink-0 text-sky-500" />
            View Details
          </button>
          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={() => { setOpen(false); onEdit(); }}
          >
            <Pencil size={15} className="shrink-0 text-violet-500" />
            Edit Profile
          </button>

          <div className={`my-1.5 border-t ${divider}`} />

          <button
            type="button"
            className={`${itemBase} ${itemDanger}`}
            role="menuitem"
            onClick={() => { setOpen(false); onDelete(); }}
          >
            <Trash2 size={15} className="shrink-0" />
            Delete Member
          </button>
        </div>
      )}
    </div>
  )
}

export function MembersPage({ isDarkMode, onOpenMemberDetail, openAddModalTrigger }: MembersPageProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [memberForm, setMemberForm] = useState<MemberFormState>(initialFormState)
  const [memberToEdit, setMemberToEdit] = useState<MemberRow | null>(null)
  const [memberToDelete, setMemberToDelete] = useState<MemberRow | null>(null)
  const [emailMember, setEmailMember] = useState<MemberRow | null>(null)
  const [smsMember, setSmsMember] = useState<MemberRow | null>(null)
  const [showToast, setShowToast] = useState<string | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const [profilePhotoName, setProfilePhotoName] = useState<string>('')
  const photoInputRef = useRef<HTMLInputElement>(null)
  const lastAddModalTriggerRef = useRef<number>(0)

  // Auto-dismiss toast
  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(t)
    }
  }, [showToast])

  // Dynamic States
  const [memberList, setMemberList] = useState<MemberRow[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedType, setselectedType] = useState('All')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [activeStatTab, setActiveStatTab] = useState<'All Members' | 'Students' | 'Teachers' | 'Staff' | 'Visitors'>('All Members')

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, selectedType, activeStatTab, itemsPerPage])

  // Dynamically compute unique departments
  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(memberList.map(m => m.type))).sort()
  }, [memberList])

  const toMemberRow = (member: Member): MemberRow => {
    const memberType = member.memberType as MemberType
    const safeType: MemberType = ['Student', 'Teacher', 'Staff', 'Visitor'].includes(memberType)
      ? memberType
      : 'Visitor'
    const memberStatus = member.status as MemberStatus
    const safeStatus: MemberStatus = ['Active', 'Suspended', 'Inactive'].includes(memberStatus)
      ? memberStatus
      : 'Active'

    return {
      id: member.id,
      name: member.fullName,
      email: member.email || 'n/a',
      memberId: member.memberId,
      type: safeType,
      department: member.department || 'General',
      yearOrRole: safeType === 'Student' ? '1st Year' : 'Support',
      contact: member.contactNumber || 'n/a',
      borrowed: member.borrowed,
      status: safeStatus,
      avatar: getAvatarByType(safeType),
      profilePhotoData: member.profilePhotoData || null,
    }
  }

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const rows = await listMembers(500)
        setMemberList(rows.map(toMemberRow))
      } catch {
        setMemberList([])
      }
    }
    void loadMembers()
  }, [])

  useEffect(() => {
    if (!openAddModalTrigger) return
    if (lastAddModalTriggerRef.current === openAddModalTrigger) return
    lastAddModalTriggerRef.current = openAddModalTrigger
    setMemberToEdit(null)
    setMemberForm(initialFormState)
    setProfilePhotoPreview(null)
    setProfilePhotoName('')
    if (photoInputRef.current) photoInputRef.current.value = ''
    setIsAddModalOpen(true)
  }, [openAddModalTrigger])

  // Filter members dynamically
  const filteredMembers = memberList.filter((member) => {
    // 1. Stat Tab Filter
    if (activeStatTab === 'Students' && member.type !== 'Student') return false
    if (activeStatTab === 'Teachers' && member.type !== 'Teacher') return false
    if (activeStatTab === 'Staff' && member.type !== 'Staff') return false
    if (activeStatTab === 'Visitors' && member.type !== 'Visitor') return false

    // 2. Status Dropdown
    if (selectedStatus !== 'All' && member.status !== selectedStatus) return false

    // 3. Department Dropdown
    if (selectedType !== 'All' && member.type !== selectedType) return false

    // 4. Search Text Input (name, memberId, email, contact)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      const matchName = member.name.toLowerCase().includes(term)
      const matchId = member.memberId.toLowerCase().includes(term)
      const matchEmail = member.email.toLowerCase().includes(term)
      const matchContact = member.contact.toLowerCase().includes(term)
      if (!matchName && !matchId && !matchEmail && !matchContact) return false
    }

    return true
  })

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedStatus('All')
    setselectedType('All')
    setActiveStatTab('All Members')
  }

  const handleMemberFormChange = (field: keyof MemberFormState, value: string) => {
    setMemberForm((previous) => ({ ...previous, [field]: value }))
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setMemberToEdit(null)
    setMemberForm(initialFormState)
    setProfilePhotoPreview(null)
    setProfilePhotoName('')
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const handleOpenEditModal = (member: MemberRow) => {
    setMemberToEdit(member)
    setMemberForm({
      fullName: member.name,
      memberType: member.type,
      memberId: member.memberId,
      courseDepartment: member.department || '',
      contactNumber: member.contact === 'n/a' ? '' : member.contact,
      email: member.email === 'n/a' ? '' : member.email,
      address: '',
      status: member.status,
    })
    setProfilePhotoPreview(member.profilePhotoData || null)
    setProfilePhotoName(member.profilePhotoData ? 'Current photo' : '')
    if (photoInputRef.current) photoInputRef.current.value = ''
    setIsAddModalOpen(true)
  }

  const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const acceptedTypes = ['image/jpeg', 'image/png']
    if (!acceptedTypes.includes(file.type)) {
      setShowToast('Only JPG and PNG files are allowed.')
      event.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setShowToast('Photo must be 2MB or smaller.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null
      setProfilePhotoPreview(dataUrl)
      setProfilePhotoName(file.name)
    }
    reader.onerror = () => {
      setShowToast('Failed to read photo file.')
      event.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  const handleSaveMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Basic validation
    if (!memberForm.fullName.trim() || !memberForm.memberType || !memberForm.memberId || !memberForm.email.trim()) return

    if (memberToEdit) {
      setMemberList(prev => prev.map(m => m.id === memberToEdit.id ? {
        ...m,
        name: memberForm.fullName,
        email: memberForm.email || 'n/a',
        memberId: memberForm.memberId,
        type: memberForm.memberType as MemberType,
        department: memberForm.courseDepartment || 'General',
        contact: memberForm.contactNumber || 'n/a',
        status: (memberForm.status as MemberStatus) || 'Active',
        avatar: getAvatarByType(memberForm.memberType as MemberType),
        profilePhotoData: profilePhotoPreview || null,
      } : m))
      setShowToast(`Successfully updated "${memberForm.fullName}"`)
    } else {
      try {
        await createMember({
          fullName: memberForm.fullName.trim(),
          memberType: memberForm.memberType,
          memberId: memberForm.memberId.trim(),
          department: memberForm.courseDepartment.trim() || null,
          contactNumber: memberForm.contactNumber.trim() || null,
          email: memberForm.email.trim() || null,
          address: memberForm.address.trim() || null,
          profilePhotoData: profilePhotoPreview || null,
          status: memberForm.status || 'Active',
        })
        const rows = await listMembers(500)
        setMemberList(rows.map(toMemberRow))
        setShowToast(`Successfully added "${memberForm.fullName}"`)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to add member.'
        setShowToast(message)
        return
      }
    }

    closeAddModal()
  }
  const handleDeleteConfirm = () => {
    if (memberToDelete) {
      setMemberList(prev => prev.filter(m => m.id !== memberToDelete.id))
      setShowToast(`Successfully deleted "${memberToDelete.name}"`)
      setMemberToDelete(null)
    }
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      {/* Toast Notification */}
      <Toast message={showToast} onClose={() => setShowToast(null)} isDarkMode={isDarkMode} />

      {/* Styled Confirmation Modal (Delete) */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
            isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'
          }`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-6">Delete Member</h3>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Are you sure you want to delete member <span className="font-semibold text-rose-500">"{memberToDelete.name}"</span>? This action cannot be undone and will remove all their records.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
                  isDarkMode
                    ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Yes, Delete Member
              </button>
            </div>
          </div>
        </div>
      )}

      <SendEmailModal
        isOpen={!!emailMember}
        onClose={() => setEmailMember(null)}
        member={emailMember ? { id: emailMember.id, fullName: emailMember.name, email: emailMember.email !== 'n/a' ? emailMember.email : null } : { id: 0, fullName: '', email: null }}
        onSuccess={() => setShowToast('Email sent successfully!')}
        isDarkMode={isDarkMode}
      />

            <SendSmsModal
        isOpen={!!smsMember}
        onClose={() => setSmsMember(null)}
        member={smsMember ? { id: smsMember.id, fullName: smsMember.name, phone: smsMember.phone !== 'n/a' ? smsMember.phone : null } : { id: 0, fullName: '', phone: null }}
        onSuccess={() => setShowToast('SMS sent successfully!')}
        isDarkMode={isDarkMode}
      />

      <section className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Members</h2>
            <p className={`mt-1 text-base ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Manage student, teacher, staff and visitor records.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setIsAddModalOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700">
              <UserPlus size={15} />
              Add Member
            </button>
            <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
              <Download size={15} />
              Export
            </button>
          </div>
        </div>

        <div className={`mt-5 overflow-hidden lg:overflow-visible rounded-xl border ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
          <div className={`flex min-w-[880px] items-center gap-2 px-3 py-3 ${isDarkMode ? 'bg-[#18181B]' : 'bg-white'}`}>
            {[
              { label: 'All Members', value: String(memberList.length) },
              { label: 'Students', value: String(memberList.filter(m => m.type === 'Student').length) },
              { label: 'Teachers', value: String(memberList.filter(m => m.type === 'Teacher').length) },
              { label: 'Staff', value: String(memberList.filter(m => m.type === 'Staff').length) },
              { label: 'Visitors', value: String(memberList.filter(m => m.type === 'Visitor').length) },
            ].map((item) => {
              const isActive = activeStatTab === item.label
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveStatTab(item.label as any)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'border border-emerald-600 bg-emerald-600 text-white'
                      : isDarkMode
                        ? 'border border-zinc-700 bg-[#27272A] text-zinc-300 hover:bg-zinc-800'
                        : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <Users size={15} />
                  {item.label}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-emerald-500 text-white' : isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                    {item.value}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={`mt-4 rounded-xl border ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
          <div className={`flex flex-wrap items-center gap-3 border-b p-3 rounded-t-xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <label className={`group flex h-11 min-w-[280px] flex-1 items-center rounded-xl border px-3 ${isDarkMode ? 'border-zinc-700 focus-within:border-emerald-500' : 'border-zinc-200 focus-within:border-emerald-500'}`}>
              <Search size={16} className={`mr-2 ${isDarkMode ? 'text-zinc-500 group-focus-within:text-emerald-400' : 'text-zinc-400 group-focus-within:text-emerald-600'}`} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400'}`}
                placeholder="Search by name, member ID, email, or contact..."
              />
            </label>
            

            {/* Status Select */}
            <div className="relative">
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`h-11 appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm outline-none min-w-[130px] ${
                  isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'
                }`}
              >
                <option value="All">Status: All</option>
                {['Active', 'Suspended', 'Inactive'].map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
            </div>

            {/* Department Course Select */}
            <div className="relative">
              <select 
                value={selectedType} 
                onChange={(e) => setselectedType(e.target.value)}
                className={`h-11 appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm outline-none min-w-[220px] max-w-[250px] truncate ${
                  isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'
                }`}
              >
                <option value="All">Member Type: All</option>
                {uniqueTypes.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
            </div>

            <button 
              type="button" 
              onClick={handleResetFilters}
              className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors duration-150 ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
            >
              <RotateCcw size={15} />
              Reset
            </button>
            <div className="ml-auto flex gap-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`grid h-11 w-11 place-items-center rounded-xl ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : isDarkMode ? 'border border-zinc-700 text-zinc-300' : 'border border-zinc-200 text-zinc-600'}`}
              >
                <List size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`grid h-11 w-11 place-items-center rounded-xl ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : isDarkMode ? 'border border-zinc-700 text-zinc-300' : 'border border-zinc-200 text-zinc-600'}`}
              >
                <Grid2x2 size={16} />
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className={`relative z-10 ${isDarkMode ? 'overflow-x-auto lg:overflow-visible bg-[#18181B]' : 'overflow-x-auto lg:overflow-visible bg-white'}`}>
              <table className="min-w-[1080px] w-full text-left text-sm">
                <thead className={isDarkMode ? 'bg-[#27272A] text-zinc-300' : 'bg-zinc-50 text-zinc-600'}>
                  <tr>
                    <th className="px-4 py-3 font-semibold"><input type="checkbox" /></th>
                    <th className="px-3 py-3 font-semibold">Member</th>
                    <th className="px-3 py-3 font-semibold">Member ID</th>
                    <th className="px-3 py-3 font-semibold">Type</th>
                    <th className="px-3 py-3 font-semibold">Borrowed</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMembers.map((member) => (
                    <tr key={member.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-zinc-700 hover:bg-[#3F3F46]' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                      <td className="px-4 py-3 align-top"><input type="checkbox" /></td>
                      <td className="px-3 py-3">
                        <div className="flex items-start gap-3">
                          <span 
                            onClick={() => onOpenMemberDetail(member.id)}
                            className={`grid h-11 w-11 place-items-center overflow-hidden rounded-full text-lg cursor-pointer hover:scale-105 transition-transform ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}
                          >
                            {member.profilePhotoData ? (
                              <img src={member.profilePhotoData} alt={`${member.name} thumbnail`} className="h-full w-full object-cover" />
                            ) : (
                              member.avatar
                            )}
                          </span>
                          <div>
                            <button
                              type="button"
                              onClick={() => onOpenMemberDetail(member.id)}
                              className={`text-left font-semibold hover:text-emerald-600 hover:underline transition-all ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}
                            >
                              {member.name}
                            </button>
                            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-3 py-3 font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{member.memberId}</td>
                      <td className="px-3 py-3">
                        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${getTypeClass(member.type)}`}>{member.type}</span>
                      </td>
                      <td className={`px-3 py-3 font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{member.borrowed}</td>
                      <td className="px-3 py-3">
                        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(member.status)}`}>{member.status}</span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <MemberActionsMenu
                          isDarkMode={isDarkMode}
                          onViewDetails={() => onOpenMemberDetail(member.id)}
                          onEdit={() => handleOpenEditModal(member)}
                          onDelete={() => setMemberToDelete(member)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`relative z-20 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 ${isDarkMode ? 'bg-[#18181B]' : 'bg-white'}`}>
              {paginatedMembers.map((member) => (
                <article key={member.id} className={`relative z-10 hover:z-20 flex h-full flex-col rounded-xl border p-3 transition-all duration-200 hover:-translate-y-0.5 ${
                  isDarkMode
                    ? 'border-zinc-700 bg-[#27272A] hover:border-emerald-500/60 hover:shadow-[0_12px_24px_-16px_rgba(16,185,129,0.45)]'
                    : 'border-zinc-200 bg-white hover:border-emerald-200 hover:shadow-[0_12px_24px_-16px_rgba(15,23,42,0.35)]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span 
                      onClick={() => onOpenMemberDetail(member.id)}
                      className={`grid h-11 w-11 place-items-center overflow-hidden rounded-full text-lg cursor-pointer hover:scale-105 transition-transform ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}
                    >
                      {member.profilePhotoData ? (
                        <img src={member.profilePhotoData} alt={`${member.name} thumbnail`} className="h-full w-full object-cover" />
                      ) : (
                        member.avatar
                      )}
                    </span>
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(member.status)}`}>{member.status}</span>
                  </div>
                  <div className="mt-3 flex flex-col items-start">
                    <button
                      type="button"
                      onClick={() => onOpenMemberDetail(member.id)}
                      className={`text-sm font-semibold hover:text-emerald-600 hover:underline text-left transition-all ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}
                    >
                      {member.name}
                    </button>
                    <p className={`mt-1 text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{member.email}</p>
                    <p className={`mt-2 text-xs font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{member.memberId}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${getTypeClass(member.type)}`}>{member.type}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{member.borrowed} borrowed</span>
                      <MemberActionsMenu
                        isDarkMode={isDarkMode}
                        onViewDetails={() => onOpenMemberDetail(member.id)}
                        onEdit={() => handleOpenEditModal(member)}
                        onDelete={() => setMemberToDelete(member)}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className={`relative z-0 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-600'}`}>
            <p>Showing {filteredMembers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members</p>
            <div className="flex items-center gap-2">
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className={`h-9 rounded-lg border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <button type="button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={`grid h-9 w-9 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800 disabled:opacity-50' : 'border-zinc-200 hover:bg-zinc-50 disabled:opacity-50'}`}>{'<'}</button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} type="button" onClick={() => setCurrentPage(page)} className={page === currentPage ? "grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : `grid h-9 w-9 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                    {page}
                  </button>
                ))}
              </div>

              <button type="button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className={`grid h-9 w-9 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800 disabled:opacity-50' : 'border-zinc-200 hover:bg-zinc-50 disabled:opacity-50'}`}>{'>'}</button>
            </div>
          </div>
        </div>
      </section>

      {isAddModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-900/45 p-4 backdrop-blur-[1px]">
          <section className={`w-full max-w-4xl rounded-2xl border shadow-2xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-6 py-5 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{memberToEdit ? 'Edit Member Profile' : 'Add New Member'}</h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{memberToEdit ? 'Update member details below.' : 'Create a new library member profile.'}</p>
              </div>
              <button type="button" onClick={closeAddModal} className={`grid h-10 w-10 place-items-center rounded-xl border ${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-5 px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Full Name <span className="text-rose-500">*</span></label>
                  <input value={memberForm.fullName} onChange={(event) => handleMemberFormChange('fullName', event.target.value)} placeholder="Enter full name" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Member Type <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select value={memberForm.memberType} onChange={(event) => handleMemberFormChange('memberType', event.target.value)} className={`h-11 w-full appearance-none rounded-xl border pl-3 pr-10 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100' : 'border-zinc-200 bg-white text-zinc-700'}`}>
                      <option value="">Select member type</option>
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Staff">Staff</option>
                      <option value="Visitor">Visitor</option>
                    </select>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Member ID / Student ID <span className="text-rose-500">*</span></label>
                  <input value={memberForm.memberId} onChange={(event) => handleMemberFormChange('memberId', event.target.value)} placeholder="Enter member ID" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Course / Department</label>
                  <input value={memberForm.courseDepartment} onChange={(event) => handleMemberFormChange('courseDepartment', event.target.value)} placeholder="Select course / department" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'}`} />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Contact Number</label>
                  <div className={`flex h-11 items-center rounded-xl border px-3 ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-white'}`}>
                    <Phone size={15} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                    <input value={memberForm.contactNumber} onChange={(event) => handleMemberFormChange('contactNumber', event.target.value)} placeholder="Enter contact number" className={`ml-2 w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-zinc-100 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400'}`} />
                  </div>
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Email Address <span className="text-rose-500">*</span></label>
                  <div className={`flex h-11 items-center rounded-xl border px-3 ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-white'}`}>
                    <Mail size={15} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                    <input value={memberForm.email} onChange={(event) => handleMemberFormChange('email', event.target.value)} placeholder="Enter email address" className={`ml-2 w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-zinc-100 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400'}`} />
                  </div>
                </div>
              </div>

              <div>
                <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Address</label>
                <textarea value={memberForm.address} onChange={(event) => handleMemberFormChange('address', event.target.value)} maxLength={200} placeholder="Enter complete address" className={`min-h-24 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'}`} />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{memberForm.address.length} / 200</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Profile Photo</label>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleProfilePhotoChange}
                  />
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                      {profilePhotoPreview ? (
                        <img src={profilePhotoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                      ) : (
                        <Users size={16} />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className={`h-10 rounded-lg border px-4 text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
                    >
                      Upload Photo
                    </button>
                    <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
                      {profilePhotoName || 'JPG, PNG (Max 2MB)'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Status <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select value={memberForm.status} onChange={(event) => handleMemberFormChange('status', event.target.value)} className={`h-11 w-full appearance-none rounded-xl border pl-3 pr-10 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100' : 'border-zinc-200 bg-white text-zinc-700'}`}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                <button type="button" onClick={closeAddModal} className={`h-11 rounded-xl border text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>Cancel</button>
                <button type="submit" className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">{memberToEdit ? 'Save Changes' : 'Save Member'}</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  )
}





