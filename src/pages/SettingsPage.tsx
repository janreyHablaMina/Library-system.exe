import { useState } from 'react'
import {
  Settings2,
  BookOpen,
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
  LayoutGrid,
  UserPlus,
  CreditCard,
  Barcode,
  History,
} from 'lucide-react'

type SettingsPageProps = {
  isDarkMode: boolean
}

type ThemeMode = 'light' | 'dark' | 'system'

const settingsMenuItems = [
  { label: 'General', icon: Settings2 },
  { label: 'Library Profile', icon: Library },
  { label: 'Users & Roles', icon: UsersRound },
  { label: 'Notifications', icon: Bell },
  { label: 'Security', icon: Shield },
  { label: 'Backup', icon: RotateCcw },
]

export function SettingsPage({ isDarkMode }: SettingsPageProps) {
  const [activeMenu, setActiveMenu] = useState('General')
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [notifications, setNotifications] = useState(true)
  const [overdueFine, setOverdueFine] = useState(true)
  const [selfRegistration, setSelfRegistration] = useState(true)
  const [autoMemberId, setAutoMemberId] = useState(true)
  const [showCatalog, setShowCatalog] = useState(true)
  const [showBarcode, setShowBarcode] = useState(true)

  // Style Tokens - Matching the image's refined aesthetic
  const cardClass = isDarkMode 
    ? 'border-slate-800 bg-[#0a1633]' 
    : 'border-slate-200 bg-white'
  
  const iconBoxBg = isDarkMode 
    ? 'bg-emerald-500/10 text-emerald-400' 
    : 'bg-[#f0fdf4] text-emerald-600'
  
  const labelClass = isDarkMode ? 'text-slate-200' : 'text-slate-700'
  const subLabelClass = isDarkMode ? 'text-slate-400' : 'text-slate-500'
  
  const inputClass = isDarkMode
    ? 'border-slate-800 bg-[#0f1f49] text-slate-200'
    : 'border-slate-200 bg-white text-slate-700'

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <div className="mx-auto flex w-full max-w-[1500px] gap-10">
        
        {/* Settings Menu (Inner Sidebar) */}
        <aside className="w-64 shrink-0">
          <div className={`rounded-2xl border p-5 sticky top-8 self-start ${cardClass}`}>
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

        {/* Main Content Area */}
        <main className="flex-1 pb-20">
          {/* Breadcrumbs & Header */}
          <div className="mb-10 flex items-start justify-between">
            <div>
              <nav className="mb-3 flex items-center gap-2 text-[13px] font-medium text-slate-400">
                <span className="hover:text-emerald-600 transition-colors cursor-pointer">Home</span>
                <span className="opacity-40">/</span>
                <span className="hover:text-emerald-600 transition-colors cursor-pointer">Settings</span>
                <span className="opacity-40">/</span>
                <span className="text-emerald-600 font-bold">{activeMenu}</span>
              </nav>
              <h2 className={`text-[32px] font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeMenu} Settings</h2>
              <p className={`mt-2 text-[14px] font-medium ${subLabelClass}`}>Manage your system preferences and configurations.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]">
              <Check size={18} strokeWidth={3} />
              Save Changes
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* 1. System Preferences */}
            <section className={`lg:col-span-8 rounded-3xl border p-8 ${cardClass}`}>
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
                <div className="space-y-2.5">
                  <label className={`text-[13px] font-bold ${labelClass}`}>Date Format</label>
                  <div className="relative">
                    <select className={`h-12 w-full appearance-none rounded-xl border px-4 pr-10 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}>
                      <option>May 12, 2026 (MM DD, YYYY)</option>
                      <option>12 May 2026 (DD MM, YYYY)</option>
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className={`text-[13px] font-bold ${labelClass}`}>Language</label>
                  <div className="relative">
                    <select className={`h-12 w-full appearance-none rounded-xl border px-4 pr-10 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}>
                      <option>English</option>
                      <option>Filipino</option>
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className={`text-[13px] font-bold ${labelClass}`}>Time Format</label>
                  <div className="relative">
                    <select className={`h-12 w-full appearance-none rounded-xl border px-4 pr-10 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}>
                      <option>12 Hour (02:30 PM)</option>
                      <option>24 Hour (14:30)</option>
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className={`text-[13px] font-bold ${labelClass}`}>Currency</label>
                  <div className="relative">
                    <select className={`h-12 w-full appearance-none rounded-xl border px-4 pr-10 text-[13px] font-semibold outline-none focus:border-emerald-500 transition-colors ${inputClass}`}>
                      <option>PHP - Philippine Peso (P)</option>
                      <option>USD - US Dollar ($)</option>
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
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

            {/* 2. Library Rules */}
            <section className={`lg:col-span-4 rounded-3xl border p-8 ${cardClass}`}>
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
                      <div className={`text-emerald-600 dark:text-emerald-400 opacity-80`}>
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

            {/* 3. Display & Behavior */}
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
                  <div className={`flex items-center justify-between rounded-2xl border px-6 py-5 self-end ${isDarkMode ? 'border-slate-800' : 'border-[#f1f5f9] bg-white'}`}>
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
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
