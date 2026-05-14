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
  Clock,
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
