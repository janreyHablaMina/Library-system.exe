import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  Globe,
  IdCard,
  Mail,
  Monitor,
  Moon,
  Pencil,
  RotateCcw,
  Settings2,
  Shield,
  Sun,
  Trash2,
  Upload,
  UserCog,
  UsersRound,
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

type InputFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  isDarkMode: boolean
  rightIcon?: LucideIcon
}

function InputField({ label, value, onChange, isDarkMode, rightIcon }: InputFieldProps) {
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

  const libraryItems = settingsMenuItems.filter((item) => item.group === 'LIBRARY')
  const systemItems = settingsMenuItems.filter((item) => item.group === 'SYSTEM')

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
                  {activeSettingsMenu === 'Library Profile' ? "Update your library's details and contact information." : 'Manage your system preferences and configurations.'}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(79,70,229,0.85)] transition-colors hover:bg-indigo-700"
              >
                <Check size={15} />
                Save Changes
              </button>
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

            {activeSettingsMenu !== 'General' && activeSettingsMenu !== 'Library Profile' ? (
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
