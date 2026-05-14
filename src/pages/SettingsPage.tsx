import { useState } from 'react'
import {
  Settings2,
  UsersRound,
  Bell,
  Shield,
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
} from 'lucide-react'

type SettingsPageProps = {
  isDarkMode: boolean
}

type ThemeMode = 'light' | 'dark' | 'system'

type OperatingDay = {
  day: string
  open: string
  close: string
  closed: boolean
}

const settingsMenuItems = [
  { label: 'General', icon: Settings2 },
  { label: 'Library Profile', icon: Library },
  { label: 'Users & Roles', icon: UsersRound },
  { label: 'Notifications', icon: Bell },
  { label: 'Security', icon: Shield },
  { label: 'Backup', icon: RotateCcw },
]

const timeOptions = ['08:00 AM', '09:00 AM', '12:00 PM', '01:00 PM', '05:00 PM']

export function SettingsPage({ isDarkMode }: SettingsPageProps) {
  const [activeMenu, setActiveMenu] = useState('Library Profile')
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [notifications, setNotifications] = useState(true)
  const [overdueFine, setOverdueFine] = useState(true)
  const [selfRegistration, setSelfRegistration] = useState(true)
  const [autoMemberId, setAutoMemberId] = useState(true)
  const [showCatalog, setShowCatalog] = useState(true)
  const [showBarcode, setShowBarcode] = useState(true)
  const [operatingHours, setOperatingHours] = useState<OperatingDay[]>([
    { day: 'Monday', open: '08:00 AM', close: '05:00 PM', closed: false },
    { day: 'Tuesday', open: '08:00 AM', close: '05:00 PM', closed: false },
    { day: 'Wednesday', open: '08:00 AM', close: '05:00 PM', closed: false },
    { day: 'Thursday', open: '08:00 AM', close: '05:00 PM', closed: false },
    { day: 'Friday', open: '08:00 AM', close: '05:00 PM', closed: false },
    { day: 'Saturday', open: '09:00 AM', close: '01:00 PM', closed: false },
    { day: 'Sunday', open: '08:00 AM', close: '05:00 PM', closed: true },
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

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <div className="mx-auto flex w-full max-w-[1500px] gap-10">
        <aside className="w-64 shrink-0">
          <div className={`sticky top-8 self-start rounded-2xl border p-5 ${cardClass}`}>
            <h3 className={`mb-5 px-3 text-[13px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Settings Menu</h3>
            <nav className="space-y-1">
              {settingsMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = item.label === activeMenu
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveMenu(item.label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-[13px] font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#f0fdf4] text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 pb-20">
          <div className="mb-10 flex items-start justify-between">
            <div>
              <nav className="mb-3 flex items-center gap-2 text-[13px] font-medium text-slate-400">
                <span className="cursor-pointer transition-colors hover:text-emerald-600">Home</span>
                <span className="opacity-40">/</span>
                <span className="cursor-pointer transition-colors hover:text-emerald-600">Settings</span>
                <span className="opacity-40">/</span>
                <span className="font-bold text-emerald-600">{activeMenu}</span>
              </nav>
              <h2 className={`text-[32px] font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeMenu}</h2>
              <p className={`mt-2 text-[14px] font-medium ${subLabelClass}`}>
                {activeMenu === 'Library Profile'
                  ? 'Manage your library information that will appear across the system.'
                  : 'Manage your system preferences and configurations.'}
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]">
              <Check size={18} strokeWidth={3} />
              Save Changes
            </button>
          </div>

          {activeMenu === 'Library Profile' ? (
            renderLibraryProfile()
          ) : (
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
          )}
        </main>
      </div>
    </div>
  )
}
