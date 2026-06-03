import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import { Users, UserCheck, UserX, ShieldCheck, Calendar, Search, ChevronDown, Filter, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, MoreHorizontal } from 'lucide-react'
import { createStaff, deleteStaff, listStaff, updateStaff } from '../lib/tauriApi'
import { Toast } from '../components/ui/Toast'
type StaffRole = 'Administrator' | 'Librarian' | 'Assistant Librarian' | 'Library Clerk'
type StaffStatus = 'Active' | 'Inactive'

type StaffMember = {
  dbId: number
  id: string
  name: string
  email: string
  role: StaffRole
  branch: string
  status: StaffStatus
  joinedOn: string
  joinedTime: string
  avatar: string
  phone?: string
  emergencyContact?: string
  employeeType?: string
  startDate?: string
  username?: string
  tempPassword?: string
  requirePasswordReset?: boolean
  profilePhotoData?: string | null
}

type StaffPageProps = {
  isDarkMode: boolean
}

type StaffActionsMenuProps = {
  isDarkMode: boolean
  onEdit: () => void
  onDelete: () => void
}



function StaffActionsMenu({ isDarkMode, onEdit, onDelete }: StaffActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const surface = isDarkMode
    ? 'bg-[#18181B] border-zinc-700 text-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
    : 'bg-white border-zinc-200 text-zinc-700 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpward(spaceBelow < 160)
    }
    setOpen((prev) => !prev)
  }

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
          open
            ? isDarkMode
              ? 'border-zinc-500 bg-zinc-700 text-zinc-100'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : isDarkMode
              ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
        }`}
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-44 rounded-xl border p-1.5 ${surface} animate-[fadeIn_0.12s_ease] ${
            openUpward 
              ? 'bottom-full mb-1.5 origin-bottom-right' 
              : 'top-full mt-1.5 origin-top-right'
          }`}
          role="menu"
          style={{ animation: openUpward ? 'bookMenuInUp 0.13s cubic-bezier(0.16,1,0.3,1)' : 'bookMenuInDown 0.13s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <style>{`
            @keyframes bookMenuInDown {
              from { opacity: 0; transform: scale(0.95) translateY(-6px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
            @keyframes bookMenuInUp {
              from { opacity: 0; transform: scale(0.95) translateY(6px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
          `}</style>
          <button
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors duration-100 ${
              isDarkMode ? 'text-zinc-200 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-50'
            }`}
            onClick={() => { setOpen(false); onEdit() }}
          >
            <Pencil size={14} className="text-violet-500" />
            Edit Staff
          </button>
          
          <div className={`my-1.5 border-t ${isDarkMode ? 'border-zinc-700/60' : 'border-zinc-100'}`} />
          
          <button
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors duration-100 ${
              isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'
            }`}
            onClick={() => { setOpen(false); onDelete() }}
          >
            <Trash2 size={14} className="text-rose-500" />
            Delete Staff
          </button>
        </div>
      )}
    </div>
  )
}

export function StaffPage({ isDarkMode }: StaffPageProps) {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null)
  const [staffError, setStaffError] = useState<string | null>(null)
  const [isSavingStaff, setIsSavingStaff] = useState(false)
  const [staffSearch, setStaffSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'All Roles' | StaffRole>('All Roles')
  const [statusFilter, setStatusFilter] = useState<'All Status' | StaffStatus>('All Status')
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showToast, setShowToast] = useState<string | null>(null)

  useEffect(() => {
    setCurrentPage(1)
  }, [staffSearch, roleFilter, statusFilter])
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const totalStaff = staffMembers.length
  const activeStaff = staffMembers.filter(s => s.status === 'Active').length
  const inactiveStaff = staffMembers.filter(s => s.status === 'Inactive').length
  const adminStaff = staffMembers.filter(s => s.role === 'Administrator').length
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const newThisMonth = staffMembers.filter(s => {
    const d = new Date(s.joinedOn)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  }).length

  const dynamicStats = [
    { label: 'Total Staff', value: totalStaff.toString(), subValue: `${newThisMonth} new this month`, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Staff', value: activeStaff.toString(), subValue: totalStaff > 0 ? `${Math.round((activeStaff/totalStaff)*100)}% of total` : '0%', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Inactive Staff', value: inactiveStaff.toString(), subValue: totalStaff > 0 ? `${Math.round((inactiveStaff/totalStaff)*100)}% of total` : '0%', icon: UserX, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Administrators', value: adminStaff.toString(), subValue: totalStaff > 0 ? `${Math.round((adminStaff/totalStaff)*100)}% of total` : '0%', icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'New This Month', value: newThisMonth.toString(), subValue: 'New staff added', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50' },
  ]


  const getRoleStyle = (role: StaffRole) => {
    switch (role) {
      case 'Administrator': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400'
      case 'Librarian': return 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400'
      case 'Assistant Librarian': return 'text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400'
      case 'Library Clerk': return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400'
    }
  }

  const filteredStaff = staffMembers.filter((staff) => {
    const normalizedSearch = staffSearch.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch.length === 0 ||
      staff.name.toLowerCase().includes(normalizedSearch) ||
      staff.email.toLowerCase().includes(normalizedSearch) ||
      staff.role.toLowerCase().includes(normalizedSearch) ||
      staff.id.toLowerCase().includes(normalizedSearch)

    const matchesRole = roleFilter === 'All Roles' || staff.role === roleFilter
    const matchesStatus = statusFilter === 'All Status' || staff.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage)
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const avatarFromName = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'ST'
  }

  const refreshStaff = async () => {
    const rows = await listStaff(1000)
    setStaffMembers(
      rows.map((staff) => {
        const joined = new Date(staff.createdAt)
        return {
          dbId: staff.id,
          id: staff.staffCode,
          name: staff.fullName,
          email: staff.email,
          role: (staff.role as StaffRole) || 'Librarian',
          branch: staff.branch,
          status: (staff.status as StaffStatus) || 'Active',
          joinedOn: joined.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          joinedTime: joined.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          avatar: avatarFromName(staff.fullName),
          phone: staff.phone ?? '',
          emergencyContact: staff.emergencyContact ?? '',
          employeeType: staff.employeeType ?? 'Full-time',
          startDate: staff.startDate ?? '',
          username: staff.username ?? '',
          tempPassword: staff.tempPassword ?? '',
          requirePasswordReset: staff.requirePasswordReset,
          profilePhotoData: staff.profilePhotoData ?? null,
        }
      }),
    )
  }

  const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const acceptedTypes = ['image/jpeg', 'image/png']
    if (!acceptedTypes.includes(file.type)) {
      setStaffError('Only JPG and PNG files are allowed.')
      event.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setStaffError('Photo must be 2MB or smaller.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null
      setProfilePhotoPreview(dataUrl)
    }
    reader.onerror = () => {
      setStaffError('Failed to read photo file.')
      event.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    refreshStaff().catch((error) => {
      console.error('Failed to load staff:', error)
      setStaffError('Failed to load staff records.')
    })
  }, [])

  const handleStaffSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const fullName = String(form.get('fullName') || '').trim()
    const email = String(form.get('email') || '').trim()
    const role = String(form.get('role') || 'Librarian')
    const branch = String(form.get('branch') || 'Central Library')
    const status = String(form.get('status') || 'Active')
    if (!fullName || !email) {
      setStaffError('Full name and email are required.')
      return
    }

    const payloadBase = {
      staffCode: String(form.get('staffCode') || '').trim() || null,
      fullName,
      email,
      role,
      branch: String(form.get('branch') || editingStaff?.branch || 'Central Library'),
      status,
      phone: String(form.get('phone') || editingStaff?.phone || '').trim() || null,
      emergencyContact: String(form.get('emergencyContact') || editingStaff?.emergencyContact || '').trim() || null,
      employeeType: String(form.get('employeeType') || editingStaff?.employeeType || '').trim() || null,
      startDate: String(form.get('startDate') || editingStaff?.startDate || '').trim() || null,
      username: String(form.get('username') || '').trim() || null,
      tempPassword: String(form.get('tempPassword') || '').trim() || null,
      requirePasswordReset: form.has('requirePasswordReset') ? form.get('requirePasswordReset') === 'on' : (editingStaff?.requirePasswordReset ?? false),
      profilePhotoData: profilePhotoPreview || editingStaff?.profilePhotoData || null,
    }

    try {
      setStaffError(null)
      setIsSavingStaff(true)
      if (editingStaff) {
        await updateStaff({ id: editingStaff.dbId, ...payloadBase, requirePasswordReset: payloadBase.requirePasswordReset })
        setShowToast('Staff member updated successfully!')
      } else {
        await createStaff(payloadBase)
        setShowToast('Staff member added successfully!')
      }
      await refreshStaff()
      setIsAddModalOpen(false)
      setEditingStaff(null)
      setProfilePhotoPreview(null)
    } catch (error) {
      console.error('Failed to save staff:', error)
      setStaffError('Failed to save staff member. Please try again.')
    } finally {
      setIsSavingStaff(false)
    }
  }

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return
    try {
      setStaffError(null)
      await deleteStaff(staffToDelete.dbId)
      await refreshStaff()
      setStaffToDelete(null)
      setShowToast('Staff member deleted successfully!')
    } catch (error) {
      console.error('Failed to delete staff:', error)
      setStaffError('Failed to delete staff member. Please try again.')
    }
  }

  useEffect(() => {
    if (isAddModalOpen) {
      setProfilePhotoPreview(editingStaff?.profilePhotoData ?? null)
    }
  }, [isAddModalOpen, editingStaff])

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <Toast message={showToast} onClose={() => setShowToast(null)} isDarkMode={isDarkMode} />
      <section className="p-5">
        {staffError ? (
          <div className={`mb-4 rounded-xl border px-4 py-2 text-xs font-semibold ${isDarkMode ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-600'}`}>
            {staffError}
          </div>
        ) : null}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Staff</h2>
            <p className={`mt-1 text-base font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Manage library staff and their access to the system.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { setEditingStaff(null); setIsAddModalOpen(true) }}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-sm"
            >
              <Plus size={18} />
              Add Staff Member
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {dynamicStats.map((stat) => {
            const Icon = stat.icon
            return (
              <article key={stat.label} className={`rounded-xl border p-5 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
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

        <div className={`mt-8 rounded-2xl border ${isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200/60 bg-white shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)]'}`}>
          <div className={`flex flex-wrap items-center gap-4 p-4 rounded-t-2xl ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <label className={`group flex h-12 min-w-[320px] flex-1 items-center rounded-xl border px-3 transition-all ${isDarkMode ? 'border-zinc-700 focus-within:border-emerald-500 bg-[#27272A]' : 'border-zinc-200 focus-within:border-emerald-500 bg-zinc-50'}`}>
              <Search size={18} className={`mr-2 transition-colors ${isDarkMode ? 'text-zinc-500 group-focus-within:text-emerald-400' : 'text-zinc-400 group-focus-within:text-emerald-600'}`} />
              <input
                value={staffSearch}
                onChange={(event) => setStaffSearch(event.target.value)}
                className={`w-full bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400'}`}
                placeholder="Search staff by name, email or role..."
              />
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-500">Role</span>
                <div className="relative">
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value as 'All Roles' | StaffRole)}
                    className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}
                  >
                    <option value="All Roles">All Roles</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Assistant Librarian">Assistant Librarian</option>
                    <option value="Library Clerk">Library Clerk</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-500">Status</span>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as 'All Status' | StaffStatus)}
                    className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}
                  >
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStaffSearch('')
                  setRoleFilter('All Roles')
                  setStatusFilter('All Status')
                }}
                className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-white'}`}
              >
                <Filter size={16} />
                Reset
              </button>
            </div>
          </div>

          <div className={`relative z-10 overflow-visible ${isDarkMode ? 'bg-[#18181B]' : 'bg-white'}`}>
            <table className="w-full min-w-[800px] text-left text-sm border-collapse">
              <thead className={isDarkMode ? 'bg-[#27272A]/50 text-zinc-400' : 'bg-zinc-50/50 text-zinc-500'}>
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Staff Name</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Joined On</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStaff.map((staff) => (
                  <tr key={staff.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-zinc-800 hover:bg-zinc-800/30' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full text-xs font-bold border ${isDarkMode ? 'border-zinc-700 bg-zinc-800/50 text-zinc-300' : 'border-zinc-200 bg-zinc-100 text-zinc-600'}`}>
                          {staff.profilePhotoData ? (
                            <img
                              src={staff.profilePhotoData}
                              alt={`${staff.name} avatar`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span className="grid h-full w-full place-items-center">{avatarFromName(staff.name)}</span>
                          )}
                        </span>
                        <p className={`font-semibold text-sm ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{staff.name}</p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{staff.email}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${getRoleStyle(staff.role)}`}>
                        {staff.role}
                      </span>
                    </td>
                                        <td className="px-6 py-4">
                      <span className={`rounded-md px-3 py-1 text-[11px] font-semibold tracking-wide ${
                        staff.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{staff.joinedOn}</p>
                      <p className={`text-[10px] font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{staff.joinedTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <StaffActionsMenu
                          isDarkMode={isDarkMode}
                          onEdit={() => { setEditingStaff(staff); setIsAddModalOpen(true) }}
                          onDelete={() => setStaffToDelete(staff)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={`px-6 py-12 text-center text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      No staff members match your current filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className={`relative z-0 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-600'}`}>
            <p>Showing {filteredStaff.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredStaff.length)} of {filteredStaff.length} staff members</p>
            <div className="flex items-center gap-2">
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className={`h-9 rounded-lg border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}>
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <section className={`flex w-full max-w-4xl max-h-[92vh] flex-col overflow-hidden rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-8 py-6 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                </h3>
                <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {editingStaff ? 'Update staff profile details and account access.' : 'Create a new staff profile and set system permissions.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setIsAddModalOpen(false); setEditingStaff(null) }}
                className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
              >
                <X size={18} />
              </button>
            </div>

            <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleStaffSubmit}>
              <div className="min-h-0 flex-1 overflow-y-auto px-8 py-7">
                <div className="space-y-7">
                  <div>
                    <h4 className={`mb-4 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Identity & Access</h4>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Full Name <span className="text-rose-500">*</span></label>
                        <input name="fullName" defaultValue={editingStaff?.name ?? ''} placeholder="e.g. James Anderson" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 focus:border-emerald-500'}`} required />
                      </div>
                      <div className="space-y-2">
                        <label className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Email Address <span className="text-rose-500">*</span></label>
                        <input name="email" defaultValue={editingStaff?.email ?? ''} placeholder="email@infolib.com" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 focus:border-emerald-500'}`} required />
                      </div>
                      <div className="space-y-2">
                        <label className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>System Role <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <select name="role" defaultValue={editingStaff?.role ?? 'Librarian'} className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 focus:border-emerald-500'}`}>
                            <option>Librarian</option>
                            <option>Administrator</option>
                            <option>Assistant Librarian</option>
                            <option>Library Clerk</option>
                          </select>
                          <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Status <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <select name="status" defaultValue={editingStaff?.status ?? 'Active'} className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 focus:border-emerald-500'}`}>
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                          <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'} border-t pt-6`}>
                    <h4 className={`mb-4 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Account Credentials</h4>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <label className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Username <span className="text-rose-500">*</span></label>
                        <input name="username" defaultValue={editingStaff?.username ?? ''} placeholder="j.anderson" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 focus:border-emerald-500'}`} required />
                      </div>
                      <div className="space-y-2">
                        <label className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Password <span className="text-rose-500">*</span></label>
                        <input name="tempPassword" type="password" defaultValue={editingStaff?.tempPassword ?? ''} placeholder="Enter password" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 focus:border-emerald-500'}`} required />
                      </div>
                      <div className="space-y-2">
                        <label className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Confirm Password <span className="text-rose-500">*</span></label>
                        <input type="password" placeholder="Re-enter password" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 focus:border-emerald-500'}`} required />
                      </div>
                    </div>
                  </div>

                  <div className={`${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'} border-t pt-6`}>
                    <h4 className={`mb-4 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Optional</h4>
                    <div className="space-y-2">
                      <label className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Profile Photo</label>
                      <div className="flex items-center gap-3">
                        <span className={`grid h-12 w-12 place-items-center overflow-hidden rounded-full border text-xs font-bold ${isDarkMode ? 'border-zinc-700 bg-zinc-800/50 text-zinc-300' : 'border-zinc-200 bg-zinc-100 text-zinc-600'}`}>
                          {profilePhotoPreview ? (
                            <img src={profilePhotoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                          ) : (
                            avatarFromName(editingStaff?.name || 'Staff')
                          )}
                        </span>
                        <input type="file" accept="image/png,image/jpeg" onChange={handleProfilePhotoChange} className={`block w-full text-sm ${isDarkMode ? 'text-zinc-300 file:bg-zinc-800 file:text-zinc-200 file:border-zinc-700' : 'text-zinc-700 file:bg-zinc-100 file:text-zinc-700 file:border-zinc-200'} file:mr-4 file:rounded-lg file:border file:px-3 file:py-2`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex gap-4 border-t px-8 py-5 ${isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-100 bg-zinc-50/60'}`}>
                <button type="button" onClick={() => { setIsAddModalOpen(false); setEditingStaff(null) }} className={`h-12 flex-1 rounded-xl border font-bold transition-all ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>Cancel</button>
                <button
                  type="submit"
                  disabled={isSavingStaff}
                  className="h-12 flex-1 rounded-xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
                >
                  {isSavingStaff ? 'Saving...' : editingStaff ? 'Save Changes' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {staffToDelete ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <h4 className={`text-xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Delete Staff Member</h4>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Are you sure you want to remove <span className={isDarkMode ? 'text-zinc-200 font-bold' : 'text-zinc-900 font-bold'}>{staffToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className={`h-11 flex-1 rounded-xl border font-bold transition-all ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStaff}
                className="h-11 flex-1 rounded-xl bg-rose-600 font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all"
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

