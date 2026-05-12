import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CircleAlert,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ClipboardCheck,
  EllipsisVertical,
  Eye,
  Globe,
  IdCard,
  KeyRound,
  Library,
  Mail,
  PenLine,
  Monitor,
  Moon,
  Plus,
  Pencil,
  RotateCcw,
  Search,
  Settings2,
  Shield,
  Sun,
  Trash2,
  Upload,
  UserRound,
  UserCog,
  UsersRound,
  View,
  Wrench,
  WalletCards,
} from 'lucide-react'

type SettingsPageProps = {
  isDarkMode: boolean
}

type ThemeMode = 'light' | 'dark' | 'system'

type GeneralSettings = {
  dateFormat: string
  language: string
  timeFormat: string
  theme: ThemeMode
  itemsPerPage: string
  currency: string
}

type SystemPreferences = {
  notifications: boolean
  overdueFine: boolean
  allowSelfRegistration: boolean
  autoGenerateMemberId: boolean
  showCatalogAvailability: boolean
}

type AdditionalPreferences = {
  autoLogout: boolean
  autoReturnToAvailable: boolean
  uniqueMemberId: boolean
  showBarcodeInReceipts: boolean
  dueDateReminders: boolean
  publicCatalog: boolean
}

type LibraryProfile = {
  libraryName: string
  establishedYear: string
  libraryEmail: string
  phoneNumber: string
  website: string
  libraryCode: string
  streetAddress: string
  addressLine2: string
  city: string
  stateProvince: string
  zipPostalCode: string
  country: string
  description: string
}

type UserStatus = 'Active' | 'Inactive'
type UserRole = 'Administrator' | 'Librarian' | 'Assistant' | 'Member Clerk'

type UserRecord = {
  name: string
  username: string
  email: string
  role: UserRole
  status: UserStatus
  lastLogin: string
  avatar: string
  isYou?: boolean
}

type BooksBorrowingSettings = {
  accessionFormat: string
  defaultLanguage: string
  defaultCondition: string
  defaultShelfLocation: string
  allowDuplicateBooks: boolean
  autoGenerateAccessionNumber: boolean
  allowMultipleCategories: boolean
  allowMultipleSubjects: boolean
  showOnPublicCatalog: boolean
  maxBooksPerMember: string
  loanPeriodDays: string
  renewalLimit: string
  renewalPeriodDays: string
  reserveWhenUnavailable: boolean
  autoDueDateCalculation: boolean
  gracePeriodDays: string
  dueDateReminder: string
  allowBorrowingIfOverdue: boolean
  blockBorrowingIfFineExists: boolean
  blockBorrowingIfMembershipExpired: boolean
  minimumDaysBetweenLoans: string
  allowStaffOverrideLoanPolicy: boolean
}

type Option = {
  value: string
  label: string
}

type SettingsMenuItem = {
  label: string
  icon: LucideIcon
  group: 'LIBRARY' | 'SYSTEM'
}

type ThemeOption = {
  key: ThemeMode
  label: string
  icon: LucideIcon
}

type PreferenceItem = {
  key: keyof SystemPreferences
  label: string
}

type AdditionalPreferenceItem = {
  key: keyof AdditionalPreferences
  title: string
  detail: string
  icon: LucideIcon
}

const settingsMenuItems: SettingsMenuItem[] = [
  { label: 'General', icon: Settings2, group: 'LIBRARY' },
  { label: 'Library Profile', icon: BookOpen, group: 'LIBRARY' },
  { label: 'Users & Roles', icon: UsersRound, group: 'LIBRARY' },
  { label: 'Books & Borrowing', icon: RotateCcw, group: 'LIBRARY' },
  { label: 'Membership & Penalties', icon: IdCard, group: 'LIBRARY' },
  { label: 'Notifications', icon: Bell, group: 'SYSTEM' },
  { label: 'Email & SMTP', icon: Mail, group: 'SYSTEM' },
  { label: 'Security', icon: Shield, group: 'SYSTEM' },
  { label: 'Backup', icon: RotateCcw, group: 'SYSTEM' },
  { label: 'Activity Logs', icon: Clock3, group: 'SYSTEM' },
]

const dateFormatOptions: Option[] = [
  { value: 'mm-dd-yyyy', label: 'May 12, 2026 (MM DD, YYYY)' },
  { value: 'dd-mm-yyyy', label: '12 May 2026 (DD MM, YYYY)' },
  { value: 'yyyy-mm-dd', label: '2026-05-12 (YYYY-MM-DD)' },
]

const languageOptions: Option[] = [
  { value: 'english', label: 'English' },
  { value: 'filipino', label: 'Filipino' },
]

const timeFormatOptions: Option[] = [
  { value: '12h', label: '12 Hour (02:30 PM)' },
  { value: '24h', label: '24 Hour (14:30)' },
]

const itemsPerPageOptions: Option[] = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
]

const currencyOptions: Option[] = [
  { value: 'php', label: 'PHP - Philippine Peso (P)' },
  { value: 'usd', label: 'USD - US Dollar ($)' },
]

const themeOptions: ThemeOption[] = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'system', label: 'System', icon: Monitor },
]

const systemPreferenceItems: PreferenceItem[] = [
  { key: 'notifications', label: 'Enable notifications' },
  { key: 'overdueFine', label: 'Enable fine for overdue books' },
  { key: 'allowSelfRegistration', label: 'Allow member self-registration' },
  { key: 'autoGenerateMemberId', label: 'Auto-generate member ID' },
  { key: 'showCatalogAvailability', label: 'Show book availability on public catalog' },
]

const additionalPreferenceItems: AdditionalPreferenceItem[] = [
  { key: 'autoLogout', title: 'Auto Logout', detail: 'Automatically logout inactive users', icon: Shield },
  { key: 'autoReturnToAvailable', title: 'Auto Return to Available', detail: 'Automatically set book to available after return', icon: RotateCcw },
  { key: 'uniqueMemberId', title: 'Unique Member ID', detail: 'Generate unique ID for new members', icon: UserCog },
  { key: 'showBarcodeInReceipts', title: 'Show Barcode in Receipts', detail: 'Display book barcode in print receipts', icon: WalletCards },
  { key: 'dueDateReminders', title: 'Due Date Reminders', detail: 'Send reminders before due date', icon: Clock3 },
  { key: 'publicCatalog', title: 'Public Catalog', detail: 'Make catalog publicly accessible', icon: Globe },
]

