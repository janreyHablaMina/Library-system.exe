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
import {
  changePassword,
  createSystemUser,
  deleteSystemUser,
  getSetting,
  listEmailLogs,
  listLoginTrail,
  listSettingsActivity,
  listSystemUsers,
  resetSystemUserPassword,
  setSetting,
  testEmailConfiguration,
  updateSystemUser,
  type EmailLog,
  type LoginTrailRow,
  type SettingActivityRow,
  type SystemUser as ApiSystemUser,
} from '../lib/tauriApi'

type SettingsPageProps = {
  isDarkMode: boolean
  activeTab: string
  onTabChange?: (tab: string) => void
}

type SystemUserStatus = 'Active' | 'Inactive'
type SystemUser = {
  id: number
  username: string
  name: string
  email: string
  profilePhotoData: string | null
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
    ? 'bg-[#18181B] border-zinc-700 text-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
    : 'bg-white border-zinc-200 text-zinc-700 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'

  const item = `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium ${
    isDarkMode ? 'text-zinc-200 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-50'
  }`

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={handleToggle}
        className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors ${
          open
            ? isDarkMode
              ? 'border-zinc-500 bg-zinc-700 text-zinc-100'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : isDarkMode
              ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
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
  const [activityCurrentPage, setActivityCurrentPage] = useState(1)
  const [activityItemsPerPage, setActivityItemsPerPage] = useState(10)
  const [defaultLoanPeriod, setDefaultLoanPeriod] = useState('7')
  const [finePerDay, setFinePerDay] = useState('5.00')
  const [maximumRenewals, setMaximumRenewals] = useState('2')
  const [gracePeriod, setGracePeriod] = useState('1')
  const [reservationExpiry, setReservationExpiry] = useState('3')
  const [libraryName, setLibraryName] = useState('City Central School Library')
  const [libraryContactNumber, setLibraryContactNumber] = useState('(02) 8123-4567')
  const [libraryEmail, setLibraryEmail] = useState('library@citycentralschool.edu.ph')
  const [libraryInCharge, setLibraryInCharge] = useState('Maria Santos')
  const [libraryAddress, setLibraryAddress] = useState('123 Education Street, Central District,\nCityville, 1234')
  const [libraryDescription, setLibraryDescription] = useState('The City Central School Library supports students and teachers by providing quality resources and a quiet place to learn and discover.')
  const [libraryLogoData, setLibraryLogoData] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const userPhotoInputRef = useRef<HTMLInputElement | null>(null)

  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' })
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [loginTrail, setLoginTrail] = useState<LoginTrailRow[]>([])
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    profilePhotoData: null as string | null,
    role: 'Librarian',
    status: 'Active' as SystemUserStatus,
  })
  const [users, setUsers] = useState<SystemUser[]>([])
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [automaticReminders, setAutomaticReminders] = useState(false)
  const [senderName, setSenderName] = useState('Library Management System')
  const [senderEmail, setSenderEmail] = useState('')
  const [smtpHost, setSmtpHost] = useState('')
  const [smtpPort, setSmtpPort] = useState('587')
  const [smtpUsername, setSmtpUsername] = useState('')
  const [smtpPassword, setSmtpPassword] = useState('')
  const [testEmailTo, setTestEmailTo] = useState('')
  const [emailTestStatus, setEmailTestStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' })
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [emailLogSearch, setEmailLogSearch] = useState('')
  const [emailLogStatus, setEmailLogStatus] = useState('')
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [txtboxApiKey, setTxtboxApiKey] = useState('')
  const [smsTestTo, setSmsTestTo] = useState('')
  const [smsTestStatus, setSmsTestStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' })

  const cardClass = isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const iconBoxBg = isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#f0fdf4] text-emerald-600'
  const labelClass = isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
  const subLabelClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
  const inputClass = isDarkMode
    ? 'border-zinc-800 bg-[#27272A] text-zinc-200'
    : 'border-zinc-200 bg-white text-zinc-700'

  const roleColor = (role: string) => {
    switch (role) {
      case 'Librarian': return 'bg-emerald-50 text-emerald-600'
      case 'Assistant': return 'bg-blue-50 text-blue-600'
      default: return 'bg-zinc-50 text-zinc-600'
    }
  }

  const mapApiUser = (user: ApiSystemUser): SystemUser => {
    const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt) : null
    const login = !lastLogin || Number.isNaN(lastLogin.getTime())
      ? 'Never'
      : `${lastLogin.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • ${lastLogin.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
    return {
      id: user.id,
      username: user.username,
      name: user.fullName,
      email: user.email,
      profilePhotoData: user.profilePhotoData,
      role: user.role,
      status: user.isActive ? 'Active' : 'Inactive',
      login,
      color: roleColor(user.role),
    }
  }

  const loadSystemUsers = async () => {
    try {
      const rows = await listSystemUsers(500)
      setUsers(rows.map(mapApiUser))
    } catch (error) {
      console.error('Failed to load system users:', error)
      setUsers([])
    }
  }

  const openAddUserModal = () => {
    setEditingUser(null)
    setUserForm({ name: '', email: '', profilePhotoData: null, role: 'Librarian', status: 'Active' })
    setIsUserModalOpen(true)
  }

  const openEditUserModal = (user: SystemUser) => {
    setEditingUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      profilePhotoData: user.profilePhotoData,
      role: user.role,
      status: user.status,
    })
    setIsUserModalOpen(true)
  }

  const saveUserFromModal = async () => {
    const trimmedName = userForm.name.trim()
    const trimmedEmail = userForm.email.trim()
    if (!trimmedName || !trimmedEmail) return

    try {
      if (editingUser) {
        await updateSystemUser({
          id: editingUser.id,
          fullName: trimmedName,
          email: trimmedEmail,
          profilePhotoData: userForm.profilePhotoData,
          role: userForm.role,
          isActive: userForm.status === 'Active',
        })
      } else {
        const derivedUsername = trimmedEmail.includes('@')
          ? trimmedEmail.split('@')[0]
          : trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '.')
        await createSystemUser({
          username: derivedUsername,
          fullName: trimmedName,
          email: trimmedEmail,
          profilePhotoData: userForm.profilePhotoData,
          password: 'password123',
          role: userForm.role,
          isActive: userForm.status === 'Active',
        })
      }
      await loadSystemUsers()
      setIsUserModalOpen(false)
      setEditingUser(null)
    } catch (error) {
      console.error('Failed to save system user:', error)
    }
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

  useEffect(() => {
    let cancelled = false
    const loadLoginTrail = async () => {
      try {
        const rows = await listLoginTrail(20)
        if (!cancelled) setLoginTrail(rows)
      } catch (error) {
        console.error('Failed to load login trail:', error)
        if (!cancelled) setLoginTrail([])
      }
    }
    loadLoginTrail()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void loadSystemUsers()
  }, [])

  useEffect(() => {
    let cancelled = false
    const loadGeneralSettings = async () => {
      try {
        const [
          loanPeriod,
          fine,
          renewals,
          grace,
          emailNotif,
          reservationExpiryDays,
          name,
          contactNumber,
          email,
          inCharge,
          address,
          description,
          logoData,
          configuredEmailEnabled,
          configuredAutomaticReminders,
          configuredSenderName,
          configuredSenderEmail,
          configuredSmtpHost,
          configuredSmtpPort,
          configuredSmtpUsername,
          configuredSmtpPassword,
          configuredSmsEnabled,
          configuredTxtboxApiKey,
        ] = await Promise.all([
          getSetting('general.default_loan_period'),
          getSetting('general.fine_per_day'),
          getSetting('general.maximum_renewals'),
          getSetting('general.grace_period'),
          getSetting('general.email_notifications'),
          getSetting('general.reservation_expiry_days'),
          getSetting('library.name'),
          getSetting('library.contact_number'),
          getSetting('library.email'),
          getSetting('library.in_charge'),
          getSetting('library.address'),
          getSetting('library.description'),
          getSetting('library.logo_data'),
          getSetting('email.enabled'),
          getSetting('email.automatic_reminders'),
          getSetting('email.sender_name'),
          getSetting('email.sender_email'),
          getSetting('email.smtp_host'),
          getSetting('email.smtp_port'),
          getSetting('email.smtp_username'),
          getSetting('email.smtp_password'),
          getSetting('sms.enabled'),
          getSetting('sms.txtbox_api_key'),
        ])

        if (cancelled) return
        if (loanPeriod) setDefaultLoanPeriod(loanPeriod)
        if (fine) setFinePerDay(fine)
        if (renewals) setMaximumRenewals(renewals)
        if (grace) setGracePeriod(grace)
        if (reservationExpiryDays) setReservationExpiry(reservationExpiryDays)
        if (emailNotif) setNotifications(emailNotif === 'true')
        if (name) setLibraryName(name)
        if (contactNumber) setLibraryContactNumber(contactNumber)
        if (email) setLibraryEmail(email)
        if (inCharge) setLibraryInCharge(inCharge)
        if (address) setLibraryAddress(address)
        if (description) setLibraryDescription(description)
        if (logoData) setLibraryLogoData(logoData)
        if (configuredEmailEnabled) setEmailEnabled(configuredEmailEnabled === 'true')
        if (configuredAutomaticReminders) setAutomaticReminders(configuredAutomaticReminders === 'true')
        if (configuredSenderName) setSenderName(configuredSenderName)
        if (configuredSenderEmail) {
          setSenderEmail(configuredSenderEmail)
          setTestEmailTo(configuredSenderEmail)
        }
        if (configuredSmtpHost) setSmtpHost(configuredSmtpHost)
        if (configuredSmtpPort) setSmtpPort(configuredSmtpPort)
        if (configuredSmtpUsername) setSmtpUsername(configuredSmtpUsername)
        if (configuredSmtpPassword) setSmtpPassword(configuredSmtpPassword)
        if (configuredSmsEnabled) setSmsEnabled(configuredSmsEnabled === 'true')
        if (configuredTxtboxApiKey) setTxtboxApiKey(configuredTxtboxApiKey)
      } catch (error) {
        console.error('Failed to load general settings:', error)
      }
    }

    loadGeneralSettings()
    return () => {
      cancelled = true
    }
  }, [])

  const saveGeneralSetting = async (key: string, value: string) => {
    try {
      await setSetting(key, value)
    } catch (error) {
      console.error(`Failed to save setting ${key}:`, error)
    }
  }

  const loadEmailLogs = async () => {
    try {
      const rows = await listEmailLogs(emailLogSearch, emailLogStatus, 200)
      setEmailLogs(rows)
    } catch (error) {
      console.error('Failed to load email logs:', error)
      setEmailLogs([])
    }
  }

  useEffect(() => {
    if (activeMenu !== 'Email Logs') return
    void loadEmailLogs()
  }, [activeMenu, emailLogSearch, emailLogStatus])

  const saveEmailSetting = async (key: string, value: string) => {
    await saveGeneralSetting(key, value)
  }

  const handleTestSms = async () => {
    const recipient = smsTestTo.trim()
    if (!recipient) {
      setSmsTestStatus({ type: 'error', message: 'Enter a test recipient phone number.' })
      return
    }
    setSmsTestStatus({ type: 'idle', message: '' })
    try {
      const message = await invoke('test_sms_configuration', { to: recipient }) as string
      setSmsTestStatus({ type: 'success', message })
      void loadEmailLogs()
    } catch (error) {
      setSmsTestStatus({ type: 'error', message: typeof error === 'string' ? error : error instanceof Error ? error.message : 'Failed to send test SMS.' })
      void loadEmailLogs()
    }
  }

  const saveSmsSetting = async (key: string, value: string) => {
    await saveGeneralSetting(key, value)
  }

  const handleTestEmail = async () => {
    const recipient = testEmailTo.trim() || senderEmail.trim()
    if (!recipient) {
      setEmailTestStatus({ type: 'error', message: 'Enter a test recipient email address.' })
      return
    }
    setEmailTestStatus({ type: 'idle', message: '' })
    try {
      const message = await testEmailConfiguration(recipient)
      setEmailTestStatus({ type: 'success', message })
      void loadEmailLogs()
    } catch (error) {
      setEmailTestStatus({ type: 'error', message: typeof error === 'string' ? error : error instanceof Error ? error.message : 'Failed to send test email.' })
      void loadEmailLogs()
    }
  }

  const handleSavePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPasswordStatus({ type: 'error', message: 'Please fill out all password fields.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirm password do not match.' })
      return
    }
    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 8 characters.' })
      return
    }

    setIsSavingPassword(true)
    setPasswordStatus({ type: 'idle', message: '' })
    try {
      await changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordStatus({ type: 'success', message: 'Password updated successfully.' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to change password.'
      setPasswordStatus({ type: 'error', message })
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleLogoFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const result = typeof reader.result === 'string' ? reader.result : null
      if (!result) return
      setLibraryLogoData(result)
      await saveGeneralSetting('library.logo_data', result)
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const removeLibraryLogo = async () => {
    setLibraryLogoData(null)
    await saveGeneralSetting('library.logo_data', '')
  }

  const handleUserProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null
      setUserForm((prev) => ({ ...prev, profilePhotoData: result }))
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.status === 'Active').length
  const inactiveUsers = totalUsers - activeUsers
  const rolesCount = new Set(users.map((user) => user.role)).size

  const renderUsersAndRoles = () => (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Users', value: String(totalUsers), sub: 'All active system users', icon: UsersRound, color: 'bg-emerald-50 text-emerald-600', darkColor: 'bg-emerald-500/10 text-emerald-400' },
          { label: 'Roles', value: String(rolesCount), sub: 'System roles defined', icon: ShieldCheck, color: 'bg-teal-50 text-teal-600', darkColor: 'bg-teal-500/10 text-teal-400' },
          { label: 'Active Users', value: String(activeUsers), sub: 'Currently active accounts', icon: UserCircle, color: 'bg-blue-50 text-blue-600', darkColor: 'bg-blue-500/10 text-blue-400' },
          { label: 'Inactive Users', value: String(inactiveUsers), sub: 'Deactivated accounts', icon: UserX, color: 'bg-orange-50 text-orange-600', darkColor: 'bg-orange-500/10 text-orange-400' },
        ].map((stat) => (
          <div key={stat.label} className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-6 transition-all hover:shadow-lg ${cardClass}`}>
            <div className="flex items-center gap-5">
              <div className={`grid h-14 w-14 place-items-center rounded-2xl transition-transform group-hover:scale-110 ${isDarkMode ? stat.darkColor : stat.color}`}>
                <stat.icon size={28} strokeWidth={2} />
              </div>
              <div>
                <p className={`text-[13px] font-bold ${subLabelClass}`}>{stat.label}</p>
                <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{stat.value}</h3>
                <p className={`text-[11px] font-medium ${subLabelClass}`}>{stat.sub}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-zinc-300 transition-transform group-hover:translate-x-1" />
          </div>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Users Table Column */}
        <section className={`rounded-2xl border ${cardClass}`}>
          <div className="px-8 pt-8 pb-8 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Users</h4>
              <p className={`text-[13px] font-medium ${subLabelClass}`}>View and manage all system users.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-72 items-center gap-3 rounded-xl border px-4 ${inputClass}`}>
                <Search size={18} className="text-zinc-400" />
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

          <div className={`relative z-10 ${isDarkMode ? 'overflow-x-auto lg:overflow-visible bg-[#18181B]' : 'overflow-x-auto lg:overflow-visible bg-white'}`}>
            <table className="w-full text-left">
              <thead className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'bg-[#27272A] text-zinc-300 border-y border-zinc-800/50' : 'bg-zinc-50 text-zinc-600 border-y border-zinc-100'}`}>
                <tr>
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Last Login</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? 'bg-[#18181B]' : 'bg-white'}>
                {users.map((user) => (
                  <tr key={user.id} className={`border-b last:border-0 transition-colors ${isDarkMode ? 'border-zinc-800/50 hover:bg-[#3F3F46]' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full text-white text-xs font-bold ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                          {user.profilePhotoData ? (
                            <img src={user.profilePhotoData} alt={`${user.name} profile`} className="h-full w-full object-cover" />
                          ) : (
                            user.name.split(' ').map(n => n[0]).join('')
                          )}
                        </div>
                        <div>
                          <p className={`text-[13px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{user.name}</p>
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
                        <span className={`text-[12px] font-bold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{user.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-[12px] font-semibold text-zinc-500">{user.login}</td>
                    <td className="px-8 py-5 text-right align-top">
                      <UserRowActionsMenu
                        isDarkMode={isDarkMode}
                        isActive={user.status === 'Active'}
                        onView={() => alert(`Viewing ${user.name} profile...`)}
                        onEdit={() => openEditUserModal(user)}
                        onResetPassword={() => {
                          void resetSystemUserPassword(user.id, 'password123').then(loadSystemUsers).catch((error) => {
                            console.error('Failed to reset password:', error)
                          })
                        }}
                        onToggleStatus={() => {
                          void updateSystemUser({
                            id: user.id,
                            fullName: user.name,
                            email: user.email,
                            role: user.role,
                            isActive: user.status !== 'Active',
                          }).then(loadSystemUsers).catch((error) => {
                            console.error('Failed to toggle user status:', error)
                          })
                        }}
                        onDelete={() => setUserToDelete(user)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
            <p className={`text-[12px] font-bold ${subLabelClass}`}>Showing 1 to {users.length} of {users.length} users</p>
            <div className="flex items-center gap-2">
              <button className={`grid h-10 w-10 place-items-center rounded-xl border ${inputClass}`}><ChevronLeft size={16} /></button>
              <button className="h-10 w-10 rounded-xl bg-emerald-600 text-[13px] font-bold text-white">1</button>
              <button className={`h-10 w-10 rounded-xl border text-[13px] font-bold transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${inputClass}`}>2</button>
              <button className={`h-10 w-10 rounded-xl border text-[13px] font-bold transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${inputClass}`}>3</button>
              <button className={`grid h-10 w-10 place-items-center rounded-xl border ${inputClass}`}><ChevronRight size={16} /></button>
            </div>
          </div>
        </section>

        {/* Roles Sidebar Column */}
        <div className="space-y-6">
          <section className={`rounded-2xl border p-8 ${cardClass}`}>
            <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Roles</h4>
            <p className={`mb-8 text-[13px] font-medium ${subLabelClass}`}>System roles and their permissions.</p>

            <div className="space-y-4">
              {[
                { title: 'Librarian', desc: 'Full access to all system modules.', users: '4 users', icon: UserCircle, color: 'bg-emerald-50 text-emerald-600' },
                { title: 'Assistant', desc: 'Manage circulation, members, and catalog only.', users: '6 users', icon: UserCircle, color: 'bg-blue-50 text-blue-600' },
                { title: 'Viewer', desc: 'View only access to selected modules.', users: '2 users', icon: Eye, color: 'bg-orange-50 text-orange-600' },
              ].map((role) => (
                <div key={role.title} className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all hover:border-emerald-500/50 ${isDarkMode ? 'border-zinc-800 hover:bg-[#27272A]/30' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : role.color}`}>
                      <role.icon size={20} />
                    </div>
                    <div>
                      <p className={`text-[13px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{role.title}</p>
                      <p className={`text-[11px] font-medium leading-relaxed ${subLabelClass}`}>{role.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>{role.users}</span>
                    <ChevronRight size={14} className="text-zinc-300" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={`rounded-2xl border p-8 ${cardClass}`}>
            <h4 className={`mb-8 text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Quick Actions</h4>
            <div className="space-y-3">
              {[
                { label: 'Add New User', sub: 'Create a new user account', icon: UserPlus },
                { label: 'Manage Roles', sub: 'Edit roles and permissions', icon: ShieldCheck },
              ].map((action) => (
                <button key={action.label} className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${inputClass}`}>
                  <div className="flex items-center gap-4">
                    <div className="text-emerald-600 dark:text-emerald-400">
                      <action.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className={`text-[13px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{action.label}</p>
                      <p className={`text-[11px] font-medium ${subLabelClass}`}>{action.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-zinc-300" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )

  const renderGeneralSettings = () => {
    const numberFields = [
      {
        label: 'Default Loan Period',
        helper: 'Number of days a borrowed book is due by default.',
        value: defaultLoanPeriod,
        setter: setDefaultLoanPeriod,
        settingKey: 'general.default_loan_period',
        suffix: 'days',
      },
      {
        label: 'Fine Per Day',
        helper: 'Daily overdue fine charged after the grace period.',
        value: finePerDay,
        setter: setFinePerDay,
        settingKey: 'general.fine_per_day',
        suffix: 'PHP',
      },
      {
        label: 'Maximum Renewals',
        helper: 'How many times a member can renew one borrowed book.',
        value: maximumRenewals,
        setter: setMaximumRenewals,
        settingKey: 'general.maximum_renewals',
        suffix: 'times',
      },
      {
        label: 'Grace Period',
        helper: 'Extra days before overdue fines begin.',
        value: gracePeriod,
        setter: setGracePeriod,
        settingKey: 'general.grace_period',
        suffix: 'days',
      },
      {
        label: 'Reservation Expiry',
        helper: 'How long a reservation stays active before expiring.',
        value: reservationExpiry,
        setter: setReservationExpiry,
        settingKey: 'general.reservation_expiry_days',
        suffix: 'days',
      },
    ]

    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <section className={`rounded-2xl border p-6 ${cardClass}`}>
          <div className="mb-6">
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Circulation Rules</h3>
            <p className={`mt-1 text-sm ${subLabelClass}`}>Configure the default borrowing and reservation behavior.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {numberFields.map((field) => (
              <label key={field.settingKey} className={`rounded-xl border p-4 ${inputClass}`}>
                <span className={`block text-sm font-bold ${labelClass}`}>{field.label}</span>
                <span className={`mt-1 block text-xs ${subLabelClass}`}>{field.helper}</span>
                <div className={`mt-3 flex h-11 items-center rounded-xl border px-3 ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-zinc-50'}`}>
                  <input
                    value={field.value}
                    onChange={(event) => field.setter(event.target.value)}
                    onBlur={() => saveGeneralSetting(field.settingKey, field.value)}
                    className={`w-full bg-transparent text-sm font-semibold outline-none ${isDarkMode ? 'text-zinc-100' : 'text-zinc-700'}`}
                  />
                  <span className={`ml-2 text-xs font-bold ${subLabelClass}`}>{field.suffix}</span>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className={`rounded-2xl border p-6 ${cardClass}`}>
          <div className="mb-6">
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>System Preferences</h3>
            <p className={`mt-1 text-sm ${subLabelClass}`}>Basic notification behavior for library operations.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = !notifications
              setNotifications(next)
              void saveGeneralSetting('general.email_notifications', String(next))
            }}
            className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${
              isDarkMode ? 'border-zinc-700 bg-[#27272A] hover:bg-zinc-800' : 'border-zinc-200 bg-white hover:bg-zinc-50'
            }`}
          >
            <div>
              <p className={`text-sm font-bold ${labelClass}`}>Email Notifications</p>
              <p className={`mt-1 text-xs ${subLabelClass}`}>{notifications ? 'Enabled for general notices.' : 'Disabled for general notices.'}</p>
            </div>
            <span className={`inline-flex h-6 w-11 items-center rounded-full p-1 transition-colors ${notifications ? 'bg-emerald-600' : isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
              <span className={`h-4 w-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0'}`} />
            </span>
          </button>
        </section>
      </div>
    )
  }

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
              <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Library Logo</h4>
              <p className={`text-[12px] font-medium ${subLabelClass}`}>Recommended: 512x512px</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`h-36 w-36 rounded-full border-2 p-2 ${isDarkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-100 bg-white shadow-sm'}`}>
              {libraryLogoData ? (
                <img
                  src={libraryLogoData}
                  alt="Library logo"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className={`flex h-full w-full items-center justify-center rounded-full ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <Library size={48} className="text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="mt-8 flex w-full flex-col gap-3">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                className="hidden"
                onChange={handleLogoFileChange}
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 py-3 text-[13px] font-bold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
              >
                <Upload size={16} /> Change Logo
              </button>
              <button
                onClick={() => { void removeLibraryLogo() }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-100 py-3 text-[13px] font-bold text-rose-500 transition-all hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/20 dark:hover:bg-rose-900/40"
                disabled={!libraryLogoData}
              >
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
            <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Library Information</h4>
            <p className={`text-[13px] font-medium ${subLabelClass}`}>Update your library's details and contact information.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Library Name</label>
              <input
                className={`h-12 w-full rounded-xl border px-4 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}
                value={libraryName}
                onChange={(event) => setLibraryName(event.target.value)}
                onBlur={() => saveGeneralSetting('library.name', libraryName)}
              />
            </div>
            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Contact Number</label>
              <input
                className={`h-12 w-full rounded-xl border px-4 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}
                value={libraryContactNumber}
                onChange={(event) => setLibraryContactNumber(event.target.value)}
                onBlur={() => saveGeneralSetting('library.contact_number', libraryContactNumber)}
              />
            </div>
            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Email</label>
              <input
                className={`h-12 w-full rounded-xl border px-4 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}
                value={libraryEmail}
                onChange={(event) => setLibraryEmail(event.target.value)}
                onBlur={() => saveGeneralSetting('library.email', libraryEmail)}
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Librarian / In-Charge</label>
              <input
                className={`h-12 w-full rounded-xl border px-4 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}
                value={libraryInCharge}
                onChange={(event) => setLibraryInCharge(event.target.value)}
                onBlur={() => saveGeneralSetting('library.in_charge', libraryInCharge)}
              />
            </div>
            <div>
              <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Address</label>
              <textarea
                className={`h-[148px] w-full resize-none rounded-xl border px-4 py-3 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}
                value={libraryAddress}
                onChange={(event) => setLibraryAddress(event.target.value)}
                onBlur={() => saveGeneralSetting('library.address', libraryAddress)}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={`mb-2 block text-[13px] font-bold ${labelClass}`}>Description (Optional)</label>
            <textarea
              className={`h-24 w-full resize-none rounded-xl border px-4 py-3 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}
              value={libraryDescription}
              onChange={(event) => setLibraryDescription(event.target.value)}
              onBlur={() => saveGeneralSetting('library.description', libraryDescription)}
            />
          </div>
        </div>
      </section>
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
              <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Change Password</h4>
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
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500 transition-colors"
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
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500 transition-colors"
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
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500 transition-colors"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <button
              onClick={() => { void handleSavePassword() }}
              disabled={isSavingPassword}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#059669] py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock size={18} />
              {isSavingPassword ? 'Saving...' : 'Save Password'}
            </button>
            {passwordStatus.message ? (
              <p className={`text-[12px] font-semibold ${passwordStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
                {passwordStatus.message}
              </p>
            ) : null}
          </div>
        </section>

        {/* Login Trail Section */}
        <section className={`rounded-2xl border p-8 ${cardClass}`}>
          <div className="mb-8 flex items-center gap-4">
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${iconBoxBg}`}>
              <Clock size={24} strokeWidth={2} />
            </div>
            <div>
              <h4 className={`text-[17px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Login Trail</h4>
              <p className={`text-[13px] font-medium ${subLabelClass}`}>A record of recent login and logout activities.</p>
            </div>
          </div>

          <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <table className="w-full text-left text-sm">
              <thead className={isDarkMode ? 'bg-[#27272A] text-zinc-300' : 'bg-zinc-50 text-zinc-600'}>
                <tr className="text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3 text-center">Action</th>
                  <th className="px-4 py-3 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {loginTrail.flatMap((session, idx) => {
                  const loginDate = new Date(session.loginAt)
                  const loginRow = {
                    key: `login-${idx}`,
                    name: session.username,
                    role: session.role,
                    action: 'Login',
                    date: Number.isNaN(loginDate.getTime()) ? 'Unknown date' : loginDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
                    time: Number.isNaN(loginDate.getTime()) ? '--:--' : loginDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
                  }
                  const logoutRows = session.logoutAt ? (() => {
                    const logoutDate = new Date(session.logoutAt as string)
                    return [{
                      key: `logout-${idx}`,
                      name: session.username,
                      role: session.role,
                      action: 'Logout',
                      date: Number.isNaN(logoutDate.getTime()) ? 'Unknown date' : logoutDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
                      time: Number.isNaN(logoutDate.getTime()) ? '--:--' : logoutDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
                    }]
                  })() : []
                  return [loginRow, ...logoutRows]
                }).slice(0, 8).map((trail) => (
                  <tr key={trail.key} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-zinc-700 hover:bg-[#3F3F46]' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-10 w-10 place-items-center rounded-full text-[11px] font-bold text-white ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                          {trail.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className={`text-[13px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{trail.name}</p>
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
                      <p className={`text-[12px] font-bold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{trail.date}</p>
                      <p className={`text-[11px] font-medium ${subLabelClass}`}>{trail.time}</p>
                    </td>
                  </tr>
                ))}
                {loginTrail.length === 0 ? (
                  <tr>
                    <td colSpan={3} className={`px-4 py-8 text-center text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      No login activity yet.
                    </td>
                  </tr>
                ) : null}
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
        <Info size={16} className="text-zinc-400" />
        <p className="text-[13px] font-medium text-zinc-400">If you notice any unfamiliar activity, please change your password immediately.</p>
      </div>
    </div>
  )

  const renderEmailConfiguration = () => (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className={`rounded-2xl border p-6 ${cardClass}`}>
        <div className="mb-6 flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-2xl ${iconBoxBg}`}><Mail size={24} /></div>
          <div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Email Configuration</h3>
            <p className={`text-sm ${subLabelClass}`}>Configure the sender and SMTP account used for book reminders.</p>
          </div>
        </div>

        <div className="space-y-5">
          {[
            { label: 'Enable Email Notifications', value: emailEnabled, setter: setEmailEnabled, key: 'email.enabled' },
            { label: 'Enable Automatic Reminders', value: automaticReminders, setter: setAutomaticReminders, key: 'email.automatic_reminders' },
          ].map((toggle) => (
            <div key={toggle.key} className={`flex items-center justify-between rounded-xl border p-4 ${inputClass}`}>
              <div>
                <p className={`text-sm font-bold ${labelClass}`}>{toggle.label}</p>
                <p className={`text-xs ${subLabelClass}`}>{toggle.value ? 'Enabled' : 'Disabled'}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !toggle.value
                  toggle.setter(next)
                  void saveEmailSetting(toggle.key, String(next))
                }}
                className={`relative h-7 w-12 rounded-full transition-colors ${toggle.value ? 'bg-emerald-600' : isDarkMode ? 'bg-zinc-700' : 'bg-zinc-300'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${toggle.value ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: 'Sender Name', value: senderName, setter: setSenderName, key: 'email.sender_name', placeholder: 'Library Management System' },
              { label: 'Sender Email', value: senderEmail, setter: setSenderEmail, key: 'email.sender_email', placeholder: 'library@example.com' },
              { label: 'SMTP Host', value: smtpHost, setter: setSmtpHost, key: 'email.smtp_host', placeholder: 'smtp.gmail.com' },
              { label: 'SMTP Port', value: smtpPort, setter: setSmtpPort, key: 'email.smtp_port', placeholder: '587' },
              { label: 'SMTP Username', value: smtpUsername, setter: setSmtpUsername, key: 'email.smtp_username', placeholder: 'SMTP username' },
              { label: 'SMTP Password / App Password', value: smtpPassword, setter: setSmtpPassword, key: 'email.smtp_password', placeholder: 'App password' },
            ].map((field) => (
              <label key={field.key} className="space-y-2">
                <span className={`text-sm font-bold ${labelClass}`}>{field.label}</span>
                <input
                  type={field.label === 'SMTP Password / App Password' ? 'password' : 'text'}
                  value={field.value}
                  onChange={(event) => field.setter(event.target.value)}
                  onBlur={() => void saveEmailSetting(field.key, field.value)}
                  placeholder={field.placeholder}
                  className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                />
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className={`rounded-2xl border p-6 ${cardClass}`}>
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Test Email</h3>
        <p className={`mt-1 text-sm ${subLabelClass}`}>Send a quick test using the current configuration.</p>
        <div className="mt-5 space-y-3">
          <label className="space-y-2">
            <span className={`text-sm font-bold ${labelClass}`}>Recipient Email</span>
            <input value={testEmailTo} onChange={(event) => setTestEmailTo(event.target.value)} placeholder="recipient@example.com" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-emerald-500 ${inputClass}`} />
          </label>
          <button type="button" onClick={() => void handleTestEmail()} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#059669] px-5 text-sm font-bold text-white hover:bg-emerald-700">
            <Send size={16} /> Test Email
          </button>
          {emailTestStatus.message ? (
            <p className={`text-sm font-semibold ${emailTestStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>{emailTestStatus.message}</p>
          ) : null}
        </div>
      </section>

      {/* SMS Configuration Section */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] mt-6">
        <section className={`rounded-2xl border p-6 ${cardClass}`}>
          <div className="mb-6 flex items-center gap-4">
            <div className={`grid h-12 w-12 place-items-center rounded-2xl ${iconBoxBg}`}><Smartphone size={24} /></div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>SMS Configuration</h3>
              <p className={`text-sm ${subLabelClass}`}>Configure the TxtBox API used for sending text messages.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className={`flex items-center justify-between rounded-xl border p-4 ${inputClass}`}>
              <div>
                <p className={`text-sm font-bold ${labelClass}`}>Enable SMS Notifications</p>
                <p className={`text-xs ${subLabelClass}`}>{smsEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !smsEnabled
                  setSmsEnabled(next)
                  void saveSmsSetting('sms.enabled', String(next))
                }}
                className={`relative h-7 w-12 rounded-full transition-colors ${smsEnabled ? 'bg-emerald-600' : isDarkMode ? 'bg-zinc-700' : 'bg-zinc-300'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${smsEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            <label className="space-y-2 block">
              <span className={`text-sm font-bold ${labelClass}`}>TxtBox API Key</span>
              <input
                type="password"
                value={txtboxApiKey}
                onChange={(event) => setTxtboxApiKey(event.target.value)}
                onBlur={() => void saveSmsSetting('sms.txtbox_api_key', txtboxApiKey)}
                placeholder="TxtBox API Key"
                className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
              />
            </label>
          </div>
        </section>

        <section className={`rounded-2xl border p-6 ${cardClass}`}>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Test SMS</h3>
          <p className={`mt-1 text-sm ${subLabelClass}`}>Send a quick test SMS using the current configuration.</p>
          <div className="mt-5 space-y-3">
            <label className="space-y-2 block">
              <span className={`text-sm font-bold ${labelClass}`}>Recipient Phone Number</span>
              <input value={smsTestTo} onChange={(event) => setSmsTestTo(event.target.value)} placeholder="09xxxxxxxxx" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-emerald-500 ${inputClass}`} />
            </label>
            <button type="button" onClick={() => void handleTestSms()} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#059669] px-5 text-sm font-bold text-white hover:bg-emerald-700">
              <Send size={16} /> Test SMS
            </button>
            {smsTestStatus.message ? (
              <p className={`text-sm font-semibold ${smsTestStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>{smsTestStatus.message}</p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )


  const renderSmsConfiguration = () => (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className={`rounded-2xl border p-6 ${cardClass}`}>
        <div className="mb-6 flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-2xl ${iconBoxBg}`}><Smartphone size={24} /></div>
          <div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>SMS Configuration</h3>
            <p className={`text-sm ${subLabelClass}`}>Configure the TxtBox API used for sending text messages.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className={`flex items-center justify-between rounded-xl border p-4 ${inputClass}`}>
            <div>
              <p className={`text-sm font-bold ${labelClass}`}>Enable SMS Notifications</p>
              <p className={`text-xs ${subLabelClass}`}>{smsEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !smsEnabled
                setSmsEnabled(next)
                void saveSmsSetting('sms.enabled', String(next))
              }}
              className={`relative h-7 w-12 rounded-full transition-colors ${smsEnabled ? 'bg-emerald-600' : isDarkMode ? 'bg-zinc-700' : 'bg-zinc-300'}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${smsEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          <label className="space-y-2 block">
            <span className={`text-sm font-bold ${labelClass}`}>TxtBox API Key</span>
            <input
              type="password"
              value={txtboxApiKey}
              onChange={(event) => setTxtboxApiKey(event.target.value)}
              onBlur={() => void saveSmsSetting('sms.txtbox_api_key', txtboxApiKey)}
              placeholder="TxtBox API Key"
              className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
            />
          </label>
        </div>
      </section>

      <section className={`rounded-2xl border p-6 ${cardClass}`}>
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Test SMS</h3>
        <p className={`mt-1 text-sm ${subLabelClass}`}>Send a quick test SMS using the current configuration.</p>
        <div className="mt-5 space-y-3">
          <label className="space-y-2 block">
            <span className={`text-sm font-bold ${labelClass}`}>Recipient Phone Number</span>
            <input value={smsTestTo} onChange={(event) => setSmsTestTo(event.target.value)} placeholder="09xxxxxxxxx" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-emerald-500 ${inputClass}`} />
          </label>
          <button type="button" onClick={() => void handleTestSms()} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#059669] px-5 text-sm font-bold text-white hover:bg-emerald-700">
            <Send size={16} /> Test SMS
          </button>
          {smsTestStatus.message ? (
            <p className={`text-sm font-semibold ${smsTestStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>{smsTestStatus.message}</p>
          ) : null}
        </div>
      </section>
    </div>
  )

  const renderEmailLogs = () => (
    <section className={`overflow-hidden rounded-2xl border ${cardClass}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4 dark:border-zinc-800">
        <div className="flex flex-1 items-center gap-3">
          <div className={`flex h-11 min-w-64 items-center rounded-xl border px-3 ${inputClass}`}>
            <Search size={16} className={subLabelClass} />
            <input value={emailLogSearch} onChange={(event) => setEmailLogSearch(event.target.value)} placeholder="Search borrower, email, or book..." className="ml-2 w-full bg-transparent text-sm outline-none" />
          </div>
          <select value={emailLogStatus} onChange={(event) => setEmailLogStatus(event.target.value)} className={`h-11 rounded-xl border px-3 text-sm outline-none ${inputClass}`}>
            <option value="">All statuses</option>
            <option value="Sent">Sent</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <button type="button" onClick={() => void loadEmailLogs()} className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold ${inputClass}`}>
          <RotateCcw size={15} /> Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className={isDarkMode ? 'bg-[#27272A]/50 text-zinc-300' : 'bg-zinc-50 text-zinc-600'}>
            <tr>
              <th className="px-6 py-3 font-semibold">Borrower</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Book</th>
              <th className="px-6 py-3 font-semibold">Type</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Sent Date</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
            {emailLogs.length === 0 ? (
              <tr><td colSpan={6} className={`px-6 py-10 text-center ${subLabelClass}`}>No email logs yet.</td></tr>
            ) : emailLogs.map((log) => (
              <tr key={log.id} className={isDarkMode ? 'hover:bg-[#3F3F46]' : 'hover:bg-zinc-50'}>
                <td className={`px-6 py-4 font-semibold ${labelClass}`}>{log.borrowerName}</td>
                <td className={`px-6 py-4 ${subLabelClass}`}>{log.emailAddress}</td>
                <td className={`px-6 py-4 ${labelClass}`}>{log.bookTitle}</td>
                <td className={`px-6 py-4 ${subLabelClass}`}>{log.emailType}</td>
                <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${log.status === 'Sent' ? 'bg-emerald-50 text-emerald-700' : log.status === 'Failed' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{log.status}</span></td>
                <td className={`px-6 py-4 text-right ${subLabelClass}`}>{new Date(log.sentAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
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

    const prettifySettingKey = (key: string) => {
      const field = key.includes('.') ? key.split('.').slice(1).join('.') : key
      const words = field.split(/[_\.]+/).filter(Boolean)
      return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
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

    const totalActivityPages = Math.ceil(settingsActivity.length / activityItemsPerPage)
    const recentActivity = settingsActivity.slice((activityCurrentPage - 1) * activityItemsPerPage, activityCurrentPage * activityItemsPerPage).map((item, index) => {
      const module = mapModule(item.key)
      const meta = activityMeta(module)
      const when = formatActivityTime(item.updatedAt)
      return {
        id: `${item.key}-${index}`,
        title: `${prettifySettingKey(item.key)} Updated`,
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
            },
            {
              title: 'Email Configuration',
              desc: 'Set up SMTP, automatic reminders and test outgoing library emails.',
              icon: Mail,
              btnText: 'Configure Email',
              tab: 'Email Configuration',
              color: 'text-sky-500 bg-sky-50 dark:bg-sky-500/10'
            },
            {
              title: 'SMS Configuration',
              desc: 'Configure the TxtBox API for sending text message notifications.',
              icon: Smartphone,
              btnText: 'Configure SMS',
              tab: 'SMS Configuration',
              color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
            },
            {
              title: 'Email Logs',
              desc: 'Review sent, failed and pending reminder emails.',
              icon: History,
              btnText: 'View Logs',
              tab: 'Email Logs',
              color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'
            }
          ].map((card) => (
            <section key={card.title} className={`flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${cardClass}`}>
              <div className="mb-6 flex items-start gap-4">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${card.color}`}>
                  <card.icon size={28} />
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{card.title}</h4>
                  <p className={`mt-1.5 text-xs font-medium leading-relaxed ${subLabelClass}`}>{card.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => onTabChange?.(card.tab)}
                className={`mt-auto flex w-full items-center justify-between rounded-xl border p-3.5 text-xs font-bold transition-all hover:border-emerald-500/30 hover:bg-emerald-50 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 ${inputClass}`}
              >
                <span className="text-emerald-600 dark:text-emerald-400">{card.btnText}</span>
                <ChevronRight size={16} className="text-emerald-500/50" />
              </button>
            </section>
          ))}
        </div>

        {/* Recent Activity Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Recent Settings Activity</h3>
            <button className="flex items-center gap-2 text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-700">
              <span>View all activity</span>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={`overflow-hidden rounded-2xl border ${cardClass}`}>
            <table className="w-full text-left text-sm">
              <thead className={isDarkMode ? 'bg-[#27272A]/50 text-zinc-300' : 'bg-zinc-50/50 text-zinc-600'}>
                <tr>
                  <th className="px-6 py-3.5 font-semibold">ACTIVITY</th>
                  <th className="px-6 py-3.5 font-semibold">MODULE</th>
                  <th className="px-6 py-3.5 font-semibold">UPDATED BY</th>
                  <th className="px-6 py-3.5 font-semibold text-right">DATE & TIME</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-zinc-800/30' : 'divide-zinc-100/50'}`}>
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={`px-6 py-8 text-center text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      No settings activity yet.
                    </td>
                  </tr>
                ) : recentActivity.map((item) => (
                  <tr key={item.id} className={`transition-colors duration-150 ${isDarkMode ? 'hover:bg-[#3F3F46]' : 'hover:bg-zinc-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.color}`}>
                          <item.icon size={20} />
                        </div>
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{item.title}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.detail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${item.badge}`}>
                        {item.module}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{item.updatedBy}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{item.date}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.time}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={`relative z-0 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-600'}`}>
              <p>Showing {settingsActivity.length > 0 ? (activityCurrentPage - 1) * activityItemsPerPage + 1 : 0} to {Math.min(activityCurrentPage * activityItemsPerPage, settingsActivity.length)} of {settingsActivity.length} activities</p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select value={activityItemsPerPage} onChange={(e) => { setActivityItemsPerPage(Number(e.target.value)); setActivityCurrentPage(1); }} className={`h-10 min-w-[150px] appearance-none rounded-lg border py-2 pl-4 pr-10 text-sm font-medium outline-none transition-colors ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200 hover:bg-zinc-800 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus:border-emerald-500'}`}>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                </div>
                <button
                  type="button"
                  onClick={() => setActivityCurrentPage(p => Math.max(1, p - 1))}
                  disabled={activityCurrentPage === 1}
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
                  {Array.from({ length: totalActivityPages || 1 }, (_, i) => i + 1).map(page => (
                    <button key={page} type="button" onClick={() => setActivityCurrentPage(page)} className={page === activityCurrentPage ? "grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : `grid h-10 w-10 place-items-center rounded-lg border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActivityCurrentPage(p => Math.min(totalActivityPages || 1, p + 1))}
                  disabled={activityCurrentPage === (totalActivityPages || 1) || (totalActivityPages || 1) === 0}
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
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <div className="space-y-10 pb-20">
          <div className="mb-10 items-start justify-between">
            {activeMenu !== 'Overview' && (
              <nav className="mb-4 flex items-center gap-2 text-[13px] font-bold">
                <button 
                  onClick={() => onTabChange?.('Overview')}
                  className="text-zinc-400 transition-colors hover:text-emerald-600"
                >
                  Settings
                </button>
                <ChevronRight size={14} className="text-zinc-300" />
                <span className="text-emerald-600">{activeMenu}</span>
              </nav>
            )}
            <div className="flex items-start justify-between">
              <div>
                <h2 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
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
                  : activeMenu === 'Email Configuration'
                    ? 'Configure SMTP and reminder delivery settings.'
                  : activeMenu === 'SMS Configuration'
                    ? 'Configure the TxtBox API for sending text messages.'
                  : activeMenu === 'Email Logs'
                    ? 'Search and review reminder email delivery history.'
                  : 'Manage your library system preferences and configuration.'}
              </p>
            </div>
            {activeMenu === 'Overview' || activeMenu === 'Email Logs' ? null : activeMenu === 'Users & Roles' ? (
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
          ) : activeMenu === 'Email Configuration' ? (
            renderEmailConfiguration()
          ) : activeMenu === 'SMS Configuration' ? (
            renderSmsConfiguration()
          ) : activeMenu === 'Email Logs' ? (
            renderEmailLogs()
          ) : (
            renderSettingsOverview()
          )}
      </div>

      {isUserModalOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-900/45 p-4 backdrop-blur-[1px]">
          <section className={`w-full max-w-4xl rounded-2xl border shadow-2xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-6 py-5 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {editingUser ? 'Update user profile and role permissions.' : 'Create a new user account with assigned role.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setIsUserModalOpen(false); setEditingUser(null) }}
                className={`grid h-10 w-10 place-items-center rounded-xl border ${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
              >
                <X size={18} />
              </button>
            </div>
            <form className="space-y-5 px-6 py-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className={`text-sm font-bold ${labelClass}`}>Profile Photo</label>
                    <input
                      ref={userPhotoInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={handleUserProfilePhotoChange}
                    />
                    <div className="flex items-center gap-3">
                      <div className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                        {userForm.profilePhotoData ? (
                          <img src={userForm.profilePhotoData} alt="User profile preview" className="h-full w-full object-cover" />
                        ) : (
                          <UsersRound size={16} />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => userPhotoInputRef.current?.click()}
                        className={`h-10 rounded-lg border px-4 text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
                      >
                        Upload Photo
                      </button>
                      <span className={`text-xs ${subLabelClass}`}>
                        JPG, PNG (Max 2MB)
                      </span>
                    </div>
                  </div>
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
                <button type="button" onClick={() => { setIsUserModalOpen(false); setEditingUser(null) }} className={`h-11 rounded-xl border text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>Cancel</button>
                <button type="button" onClick={() => { void saveUserFromModal() }} className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">
                  {editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {userToDelete ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${cardClass}`}>
            <h4 className={`text-xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Delete User</h4>
            <p className={`mt-2 text-sm ${subLabelClass}`}>
              Are you sure you want to remove <span className={isDarkMode ? 'text-zinc-100 font-bold' : 'text-zinc-900 font-bold'}>{userToDelete.name}</span>?
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setUserToDelete(null)} className={`h-11 flex-1 rounded-xl border font-bold ${inputClass}`}>Cancel</button>
              <button
                type="button"
                onClick={() => {
                  void deleteSystemUser(userToDelete.id)
                    .then(loadSystemUsers)
                    .catch((error) => {
                      console.error('Failed to delete system user:', error)
                    })
                    .finally(() => setUserToDelete(null))
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


