import { useState, useRef, useEffect } from 'react'
import {
  Settings2,
  UsersRound,
  Bell,
  RotateCcw,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  Check,
  Library,
  Globe,
  UserPlus,
  CreditCard,
  History,
  Upload,
  Trash2,
  Link2,
  Image,
  Play,
  Send,
  Search,
  Filter,
  Plus,
  Download,
  Pencil,
  Trash,
  ShieldCheck,
  BookOpen,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  ExternalLink,
  Mail,
  Calendar,
  AlertCircle,
  Receipt,
  Info,
  Lock,
  Shield,
  Clock,
  MoreVertical,
  MoreHorizontal,
  X,
  UserCircle,
  UserX,
  Smartphone,
} from 'lucide-react'
import { listSettingsActivity, type SettingActivityRow } from '../lib/tauriApi'

type SettingsPageProps = {
  isDarkMode: boolean
  activeTab: string
  onTabChange?: (tab: string) => void
}

type SystemUserStatus = 'Active' | 'Inactive'
type SystemUser = {
  name: string
  email: string
  role: string
  status: SystemUserStatus
  login: string
  color: string
}

type UserRowActionsMenuProps = {
  isDarkMode: boolean
  onView: () => void
  onEdit: () => void
  onResetPassword: () => void
  onToggleStatus: () => void
  onDelete: () => void
  isActive: boolean
}

