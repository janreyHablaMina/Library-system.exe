import { useState, useRef, useEffect } from 'react'
import { Users, UserCheck, UserX, ShieldCheck, Calendar, Search, ChevronDown, Filter, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, MoreHorizontal } from 'lucide-react'

type StaffRole = 'Administrator' | 'Librarian' | 'Assistant Librarian' | 'Library Clerk'
type StaffStatus = 'Active' | 'Inactive'

type StaffMember = {
  id: string
  name: string
  email: string
  role: StaffRole
  branch: string
  status: StaffStatus
  joinedOn: string
  joinedTime: string
  avatar: string
}

type StaffPageProps = {
  isDarkMode: boolean
}

type StaffActionsMenuProps = {
  isDarkMode: boolean
  onEdit: () => void
  onDelete: () => void
}

const stats = [
  { label: 'Total Staff', value: '18', subValue: '↑ 2 this month', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Active Staff', value: '16', subValue: '88.9% of total', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Inactive Staff', value: '2', subValue: '11.1% of total', icon: UserX, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Administrators', value: '5', subValue: '27.8% of total', icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'New This Month', value: '1', subValue: 'New staff added', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50' },
]

const staffData: StaffMember[] = [
  { id: 'ST-001', name: 'James Anderson', email: 'james.anderson@infolib.com', role: 'Administrator', branch: 'Central Library', status: 'Active', joinedOn: 'May 10, 2026', joinedTime: '09:15 AM', avatar: '👨🏻' },
  { id: 'ST-002', name: 'Maria Santos', email: 'maria.santos@infolib.com', role: 'Librarian', branch: 'North Branch', status: 'Active', joinedOn: 'May 8, 2026', joinedTime: '02:30 PM', avatar: '👩🏽' },
  { id: 'ST-003', name: 'Juan Dela Cruz', email: 'juan.delacruz@infolib.com', role: 'Assistant Librarian', branch: 'Central Library', status: 'Active', joinedOn: 'May 7, 2026', joinedTime: '11:20 AM', avatar: '👨🏼' },
  { id: 'ST-004', name: 'Ana Lim', email: 'ana.lim@infolib.com', role: 'Librarian', branch: 'West Branch', status: 'Active', joinedOn: 'May 6, 2026', joinedTime: '10:45 AM', avatar: '👩🏻' },
  { id: 'ST-005', name: 'Pedro Reyes', email: 'pedro.reyes@infolib.com', role: 'Assistant Librarian', branch: 'South Branch', status: 'Active', joinedOn: 'May 5, 2026', joinedTime: '03:05 PM', avatar: '👨🏼' },
  { id: 'ST-006', name: 'Sarah Wilson', email: 'sarah.wilson@infolib.com', role: 'Library Clerk', branch: 'Central Library', status: 'Inactive', joinedOn: 'Apr 28, 2026', joinedTime: '09:10 AM', avatar: '👩🏼' },
  { id: 'ST-007', name: 'Carlo Garcia', email: 'carlo.garcia@infolib.com', role: 'Library Clerk', branch: 'North Branch', status: 'Active', joinedOn: 'Apr 25, 2026', joinedTime: '01:45 PM', avatar: '👨🏻' },
  { id: 'ST-008', name: 'Alicia H.', email: 'alicia.h@infolib.com', role: 'Assistant Librarian', branch: 'West Branch', status: 'Active', joinedOn: 'Apr 20, 2026', joinedTime: '11:30 AM', avatar: '👩🏻' },
]

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
    ? 'bg-[#0f172a] border-slate-700 text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
    : 'bg-white border-slate-200 text-slate-700 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'

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
              ? 'border-slate-500 bg-slate-700 text-slate-100'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : isDarkMode
              ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        <MoreHorizontal size={15} />
      </button>

      {open ? (
        <div
          className={`absolute right-0 z-50 w-44 rounded-xl border p-1.5 ${surface} ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
          role="menu"
        >
          <button
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium ${
              isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => { setOpen(false); onEdit() }}
          >
            <Pencil size={14} className="text-blue-500" />
            Edit Staff
          </button>
          <button
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium ${
              isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'
            }`}
            onClick={() => { setOpen(false); onDelete() }}
          >
            <Trash2 size={14} className="text-rose-500" />
            Delete Staff
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function StaffPage({ isDarkMode }: StaffPageProps) {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(staffData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null)
  const [staffSearch, setStaffSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'All Roles' | StaffRole>('All Roles')
  const [statusFilter, setStatusFilter] = useState<'All Status' | StaffStatus>('All Status')
  const [branchFilter, setBranchFilter] = useState<'All Branches' | string>('All Branches')

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
    const matchesBranch = branchFilter === 'All Branches' || staff.branch === branchFilter

    return matchesSearch && matchesRole && matchesStatus && matchesBranch
  })

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Staff</h2>
            <p className={`mt-1 text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage library staff and their access to the system.</p>
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
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <article key={stat.label} className={`rounded-xl border p-5 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'}`}>
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

        <div className={`mt-8 overflow-hidden rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200/60 bg-white shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)]'}`}>
          <div className={`flex flex-wrap items-center gap-4 p-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <label className={`group flex h-12 min-w-[320px] flex-1 items-center rounded-xl border px-3 transition-all ${isDarkMode ? 'border-slate-700 focus-within:border-emerald-500 bg-[#0f1f49]' : 'border-slate-200 focus-within:border-emerald-500 bg-slate-50'}`}>
              <Search size={18} className={`mr-2 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
              <input
                value={staffSearch}
                onChange={(event) => setStaffSearch(event.target.value)}
                className={`w-full bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`}
                placeholder="Search staff by name, email or role..."
              />
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Role</span>
                <div className="relative">
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value as 'All Roles' | StaffRole)}
                    className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}
                  >
                    <option value="All Roles">All Roles</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Assistant Librarian">Assistant Librarian</option>
                    <option value="Library Clerk">Library Clerk</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status</span>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as 'All Status' | StaffStatus)}
                    className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}
                  >
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Branch</span>
                <div className="relative">
                  <select
                    value={branchFilter}
                    onChange={(event) => setBranchFilter(event.target.value)}
                    className={`h-11 min-w-[140px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="Central Library">Central Library</option>
                    <option value="North Branch">North Branch</option>
                    <option value="West Branch">West Branch</option>
                    <option value="South Branch">South Branch</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStaffSearch('')
                  setRoleFilter('All Roles')
                  setStatusFilter('All Status')
                  setBranchFilter('All Branches')
                }}
                className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-white'}`}
              >
                <Filter size={16} />
                Reset
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className={isDarkMode ? 'bg-[#0f1f49]/50 text-slate-400' : 'bg-slate-50/50 text-slate-500'}>
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Staff Name</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Joined On</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-full text-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-100'}`}>{staff.avatar}</span>
                        <p className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{staff.name}</p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{staff.email}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${getRoleStyle(staff.role)}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{staff.branch}</td>
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
                      <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{staff.joinedOn}</p>
                      <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{staff.joinedTime}</p>
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
                    <td colSpan={7} className={`px-6 py-12 text-center text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      No staff members match your current filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-4 border-t p-4 text-xs font-bold ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
            <p>Showing {filteredStaff.length} of {staffMembers.length} staff members</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm">1</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>2</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>3</button>
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section className={`flex w-full max-w-4xl max-h-[92vh] flex-col overflow-hidden rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-8 py-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                </h3>
                <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {editingStaff ? 'Update staff profile details and account access.' : 'Create a new staff profile and set system permissions.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setIsAddModalOpen(false); setEditingStaff(null) }}
                className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <X size={18} />
              </button>
            </div>

            <form className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-8 py-7">
                <div className="space-y-7">
                <div>
                <h4 className={`mb-4 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Identity & Contact</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Full Name <span className="text-rose-500">*</span></label>
                    <input defaultValue={editingStaff?.name ?? ''} placeholder="e.g. James Anderson" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`} required />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Email Address <span className="text-rose-500">*</span></label>
                    <input defaultValue={editingStaff?.email ?? ''} placeholder="email@infolib.com" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`} required />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Staff ID</label>
                    <input defaultValue={editingStaff?.id ?? ''} placeholder="Auto-generate (e.g. ST-009)" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Phone Number</label>
                    <input type="tel" placeholder="0917 123 4567" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Emergency Contact (Optional)</label>
                    <input placeholder="Name and phone number" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`} />
                  </div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'border-slate-800' : 'border-slate-100'} border-t pt-6`}>
                <h4 className={`mb-4 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Role & Employment</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>System Role</label>
                    <div className="relative">
                      <select defaultValue={editingStaff?.role ?? 'Librarian'} className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`}>
                        <option>Librarian</option>
                        <option>Administrator</option>
                        <option>Assistant Librarian</option>
                        <option>Library Clerk</option>
                      </select>
                      <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Assigned Branch</label>
                    <div className="relative">
                      <select defaultValue={editingStaff?.branch ?? 'Central Library'} className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`}>
                        <option>Central Library</option>
                        <option>North Branch</option>
                        <option>West Branch</option>
                        <option>South Branch</option>
                      </select>
                      <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Status</label>
                    <div className="relative">
                      <select defaultValue={editingStaff?.status ?? 'Active'} className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`}>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                      <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Employee Type</label>
                    <div className="relative">
                      <select className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`}>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                      </select>
                      <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Start Date</label>
                    <input type="date" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`} />
                  </div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'border-slate-800' : 'border-slate-100'} border-t pt-6`}>
                <h4 className={`mb-4 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Account Access</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Username</label>
                    <input placeholder="j.anderson" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Temporary Password</label>
                    <input type="password" placeholder="Enter temporary password" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Confirm Password</label>
                    <input type="password" placeholder="Re-enter temporary password" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`} />
                  </div>
                </div>
                <label className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                  Require password reset on first login
                </label>
              </div>
                </div>
              </div>

              <div className={`flex gap-4 border-t px-8 py-5 ${isDarkMode ? 'border-slate-800 bg-[#0b1738]' : 'border-slate-100 bg-slate-50/60'}`}>
                <button type="button" onClick={() => { setIsAddModalOpen(false); setEditingStaff(null) }} className={`h-12 flex-1 rounded-xl border font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false)
                    setEditingStaff(null)
                  }}
                  className="h-12 flex-1 rounded-xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
                >
                  {editingStaff ? 'Save Changes' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {staffToDelete ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'}`}>
            <h4 className={`text-xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Delete Staff Member</h4>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Are you sure you want to remove <span className={isDarkMode ? 'text-slate-200 font-bold' : 'text-slate-900 font-bold'}>{staffToDelete.name}</span>? This is a UI-only action for now.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className={`h-11 flex-1 rounded-xl border font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setStaffMembers((prev) => prev.filter((item) => item.id !== staffToDelete.id))
                  setStaffToDelete(null)
                }}
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
