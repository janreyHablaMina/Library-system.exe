import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Globe,
  IdCard,
  Mail,
  Monitor,
  Moon,
  RotateCcw,
  Settings2,
  Shield,
  Sun,
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
                  General
                </p>
                <h3 className="mt-1 text-[30px] font-medium tracking-tight">General Settings</h3>
                <p className={`mt-1 text-sm ${textMutedClass}`}>Manage your system preferences and configurations.</p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(79,70,229,0.85)] transition-colors hover:bg-indigo-700"
              >
                <Check size={15} />
                Save Changes
              </button>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  )
}