const initialGeneralSettings: GeneralSettings = {
  dateFormat: 'mm-dd-yyyy',
  language: 'english',
  timeFormat: '12h',
  theme: 'light',
  itemsPerPage: '10',
  currency: 'php',
}

const initialSystemPreferences: SystemPreferences = {
  notifications: true,
  overdueFine: true,
  allowSelfRegistration: true,
  autoGenerateMemberId: true,
  showCatalogAvailability: true,
}

const initialAdditionalPreferences: AdditionalPreferences = {
  autoLogout: true,
  autoReturnToAvailable: true,
  uniqueMemberId: true,
  showBarcodeInReceipts: false,
  dueDateReminders: true,
  publicCatalog: true,
}

const initialLibraryProfile: LibraryProfile = {
  libraryName: 'infoLib Library',
  establishedYear: '2020',
  libraryEmail: 'infolib@example.com',
  phoneNumber: '+63 912 345 6789',
  website: 'https://infolib.com',
  libraryCode: 'INFOLIB-2020',
  streetAddress: '123 Library St.',
  addressLine2: 'Cityville',
  city: 'Cityville',
  stateProvince: 'California',
  zipPostalCode: 'CA 90210',
  country: 'United States',
  description: 'infoLib Library is a modern library dedicated to providing knowledge and resources to inspire learning, research, and community growth.',
}

const userRoleOptions: Option[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'Administrator', label: 'Administrator' },
  { value: 'Librarian', label: 'Librarian' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Member Clerk', label: 'Member Clerk' },
]

