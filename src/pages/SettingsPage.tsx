import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  BadgeDollarSign,
  Bell,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  DatabaseBackup,
  History,
  IdCard,
  Mail,
  Monitor,
  Moon,
  RotateCcw,
  Settings2,
  Shield,
  Sun,
  Upload,
  UsersRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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

type LibraryInformation = {
  name: string
  email: string
  phone: string
  address: string
  website: string
  establishedYear: string
  logoFileName: string | null
}

type BackupSettings = {
  autoBackup: boolean
  backupFrequency: string
  lastBackup: string
}

type EmailSettings = {
  smtpHost: string
  smtpPort: string
  fromEmail: string
}

type SecuritySettings = {
  sessionTimeout: string
  passwordMinLength: string
  requireStrongPassword: boolean
  twoFactorAuthentication: boolean
}

type SettingsState = {
  general: GeneralSettings
  systemPreferences: SystemPreferences
  library: LibraryInformation
  backup: BackupSettings
  email: EmailSettings
  security: SecuritySettings
}

type Option = {
  value: string
  label: string
}

type SettingsMenuItem = {
  label: string
  icon: LucideIcon
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

const settingsMenuItems: SettingsMenuItem[] = [
  { label: 'General Settings', icon: Settings2 },
  { label: 'Library Information', icon: Building2 },
  { label: 'User Management', icon: UsersRound },
  { label: 'Membership Settings', icon: IdCard },
  { label: 'Book Settings', icon: BookOpen },
  { label: 'Borrow / Return Settings', icon: RotateCcw },
  { label: 'Fine & Penalty Settings', icon: BadgeDollarSign },
  { label: 'Email Settings', icon: Mail },
  { label: 'Notification Settings', icon: Bell },
  { label: 'System Backup', icon: DatabaseBackup },
  { label: 'Security Settings', icon: Shield },
  { label: 'Activity Logs', icon: History },
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
  { value: 'php', label: 'PHP - Philippine Peso (\u20b1)' },
  { value: 'usd', label: 'USD - US Dollar ($)' },
]

const backupFrequencyOptions: Option[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const sessionTimeoutOptions: Option[] = [
  { value: '30', label: '30 Minutes' },
  { value: '45', label: '45 Minutes' },
  { value: '60', label: '60 Minutes' },
]

const passwordLengthOptions: Option[] = [
  { value: '8', label: '8 Characters' },
  { value: '10', label: '10 Characters' },
  { value: '12', label: '12 Characters' },
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

const initialSettingsState: SettingsState = {
  general: {
    dateFormat: 'mm-dd-yyyy',
    language: 'english',
    timeFormat: '12h',
    theme: 'light',
    itemsPerPage: '10',
    currency: 'php',
  },
  systemPreferences: {
    notifications: true,
    overdueFine: true,
    allowSelfRegistration: false,
    autoGenerateMemberId: true,
    showCatalogAvailability: true,
  },
  library: {
    name: 'infoLib Library',
    email: 'infolib@example.com',
    phone: '+63 912 345 6789',
    address: '123 Library St., Cityville, CA 90210',
    website: 'https://infolib.com',
    establishedYear: '2020',
    logoFileName: null,
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    lastBackup: 'May 6, 2026 02:30 AM',
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    fromEmail: 'noreply@infolib.com',
  },
  security: {
    sessionTimeout: '30',
    passwordMinLength: '8',
    requireStrongPassword: true,
    twoFactorAuthentication: false,
  },
}

type InputFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  isDarkMode: boolean
  type?: 'text' | 'email' | 'url'
}

function InputField({ label, value, onChange, isDarkMode, type = 'text' }: InputFieldProps) {
  return (
    <label className="space-y-1.5">
      <span className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full rounded-xl border px-3 text-sm outline-none transition-colors ${
          isDarkMode
            ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
            : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
        }`}
      />
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
      <span className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full appearance-none rounded-xl border py-2 pl-3 pr-10 text-sm outline-none transition-colors ${
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
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  isDarkMode: boolean
}

function SwitchField({ label, checked, onChange, isDarkMode }: SwitchFieldProps) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{label}</span>
      <span className="relative inline-flex items-center">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span
          className={`h-6 w-11 rounded-full transition-colors ${
            checked ? 'bg-indigo-600' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
          }`}
        />
        <span className={`pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </span>
    </label>
  )
}

export function SettingsPage({ isDarkMode }: SettingsPageProps) {
  const [settings, setSettings] = useState<SettingsState>(initialSettingsState)
  const [activeSettingsMenu, setActiveSettingsMenu] = useState(settingsMenuItems[0]?.label ?? 'General Settings')
  const logoInputRef = useRef<HTMLInputElement | null>(null)

  const shellClass = isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
  const cardClass = isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'
  const textMutedClass = isDarkMode ? 'text-slate-400' : 'text-slate-500'

  const updateGeneral = <Key extends keyof GeneralSettings>(key: Key, value: GeneralSettings[Key]) => {
    setSettings((previous) => ({
      ...previous,
      general: {
        ...previous.general,
        [key]: value,
      },
    }))
  }

  const updateSystemPreference = (key: keyof SystemPreferences, value: boolean) => {
    setSettings((previous) => ({
      ...previous,
      systemPreferences: {
        ...previous.systemPreferences,
        [key]: value,
      },
    }))
  }

  const updateLibrary = <Key extends keyof LibraryInformation>(key: Key, value: LibraryInformation[Key]) => {
    setSettings((previous) => ({
      ...previous,
      library: {
        ...previous.library,
        [key]: value,
      },
    }))
  }

  const updateBackup = <Key extends keyof BackupSettings>(key: Key, value: BackupSettings[Key]) => {
    setSettings((previous) => ({
      ...previous,
      backup: {
        ...previous.backup,
        [key]: value,
      },
    }))
  }

  const updateEmail = <Key extends keyof EmailSettings>(key: Key, value: EmailSettings[Key]) => {
    setSettings((previous) => ({
      ...previous,
      email: {
        ...previous.email,
        [key]: value,
      },
    }))
  }

  const updateSecurity = <Key extends keyof SecuritySettings>(key: Key, value: SecuritySettings[Key]) => {
    setSettings((previous) => ({
      ...previous,
      security: {
        ...previous.security,
        [key]: value,
      },
    }))
  }

  const handleLogoSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    updateLibrary('logoFileName', selectedFile?.name ?? null)
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-6 ${shellClass}`}>
      <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className={`text-sm font-semibold ${textMutedClass}`}>
              Home
              <span className="mx-2">/</span>
              Settings
            </p>
            <h2 className="mt-1 text-4xl font-black tracking-tight">Settings</h2>
            <p className={`mt-1 text-sm ${textMutedClass}`}>Manage your system preferences and configurations</p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(79,70,229,0.85)] transition-colors hover:bg-indigo-700"
          >
            <Check size={15} />
            Save Changes
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={`rounded-2xl border p-4 ${cardClass}`}>
            <nav className="space-y-1">
              {settingsMenuItems.map((item) => {
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
                <Settings2 size={24} />
              </div>
              <p className={`mt-3 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Manage your system preferences and keep everything organized.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                View System Logs
              </button>
            </div>

            <p className={`mt-5 text-xs font-semibold ${textMutedClass}`}>(c) 2026 infoLib</p>
            <p className={`mt-1 text-xs ${textMutedClass}`}>Version 1.0.0</p>
          </aside>

          <div className="space-y-6">
            <section className={`rounded-2xl border p-6 ${cardClass}`}>
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
                <div>
                  <h3 className="text-[22px] font-semibold tracking-tight">General Settings</h3>
                  <p className={`mt-1 text-sm ${textMutedClass}`}>Configure general system preferences</p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <SelectField
                      label="Date Format"
                      value={settings.general.dateFormat}
                      onChange={(value) => updateGeneral('dateFormat', value)}
                      options={dateFormatOptions}
                      isDarkMode={isDarkMode}
                    />
                    <SelectField
                      label="Language"
                      value={settings.general.language}
                      onChange={(value) => updateGeneral('language', value)}
                      options={languageOptions}
                      isDarkMode={isDarkMode}
                    />
                    <SelectField
                      label="Time Format"
                      value={settings.general.timeFormat}
                      onChange={(value) => updateGeneral('timeFormat', value)}
                      options={timeFormatOptions}
                      isDarkMode={isDarkMode}
                    />
                    <div className="space-y-1.5">
                      <span className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Default Theme</span>
                      <div className="grid grid-cols-3 gap-2">
                        {themeOptions.map((option) => {
                          const ThemeIcon = option.icon
                          const isSelected = settings.general.theme === option.key

                          return (
                            <button
                              key={option.key}
                              type="button"
                              onClick={() => updateGeneral('theme', option.key)}
                              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors ${
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
                    <SelectField
                      label="Items Per Page"
                      value={settings.general.itemsPerPage}
                      onChange={(value) => updateGeneral('itemsPerPage', value)}
                      options={itemsPerPageOptions}
                      isDarkMode={isDarkMode}
                    />
                    <SelectField
                      label="Currency"
                      value={settings.general.currency}
                      onChange={(value) => updateGeneral('currency', value)}
                      options={currencyOptions}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>

                <div className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50'}`}>
                  <h4 className="text-[22px] font-semibold">System Preferences</h4>
                  <div className="mt-4 space-y-3">
                    {systemPreferenceItems.map((item) => (
                      <label key={item.key} className="flex items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={settings.systemPreferences[item.key]}
                          onChange={(event) => updateSystemPreference(item.key, event.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-600"
                        />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className={`rounded-2xl border p-6 ${cardClass}`}>
              <h3 className="text-[22px] font-semibold tracking-tight">Library Information</h3>
              <p className={`mt-1 text-sm ${textMutedClass}`}>Update your library information</p>

              <div className="mt-5 grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
                <div className={`rounded-xl border border-dashed p-5 text-center ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50'}`}>
                  <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${isDarkMode ? 'bg-slate-700 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                    <Building2 size={28} />
                  </div>
                  <p className={`mt-4 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Upload Library Logo</p>
                  <p className={`mt-1 text-xs ${textMutedClass}`}>PNG, JPG or SVG. Max size 2MB</p>
                  {settings.library.logoFileName ? (
                    <p className={`mt-2 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{settings.library.logoFileName}</p>
                  ) : null}
                  <input ref={logoInputRef} type="file" accept=".png,.jpg,.jpeg,.svg" className="sr-only" onChange={handleLogoSelection} />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className={`mt-4 inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors ${
                      isDarkMode
                        ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                        : 'border-slate-300 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <Upload size={14} />
                    Choose File
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Library Name"
                    value={settings.library.name}
                    onChange={(value) => updateLibrary('name', value)}
                    isDarkMode={isDarkMode}
                  />
                  <InputField
                    label="Address"
                    value={settings.library.address}
                    onChange={(value) => updateLibrary('address', value)}
                    isDarkMode={isDarkMode}
                  />
                  <InputField
                    label="Library Email"
                    value={settings.library.email}
                    onChange={(value) => updateLibrary('email', value)}
                    isDarkMode={isDarkMode}
                    type="email"
                  />
                  <InputField
                    label="Website"
                    value={settings.library.website}
                    onChange={(value) => updateLibrary('website', value)}
                    isDarkMode={isDarkMode}
                    type="url"
                  />
                  <InputField
                    label="Phone Number"
                    value={settings.library.phone}
                    onChange={(value) => updateLibrary('phone', value)}
                    isDarkMode={isDarkMode}
                  />
                  <InputField
                    label="Established Year"
                    value={settings.library.establishedYear}
                    onChange={(value) => updateLibrary('establishedYear', value)}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-3">
              <section className={`rounded-2xl border p-5 ${cardClass}`}>
                <h3 className="text-[22px] font-semibold tracking-tight">Backup Settings</h3>
                <p className={`mt-1 text-sm ${textMutedClass}`}>Manage system backup and restore</p>

                <div className="mt-5 space-y-4">
                  <SwitchField
                    label="Auto Backup"
                    checked={settings.backup.autoBackup}
                    onChange={(value) => updateBackup('autoBackup', value)}
                    isDarkMode={isDarkMode}
                  />
                  <SelectField
                    label="Backup Frequency"
                    value={settings.backup.backupFrequency}
                    onChange={(value) => updateBackup('backupFrequency', value)}
                    options={backupFrequencyOptions}
                    isDarkMode={isDarkMode}
                  />
                  <div>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Last Backup</p>
                    <p className={`mt-1 text-sm ${textMutedClass}`}>{settings.backup.lastBackup}</p>
                  </div>
                  <button
                    type="button"
                    className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors ${
                      isDarkMode
                        ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <DatabaseBackup size={14} />
                    Backup Now
                  </button>
                </div>
              </section>

              <section className={`rounded-2xl border p-5 ${cardClass}`}>
                <h3 className="text-[22px] font-semibold tracking-tight">Email Settings</h3>
                <p className={`mt-1 text-sm ${textMutedClass}`}>Configure email settings for system</p>

                <div className="mt-5 space-y-4">
                  <InputField
                    label="SMTP Host"
                    value={settings.email.smtpHost}
                    onChange={(value) => updateEmail('smtpHost', value)}
                    isDarkMode={isDarkMode}
                  />
                  <InputField
                    label="SMTP Port"
                    value={settings.email.smtpPort}
                    onChange={(value) => updateEmail('smtpPort', value)}
                    isDarkMode={isDarkMode}
                  />
                  <InputField
                    label="From Email"
                    value={settings.email.fromEmail}
                    onChange={(value) => updateEmail('fromEmail', value)}
                    isDarkMode={isDarkMode}
                    type="email"
                  />
                  <button
                    type="button"
                    className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors ${
                      isDarkMode
                        ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Mail size={14} />
                    Test Email Connection
                  </button>
                </div>
              </section>

              <section className={`rounded-2xl border p-5 ${cardClass}`}>
                <h3 className="text-[22px] font-semibold tracking-tight">Security Settings</h3>
                <p className={`mt-1 text-sm ${textMutedClass}`}>Manage security and session settings</p>

                <div className="mt-5 space-y-4">
                  <SelectField
                    label="Session Timeout"
                    value={settings.security.sessionTimeout}
                    onChange={(value) => updateSecurity('sessionTimeout', value)}
                    options={sessionTimeoutOptions}
                    isDarkMode={isDarkMode}
                  />
                  <SelectField
                    label="Password Min Length"
                    value={settings.security.passwordMinLength}
                    onChange={(value) => updateSecurity('passwordMinLength', value)}
                    options={passwordLengthOptions}
                    isDarkMode={isDarkMode}
                  />
                  <SwitchField
                    label="Require Strong Password"
                    checked={settings.security.requireStrongPassword}
                    onChange={(value) => updateSecurity('requireStrongPassword', value)}
                    isDarkMode={isDarkMode}
                  />
                  <SwitchField
                    label="Two-Factor Authentication"
                    checked={settings.security.twoFactorAuthentication}
                    onChange={(value) => updateSecurity('twoFactorAuthentication', value)}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
