import { useState } from 'react'
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
} from 'lucide-react'

type SettingsPageProps = {
  isDarkMode: boolean
  activeTab: string
  onTabChange?: (tab: string) => void
}

type ThemeMode = 'light' | 'dark' | 'system'

type OperatingDay = {
  day: string
  open: string
  close: string
  closed: boolean
}

const timeOptions = ['08:00 AM', '09:00 AM', '12:00 PM', '01:00 PM', '05:00 PM']

export function SettingsPage({ isDarkMode, activeTab, onTabChange }: SettingsPageProps) {
  const activeMenu = activeTab
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [notifications, setNotifications] = useState(true)
  const [overdueFine, setOverdueFine] = useState(true)
  const [selfRegistration, setSelfRegistration] = useState(true)
  const [autoMemberId, setAutoMemberId] = useState(true)
  const [showCatalog, setShowCatalog] = useState(true)
  const [showBarcode, setShowBarcode] = useState(true)
  const [usersRolesTab, setUsersRolesTab] = useState<'Users' | 'Roles'>('Users')
  const [operatingHours, setOperatingHours] = useState<OperatingDay[]>([
    { day: 'Monday', open: '08:00 AM', close: '05:00 PM', closed: false },
    { day: 'Tuesday', open: '08:00 AM', close: '05:00 PM', closed: false },
    { day: 'Wednesday', open: '08:00 AM', close: '05:00 PM', closed: false },
    { day: 'Thursday', open: '08:00 AM', close: '05:00 PM', closed: false },
    { day: 'Friday', open: '08:00 AM', close: '05:00 PM', closed: false },
    { day: 'Saturday', open: '09:00 AM', close: '01:00 PM', closed: false },
    { day: 'Sunday', open: '08:00 AM', close: '05:00 PM', closed: true },
  ])

  const [emailNotifs, setEmailNotifs] = useState(true)
  const [inAppNotifs, setInAppNotifs] = useState(true)
  const [previewTab, setPreviewTab] = useState<'Email' | 'In-App'>('Email')

  const [events, setEvents] = useState([
    { id: 'due-date', label: 'Due Date Reminder', desc: 'Notify members before the book due date.', icon: Calendar, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10', email: true, inApp: true, hasInApp: true },
    { id: 'overdue', label: 'Overdue Notice', desc: 'Notify members when a book is overdue.', icon: AlertCircle, color: 'text-rose-500 bg-rose-100 dark:bg-rose-500/10', email: true, inApp: true, hasInApp: true },
    { id: 'fine', label: 'Fine Notice', desc: 'Notify members about fines generated.', icon: Receipt, color: 'text-amber-500 bg-amber-100 dark:bg-amber-500/10', email: true, inApp: false, hasInApp: false },
    { id: 'reservation', label: 'Reservation Available', desc: 'Notify members when their reserved book is available.', icon: BookOpen, color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/10', email: true, inApp: true, hasInApp: true },
    { id: 'registration', label: 'Member Registration', desc: 'Notify admin when a new member registers.', icon: UsersRound, color: 'text-violet-500 bg-violet-100 dark:bg-violet-500/10', email: true, inApp: true, hasInApp: true },
    { id: 'return', label: 'Return Reminder', desc: 'Notify members who have not returned borrowed books.', icon: RotateCcw, color: 'text-sky-500 bg-sky-100 dark:bg-sky-500/10', email: true, inApp: false, hasInApp: true },
  ])

  const cardClass = isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'
  const iconBoxBg = isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#f0fdf4] text-emerald-600'
  const labelClass = isDarkMode ? 'text-slate-200' : 'text-slate-700'
  const subLabelClass = isDarkMode ? 'text-slate-400' : 'text-slate-500'
  const inputClass = isDarkMode
    ? 'border-slate-800 bg-[#0f1f49] text-slate-200'
    : 'border-slate-200 bg-white text-slate-700'

  const updateOperatingHour = (index: number, key: 'open' | 'close' | 'closed', value: string | boolean) => {
    setOperatingHours((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)),
    )
  }

  const users = [
    { name: 'Admin User', email: 'admin@infolib.com', role: 'Administrator', roleClass: 'bg-emerald-100 text-emerald-700', status: 'Active', statusClass: 'bg-emerald-100 text-emerald-700', login: 'May 14, 2026 10:30 AM' },
    { name: 'Maria Santos', email: 'maria.santos@infolib.com', role: 'Librarian', roleClass: 'bg-sky-100 text-sky-700', status: 'Active', statusClass: 'bg-emerald-100 text-emerald-700', login: 'May 14, 2026 09:15 AM' },
    { name: 'Juan Dela Cruz', email: 'juan.delacruz@infolib.com', role: 'Assistant Librarian', roleClass: 'bg-violet-100 text-violet-700', status: 'Active', statusClass: 'bg-emerald-100 text-emerald-700', login: 'May 13, 2026 04:20 PM' },
    { name: 'Ana Lim', email: 'ana.lim@infolib.com', role: 'Library Clerk', roleClass: 'bg-amber-100 text-amber-700', status: 'Active', statusClass: 'bg-emerald-100 text-emerald-700', login: 'May 13, 2026 02:45 PM' },
    { name: 'Pedro Reyes', email: 'pedro.reyes@infolib.com', role: 'Library Clerk', roleClass: 'bg-amber-100 text-amber-700', status: 'Inactive', statusClass: 'bg-rose-100 text-rose-700', login: 'May 10, 2026 11:05 AM' },
    { name: 'Sarah Wilson', email: 'sarah.wilson@infolib.com', role: 'Assistant Librarian', roleClass: 'bg-violet-100 text-violet-700', status: 'Active', statusClass: 'bg-emerald-100 text-emerald-700', login: 'May 9, 2026 03:30 PM' },
    { name: 'Carlo Garcia', email: 'carlo.garcia@infolib.com', role: 'Library Clerk', roleClass: 'bg-amber-100 text-amber-700', status: 'Active', statusClass: 'bg-emerald-100 text-emerald-700', login: 'May 8, 2026 10:10 AM' },
  ]

  const roles = [
    { title: 'Administrator', desc: 'Full access to all modules and settings.', users: '1 User', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-100' },
    { title: 'Librarian', desc: 'Manage books, members, circulation and reports.', users: '1 User', icon: BookOpen, color: 'text-sky-600 bg-sky-100' },
    { title: 'Assistant Librarian', desc: 'Assist in circulation, catalogs and member services.', users: '2 Users', icon: UserCog, color: 'text-violet-600 bg-violet-100' },
    { title: 'Library Clerk', desc: 'Handle daily operations and basic transactions.', users: '3 Users', icon: UsersRound, color: 'text-amber-600 bg-amber-100' },
  ]

  const renderUsersAndRoles = () => (
    <div className="space-y-6">
      <div className="grid items-start gap-5 lg:grid-cols-[7fr_3fr]">
        <section className={`rounded-2xl border p-4 ${cardClass}`}>
          <div className="mb-4 flex border-b border-slate-200 pb-2 text-sm font-semibold">
            <button onClick={() => setUsersRolesTab('Users')} className={`px-4 py-2 ${usersRolesTab === 'Users' ? 'border-b-2 border-emerald-600 text-emerald-600' : subLabelClass}`}>Users</button>
            <button onClick={() => setUsersRolesTab('Roles')} className={`px-4 py-2 ${usersRolesTab === 'Roles' ? 'border-b-2 border-emerald-600 text-emerald-600' : subLabelClass}`}>Roles</button>
          </div>

          {usersRolesTab === 'Users' ? (
            <>
              <div className="mb-4 grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_auto]">
                <div className={`flex h-11 items-center gap-2 rounded-xl border px-3 ${inputClass}`}>
                  <Search size={16} className="text-slate-400" />
                  <input className="w-full bg-transparent text-sm outline-none" placeholder="Search users by name, email or role..." />
                </div>
                <select className={`h-11 rounded-xl border px-3 text-sm outline-none ${inputClass}`}><option>All Roles</option></select>
                <select className={`h-11 rounded-xl border px-3 text-sm outline-none ${inputClass}`}><option>All Status</option></select>
                <button className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold ${inputClass}`}><Filter size={14} /> Filter</button>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className={`grid grid-cols-[2.1fr_1.4fr_0.9fr_1.2fr_0.8fr] gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-500'}`}>
                  <p>User</p><p>Role</p><p>Status</p><p>Last Login</p><p>Actions</p>
                </div>
                {users.map((user) => (
                  <div key={user.email} className={`grid grid-cols-[2.1fr_1.4fr_0.9fr_1.2fr_0.8fr] items-center gap-2 px-4 py-3 text-sm ${isDarkMode ? 'border-t border-slate-800' : 'border-t border-slate-100'}`}>
                    <div><p className={`font-semibold ${labelClass}`}>{user.name}</p><p className={`text-xs ${subLabelClass}`}>{user.email}</p></div>
                    <p><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.roleClass}`}>{user.role}</span></p>
                    <p><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.statusClass}`}>{user.status}</span></p>
                    <p className={`text-xs ${labelClass}`}>{user.login}</p>
                    <div className="flex gap-2">
                      <button className={`grid h-8 w-8 place-items-center rounded-lg border ${inputClass}`}><Pencil size={13} /></button>
                      <button className={`grid h-8 w-8 place-items-center rounded-lg border text-rose-500 ${inputClass}`}><Trash size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className={`text-xs ${subLabelClass}`}>Showing 1 to 7 of 7 users</p>
                <div className="flex items-center gap-2">
                  <button className={`grid h-8 w-8 place-items-center rounded-lg border ${inputClass}`}><ChevronLeft size={14} /></button>
                  <button className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-sm font-semibold text-white">1</button>
                  <button className={`grid h-8 w-8 place-items-center rounded-lg border ${inputClass}`}><ChevronRight size={14} /></button>
                  <select className={`ml-2 h-8 rounded-lg border px-2 text-sm ${inputClass}`}><option>10 / page</option></select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 max-w-[320px]">
                <div className={`flex h-11 items-center gap-2 rounded-xl border px-3 ${inputClass}`}>
                  <Search size={16} className="text-slate-400" />
                  <input className="w-full bg-transparent text-sm outline-none" placeholder="Search roles..." />
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className={`grid grid-cols-[1.4fr_2.1fr_0.6fr_0.8fr_0.8fr] gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-500'}`}>
                  <p>Role Name</p><p>Description</p><p>Users</p><p>Status</p><p>Actions</p>
                </div>
                {[
                  { title: 'Administrator', desc: 'Full access to all modules and settings.', users: '1', status: 'Active', statusClass: 'bg-emerald-100 text-emerald-700', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-100' },
                  { title: 'Librarian', desc: 'Manage books, members, circulation and reports.', users: '1', status: 'Active', statusClass: 'bg-emerald-100 text-emerald-700', icon: BookOpen, color: 'text-sky-600 bg-sky-100' },
                  { title: 'Assistant Librarian', desc: 'Assist in circulation, catalogs and member services.', users: '2', status: 'Active', statusClass: 'bg-emerald-100 text-emerald-700', icon: UserCog, color: 'text-violet-600 bg-violet-100' },
                  { title: 'Library Clerk', desc: 'Handle daily operations and basic transactions.', users: '3', status: 'Active', statusClass: 'bg-emerald-100 text-emerald-700', icon: UsersRound, color: 'text-amber-600 bg-amber-100' },
                  { title: 'View Only', desc: 'Can view books and members but cannot make changes.', users: '0', status: 'Inactive', statusClass: 'bg-rose-100 text-rose-700', icon: Eye, color: 'text-slate-600 bg-slate-100' },
                ].map((role) => (
                  <div key={role.title} className={`grid grid-cols-[1.4fr_2.1fr_0.6fr_0.8fr_0.8fr] items-center gap-2 px-4 py-3 text-sm ${isDarkMode ? 'border-t border-slate-800' : 'border-t border-slate-100'}`}>
                    <div className="flex items-center gap-3"><div className={`grid h-10 w-10 place-items-center rounded-xl ${role.color}`}><role.icon size={17} /></div><p className={`font-semibold ${labelClass}`}>{role.title}</p></div>
                    <p className={`text-sm ${subLabelClass}`}>{role.desc}</p>
                    <p className={`text-sm font-semibold ${labelClass}`}>{role.users}</p>
                    <p><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${role.statusClass}`}>{role.status}</span></p>
                    <div className="flex gap-2">
                      <button className={`grid h-8 w-8 place-items-center rounded-lg border ${inputClass}`}><Pencil size={13} /></button>
                      <button className={`grid h-8 w-8 place-items-center rounded-lg border text-rose-500 ${inputClass}`}><Trash size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className={`text-xs ${subLabelClass}`}>Showing 1 to 5 of 5 roles</p>
                <div className="flex items-center gap-2">
                  <button className={`grid h-8 w-8 place-items-center rounded-lg border ${inputClass}`}><ChevronLeft size={14} /></button>
                  <button className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-sm font-semibold text-white">1</button>
                  <button className={`grid h-8 w-8 place-items-center rounded-lg border ${inputClass}`}><ChevronRight size={14} /></button>
                  <select className={`ml-2 h-8 rounded-lg border px-2 text-sm ${inputClass}`}><option>10 / page</option></select>
                </div>
              </div>
            </>
          )}
        </section>

        <section className={`rounded-2xl border p-5 ${cardClass}`}>
          {usersRolesTab === 'Users' ? (
            <>
              <div className="mb-5 grid grid-cols-[1fr_auto] items-start gap-3">
                <div className="min-w-0">
                  <h4 className={`text-[20px] font-bold leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Roles</h4>
                  <p className={`mt-1 text-sm leading-5 ${subLabelClass}`}>Manage user roles and their permissions.</p>
                </div>
                <button className={`inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-xl border px-4 text-sm font-semibold ${inputClass}`}><Plus size={14} />Add Role</button>
              </div>
              <div className="space-y-3.5">
                {roles.map((role) => (
                  <div key={role.title} className={`grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border p-3.5 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="flex min-w-0 items-start gap-3"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${role.color}`}><role.icon size={17} /></div><div className="min-w-0"><p className={`text-sm font-semibold ${labelClass}`}>{role.title}</p><p className={`text-xs leading-5 ${subLabelClass}`}>{role.desc}</p></div></div>
                    <div className="flex items-center gap-2 whitespace-nowrap pl-2"><p className="text-xs font-semibold text-emerald-600">{role.users}</p><ChevronRight size={14} className="text-emerald-500" /></div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h4 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Role Details</h4>
              <p className={`mb-4 mt-1 text-sm ${subLabelClass}`}>View role information and permissions.</p>
              <div className={`mb-4 flex items-center justify-between rounded-xl border p-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600"><ShieldCheck size={17} /></div><p className={`font-semibold ${labelClass}`}>Administrator</p></div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
              </div>
              <div className="space-y-3">
                <div><p className={`text-sm font-semibold ${labelClass}`}>Description</p><p className={`text-sm ${subLabelClass}`}>Full access to all modules and settings.</p></div>
                <div><p className={`text-sm font-semibold ${labelClass}`}>Users</p><p className={`text-sm ${subLabelClass}`}>1 user assigned</p></div>
                <div className={`border-t pt-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <p className={`mb-2 text-sm font-semibold ${labelClass}`}>Permissions</p>
                  <p className={`mb-3 text-sm ${subLabelClass}`}>This role has access to all modules and features.</p>
                  <div className="space-y-2">
                    {[
                      ['Dashboard', 'View system overview and statistics'],
                      ['Books', 'Add, edit, delete and manage books'],
                      ['Members', 'Add, edit, delete and manage members'],
                      ['Circulation', 'Borrow, return and manage reservations'],
                      ['Reports', 'View and export all reports'],
                      ['Settings', 'Manage all system settings'],
                    ].map(([title, subtitle]) => (
                      <div key={title} className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" /><div><p className={`text-sm font-semibold ${labelClass}`}>{title}</p><p className={`text-xs ${subLabelClass}`}>{subtitle}</p></div></div>
                    ))}
                  </div>
                </div>
              </div>
              <button className={`mt-5 w-full rounded-xl border px-4 py-2.5 text-sm font-semibold ${inputClass}`}>View All Permissions</button>
            </>
          )}
        </section>
      </div>
      <div className={`flex items-center justify-between rounded-2xl border px-5 py-4 ${isDarkMode ? 'border-emerald-700/30 bg-emerald-900/10' : 'border-emerald-100 bg-emerald-50/40'}`}>
        <div>
          <p className={`text-sm font-semibold ${labelClass}`}>About Roles & Permissions</p>
          <p className={`text-xs ${subLabelClass}`}>Roles help you control what users can access and do in the system.</p>
        </div>
        <button className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${inputClass}`}>
          {usersRolesTab === 'Roles' ? 'Learn More' : 'View Permissions Guide'}
          {usersRolesTab === 'Roles' ? <ExternalLink size={14} /> : null}
        </button>
      </div>
    </div>
  )

  const renderLibraryProfile = () => (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-12">
        <section className={`rounded-3xl border p-6 lg:col-span-8 ${cardClass}`}>
          <h4 className={`mb-6 text-[22px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Library Information</h4>
          <div className="grid gap-6 md:grid-cols-[180px_1fr]">
            <div>
              <p className={`mb-2 text-[13px] font-semibold ${labelClass}`}>Library Logo</p>
              <div className={`grid h-44 place-items-center rounded-2xl border ${inputClass}`}>
                <div className="text-center">
                  <Library size={46} className="mx-auto text-emerald-500" />
                  <p className="mt-3 text-xl font-black text-emerald-600">infoLib</p>
                  <p className={`text-[10px] font-semibold uppercase tracking-wide ${subLabelClass}`}>Public Library</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border text-[13px] font-semibold ${inputClass}`}>
                  <Upload size={15} /> Upload New
                </button>
                <button className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-rose-500 ${inputClass}`}>
                  <Trash2 size={15} />
                </button>
              </div>
              <p className={`mt-2 text-[11px] ${subLabelClass}`}>Allowed: JPG, PNG, SVG</p>
              <p className={`text-[11px] ${subLabelClass}`}>Max size: 2MB</p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-2 block text-[13px] font-semibold ${labelClass}`}>Library Name *</label>
                  <input className={`h-11 w-full rounded-xl border px-3 text-[13px] outline-none focus:border-emerald-500 ${inputClass}`} defaultValue="infoLib Public Library" />
                </div>
                <div>
                  <label className={`mb-2 block text-[13px] font-semibold ${labelClass}`}>Library Code</label>
                  <input className={`h-11 w-full rounded-xl border px-3 text-[13px] outline-none focus:border-emerald-500 ${inputClass}`} defaultValue="INFLIB001" />
                </div>
              </div>

              <div>
                <label className={`mb-2 block text-[13px] font-semibold ${labelClass}`}>Address *</label>
                <input className={`h-11 w-full rounded-xl border px-3 text-[13px] outline-none focus:border-emerald-500 ${inputClass}`} defaultValue="123 Library Street, Cityville, Metro Manila, Philippines" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-2 block text-[13px] font-semibold ${labelClass}`}>Phone Number</label>
                  <input className={`h-11 w-full rounded-xl border px-3 text-[13px] outline-none focus:border-emerald-500 ${inputClass}`} defaultValue="+63 912 345 6789" />
                </div>
                <div>
                  <label className={`mb-2 block text-[13px] font-semibold ${labelClass}`}>Email Address</label>
                  <input className={`h-11 w-full rounded-xl border px-3 text-[13px] outline-none focus:border-emerald-500 ${inputClass}`} defaultValue="infolib@example.com" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-2 block text-[13px] font-semibold ${labelClass}`}>Website</label>
                  <input className={`h-11 w-full rounded-xl border px-3 text-[13px] outline-none focus:border-emerald-500 ${inputClass}`} defaultValue="https://infolib.example.com" />
                </div>
                <div>
                  <label className={`mb-2 block text-[13px] font-semibold ${labelClass}`}>Established Year</label>
                  <div className="relative">
                    <select className={`h-11 w-full appearance-none rounded-xl border px-3 pr-10 text-[13px] outline-none focus:border-emerald-500 ${inputClass}`} defaultValue="2015">
                      <option>2026</option>
                      <option>2020</option>
                      <option>2015</option>
                      <option>2010</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className={`mb-2 block text-[13px] font-semibold ${labelClass}`}>Library Description</label>
                <textarea className={`h-20 w-full resize-none rounded-xl border px-3 py-2 text-[13px] outline-none focus:border-emerald-500 ${inputClass}`} defaultValue="infoLib Public Library is dedicated to providing quality resources, services, and programs that support learning, literacy, and community development." />
              </div>
            </div>
          </div>
        </section>

        <section className={`rounded-3xl border p-6 lg:col-span-4 ${cardClass}`}>
          <h4 className={`text-[22px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Operating Hours</h4>
          <p className={`mt-1 text-[13px] ${subLabelClass}`}>Set your library's regular operating hours.</p>
          <div className="mt-5 space-y-3">
            {operatingHours.map((item, idx) => (
              <div key={item.day} className="grid grid-cols-[78px_1fr] items-center gap-3">
                <p className={`text-[13px] font-semibold ${labelClass}`}>{item.day}</p>
                {item.closed ? (
                  <label className={`inline-flex items-center gap-2 text-[13px] font-semibold ${labelClass}`}>
                    <input
                      type="checkbox"
                      checked={item.closed}
                      onChange={(event) => updateOperatingHour(idx, 'closed', event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                    />
                    Closed
                  </label>
                ) : (
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div className="relative">
                      <select
                        value={item.open}
                        onChange={(event) => updateOperatingHour(idx, 'open', event.target.value)}
                        className={`h-10 w-full appearance-none rounded-xl border px-3 pr-8 text-[13px] outline-none focus:border-emerald-500 ${inputClass}`}
                      >
                        {timeOptions.map((time) => (
                          <option key={`${item.day}-${time}`}>{time}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    <span className={subLabelClass}>-</span>
                    <div className="relative">
                      <select
                        value={item.close}
                        onChange={(event) => updateOperatingHour(idx, 'close', event.target.value)}
                        className={`h-10 w-full appearance-none rounded-xl border px-3 pr-8 text-[13px] outline-none focus:border-emerald-500 ${inputClass}`}
                      >
                        {timeOptions.map((time) => (
                          <option key={`${item.day}-close-${time}`}>{time}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className={`mt-4 text-[12px] ${subLabelClass}`}>Note: Time format is based on your system settings.</p>
        </section>
      </div>

      <section className={`rounded-3xl border p-6 ${cardClass}`}>
        <h4 className={`mb-4 text-[22px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Additional Information</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: 'Facebook', value: 'https://facebook.com/infoliblibrary', icon: Link2, color: 'text-blue-500' },
            { label: 'Instagram', value: 'https://instagram.com/infoliblibrary', icon: Image, color: 'text-pink-500' },
            { label: 'Twitter', value: 'https://twitter.com/infoliblibrary', icon: Send, color: 'text-sky-500' },
            { label: 'YouTube', value: 'https://youtube.com/@infoliblibrary', icon: Play, color: 'text-red-500' },
          ].map((field) => (
            <div key={field.label}>
              <label className={`mb-2 block text-[13px] font-semibold ${labelClass}`}>{field.label}</label>
              <div className={`flex h-11 items-center gap-3 rounded-xl border px-3 ${inputClass}`}>
                <field.icon size={18} className={field.color} />
                <input className="w-full bg-transparent text-[13px] outline-none" defaultValue={field.value} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )

  const renderGeneralSettings = () => (
    <div className="grid gap-8 lg:grid-cols-12">
      <section className={`rounded-3xl border p-8 lg:col-span-8 ${cardClass}`}>
        <div className="mb-10 flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-xl ${iconBoxBg}`}>
            <Settings2 size={24} strokeWidth={2} />
          </div>
          <div>
            <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>1. System Preferences</h4>
            <p className={`text-[13px] font-medium ${subLabelClass}`}>Configure basic system preferences.</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {[
            { label: 'Date Format', options: ['May 12, 2026 (MM DD, YYYY)', '12 May 2026 (DD MM, YYYY)'] },
            { label: 'Language', options: ['English', 'Filipino'] },
            { label: 'Time Format', options: ['12 Hour (02:30 PM)', '24 Hour (14:30)'] },
            { label: 'Currency', options: ['PHP - Philippine Peso (P)', 'USD - US Dollar ($)'] },
          ].map((field) => (
            <div key={field.label} className="space-y-2.5">
              <label className={`text-[13px] font-bold ${labelClass}`}>{field.label}</label>
              <div className="relative">
                <select className={`h-12 w-full appearance-none rounded-xl border px-4 pr-10 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}>
                  {field.options.map((option) => (
                    <option key={`${field.label}-${option}`}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-3">
          <label className={`text-[13px] font-bold ${labelClass}`}>Default Theme</label>
          <div className="flex gap-4">
            {[
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'system', icon: Monitor, label: 'System' },
            ].map((t) => {
              const isActive = theme === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as ThemeMode)}
                  className={`flex min-w-[140px] items-center justify-center gap-3 rounded-xl border px-6 py-3.5 text-[13px] font-bold transition-all duration-200 ${
                    isActive
                      ? 'border-emerald-500 bg-[#f0fdf4] text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : isDarkMode
                        ? 'border-slate-800 bg-[#0f1f49] text-slate-400 hover:bg-slate-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <t.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className={`rounded-3xl border p-8 lg:col-span-4 ${cardClass}`}>
        <div className="mb-10 flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-xl ${iconBoxBg}`}>
            <History size={24} strokeWidth={2} />
          </div>
          <div>
            <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>2. Library Rules</h4>
            <p className={`text-[13px] font-medium ${subLabelClass}`}>Set important rules and policies for your library.</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Enable Notifications', state: notifications, setState: setNotifications, icon: Bell },
            { label: 'Enable Overdue Fine', state: overdueFine, setState: setOverdueFine, icon: RotateCcw },
            { label: 'Allow Member Self-Registration', state: selfRegistration, setState: setSelfRegistration, icon: UserPlus },
            { label: 'Auto-generate Member ID', state: autoMemberId, setState: setAutoMemberId, icon: CreditCard },
            { label: 'Show Book Availability in Public Catalog', state: showCatalog, setState: setShowCatalog, icon: Globe },
          ].map((item) => (
            <div key={item.label} className={`flex items-center justify-between rounded-2xl border px-5 py-4 transition-all ${isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-[#f1f5f9] bg-white hover:bg-[#f8fafc]'}`}>
              <div className="flex items-center gap-4">
                <div className="text-emerald-600 opacity-80 dark:text-emerald-400">
                  <item.icon size={20} strokeWidth={2} />
                </div>
                <span className={`text-[13px] font-semibold ${labelClass}`}>{item.label}</span>
              </div>
              <button
                onClick={() => item.setState(!item.state)}
                className={`relative h-[26px] w-[50px] shrink-0 rounded-full transition-all duration-300 ${
                  item.state ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div className={`absolute left-1 top-1 h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-300 ${item.state ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className={`col-span-12 rounded-3xl border p-8 ${cardClass}`}>
        <div className="mb-10 flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-xl ${iconBoxBg}`}>
            <Monitor size={24} strokeWidth={2} />
          </div>
          <div>
            <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>3. Display & Behavior</h4>
            <p className={`text-[13px] font-medium ${subLabelClass}`}>Customize how the system behaves and displays information.</p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-2">
              <label className={`text-[13px] font-bold ${labelClass}`}>Items Per Page</label>
              <p className={`text-[12px] font-medium leading-relaxed ${subLabelClass}`}>Number of items to show in lists and tables.</p>
              <div className="relative mt-3">
                <select className={`h-12 w-full appearance-none rounded-xl border px-4 pr-10 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}>
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className={`text-[13px] font-bold ${labelClass}`}>Due Date Reminder</label>
              <p className={`text-[12px] font-medium leading-relaxed ${subLabelClass}`}>Send reminders before the due date.</p>
              <div className="relative mt-3">
                <select className={`h-12 w-full appearance-none rounded-xl border px-4 pr-10 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}>
                  <option>2 Days Before</option>
                  <option>1 Day Before</option>
                  <option>Same Day</option>
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-2">
              <label className={`text-[13px] font-bold ${labelClass}`}>Auto Logout</label>
              <p className={`text-[12px] font-medium leading-relaxed ${subLabelClass}`}>Automatically logout inactive users.</p>
              <div className="relative mt-3">
                <select className={`h-12 w-full appearance-none rounded-xl border px-4 pr-10 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}>
                  <option>30 Minutes</option>
                  <option>1 Hour</option>
                  <option>2 Hours</option>
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className={`self-end rounded-2xl border px-6 py-5 ${isDarkMode ? 'border-slate-800' : 'border-[#f1f5f9] bg-white'}`}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className={`text-[13px] font-bold ${labelClass}`}>Show Barcode in Receipts</label>
                  <p className={`text-[11px] font-medium leading-relaxed ${subLabelClass}`}>Display book barcode in print receipts.</p>
                </div>
                <button
                  onClick={() => setShowBarcode(!showBarcode)}
                  className={`relative h-[26px] w-[50px] shrink-0 rounded-full transition-all duration-300 ${
                    showBarcode ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <div className={`absolute left-1 top-1 h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-300 ${showBarcode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  const renderSettingsOverview = () => (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* General */}
        <section className={`flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${cardClass}`}>
          <div className="mb-8 flex items-start gap-4">
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <Settings2 size={24} />
            </div>
            <div>
              <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>General</h4>
              <p className={`mt-1 text-sm ${subLabelClass}`}>Configure general system settings like language, date format, loan rules and more.</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('General')}
            className={`mt-auto flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${inputClass}`}
          >
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Settings2 size={16} />
              <span>Manage Settings</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </section>

        {/* Library Profile */}
        <section className={`flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${cardClass}`}>
          <div className="mb-8 flex items-start gap-4">
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <Library size={24} />
            </div>
            <div>
              <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Library Profile</h4>
              <p className={`mt-1 text-sm ${subLabelClass}`}>Update library information, contact details and system identity.</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('Library Profile')}
            className={`mt-auto flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${inputClass}`}
          >
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Library size={16} />
              <span>Edit Profile</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </section>

        {/* Users & Roles */}
        <section className={`flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${cardClass}`}>
          <div className="mb-8 flex items-start gap-4">
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <UsersRound size={24} />
            </div>
            <div>
              <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Users & Roles</h4>
              <p className={`mt-1 text-sm ${subLabelClass}`}>Add users, set roles and manage permissions across the system.</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('Users & Roles')}
            className={`mt-auto flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${inputClass}`}
          >
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <UsersRound size={16} />
              <span>Manage Access</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </section>

        {/* Notifications */}
        <section className={`flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${cardClass}`}>
          <div className="mb-8 flex items-start gap-4">
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <Bell size={24} />
            </div>
            <div>
              <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</h4>
              <p className={`mt-1 text-sm ${subLabelClass}`}>Configure email notifications, alerts and reminder preferences.</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('Notifications')}
            className={`mt-auto flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${inputClass}`}
          >
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Bell size={16} />
              <span>Notification Settings</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </section>

        {/* Security */}
        <section className={`flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${cardClass}`}>
          <div className="mb-8 flex items-start gap-4">
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Security</h4>
              <p className={`mt-1 text-sm ${subLabelClass}`}>Manage password policy, sessions and other security preferences.</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('Security')}
            className={`mt-auto flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${inputClass}`}
          >
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={16} />
              <span>Security Settings</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </section>

        {/* System Secure Card */}
        <section className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'border-emerald-900/30 bg-emerald-900/10' : 'border-emerald-100/50 bg-emerald-50/20'}`}>
          <div className="flex items-center gap-8">
            <div className="relative flex-shrink-0">
              <div className={`grid h-28 w-24 place-items-center rounded-2xl border-2 ${isDarkMode ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-emerald-200 bg-white'}`}>
                <div className="relative">
                  <Lock size={40} className="text-emerald-500" />
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                    <Check size={12} strokeWidth={4} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Your system is secure</h4>
                <p className={`mt-1 text-sm font-medium ${subLabelClass}`}>All settings are protected and changes are logged.</p>
              </div>
              
              <div className={`h-[1px] w-full ${isDarkMode ? 'bg-slate-800/50' : 'bg-emerald-100'}`} />

              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Last updated</p>
                  <p className={`mt-0.5 text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>May 15, 2026 • 10:30 AM</p>
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Calendar size={18} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Settings Activity */}
      <section className={`mt-10 overflow-hidden rounded-2xl border ${cardClass}`}>
        <div className="flex items-center justify-between px-8 py-5">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Settings Activity</h3>
          <button 
            onClick={() => onTabChange?.('Overview')}
            className="flex items-center gap-1 text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-700"
          >
            <span>View all activity</span>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'bg-[#0f1f49] text-slate-300 border-y border-slate-800/50' : 'bg-slate-50 text-slate-600 border-y border-slate-100'}`}>
              <tr>
                <th className="px-8 py-3.5">Activity</th>
                <th className="px-6 py-3.5">Module</th>
                <th className="px-6 py-3.5">Updated By</th>
                <th className="px-6 py-3.5">Date & Time</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? 'bg-[#0b1738]' : 'bg-white'}>
              {[
                { 
                  title: 'General settings updated', 
                  detail: 'Loan period, Fine per day changed', 
                  module: 'General', 
                  user: 'Admin User', 
                  time: 'May 15, 2026 • 10:30 AM',
                  icon: Settings2,
                  iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                },
                { 
                  title: 'New user added: Ana Lim', 
                  detail: 'Assigned as Student Librarian', 
                  module: 'Users & Roles', 
                  user: 'Admin User', 
                  time: 'May 14, 2026 • 04:22 PM',
                  icon: UsersRound,
                  iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
                },
                { 
                  title: 'Password policy updated', 
                  detail: 'Enforced 12-char minimum length', 
                  module: 'Security', 
                  user: 'Admin User', 
                  time: 'May 13, 2026 • 09:15 AM',
                  icon: ShieldCheck,
                  iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                },
              ].map((item, idx) => (
                <tr key={idx} className={`border-t transition-colors ${isDarkMode ? 'border-slate-800/50 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`grid h-10 w-10 place-items-center rounded-lg ${item.iconBg}`}>
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.title}</p>
                        <p className={`text-xs ${subLabelClass}`}>{item.detail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ${
                      item.module === 'General' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15' :
                      item.module === 'Users & Roles' ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/15' :
                      'bg-blue-50 text-blue-700 dark:bg-blue-500/15'
                    }`}>
                      {item.module}
                    </span>
                  </td>
                  <td className={`px-6 py-5 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.user}</td>
                  <td className={`px-6 py-5 text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <div className="space-y-10 pb-20">
          <div className="mb-10 flex items-start justify-between">
            <div>
              <h2 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {activeMenu === 'Overview' ? 'Settings' : activeMenu}
              </h2>
              <p className={`mt-1 text-base ${subLabelClass}`}>
                {activeMenu === 'Library Profile'
                  ? 'Manage your library information that will appear across the system.'
                  : activeMenu === 'Users & Roles'
                    ? 'Manage system users and their roles and permissions.'
                  : activeMenu === 'Notifications'
                    ? 'Manage and customize system notifications and reminders.'
                  : activeMenu === 'General'
                    ? 'Configure basic system preferences and rules.'
                  : 'Manage your library system preferences and configuration.'}
              </p>
            </div>
            {activeMenu === 'Overview' ? null : activeMenu === 'Users & Roles' ? (
              <div className="flex gap-3">
                {usersRolesTab === 'Users' ? (
                  <button className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold ${inputClass}`}>
                    <Download size={16} /> Export
                  </button>
                ) : null}
                <button className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]">
                  <Plus size={16} /> {usersRolesTab === 'Users' ? 'Add User' : 'Add Role'}
                </button>
              </div>
            ) : (
              <button className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]">
                <Check size={18} strokeWidth={3} />
                Save Changes
              </button>
            )}
          </div>

          {activeMenu === 'Library Profile' ? (
            renderLibraryProfile()
          ) : activeMenu === 'Users & Roles' ? (
            renderUsersAndRoles()
          ) : activeMenu === 'Notifications' ? (
            renderNotifications()
          ) : activeMenu === 'General' ? (
            renderGeneralSettings()
          ) : (
            renderSettingsOverview()
          )}
      </div>
    </div>
  )
}