const userStatusOptions: Option[] = [
  { value: 'all', label: 'All Status' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

const mockUsers: UserRecord[] = [
  { name: 'Admin User', username: 'admin', email: 'admin@infolib.com', role: 'Administrator', status: 'Active', lastLogin: 'May 12, 2026 10:30 AM', avatar: '🧑🏻', isYou: true },
  { name: 'Sarah Johnson', username: 'sarah.j', email: 'sarah@infolib.com', role: 'Librarian', status: 'Active', lastLogin: 'May 12, 2026 09:15 AM', avatar: '👩🏻' },
  { name: 'Michael Brown', username: 'michael.b', email: 'michael@infolib.com', role: 'Librarian', status: 'Active', lastLogin: 'May 11, 2026 04:45 PM', avatar: '👨🏽' },
  { name: 'Emily Davis', username: 'emily.d', email: 'emily@infolib.com', role: 'Assistant', status: 'Active', lastLogin: 'May 10, 2026 02:20 PM', avatar: '👩🏼' },
  { name: 'James Wilson', username: 'james.w', email: 'james@infolib.com', role: 'Member Clerk', status: 'Inactive', lastLogin: 'May 5, 2026 11:10 AM', avatar: '👨🏻' },
  { name: 'Olivia Martinez', username: 'olivia.m', email: 'olivia@infolib.com', role: 'Assistant', status: 'Active', lastLogin: 'May 8, 2026 03:30 PM', avatar: '👩🏽' },
]

const roles = [
  { name: 'Administrator', detail: 'Full system access and configuration', users: 5, icon: Shield, color: 'violet' },
  { name: 'Librarian', detail: 'Manage books, members and circulation', users: 8, icon: BookOpen, color: 'blue' },
  { name: 'Assistant', detail: 'Assist with daily library operations', users: 4, icon: UserCog, color: 'amber' },
  { name: 'Member Clerk', detail: 'Manage members and basic circulation', users: 3, icon: UsersRound, color: 'cyan' },
  { name: 'Guest View', detail: 'Read-only access to catalog', users: 0, icon: View, color: 'slate' },
] as const

const languageSelectOptions: Option[] = [
  { value: 'English', label: 'English' },
  { value: 'Filipino', label: 'Filipino' },
]

const conditionOptions: Option[] = [
  { value: 'New', label: 'New' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
]

const reminderOptions: Option[] = [
  { value: '1 day before', label: '1 day before' },
  { value: '2 days before', label: '2 days before' },
  { value: '3 days before', label: '3 days before' },
]

const initialBooksBorrowingSettings: BooksBorrowingSettings = {
  accessionFormat: 'ACC-(YYYY)-(#####)',
  defaultLanguage: 'English',
  defaultCondition: 'New',
  defaultShelfLocation: 'General Shelf',
  allowDuplicateBooks: true,
  autoGenerateAccessionNumber: true,
  allowMultipleCategories: true,
  allowMultipleSubjects: true,
  showOnPublicCatalog: true,
  maxBooksPerMember: '5',
  loanPeriodDays: '14',
  renewalLimit: '2',
  renewalPeriodDays: '7',
  reserveWhenUnavailable: true,
  autoDueDateCalculation: true,
  gracePeriodDays: '1',
  dueDateReminder: '2 days before',
  allowBorrowingIfOverdue: true,
  blockBorrowingIfFineExists: false,
  blockBorrowingIfMembershipExpired: true,
  minimumDaysBetweenLoans: '0',
  allowStaffOverrideLoanPolicy: true,
}

type InputFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  isDarkMode: boolean
  rightIcon?: LucideIcon
  hint?: string
}

function InputField({ label, value, onChange, isDarkMode, rightIcon, hint }: InputFieldProps) {
  const RightIcon = rightIcon
  return (
    <label className="space-y-1.5">
      <span className={`block text-[13px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
      <div className="relative">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-10 w-full rounded-xl border px-3 pr-9 text-[14px] outline-none transition-colors ${
            isDarkMode
              ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
              : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
          }`}
        />
        {RightIcon ? <RightIcon size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} /> : null}
      </div>
      {hint ? <span className={`block text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{hint}</span> : null}
    </label>
  )
}

type SelectFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  isDarkMode: boolean
}

function SelectField({ label, value, onChange, options, isDarkMode }: SelectFieldProps) {
  return (
    <label className="space-y-1.5">
      <span className={`block text-[13px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-10 w-full appearance-none rounded-xl border py-2 pl-3 pr-10 text-[14px] outline-none transition-colors ${
            isDarkMode
              ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500'
              : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
      </div>
    </label>
  )
}

type SwitchFieldProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  isDarkMode: boolean
}

function SwitchField({ checked, onChange, isDarkMode }: SwitchFieldProps) {
  return (
    <span className="relative inline-flex items-center">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className={`h-6 w-11 rounded-full transition-colors ${checked ? 'bg-indigo-600' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
      <span className={`pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </span>
  )
}

export function SettingsPage({ isDarkMode }: SettingsPageProps) {
  const [activeSettingsMenu, setActiveSettingsMenu] = useState('General')
  const [general, setGeneral] = useState(initialGeneralSettings)
  const [systemPreferences, setSystemPreferences] = useState(initialSystemPreferences)
  const [additionalPreferences, setAdditionalPreferences] = useState(initialAdditionalPreferences)
  const [libraryProfile, setLibraryProfile] = useState(initialLibraryProfile)
  const [usersRoleTab, setUsersRoleTab] = useState<'Users' | 'Roles'>('Users')
  const [booksBorrowingTab, setBooksBorrowingTab] = useState<'Book Settings' | 'Borrowing Settings' | 'Return Settings' | 'Reservation Settings'>('Book Settings')
  const [booksBorrowingSettings, setBooksBorrowingSettings] = useState(initialBooksBorrowingSettings)
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [userStatusFilter, setUserStatusFilter] = useState('all')

  const shellClass = isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
  const cardClass = isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'
  const textMutedClass = isDarkMode ? 'text-slate-400' : 'text-slate-500'

  const updateGeneral = <Key extends keyof GeneralSettings>(key: Key, value: GeneralSettings[Key]) => {
    setGeneral((previous) => ({ ...previous, [key]: value }))
  }

  const updateSystemPreference = (key: keyof SystemPreferences, value: boolean) => {
    setSystemPreferences((previous) => ({ ...previous, [key]: value }))
  }

  const updateAdditionalPreference = (key: keyof AdditionalPreferences, value: boolean) => {
    setAdditionalPreferences((previous) => ({ ...previous, [key]: value }))
  }
  const updateLibraryProfile = <Key extends keyof LibraryProfile>(key: Key, value: LibraryProfile[Key]) => {
    setLibraryProfile((previous) => ({ ...previous, [key]: value }))
  }
  const updateBooksBorrowing = <Key extends keyof BooksBorrowingSettings>(key: Key, value: BooksBorrowingSettings[Key]) => {
    setBooksBorrowingSettings((previous) => ({ ...previous, [key]: value }))
  }

  const libraryItems = settingsMenuItems.filter((item) => item.group === 'LIBRARY')
  const systemItems = settingsMenuItems.filter((item) => item.group === 'SYSTEM')
  const filteredUsers = mockUsers.filter((user) => {
    const q = userSearch.trim().toLowerCase()
    const searchMatch = !q || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.username.toLowerCase().includes(q)
    const roleMatch = userRoleFilter === 'all' || user.role === userRoleFilter
    const statusMatch = userStatusFilter === 'all' || user.status === userStatusFilter
    return searchMatch && roleMatch && statusMatch
  })

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-6 ${shellClass}`}>
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={`rounded-2xl border p-4 ${cardClass}`}>
            <h2 className="px-2 py-2 text-[26px] font-bold tracking-tight">Settings</h2>

            <p className="px-2 pt-2 text-xs font-bold tracking-[0.08em] text-indigo-600">LIBRARY</p>
            <nav className="mt-2 space-y-1">
              {libraryItems.map((item) => {
                const ItemIcon = item.icon
                const isActive = item.label === activeSettingsMenu
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveSettingsMenu(item.label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                      isActive
                        ? isDarkMode
                          ? 'bg-indigo-500/20 text-indigo-200'
                          : 'bg-indigo-50 text-indigo-700'
                        : isDarkMode
                          ? 'text-slate-300 hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ItemIcon size={16} />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className={`my-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} />

            <p className="px-2 pt-2 text-xs font-bold tracking-[0.08em] text-indigo-600">SYSTEM</p>
            <nav className="mt-2 space-y-1">
              {systemItems.map((item) => {
                const ItemIcon = item.icon
                const isActive = item.label === activeSettingsMenu
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveSettingsMenu(item.label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                      isActive
                        ? isDarkMode
                          ? 'bg-indigo-500/20 text-indigo-200'
                          : 'bg-indigo-50 text-indigo-700'
                        : isDarkMode
                          ? 'text-slate-300 hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ItemIcon size={16} />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className={`mt-6 rounded-2xl border p-4 text-center ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50'}`}>
              <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${isDarkMode ? 'bg-slate-700 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                <Shield size={24} />
              </div>
              <p className={`mt-3 text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>System Security</p>
              <p className={`mt-2 text-sm ${textMutedClass}`}>Keep your system secure and up to date.</p>
              <button type="button" className={`mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-white'}`}>
                Security Settings
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <p className={`mt-6 text-xs font-semibold ${textMutedClass}`}>(c) 2026 infoLib</p>
            <p className={`mt-1 text-xs ${textMutedClass}`}>v1.0.0</p>
          </aside>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-semibold ${textMutedClass}`}>
                  Home
                  <span className="mx-2">/</span>
                  Settings
                  <span className="mx-2">/</span>
                  {activeSettingsMenu}
                </p>
                <h3 className="mt-1 text-[30px] font-medium tracking-tight">{activeSettingsMenu === 'General' ? 'General Settings' : activeSettingsMenu}</h3>
                <p className={`mt-1 text-sm ${textMutedClass}`}>
                  {activeSettingsMenu === 'Library Profile'
                    ? "Update your library's details and contact information."
                    : activeSettingsMenu === 'Users & Roles'
                      ? 'Manage system users and their roles and permissions.'
                      : activeSettingsMenu === 'Books & Borrowing'
                        ? 'Configure book management and circulation settings.'
                      : 'Manage your system preferences and configurations.'}
                </p>
              </div>
              {activeSettingsMenu === 'Users & Roles' ? (
                <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(79,70,229,0.85)] transition-colors hover:bg-indigo-700">
                  <Plus size={15} />
                  Add User
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(79,70,229,0.85)] transition-colors hover:bg-indigo-700"
                >
                  <Check size={15} />
                  Save Changes
                </button>
              )}
            </div>

            {activeSettingsMenu === 'General' ? (
              <>
                <section className={`rounded-2xl border p-6 ${cardClass}`}>
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_285px]">
                <div>
                  <h4 className="text-[20px] font-semibold tracking-tight">System Preferences</h4>
                  <div className="mt-2 mb-3 h-0.5 w-24 rounded-full bg-indigo-500" />
                  <p className={`text-sm ${textMutedClass}`}>Configure general system preferences.</p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <SelectField label="Date Format" value={general.dateFormat} onChange={(value) => updateGeneral('dateFormat', value)} options={dateFormatOptions} isDarkMode={isDarkMode} />
                    <SelectField label="Language" value={general.language} onChange={(value) => updateGeneral('language', value)} options={languageOptions} isDarkMode={isDarkMode} />
                    <SelectField label="Time Format" value={general.timeFormat} onChange={(value) => updateGeneral('timeFormat', value)} options={timeFormatOptions} isDarkMode={isDarkMode} />

                    <div className="space-y-1.5">
                      <span className={`block text-[13px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Default Theme</span>
                      <div className="grid grid-cols-3 gap-2">
                        {themeOptions.map((option) => {
                          const ThemeIcon = option.icon
                          const isSelected = general.theme === option.key

                          return (
                            <button
                              key={option.key}
                              type="button"
                              onClick={() => updateGeneral('theme', option.key)}
                              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-[14px] font-semibold transition-colors ${
                                isSelected
                                  ? isDarkMode
                                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200'
                                    : 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                  : isDarkMode
                                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <ThemeIcon size={15} />
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <SelectField label="Items Per Page" value={general.itemsPerPage} onChange={(value) => updateGeneral('itemsPerPage', value)} options={itemsPerPageOptions} isDarkMode={isDarkMode} />
                    <SelectField label="Currency" value={general.currency} onChange={(value) => updateGeneral('currency', value)} options={currencyOptions} isDarkMode={isDarkMode} />
                  </div>
                </div>

                <aside className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50'}`}>
                  <h5 className="text-xl font-semibold">System Preferences</h5>
                  <div className="mt-4 space-y-3">
                    {systemPreferenceItems.map((item) => (
                      <label key={item.key} className="flex items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={systemPreferences[item.key]}
                          onChange={(event) => updateSystemPreference(item.key, event.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-600"
                        />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </aside>
              </div>
                </section>

                <section className={`rounded-2xl border p-6 ${cardClass}`}>
              <h4 className="text-[20px] font-semibold tracking-tight">Additional Preferences</h4>
              <div className="mt-2 mb-3 h-0.5 w-24 rounded-full bg-indigo-500" />
              <p className={`text-sm ${textMutedClass}`}>Configure additional system preferences.</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {additionalPreferenceItems.map((item) => {
                  const ItemIcon = item.icon
                  return (
                    <article key={item.key} className={`flex items-center justify-between rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 grid h-10 w-10 place-items-center rounded-xl ${isDarkMode ? 'bg-slate-700 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                          <ItemIcon size={18} />
                        </span>
                        <div>
                          <p className={`text-[15px] font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{item.title}</p>
                          <p className={`text-sm ${textMutedClass}`}>{item.detail}</p>
                        </div>
                      </div>
                      <SwitchField
                        checked={additionalPreferences[item.key]}
                        onChange={(value) => updateAdditionalPreference(item.key, value)}
                        isDarkMode={isDarkMode}
                      />
                    </article>
                  )
                })}
              </div>

              <div className={`mt-5 rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                These settings will be applied across the entire system.
              </div>
                </section>
              </>
            ) : null}

            {activeSettingsMenu === 'Library Profile' ? (
              <>
                <section className={`rounded-2xl border p-5 ${cardClass}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-[20px] font-semibold tracking-tight">Library Details</h4>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Basic information about your library.</p>
                    </div>
                    <button type="button" className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                      <Eye size={15} />
                      Preview Library Profile
                    </button>
                  </div>

                  <div className="mt-5 grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
                    <div className={`rounded-xl border p-4 text-center ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50'}`}>
                      <div className="relative mx-auto w-fit">
                        <div className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${isDarkMode ? 'bg-slate-700 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                          <Building2 size={36} />
                        </div>
                        <span className={`absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                          <Pencil size={14} />
                        </span>
                      </div>
                      <p className={`mt-3 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Current Logo</p>
                      <p className={`mt-1 text-xs ${textMutedClass}`}>PNG, JPG or SVG. Max size 2MB</p>
                      <button type="button" className={`mt-3 inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-white'}`}>
                        <Upload size={14} />
                        Change Logo
                      </button>
                      <button type="button" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600">
                        <Trash2 size={14} />
                        Remove Logo
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField label="Library Name *" value={libraryProfile.libraryName} onChange={(value) => updateLibraryProfile('libraryName', value)} isDarkMode={isDarkMode} />
                      <InputField label="Established Year" value={libraryProfile.establishedYear} onChange={(value) => updateLibraryProfile('establishedYear', value)} isDarkMode={isDarkMode} rightIcon={CalendarDays} />
                      <InputField label="Library Email *" value={libraryProfile.libraryEmail} onChange={(value) => updateLibraryProfile('libraryEmail', value)} isDarkMode={isDarkMode} />
                      <InputField label="Phone Number *" value={libraryProfile.phoneNumber} onChange={(value) => updateLibraryProfile('phoneNumber', value)} isDarkMode={isDarkMode} />
                      <InputField label="Website" value={libraryProfile.website} onChange={(value) => updateLibraryProfile('website', value)} isDarkMode={isDarkMode} />
                      <InputField label="Library Code / ID" value={libraryProfile.libraryCode} onChange={(value) => updateLibraryProfile('libraryCode', value)} isDarkMode={isDarkMode} />
                    </div>
                  </div>
                </section>

                <section className={`rounded-2xl border p-5 ${cardClass}`}>
                  <h4 className="text-[20px] font-semibold tracking-tight">Address</h4>
                  <p className={`mt-1 text-sm ${textMutedClass}`}>Library location and address details.</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <InputField label="Street Address *" value={libraryProfile.streetAddress} onChange={(value) => updateLibraryProfile('streetAddress', value)} isDarkMode={isDarkMode} />
                    <InputField label="Address Line 2" value={libraryProfile.addressLine2} onChange={(value) => updateLibraryProfile('addressLine2', value)} isDarkMode={isDarkMode} />
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-4">
                    <InputField label="City *" value={libraryProfile.city} onChange={(value) => updateLibraryProfile('city', value)} isDarkMode={isDarkMode} />
                    <InputField label="State / Province *" value={libraryProfile.stateProvince} onChange={(value) => updateLibraryProfile('stateProvince', value)} isDarkMode={isDarkMode} />
                    <InputField label="ZIP / Postal Code *" value={libraryProfile.zipPostalCode} onChange={(value) => updateLibraryProfile('zipPostalCode', value)} isDarkMode={isDarkMode} />
                    <SelectField label="Country *" value={libraryProfile.country} onChange={(value) => updateLibraryProfile('country', value)} options={[{ value: 'United States', label: 'United States' }, { value: 'Philippines', label: 'Philippines' }]} isDarkMode={isDarkMode} />
                  </div>

                  <div className={`mt-5 border-t pt-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <h4 className="text-[20px] font-semibold tracking-tight">Library Description</h4>
                    <p className={`mt-1 text-sm ${textMutedClass}`}>Brief description about your library.</p>
                    <textarea
                      value={libraryProfile.description}
                      onChange={(event) => updateLibraryProfile('description', event.target.value.slice(0, 500))}
                      rows={4}
                      className={`mt-3 w-full resize-none rounded-xl border px-3 py-2 text-[14px] outline-none transition-colors ${
                        isDarkMode
                          ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
                          : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
                      }`}
                    />
                    <p className={`mt-2 text-right text-xs ${textMutedClass}`}>{libraryProfile.description.length} / 500</p>
                  </div>
                </section>
              </>
            ) : null}

            {activeSettingsMenu === 'Users & Roles' ? (
              <section className={`rounded-2xl border p-0 ${cardClass}`}>
                <div className="px-6 pt-4">
                  <div className={`flex items-center gap-5 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    {(['Users', 'Roles'] as const).map((tab) => {
                      const active = usersRoleTab === tab
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setUsersRoleTab(tab)}
                          className={`border-b-2 px-1 pb-3 text-[22px] font-semibold transition-colors ${
                            active
                              ? 'border-indigo-600 text-indigo-600'
                              : isDarkMode
                                ? 'border-transparent text-slate-300 hover:text-slate-100'
                                : 'border-transparent text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          {tab}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {usersRoleTab === 'Users' ? (
                  <>
                    <div className="px-6 py-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[280px] flex-1">
                          <Search size={16} className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                          <input
                            value={userSearch}
                            onChange={(event) => setUserSearch(event.target.value)}
                            placeholder="Search users by name, email, or username..."
                            className={`h-10 w-full rounded-xl border py-2 pl-10 pr-3 text-[14px] outline-none transition-colors ${
                              isDarkMode
                                ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
                                : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
                            }`}
                          />
                        </div>

                        <div className="w-[190px]">
                          <SelectField label="" value={userRoleFilter} onChange={setUserRoleFilter} options={userRoleOptions} isDarkMode={isDarkMode} />
                        </div>
                        <div className="w-[150px]">
                          <SelectField label="" value={userStatusFilter} onChange={setUserStatusFilter} options={userStatusOptions} isDarkMode={isDarkMode} />
                        </div>

                        <button type="button" className={`ml-auto inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                          <Upload size={14} />
                          Export
                        </button>
                      </div>
                    </div>

                    <div className="px-6 pb-0">
                      <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className={`grid grid-cols-[1.35fr_0.8fr_1.2fr_1fr_0.85fr_1.35fr_0.35fr] gap-3 border-b px-4 py-3 text-[13px] font-semibold ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                          <p>User</p>
                          <p>Username</p>
                          <p>Email</p>
                          <p>Role</p>
                          <p>Status</p>
                          <p>Last Login</p>
                          <p className="text-right">Actions</p>
                        </div>

                        {filteredUsers.map((user) => (
                          <div key={user.email} className={`grid grid-cols-[1.35fr_0.8fr_1.2fr_1fr_0.85fr_1.35fr_0.35fr] items-center gap-3 border-b px-4 py-3 last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <div className="flex items-center gap-3">
                              <span className={`grid h-9 w-9 place-items-center rounded-full text-lg ${isDarkMode ? 'bg-slate-700' : 'bg-indigo-100'}`}>{user.avatar}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{user.name}</span>
                                {user.isYou ? <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>You</span> : null}
                              </div>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{user.username}</p>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{user.email}</p>
                            <p>
                              <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                user.role === 'Administrator'
                                  ? isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'
                                  : user.role === 'Librarian'
                                    ? isDarkMode ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'
                                    : user.role === 'Member Clerk'
                                      ? isDarkMode ? 'bg-cyan-500/20 text-cyan-200' : 'bg-cyan-100 text-cyan-700'
                                      : isDarkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {user.role}
                              </span>
                            </p>
                            <p>
                              <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                user.status === 'Active'
                                  ? isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'
                                  : isDarkMode ? 'bg-rose-500/20 text-rose-200' : 'bg-rose-100 text-rose-700'
                              }`}>
                                {user.status}
                              </span>
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{user.lastLogin}</p>
                            <button type="button" className={`ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
                              <EllipsisVertical size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`mt-3 flex items-center justify-between border-t px-6 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                      <p className={`text-sm ${textMutedClass}`}>Showing 1 to {filteredUsers.length} of {filteredUsers.length} users</p>
                      <div className="flex items-center gap-2">
                        <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                          <ChevronLeft size={15} />
                        </button>
                        <button type="button" className="grid h-8 min-w-8 place-items-center rounded-lg bg-indigo-600 px-2 text-sm font-semibold text-white">1</button>
                        <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="px-6 py-5">
                    <div className="grid gap-4 xl:grid-cols-[460px_minmax(0,1fr)]">
                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h4 className="text-[20px] font-semibold tracking-tight">Roles</h4>
                            <p className={`mt-1 text-sm ${textMutedClass}`}>Manage user roles and their permissions.</p>
                          </div>
                          <button type="button" className={`inline-flex h-8 items-center gap-1 rounded-lg border px-3 text-xs font-semibold transition-colors ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                            <Plus size={12} />
                            Add Role
                          </button>
                        </div>

                        <div className="relative mt-4">
                          <Search size={15} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                          <input
                            placeholder="Search roles..."
                            className={`h-10 w-full rounded-xl border py-2 pl-3 pr-9 text-[14px] outline-none transition-colors ${
                              isDarkMode
                                ? 'border-slate-700 bg-[#0b1738] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
                                : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
                            }`}
                          />
                        </div>

                        <div className={`mt-3 overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                          {roles.map((role, index) => {
                            const RoleIcon = role.icon
                            const isActive = index === 0
                            const badgeClass =
                              role.color === 'violet'
                                ? isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'
                                : role.color === 'blue'
                                  ? isDarkMode ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'
                                  : role.color === 'amber'
                                    ? isDarkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'
                                    : role.color === 'cyan'
                                      ? isDarkMode ? 'bg-cyan-500/20 text-cyan-200' : 'bg-cyan-100 text-cyan-700'
                                      : isDarkMode ? 'bg-slate-600 text-slate-200' : 'bg-slate-100 text-slate-700'

                            return (
                              <div
                                key={role.name}
                                className={`flex items-center justify-between gap-3 border-b px-3 py-3 last:border-b-0 ${
                                  isActive
                                    ? isDarkMode ? 'border-slate-700 bg-indigo-500/10' : 'border-slate-200 bg-indigo-50/60'
                                    : isDarkMode ? 'border-slate-700' : 'border-slate-200'
                                }`}
                              >
                                <div className="flex min-w-0 items-start gap-3">
                                  <span className={`mt-0.5 grid h-8 w-8 place-items-center rounded-lg ${badgeClass}`}>
                                    <RoleIcon size={15} />
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold">{role.name}</p>
                                    <p className={`truncate text-xs ${textMutedClass}`}>{role.detail}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>{role.users} Users</span>
                                  <button type="button" className={`grid h-7 w-7 place-items-center rounded-md ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
                                    <EllipsisVertical size={14} />
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <p className={`mt-4 text-sm ${textMutedClass}`}>Showing 1 to 5 of 5 roles</p>
                      </section>

                      <section className={`rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <div className={`border-b p-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <span className={`grid h-12 w-12 place-items-center rounded-xl ${isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'}`}>
                                <Shield size={22} />
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-[20px] font-semibold tracking-tight">Administrator</h4>
                                  <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'}`}>System Role</span>
                                </div>
                                <p className={`mt-1 text-sm ${textMutedClass}`}>Full system access and configuration</p>
                              </div>
                            </div>
                            <button type="button" className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                              <PenLine size={14} />
                              Edit Role
                            </button>
                          </div>

                          <div className="mt-4 flex items-center gap-5">
                            <button type="button" className="border-b-2 border-indigo-600 pb-2 text-sm font-semibold text-indigo-600">Permissions</button>
                            <button type="button" className={`border-b-2 border-transparent pb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Users (5)</button>
                            <button type="button" className={`border-b-2 border-transparent pb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Role Details</button>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                              <h5 className="text-[20px] font-semibold tracking-tight">Permissions</h5>
                              <p className={`mt-1 text-sm ${textMutedClass}`}>Manage what this role can access and do.</p>
                            </div>
                            <button type="button" className={`inline-flex h-8 items-center gap-1 rounded-lg border px-3 text-xs font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                              Expand All
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-slate-50'}`}>
                                <p className="flex items-center gap-2 text-sm font-semibold"><KeyRound size={15} />Dashboard</p>
                                <ChevronUp size={15} />
                              </div>
                              <div className="px-4 py-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span>View dashboard</span>
                                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>Allowed</span>
                                </div>
                              </div>
                            </div>

                            <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-slate-50'}`}>
                                <p className="flex items-center gap-2 text-sm font-semibold"><Library size={15} />Books</p>
                                <ChevronDown size={15} />
                              </div>
                              <div className="space-y-0">
                                {['View books', 'Add new books', 'Edit books', 'Delete books'].map((item) => (
                                  <div key={item} className={`flex items-center justify-between border-b px-4 py-2.5 text-sm last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <span>{item}</span>
                                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>Allowed</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-slate-50'}`}>
                                <p className="flex items-center gap-2 text-sm font-semibold"><UserRound size={15} />Members</p>
                                <ChevronDown size={15} />
                              </div>
                              <div className="space-y-0">
                                {['View members', 'Add new members', 'Edit members', 'Delete members'].map((item) => (
                                  <div key={item} className={`flex items-center justify-between border-b px-4 py-2.5 text-sm last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <span>{item}</span>
                                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>Allowed</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                )}
              </section>
            ) : null}

            {activeSettingsMenu === 'Books & Borrowing' ? (
              <section className={`rounded-2xl border p-0 ${cardClass}`}>
                <div className="px-6 pt-4">
                  <div className={`flex items-center gap-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    {(['Book Settings', 'Borrowing Settings', 'Return Settings', 'Reservation Settings'] as const).map((tab) => {
                      const active = booksBorrowingTab === tab
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setBooksBorrowingTab(tab)}
                          className={`border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                            active
                              ? 'border-indigo-600 text-indigo-600'
                              : isDarkMode
                                ? 'border-transparent text-slate-300 hover:text-slate-100'
                                : 'border-transparent text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          {tab}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {booksBorrowingTab === 'Book Settings' ? (
                  <div className="space-y-4 p-6">
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <h4 className="text-[20px] font-semibold tracking-tight">Book Management</h4>
                        <p className={`mt-1 text-sm ${textMutedClass}`}>Configure general settings for managing books in the library.</p>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <InputField
                            label="Accession Number Format"
                            value={booksBorrowingSettings.accessionFormat}
                            onChange={(value) => updateBooksBorrowing('accessionFormat', value)}
                            isDarkMode={isDarkMode}
                            hint="Use (YYYY) for year and (#####) for number"
                          />
                          <SelectField
                            label="Default Language"
                            value={booksBorrowingSettings.defaultLanguage}
                            onChange={(value) => updateBooksBorrowing('defaultLanguage', value)}
                            options={languageSelectOptions}
                            isDarkMode={isDarkMode}
                          />
                          <SelectField
                            label="Default Condition"
                            value={booksBorrowingSettings.defaultCondition}
                            onChange={(value) => updateBooksBorrowing('defaultCondition', value)}
                            options={conditionOptions}
                            isDarkMode={isDarkMode}
                          />
                          <InputField
                            label="Default Shelf Location"
                            value={booksBorrowingSettings.defaultShelfLocation}
                            onChange={(value) => updateBooksBorrowing('defaultShelfLocation', value)}
                            isDarkMode={isDarkMode}
                          />
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
                            <div>
                              <p className="text-sm font-semibold">Allow Duplicate Books</p>
                              <p className={`text-xs ${textMutedClass}`}>Allow adding multiple copies of the same book.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.allowDuplicateBooks} onChange={(value) => updateBooksBorrowing('allowDuplicateBooks', value)} isDarkMode={isDarkMode} />
                          </div>
                          <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
                            <div>
                              <p className="text-sm font-semibold">Auto-generate Accession Number</p>
                              <p className={`text-xs ${textMutedClass}`}>Automatically generate accession number when adding books.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.autoGenerateAccessionNumber} onChange={(value) => updateBooksBorrowing('autoGenerateAccessionNumber', value)} isDarkMode={isDarkMode} />
                          </div>
                        </div>
                      </section>

                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <h4 className="text-[20px] font-semibold tracking-tight">Book Categories & Subjects</h4>
                        <p className={`mt-1 text-sm ${textMutedClass}`}>Manage how categories and subjects work.</p>
                        <div className="mt-4 space-y-0">
                          <div className={`flex items-center justify-between gap-3 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} border-b`}>
                            <div>
                              <p className="text-sm font-semibold">Allow Multiple Categories</p>
                              <p className={`text-xs ${textMutedClass}`}>A book can be assigned to multiple categories.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.allowMultipleCategories} onChange={(value) => updateBooksBorrowing('allowMultipleCategories', value)} isDarkMode={isDarkMode} />
                          </div>
                          <div className={`flex items-center justify-between gap-3 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} border-b`}>
                            <div>
                              <p className="text-sm font-semibold">Allow Multiple Subjects</p>
                              <p className={`text-xs ${textMutedClass}`}>A book can be assigned to multiple subjects.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.allowMultipleSubjects} onChange={(value) => updateBooksBorrowing('allowMultipleSubjects', value)} isDarkMode={isDarkMode} />
                          </div>
                          <div className="flex items-center justify-between gap-3 py-4">
                            <div>
                              <p className="text-sm font-semibold">Show on Public Catalog</p>
                              <p className={`text-xs ${textMutedClass}`}>Make newly added books visible on the public catalog.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.showOnPublicCatalog} onChange={(value) => updateBooksBorrowing('showOnPublicCatalog', value)} isDarkMode={isDarkMode} />
                          </div>
                        </div>
                      </section>
                    </div>

                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <h4 className="text-[20px] font-semibold tracking-tight">Circulation Rules (General)</h4>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Set general rules that apply to all book transactions.</p>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <InputField label="Maximum Books Per Member" value={booksBorrowingSettings.maxBooksPerMember} onChange={(value) => updateBooksBorrowing('maxBooksPerMember', value)} isDarkMode={isDarkMode} hint="Number of books a member can borrow at a time." />
                        <InputField label="Loan Period (Days)" value={booksBorrowingSettings.loanPeriodDays} onChange={(value) => updateBooksBorrowing('loanPeriodDays', value)} isDarkMode={isDarkMode} hint="Default number of days for borrowing books." />
                        <InputField label="Renewal Limit" value={booksBorrowingSettings.renewalLimit} onChange={(value) => updateBooksBorrowing('renewalLimit', value)} isDarkMode={isDarkMode} hint="Maximum number of times a book can be renewed." />
                        <InputField label="Renewal Period (Days)" value={booksBorrowingSettings.renewalPeriodDays} onChange={(value) => updateBooksBorrowing('renewalPeriodDays', value)} isDarkMode={isDarkMode} hint="Number of days added on each renewal." />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
                          <div>
                            <p className="text-sm font-semibold">Reserve When Unavailable</p>
                            <p className={`text-xs ${textMutedClass}`}>Allow members to reserve books that are currently borrowed.</p>
                          </div>
                          <SwitchField checked={booksBorrowingSettings.reserveWhenUnavailable} onChange={(value) => updateBooksBorrowing('reserveWhenUnavailable', value)} isDarkMode={isDarkMode} />
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
                          <div>
                            <p className="text-sm font-semibold">Auto Due Date Calculation</p>
                            <p className={`text-xs ${textMutedClass}`}>Automatically calculate due date based on loan period.</p>
                          </div>
                          <SwitchField checked={booksBorrowingSettings.autoDueDateCalculation} onChange={(value) => updateBooksBorrowing('autoDueDateCalculation', value)} isDarkMode={isDarkMode} />
                        </div>
                        <InputField label="Grace Period (Days)" value={booksBorrowingSettings.gracePeriodDays} onChange={(value) => updateBooksBorrowing('gracePeriodDays', value)} isDarkMode={isDarkMode} hint="Grace period before fine is applied." />
                        <SelectField label="Due Date Reminder" value={booksBorrowingSettings.dueDateReminder} onChange={(value) => updateBooksBorrowing('dueDateReminder', value)} options={reminderOptions} isDarkMode={isDarkMode} />
                      </div>
                    </section>

                    <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                      <p className="font-semibold">Default Values</p>
                      <p className="mt-1">These settings will be applied globally across the system. You can override some of these values for specific members or books when needed.</p>
                    </div>
                  </div>
                ) : booksBorrowingTab === 'Borrowing Settings' ? (
                  <div className="space-y-4 p-6">
                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <h4 className="text-[20px] font-semibold tracking-tight">Borrowing Settings</h4>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Configure rules and policies for borrowing books.</p>

                      <div className={`mt-4 rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <ClipboardCheck size={15} className="text-indigo-600" />
                          Loan Policy
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-4">
                          <InputField
                            label="Maximum Books Per Member"
                            value={booksBorrowingSettings.maxBooksPerMember}
                            onChange={(value) => updateBooksBorrowing('maxBooksPerMember', value)}
                            isDarkMode={isDarkMode}
                            hint="Total books a member can borrow."
                          />
                          <InputField
                            label="Loan Period (Days)"
                            value={booksBorrowingSettings.loanPeriodDays}
                            onChange={(value) => updateBooksBorrowing('loanPeriodDays', value)}
                            isDarkMode={isDarkMode}
                            hint="Default number of days for borrowing."
                          />
                          <InputField
                            label="Renewal Limit"
                            value={booksBorrowingSettings.renewalLimit}
                            onChange={(value) => updateBooksBorrowing('renewalLimit', value)}
                            isDarkMode={isDarkMode}
                            hint="Maximum number of times a book can be renewed."
                          />
                          <InputField
                            label="Renewal Period (Days)"
                            value={booksBorrowingSettings.renewalPeriodDays}
                            onChange={(value) => updateBooksBorrowing('renewalPeriodDays', value)}
                            isDarkMode={isDarkMode}
                            hint="Number of days added on each renewal."
                          />
                        </div>
                      </div>

                      <div className={`mt-3 rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <Shield size={15} className="text-indigo-600" />
                          Borrowing Restrictions
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">Allow Borrowing If Member Has Overdue</p>
                                <p className={`text-xs ${textMutedClass}`}>If enabled, members can borrow even with overdue books.</p>
                              </div>
                              <SwitchField
                                checked={booksBorrowingSettings.allowBorrowingIfOverdue}
                                onChange={(value) => updateBooksBorrowing('allowBorrowingIfOverdue', value)}
                                isDarkMode={isDarkMode}
                              />
                            </div>

                            <InputField
                              label="Minimum Days Between Loans"
                              value={booksBorrowingSettings.minimumDaysBetweenLoans}
                              onChange={(value) => updateBooksBorrowing('minimumDaysBetweenLoans', value)}
                              isDarkMode={isDarkMode}
                              hint="Minimum wait days before borrowing again."
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">Block Borrowing If Fine Exists</p>
                                <p className={`text-xs ${textMutedClass}`}>If enabled, members with fines cannot borrow.</p>
                              </div>
                              <SwitchField
                                checked={booksBorrowingSettings.blockBorrowingIfFineExists}
                                onChange={(value) => updateBooksBorrowing('blockBorrowingIfFineExists', value)}
                                isDarkMode={isDarkMode}
                              />
                            </div>

                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">Block Borrowing If Membership Expired</p>
                                <p className={`text-xs ${textMutedClass}`}>If enabled, expired members cannot borrow.</p>
                              </div>
                              <SwitchField
                                checked={booksBorrowingSettings.blockBorrowingIfMembershipExpired}
                                onChange={(value) => updateBooksBorrowing('blockBorrowingIfMembershipExpired', value)}
                                isDarkMode={isDarkMode}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`mt-3 rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <Wrench size={15} className="text-indigo-600" />
                          Additional Options
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">Auto Due Date Calculation</p>
                                <p className={`text-xs ${textMutedClass}`}>Automatically calculate due date based on loan period.</p>
                              </div>
                              <SwitchField
                                checked={booksBorrowingSettings.autoDueDateCalculation}
                                onChange={(value) => updateBooksBorrowing('autoDueDateCalculation', value)}
                                isDarkMode={isDarkMode}
                              />
                            </div>

                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">Allow Staff to Override Loan Policy</p>
                                <p className={`text-xs ${textMutedClass}`}>Allow staff to override loan rules when necessary.</p>
                              </div>
                              <SwitchField
                                checked={booksBorrowingSettings.allowStaffOverrideLoanPolicy}
                                onChange={(value) => updateBooksBorrowing('allowStaffOverrideLoanPolicy', value)}
                                isDarkMode={isDarkMode}
                              />
                            </div>
                          </div>

                          <div>
                            <SelectField
                              label="Due Date Reminder"
                              value={booksBorrowingSettings.dueDateReminder}
                              onChange={(value) => updateBooksBorrowing('dueDateReminder', value)}
                              options={reminderOptions}
                              isDarkMode={isDarkMode}
                            />
                            <p className={`mt-1 text-xs ${textMutedClass}`}>Send reminder before due date.</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                      <p className="flex items-center gap-2 font-semibold"><CircleAlert size={15} />Note</p>
                      <p className="mt-1">These borrowing settings will be applied to all members unless specific rules are set for individual member types.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <section className={`rounded-xl border p-6 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <h4 className="text-[20px] font-semibold tracking-tight">{booksBorrowingTab}</h4>
                      <p className={`mt-2 text-sm ${textMutedClass}`}>This section is ready next. We can implement it with the same detail level as Book Settings.</p>
                    </section>
                  </div>
                )}
              </section>
            ) : null}

            {activeSettingsMenu !== 'General' && activeSettingsMenu !== 'Library Profile' && activeSettingsMenu !== 'Users & Roles' && activeSettingsMenu !== 'Books & Borrowing' ? (
              <section className={`rounded-2xl border p-6 ${cardClass}`}>
                <h4 className="text-[20px] font-semibold tracking-tight">{activeSettingsMenu}</h4>
                <p className={`mt-2 text-sm ${textMutedClass}`}>This tab is ready for implementation next.</p>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