function UserRowActionsMenu({
  isDarkMode,
  onView,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onDelete,
  isActive
}: UserRowActionsMenuProps) {
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

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpward(spaceBelow < 215)
    }
    setOpen((prev) => !prev)
  }

  const surface = isDarkMode
    ? 'bg-[#0f172a] border-slate-700 text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
    : 'bg-white border-slate-200 text-slate-700 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'

  const item = `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium ${
    isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
  }`

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={handleToggle}
        className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors ${
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

      {open ? (
        <div className={`absolute right-0 z-50 w-48 rounded-xl border p-1.5 ${surface} ${openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'}`}>
          <button type="button" className={item} onClick={() => { setOpen(false); onView() }}><Eye size={14} className="text-blue-500" />View Profile</button>
          <button type="button" className={item} onClick={() => { setOpen(false); onEdit() }}><Pencil size={14} className="text-indigo-500" />Edit User</button>
          <button type="button" className={item} onClick={() => { setOpen(false); onResetPassword() }}><Lock size={14} className="text-amber-500" />Reset Password</button>
          <button type="button" className={item} onClick={() => { setOpen(false); onToggleStatus() }}><UserX size={14} className="text-orange-500" />{isActive ? 'Deactivate User' : 'Activate User'}</button>
          <button
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium ${
              isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'
            }`}
            onClick={() => { setOpen(false); onDelete() }}
          >
            <Trash2 size={14} className="text-rose-500" />
            Delete User
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function SettingsPage({ isDarkMode, activeTab, onTabChange }: SettingsPageProps) {
  const activeMenu = activeTab
  const [notifications, setNotifications] = useState(true)
  const [settingsActivity, setSettingsActivity] = useState<SettingActivityRow[]>([])

  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'Librarian',
    status: 'Active' as SystemUserStatus,
  })
  const [users, setUsers] = useState<SystemUser[]>([
    { name: 'Admin User', email: 'admin@citycentralschool.edu.ph', role: 'Librarian', status: 'Active', login: 'May 15, 2026 • 10:30 AM', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Maria Santos', email: 'maria.santos@citycentralschool.edu.ph', role: 'Librarian', status: 'Active', login: 'May 15, 2026 • 09:15 AM', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'John Dela Cruz', email: 'john.delacruz@citycentralschool.edu.ph', role: 'Assistant', status: 'Active', login: 'May 14, 2026 • 02:20 PM', color: 'bg-blue-50 text-blue-600' },
    { name: 'Ana Lim', email: 'ana.lim@citycentralschool.edu.ph', role: 'Assistant', status: 'Active', login: 'May 14, 2026 • 11:05 AM', color: 'bg-blue-50 text-blue-600' },
    { name: 'Guest User', email: 'guest@citycentralschool.edu.ph', role: 'Viewer', status: 'Inactive', login: 'Apr 20, 2026 • 04:45 PM', color: 'bg-slate-50 text-slate-600' },
  ])

  const cardClass = isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'
  const iconBoxBg = isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#f0fdf4] text-emerald-600'
  const labelClass = isDarkMode ? 'text-slate-200' : 'text-slate-700'
  const subLabelClass = isDarkMode ? 'text-slate-400' : 'text-slate-500'
  const inputClass = isDarkMode
    ? 'border-slate-800 bg-[#0f1f49] text-slate-200'
    : 'border-slate-200 bg-white text-slate-700'

  const roleColor = (role: string) => {
    switch (role) {
      case 'Librarian': return 'bg-emerald-50 text-emerald-600'
      case 'Assistant': return 'bg-blue-50 text-blue-600'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  const openAddUserModal = () => {
    setEditingUser(null)
    setUserForm({ name: '', email: '', role: 'Librarian', status: 'Active' })
    setIsUserModalOpen(true)
  }

  const openEditUserModal = (user: SystemUser) => {
    setEditingUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    setIsUserModalOpen(true)
  }

  const saveUserFromModal = () => {
    const trimmedName = userForm.name.trim()
    const trimmedEmail = userForm.email.trim()
    if (!trimmedName || !trimmedEmail) return

    if (editingUser) {
      setUsers((prev) =>
        prev.map((item) =>
          item.email === editingUser.email
            ? {
                ...item,
                name: trimmedName,
                email: trimmedEmail,
                role: userForm.role,
                status: userForm.status,
                color: roleColor(userForm.role),
              }
            : item
        )
      )
    } else {
      setUsers((prev) => [
        {
          name: trimmedName,
          email: trimmedEmail,
          role: userForm.role,
          status: userForm.status,
          login: 'Just now',
          color: roleColor(userForm.role),
        },
        ...prev,
      ])
    }

    setIsUserModalOpen(false)
    setEditingUser(null)
  }

  useEffect(() => {
    let cancelled = false
    const loadSettingsActivity = async () => {
      try {
        const rows = await listSettingsActivity(10)
        if (!cancelled) setSettingsActivity(rows)
      } catch (error) {
        console.error('Failed to load settings activity:', error)
        if (!cancelled) setSettingsActivity([])
      }
    }
    loadSettingsActivity()
    return () => {
      cancelled = true
    }
  }, [])


  const renderUsersAndRoles = () => (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Users', value: '12', sub: 'All active system users', icon: UsersRound, color: 'bg-emerald-50 text-emerald-600', darkColor: 'bg-emerald-500/10 text-emerald-400' },
          { label: 'Roles', value: '3', sub: 'System roles defined', icon: ShieldCheck, color: 'bg-teal-50 text-teal-600', darkColor: 'bg-teal-500/10 text-teal-400' },
          { label: 'Active Users', value: '11', sub: 'Currently active accounts', icon: UserCircle, color: 'bg-blue-50 text-blue-600', darkColor: 'bg-blue-500/10 text-blue-400' },
          { label: 'Inactive Users', value: '1', sub: 'Deactivated accounts', icon: UserX, color: 'bg-orange-50 text-orange-600', darkColor: 'bg-orange-500/10 text-orange-400' },
        ].map((stat) => (
          <div key={stat.label} className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-6 transition-all hover:shadow-lg ${cardClass}`}>
            <div className="flex items-center gap-5">
              <div className={`grid h-14 w-14 place-items-center rounded-2xl transition-transform group-hover:scale-110 ${isDarkMode ? stat.darkColor : stat.color}`}>
                <stat.icon size={28} strokeWidth={2} />
              </div>
              <div>
                <p className={`text-[13px] font-bold ${subLabelClass}`}>{stat.label}</p>
                <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
                <p className={`text-[11px] font-medium ${subLabelClass}`}>{stat.sub}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 transition-transform group-hover:translate-x-1" />
          </div>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Users Table Column */}
        <section className={`rounded-2xl border ${cardClass}`}>
          <div className="px-8 pt-8 pb-8 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Users</h4>
              <p className={`text-[13px] font-medium ${subLabelClass}`}>View and manage all system users.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-72 items-center gap-3 rounded-xl border px-4 ${inputClass}`}>
                <Search size={18} className="text-slate-400" />
                <input className="w-full bg-transparent text-[13px] font-medium outline-none" placeholder="Search users..." />
              </div>
              <button className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-[13px] font-bold ${inputClass}`}>
                <Filter size={16} /> Filter
              </button>
              <button className={`grid h-11 w-11 place-items-center rounded-xl border ${inputClass}`}>
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'bg-[#0f1f49] text-slate-300 border-y border-slate-800/50' : 'bg-slate-50 text-slate-600 border-y border-slate-100'}`}>
                <tr>
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Last Login</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? 'bg-[#0b1738]' : 'bg-white'}>
                {users.map((user) => (
                  <tr key={user.email} className={`border-b last:border-0 transition-colors ${isDarkMode ? 'border-slate-800/50 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`grid h-10 w-10 place-items-center rounded-full text-white text-xs font-bold ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                           {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className={`text-[13px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                          <p className={`text-[11px] font-medium ${subLabelClass}`}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : user.color}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'}`} />
                        <span className={`text-[12px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{user.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-[12px] font-semibold text-slate-500">{user.login}</td>
                    <td className="px-8 py-5 text-right">
                      <UserRowActionsMenu
                        isDarkMode={isDarkMode}
                        isActive={user.status === 'Active'}
                        onView={() => alert(`Viewing ${user.name} profile...`)}
                        onEdit={() => openEditUserModal(user)}
                        onResetPassword={() => alert(`Password reset email sent to ${user.email}`)}
                        onToggleStatus={() => {
                          setUsers((prev) => prev.map((item) => item.email === user.email
                            ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' }
                            : item
                          ))
                        }}
                        onDelete={() => setUserToDelete(user)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <p className={`text-[12px] font-bold ${subLabelClass}`}>Showing 1 to {users.length} of 12 users</p>
            <div className="flex items-center gap-2">
              <button className={`grid h-10 w-10 place-items-center rounded-xl border ${inputClass}`}><ChevronLeft size={16} /></button>
              <button className="h-10 w-10 rounded-xl bg-emerald-600 text-[13px] font-bold text-white">1</button>
              <button className={`h-10 w-10 rounded-xl border text-[13px] font-bold transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${inputClass}`}>2</button>
              <button className={`h-10 w-10 rounded-xl border text-[13px] font-bold transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${inputClass}`}>3</button>
              <button className={`grid h-10 w-10 place-items-center rounded-xl border ${inputClass}`}><ChevronRight size={16} /></button>
            </div>
          </div>
        </section>

        {/* Roles Sidebar Column */}
        <div className="space-y-6">
          <section className={`rounded-2xl border p-8 ${cardClass}`}>
            <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Roles</h4>
            <p className={`mb-8 text-[13px] font-medium ${subLabelClass}`}>System roles and their permissions.</p>

            <div className="space-y-4">
              {[
                { title: 'Librarian', desc: 'Full access to all system modules.', users: '4 users', icon: UserCircle, color: 'bg-emerald-50 text-emerald-600' },
                { title: 'Assistant', desc: 'Manage circulation, members, and catalog only.', users: '6 users', icon: UserCircle, color: 'bg-blue-50 text-blue-600' },
                { title: 'Viewer', desc: 'View only access to selected modules.', users: '2 users', icon: Eye, color: 'bg-orange-50 text-orange-600' },
              ].map((role) => (
                <div key={role.title} className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all hover:border-emerald-500/50 ${isDarkMode ? 'border-slate-800 hover:bg-[#0f1f49]/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : role.color}`}>
                      <role.icon size={20} />
                    </div>
                    <div>
                      <p className={`text-[13px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{role.title}</p>
                      <p className={`text-[11px] font-medium leading-relaxed ${subLabelClass}`}>{role.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>{role.users}</span>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={`rounded-2xl border p-8 ${cardClass}`}>
            <h4 className={`mb-8 text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Quick Actions</h4>
            <div className="space-y-3">
              {[
                { label: 'Add New User', sub: 'Create a new user account', icon: UserPlus },
                { label: 'Manage Roles', sub: 'Edit roles and permissions', icon: ShieldCheck },
              ].map((action) => (
                <button key={action.label} className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${inputClass}`}>
                  <div className="flex items-center gap-4">
                    <div className="text-emerald-600 dark:text-emerald-400">
                      <action.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className={`text-[13px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{action.label}</p>
                      <p className={`text-[11px] font-medium ${subLabelClass}`}>{action.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )

  const renderLibraryProfile = () => (
    <div className="grid items-start gap-6 lg:grid-cols-[3fr_7fr]">
      {/* Library Logo Column */}
      <div className="space-y-6">
        <section className={`rounded-2xl border p-8 ${cardClass}`}>
          <div className="mb-8 flex items-center gap-4">
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${iconBoxBg}`}>
              <Image size={24} strokeWidth={2} />
            </div>
            <div>
              <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Library Logo</h4>
              <p className={`text-[12px] font-medium ${subLabelClass}`}>Recommended: 512x512px</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`h-36 w-36 rounded-full border-2 p-2 ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-white shadow-sm'}`}>
              <div className={`flex h-full w-full items-center justify-center rounded-full ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <Library size={48} className="text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-8 flex w-full flex-col gap-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/50">
                <Upload size={16} /> Change Logo
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-100 py-3 text-[13px] font-bold text-rose-500 transition-all hover:bg-rose-50 dark:border-rose-900/20 dark:hover:bg-rose-900/40">
                <Trash2 size={16} /> Remove Logo
              </button>
            </div>
          </div>
        </section>

        <section className={`rounded-2xl border p-6 transition-all hover:shadow-md ${isDarkMode ? 'border-emerald-900/30 bg-emerald-900/10' : 'border-emerald-100 bg-emerald-50/40'}`}>
          <div className="mb-4 flex items-center gap-3">
            <div className={`grid h-10 w-10 place-items-center rounded-lg ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
              <Info size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h5 className={`text-[14px] font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>Logo Guidelines</h5>
              <p className={`text-[11px] font-medium ${isDarkMode ? 'text-emerald-500/60' : 'text-emerald-600'}`}>For best display results</p>
            </div>
          </div>
          
          <ul className="space-y-3 text-[12px] font-semibold">
            {[
              { label: 'Recommended size', value: '512 x 512px' },
              { label: 'Supported formats', value: 'PNG, JPG, SVG' },
              { label: 'Maximum file size', value: '2.0 MB' },
              { label: 'Aspect ratio', value: '1:1 (Square)' },
            ].map((item) => (
              <li key={item.label} className="flex items-center justify-between border-b border-emerald-500/10 pb-2 last:border-0 last:pb-0">
                <span className={isDarkMode ? 'text-emerald-100/60' : 'text-emerald-700/70'}>{item.label}</span>
                <span className={isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}>{item.value}</span>
              </li>
            ))}
          </ul>

          <div className={`mt-5 rounded-xl p-3 text-[11px] font-medium leading-relaxed ${isDarkMode ? 'bg-emerald-500/5 text-emerald-400/80' : 'bg-white/60 text-emerald-700'}`}>
            <span className="font-bold">Pro Tip:</span> Use a transparent PNG logo for a more integrated look on both light and dark themes.
          </div>
        </section>
      </div>

      {/* Library Information */}
      <section className={`rounded-2xl border p-8 ${cardClass}`}>
        <div className="mb-10 flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-xl ${iconBoxBg}`}>
            <Library size={24} strokeWidth={2} />
          </div>
          <div>
            <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Library Information</h4>
            <p className={`text-[13px] font-medium ${subLabelClass}`}>Update your library's details and contact information.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Library Name</label>
              <input className={`h-12 w-full rounded-xl border px-4 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`} defaultValue="City Central School Library" />
            </div>
            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Contact Number</label>
              <input className={`h-12 w-full rounded-xl border px-4 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`} defaultValue="(02) 8123-4567" />
            </div>
            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Email</label>
              <input className={`h-12 w-full rounded-xl border px-4 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`} defaultValue="library@citycentralschool.edu.ph" />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Librarian / In-Charge</label>
              <input className={`h-12 w-full rounded-xl border px-4 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`} defaultValue="Maria Santos" />
            </div>
            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Address</label>
              <textarea className={`h-[148px] w-full resize-none rounded-xl border px-4 py-3 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`} defaultValue="123 Education Street, Central District,&#10;Cityville, 1234" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Description (Optional)</label>
            <textarea className={`h-24 w-full resize-none rounded-xl border px-4 py-3 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`} defaultValue="The City Central School Library supports students and teachers by providing quality resources and a quiet place to learn and discover." />
          </div>
        </div>
      </section>
    </div>
  )

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Circulation Rules */}
      <section className={`rounded-2xl border p-8 ${cardClass}`}>
        <div className="mb-10 flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-xl ${iconBoxBg}`}>
            <Calendar size={24} strokeWidth={2} />
          </div>
          <div>
            <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Circulation Rules</h4>
            <p className={`text-[13px] font-medium ${subLabelClass}`}>Set rules for borrowing and returning library materials.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Default Loan Period', sub: '(days)', desc: 'Number of days a book can be borrowed.', value: '7', icon: Calendar },
            { label: 'Fine Per Day', sub: '(PHP)', desc: 'Amount charged for each overdue day.', value: '5.00', icon: CreditCard },
            { label: 'Maximum Renewals', sub: '(times)', desc: 'How many times a loan can be renewed.', value: '2', icon: RotateCcw },
            { label: 'Grace Period', sub: '(days)', desc: 'Number of days before fines are applied.', value: '1', icon: Clock },
          ].map((item) => (
            <div key={item.label} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-emerald-600 dark:text-emerald-400">
                  <item.icon size={18} />
                </div>
                <div>
                  <label className={`block text-[13px] font-bold ${labelClass}`}>{item.label}</label>
                  <span className={`text-[11px] font-medium ${subLabelClass}`}>{item.sub}</span>
                </div>
              </div>
              <div className={`relative flex h-12 w-full items-center justify-between rounded-xl border px-4 ${inputClass}`}>
                <input type="text" className="w-full bg-transparent text-[15px] font-bold outline-none" defaultValue={item.value} />
                <div className="flex flex-col border-l border-slate-200 pl-3 dark:border-slate-800">
                  <button className="text-slate-400 hover:text-emerald-500 transition-colors"><ChevronDown size={14} className="rotate-180" /></button>
                  <button className="text-slate-400 hover:text-emerald-500 transition-colors"><ChevronDown size={14} /></button>
                </div>
              </div>
              <p className={`text-[11px] font-medium leading-relaxed ${subLabelClass}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications & Behavior */}
      <section className={`rounded-2xl border p-8 ${cardClass}`}>
        <div className="mb-10 flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-xl ${iconBoxBg}`}>
            <Bell size={24} strokeWidth={2} />
          </div>
          <div>
            <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notifications & Behavior</h4>
            <p className={`text-[13px] font-medium ${subLabelClass}`}>Configure notification settings and reservation behavior.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className={`rounded-2xl border p-6 transition-all hover:border-emerald-500/30 ${isDarkMode ? 'border-slate-800 bg-[#0f1f49]/30' : 'border-slate-100 bg-slate-50/50'}`}>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-1 items-start gap-5">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white text-emerald-600 shadow-sm'}`}>
                  <Mail size={22} />
                </div>
                <div className="space-y-1">
                  <h5 className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Email Notifications</h5>
                  <p className={`max-w-md text-[12px] font-medium leading-relaxed ${subLabelClass}`}>
                    Receive email notifications for important library activities such as reservations, due dates, and overdue items.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative h-[26px] w-[50px] shrink-0 rounded-full transition-all duration-300 ${
                    notifications ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`absolute left-1 top-1 h-[18px] w-[18px] transform rounded-full bg-white shadow-sm transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <div className={`rounded-lg px-4 py-3 text-[11px] font-semibold leading-relaxed ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                  Notification will be sent to the <br /> registered email of the member.
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Expiry */}
          <div className={`rounded-2xl border p-6 transition-all hover:border-emerald-500/30 ${isDarkMode ? 'border-slate-800 bg-[#0f1f49]/30' : 'border-slate-100 bg-slate-50/50'}`}>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-1 items-start gap-5">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white text-emerald-600 shadow-sm'}`}>
                  <Calendar size={22} />
                </div>
                <div className="space-y-1">
                  <h5 className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Reservation Expiry <span className={`text-[11px] font-medium ${subLabelClass}`}>(days)</span></h5>
                  <p className={`max-w-md text-[12px] font-medium leading-relaxed ${subLabelClass}`}>
                    Automatically cancel a reservation if it is not claimed within the set number of days.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className={`relative flex h-11 w-24 items-center justify-between rounded-xl border px-3 ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                  <input type="text" className="w-full bg-transparent text-[14px] font-bold outline-none" defaultValue="3" />
                  <div className="flex flex-col border-l border-slate-200 pl-2 dark:border-slate-800">
                    <ChevronDown size={12} className="rotate-180 text-slate-400" />
                    <ChevronDown size={12} className="text-slate-400" />
                  </div>
                </div>
                <div className={`rounded-lg px-4 py-3 text-[11px] font-semibold leading-relaxed ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                  Reservation will be cancelled <br /> after the number of days.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center gap-2 py-4">
        <Info size={16} className="text-slate-400" />
        <p className="text-[12px] font-medium text-slate-400">These settings apply to the entire library system.</p>
      </div>
    </div>
  )

  const renderAccountSecurity = () => (
    <div className="space-y-10">
      <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Change Password Section */}
        <section className={`rounded-2xl border p-8 ${cardClass}`}>
          <div className="mb-8 flex items-center gap-4">
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${iconBoxBg}`}>
              <Shield size={24} strokeWidth={2} />
            </div>
            <div>
              <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Change Password</h4>
              <p className={`text-[13px] font-medium ${subLabelClass}`}>Update your password regularly to keep your account secure.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Current Password</label>
              <div className="relative">
                <input 
                  type={showCurrentPass ? "text" : "password"}
                  className={`h-12 w-full rounded-xl border px-4 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors pr-12 ${inputClass}`} 
                  placeholder="Enter your current password" 
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>New Password</label>
              <div className="relative">
                <input 
                  type={showNewPass ? "text" : "password"}
                  className={`h-12 w-full rounded-xl border px-4 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors pr-12 ${inputClass}`} 
                  placeholder="Enter your new password" 
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  <Eye size={18} />
                </button>
              </div>
              <p className={`mt-2 text-[11px] font-medium ${subLabelClass}`}>Password must be at least 8 characters long.</p>
            </div>

            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPass ? "text" : "password"}
                  className={`h-12 w-full rounded-xl border px-4 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors pr-12 ${inputClass}`} 
                  placeholder="Confirm your new password" 
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#059669] py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]">
              <Lock size={18} />
              Save Password
            </button>
          </div>
        </section>

        {/* Login Trail Section */}
        <section className={`rounded-2xl border p-8 ${cardClass}`}>
          <div className="mb-8 flex items-center gap-4">
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${iconBoxBg}`}>
              <Clock size={24} strokeWidth={2} />
            </div>
            <div>
              <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Login Trail</h4>
              <p className={`text-[13px] font-medium ${subLabelClass}`}>A record of recent login and logout activities.</p>
            </div>
          </div>

          <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <table className="w-full text-left text-sm">
              <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                <tr className="text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3 text-center">Action</th>
                  <th className="px-4 py-3 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Admin User', role: 'Librarian', action: 'Login', date: 'May 15, 2026', time: '10:30 AM' },
                  { name: 'Admin User', role: 'Librarian', action: 'Logout', date: 'May 15, 2026', time: '12:15 PM' },
                  { name: 'Maria Santos', role: 'Librarian', action: 'Login', date: 'May 15, 2026', time: '09:05 AM' },
                  { name: 'Maria Santos', role: 'Librarian', action: 'Logout', date: 'May 15, 2026', time: '09:45 AM' },
                  { name: 'John Dela Cruz', role: 'Assistant Librarian', action: 'Login', date: 'May 14, 2026', time: '04:20 PM' },
                ].map((trail, idx) => (
                  <tr key={idx} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-10 w-10 place-items-center rounded-full text-[11px] font-bold text-white ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          {trail.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className={`text-[13px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{trail.name}</p>
                          <p className={`text-[11px] font-medium ${subLabelClass}`}>{trail.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        trail.action === 'Login' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' 
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                      }`}>
                        {trail.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className={`text-[12px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{trail.date}</p>
                      <p className={`text-[11px] font-medium ${subLabelClass}`}>{trail.time}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="mt-8 flex w-full items-center justify-between px-2 text-[14px] font-bold text-emerald-600 transition-colors hover:text-emerald-700">
            <span>View All Login Activity</span>
            <ChevronRight size={18} />
          </button>
        </section>
      </div>

      <div className="flex items-center justify-center gap-2 py-4">
        <Info size={16} className="text-slate-400" />
        <p className="text-[13px] font-medium text-slate-400">If you notice any unfamiliar activity, please change your password immediately.</p>
      </div>
    </div>
  )

  const renderSettingsOverview = () => {
    const formatActivityTime = (rawDate: string) => {
      const parsed = new Date(rawDate)
      if (Number.isNaN(parsed.getTime())) return { date: 'Unknown date', time: '--:--' }
      return {
        date: parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        time: parsed.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      }
    }

    const mapModule = (key: string) => {
      if (key.startsWith('general.')) return 'General'
      if (key.startsWith('library.')) return 'Library Profile'
      if (key.startsWith('security.')) return 'Account Security'
      if (key.startsWith('users.')) return 'Users & Roles'
      return 'General'
    }

    const activityMeta = (module: string) => {
      if (module === 'Users & Roles') {
        return {
          icon: UsersRound,
          color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400',
          badge: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
        }
      }
      if (module === 'Account Security') {
        return {
          icon: ShieldCheck,
          color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400',
          badge: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
        }
      }
      if (module === 'Library Profile') {
        return {
          icon: Library,
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400',
          badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
        }
      }
      return {
        icon: Settings2,
        color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400',
        badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
      }
    }

    const recentActivity = settingsActivity.map((item, index) => {
      const module = mapModule(item.key)
      const meta = activityMeta(module)
      const when = formatActivityTime(item.updatedAt)
      return {
        id: `${item.key}-${index}`,
        title: `${item.key.replaceAll('.', ' ')} updated`,
        detail: item.value.length > 80 ? `${item.value.slice(0, 80)}...` : item.value,
        module,
        updatedBy: 'Admin User',
        date: when.date,
        time: when.time,
        icon: meta.icon,
        color: meta.color,
        badge: meta.badge,
      }
    })

    return (
      <div className="space-y-12">
        {/* Top Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { 
              title: 'General', 
              desc: 'Configure general system settings like language, date format, loan rules and more.', 
              icon: Settings2, 
              btnText: 'Manage Settings', 
              tab: 'General',
              color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
            },
            { 
              title: 'Library Profile', 
              desc: 'Update library information, contact details and system identity.', 
              icon: Library, 
              btnText: 'Edit Profile', 
              tab: 'Library Profile',
              color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'
            },
            { 
              title: 'Users & Roles', 
              desc: 'Add users, set roles and manage permissions across the system.', 
              icon: UsersRound, 
              btnText: 'Manage Access', 
              tab: 'Users & Roles',
              color: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10'
            },
            { 
              title: 'Account Security', 
              desc: 'Change your password and view login trail to keep your account secure.', 
              icon: ShieldCheck, 
              btnText: 'Manage Security', 
              tab: 'Account Security',
              color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10'
            }
          ].map((card) => (
            <section key={card.title} className={`flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${cardClass}`}>
              <div className="mb-6 flex items-start gap-4">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${card.color}`}>
                  <card.icon size={28} />
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{card.title}</h4>
                  <p className={`mt-1.5 text-xs font-medium leading-relaxed ${subLabelClass}`}>{card.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => onTabChange?.(card.tab)}
                className={`mt-auto flex w-full items-center justify-between rounded-xl border p-3.5 text-xs font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${inputClass}`}
              >
                <span className="text-emerald-600 dark:text-emerald-400">{card.btnText}</span>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            </section>
          ))}
        </div>

        {/* Recent Activity Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Settings Activity</h3>
            <button className="flex items-center gap-2 text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-700">
              <span>View all activity</span>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={`overflow-hidden rounded-2xl border ${cardClass}`}>
            <table className="w-full text-left text-sm">
              <thead className={isDarkMode ? 'bg-[#0f1f49]/50 text-slate-300' : 'bg-slate-50/50 text-slate-600'}>
                <tr>
                  <th className="px-6 py-3.5 font-semibold">ACTIVITY</th>
                  <th className="px-6 py-3.5 font-semibold">MODULE</th>
                  <th className="px-6 py-3.5 font-semibold">UPDATED BY</th>
                  <th className="px-6 py-3.5 font-semibold text-right">DATE & TIME</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/30' : 'divide-slate-100/50'}`}>
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={`px-6 py-8 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      No settings activity yet.
                    </td>
                  </tr>
                ) : recentActivity.map((item) => (
                  <tr key={item.id} className={`transition-colors duration-150 ${isDarkMode ? 'hover:bg-[#12244f]' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.color}`}>
                          <item.icon size={20} />
                        </div>
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{item.title}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.detail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${item.badge}`}>
                        {item.module}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.updatedBy}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item.date}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.time}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <div className="space-y-10 pb-20">
          <div className="mb-10 items-start justify-between">
            {activeMenu !== 'Overview' && (
              <nav className="mb-4 flex items-center gap-2 text-[13px] font-bold">
                <button 
                  onClick={() => onTabChange?.('Overview')}
                  className="text-slate-400 transition-colors hover:text-emerald-600"
                >
                  Settings
                </button>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-emerald-600">{activeMenu}</span>
              </nav>
            )}
            <div className="flex items-start justify-between">
              <div>
                <h2 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {activeMenu === 'Overview' ? 'Settings' : activeMenu}
              </h2>
              <p className={`mt-1 text-base ${subLabelClass}`}>
                {activeMenu === 'Library Profile'
                  ? 'Manage your library information that will appear across the system.'
                  : activeMenu === 'Users & Roles'
                    ? 'Manage system users and their roles and permissions.'
                  : activeMenu === 'General'
                    ? 'Configure basic system preferences and rules.'
                  : activeMenu === 'Account Security'
                    ? 'Manage your account password and view login trail.'
                  : 'Manage your library system preferences and configuration.'}
              </p>
            </div>
            {activeMenu === 'Overview' ? null : activeMenu === 'Users & Roles' ? (
              <div className="flex gap-3">
                <button 
                  onClick={() => alert('Exporting user data...')}
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold ${inputClass}`}
                >
                  <Download size={16} /> Export
                </button>
                <button 
                  onClick={openAddUserModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]"
                >
                  <Plus size={16} /> Add New User
                </button>
              </div>
            ) : (
              <button 
                onClick={() => alert('Settings saved successfully!')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]"
              >
                <Check size={18} strokeWidth={3} />
                Save Changes
              </button>
            )}
          </div>
        </div>

          {activeMenu === 'Library Profile' ? (
            renderLibraryProfile()
          ) : activeMenu === 'Users & Roles' ? (
            renderUsersAndRoles()
          ) : activeMenu === 'Notifications' ? (
            renderGeneralSettings()
          ) : activeMenu === 'General' ? (
            renderGeneralSettings()
          ) : activeMenu === 'Account Security' ? (
            renderAccountSecurity()
          ) : (
            renderSettingsOverview()
          )}
      </div>

      {isUserModalOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px]">
          <section className={`w-full max-w-4xl rounded-2xl border shadow-2xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-6 py-5 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {editingUser ? 'Update user profile and role permissions.' : 'Create a new user account with assigned role.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setIsUserModalOpen(false); setEditingUser(null) }}
                className={`grid h-10 w-10 place-items-center rounded-xl border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <X size={18} />
              </button>
            </div>
            <form className="space-y-5 px-6 py-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${labelClass}`}>Full Name</label>
                  <input
                    value={userForm.name}
                    onChange={(event) => setUserForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="e.g. Maria Santos"
                    className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                  />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${labelClass}`}>Email Address</label>
                  <input
                    value={userForm.email}
                    onChange={(event) => setUserForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="user@library.com"
                    className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                  />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${labelClass}`}>Role</label>
                  <select
                    value={userForm.role}
                    onChange={(event) => setUserForm((prev) => ({ ...prev, role: event.target.value }))}
                    className={`h-11 w-full rounded-xl border px-3 text-sm font-semibold outline-none focus:border-emerald-500 ${inputClass}`}
                  >
                    <option>Librarian</option>
                    <option>Assistant</option>
                    <option>Viewer</option>
                  </select>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${labelClass}`}>Status</label>
                  <select
                    value={userForm.status}
                    onChange={(event) => setUserForm((prev) => ({ ...prev, status: event.target.value as SystemUserStatus }))}
                    className={`h-11 w-full rounded-xl border px-3 text-sm font-semibold outline-none focus:border-emerald-500 ${inputClass}`}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  </div>
                </div>
              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                <button type="button" onClick={() => { setIsUserModalOpen(false); setEditingUser(null) }} className={`h-11 rounded-xl border text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Cancel</button>
                <button type="button" onClick={saveUserFromModal} className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">
                  {editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {userToDelete ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${cardClass}`}>
            <h4 className={`text-xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Delete User</h4>
            <p className={`mt-2 text-sm ${subLabelClass}`}>
              Are you sure you want to remove <span className={isDarkMode ? 'text-slate-100 font-bold' : 'text-slate-900 font-bold'}>{userToDelete.name}</span>?
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setUserToDelete(null)} className={`h-11 flex-1 rounded-xl border font-bold ${inputClass}`}>Cancel</button>
              <button
                type="button"
                onClick={() => {
                  setUsers((prev) => prev.filter((item) => item.email !== userToDelete.email))
                  setUserToDelete(null)
                }}
                className="h-11 flex-1 rounded-xl bg-rose-600 font-bold text-white transition-all hover:bg-rose-700"
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
