import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Bell, Mail, MessageCircle, Moon, Search, Sun } from 'lucide-react'
import heroImage from './assets/login.avif'

type LoginFormState = {
  username: string
  password: string
  rememberMe: boolean
}

type NavItem = {
  label: string
  active?: boolean
}

type StatCard = {
  title: string
  value: string
  delta: string
  deltaTone: 'up' | 'down'
}

type ActivityItem = {
  time: string
  title: string
  subtitle: string
}

const initialState: LoginFormState = {
  username: '',
  password: '',
  rememberMe: true,
}

const navItems: NavItem[] = [
  { label: 'Overview', active: true },
  { label: 'Books' },
  { label: 'Members' },
  { label: 'Authors' },
  { label: 'Categories' },
  { label: 'Borrow / Return' },
  { label: 'Reports' },
  { label: 'Settings' },
]

const statCards: StatCard[] = [
  { title: 'Total Books', value: '6,619', delta: '+12 this month', deltaTone: 'up' },
  { title: 'Available Books', value: '5,547', delta: '+18 this month', deltaTone: 'up' },
  { title: 'Borrowed Books', value: '320', delta: '+8 this month', deltaTone: 'up' },
  { title: 'Overdue Books', value: '45', delta: '+5 from yesterday', deltaTone: 'down' },
  { title: 'Total Members', value: '1,245', delta: '+25 this month', deltaTone: 'up' },
  { title: 'New Books', value: '12', delta: '+12 this month', deltaTone: 'up' },
]

const todayActivity: ActivityItem[] = [
  { time: '1:02 PM', title: 'New book added', subtitle: '"Philippine Constitution"' },
  { time: '12:45 PM', title: 'Book borrowed', subtitle: 'by Maria Santos' },
  { time: '11:30 AM', title: 'Book returned', subtitle: 'by Juan Dela Cruz' },
  { time: '10:15 AM', title: 'New member added', subtitle: 'Pedro Reyes' },
  { time: '9:05 AM', title: 'Book borrowed', subtitle: 'by Ana Lim' },
]

function Panel({ title, action, children }: { title: string; action?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        {action ? <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">{action}</button> : null}
      </header>
      {children}
    </section>
  )
}

function DashboardShell({ onLogout }: { onLogout: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#f3f5fb] p-0 text-slate-800">
      <div className="flex min-h-screen w-full overflow-hidden border border-slate-200 bg-white">
        <aside className={`hidden shrink-0 border-r border-slate-200 bg-slate-50 transition-all duration-200 lg:flex lg:flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <div className={`border-b border-slate-200 py-6 ${sidebarCollapsed ? 'px-3' : 'px-6'}`}>
            <h1 className={`font-black italic tracking-tight text-[#2f5bff] ${sidebarCollapsed ? 'text-2xl text-center' : 'text-4xl'}`}>infoLib</h1>
            {!sidebarCollapsed ? <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Library Management System</p> : null}
          </div>
          <nav className={`flex-1 space-y-1 py-5 text-sm ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
            {navItems.map((item) => (
              <button
                key={item.label}
                className={
                  item.active
                    ? `flex w-full items-center rounded-lg bg-blue-100 py-2 font-semibold text-blue-700 ${sidebarCollapsed ? 'justify-center px-2' : 'gap-2 px-3'}`
                    : `flex w-full items-center rounded-lg py-2 text-slate-600 hover:bg-slate-100 ${sidebarCollapsed ? 'justify-center px-2' : 'gap-2 px-3'}`
                }
                type="button"
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {!sidebarCollapsed ? item.label : null}
              </button>
            ))}
          </nav>
          <div className={`border-t border-slate-200 ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
            {!sidebarCollapsed ? <p className="text-xs text-slate-500">© 2026 infoLib</p> : null}
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-20 items-center border-b border-slate-200 bg-white px-5">
            <div className="flex w-full items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarCollapsed((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <ArrowRight size={20} strokeWidth={2.2} /> : <ArrowLeft size={20} strokeWidth={2.2} />}
              </button>
              <form className="group flex h-12 w-[520px] items-center rounded-full border border-slate-200 bg-slate-50 px-4 focus-within:border-emerald-500" role="search">
                <label htmlFor="header-search" className="sr-only">Search library records</label>
                <Search size={16} className="mr-3 text-slate-400 transition-colors group-focus-within:text-emerald-600" />
                <input
                  id="header-search"
                  type="search"
                  placeholder="Search books, members, authors, categories..."
                  className="w-full bg-transparent text-sm font-light text-slate-700 placeholder:font-light placeholder:text-slate-400 outline-none"
                />
              </form>
              <div className="ml-auto flex items-center gap-4">
                <div className="hidden items-center gap-2 lg:flex">
                  <button
                    type="button"
                    onClick={() => setIsDarkMode((value) => !value)}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                    aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    title={isDarkMode ? 'Light mode' : 'Dark mode'}
                  >
                    {isDarkMode ? <Sun size={18} strokeWidth={1.9} /> : <Moon size={18} strokeWidth={1.9} />}
                  </button>
                  <button type="button" className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Open messages">
                    <MessageCircle size={18} strokeWidth={1.9} />
                    <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
                  </button>
                  <button type="button" className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Open inbox">
                    <Mail size={18} strokeWidth={1.9} />
                    <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">5</span>
                  </button>
                  <button type="button" className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Open notifications">
                    <Bell size={18} strokeWidth={1.9} />
                    <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">2</span>
                  </button>
                </div>
                <div ref={profileMenuRef} className="relative hidden items-center gap-3 border-l border-slate-200 pl-4 md:flex">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-violet-200 text-xl">👨🏻</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Admin User</p>
                    <p className="text-xs text-slate-500">Librarian</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((value) => !value)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="menu"
                    aria-controls="profile-menu"
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
                      <path d="M5.5 7.5 10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {isProfileOpen ? (
                    <div id="profile-menu" role="menu" className="absolute right-0 top-14 z-20 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                      <button
                        type="button"
                        onClick={onLogout}
                        role="menuitem"
                        className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-3xl font-black text-slate-900">Good morning, Admin!</h2>
              <p className="mt-1 text-sm text-slate-500">Here is what is happening in your library today.</p>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              {statCards.map((card) => (
                <article key={card.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500">{card.title}</p>
                  <p className="mt-1 text-3xl font-black text-slate-900">{card.value}</p>
                  <p className={card.deltaTone === 'up' ? 'mt-1 text-xs font-semibold text-emerald-600' : 'mt-1 text-xs font-semibold text-rose-600'}>{card.delta}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-3 xl:grid-cols-3">
              <Panel title="Recent Borrowed Books" action="View all">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Sosyolohiya sa Filipino</span><span className="text-slate-500">May 6, 2026</span></div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Understanding Philippine Social Realities</span><span className="text-slate-500">May 5, 2026</span></div>
                  <div className="flex items-center justify-between"><span>Filipino Values Today</span><span className="text-slate-500">May 3, 2026</span></div>
                </div>
              </Panel>

              <Panel title="Overdue Returns" action="View all">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2"><span>How to read a newspaper</span><span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">5 days</span></div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Peryodismo sa Pilipino</span><span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">3 days</span></div>
                  <div className="flex items-center justify-between"><span>Sociology in the Philippines</span><span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">1 day</span></div>
                </div>
              </Panel>

              <Panel title="Today's Activity" action="View all">
                <div className="space-y-3 text-sm">
                  {todayActivity.map((item) => (
                    <div key={`${item.time}-${item.title}`} className="flex gap-3">
                      <span className="w-12 shrink-0 text-xs font-semibold text-slate-500">{item.time}</span>
                      <div>
                        <p className="font-semibold text-slate-700">{item.title}</p>
                        <p className="text-slate-500">{item.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

function App() {
  const [formState, setFormState] = useState<LoginFormState>(initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.username.trim() || !formState.password.trim()) {
      return
    }
    setIsAuthenticated(true)
  }

  if (isAuthenticated) {
    return <DashboardShell onLogout={() => setIsAuthenticated(false)} />
  }

  return (
    <main className="h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,#22c55e33_0%,transparent_40%),linear-gradient(120deg,#03171d_0%,#0b2a35_45%,#1a3f4f_100%)]">
      <div className="h-full overflow-hidden border border-emerald-100/20 bg-[#04202b]/45">
        <div className="grid h-full grid-cols-[1.03fr_1fr]">
          <section className="relative overflow-hidden">
            <img src={heroImage} alt="Library shelves and desk" className="h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,33,30,0.76)_0%,rgba(1,33,35,0.88)_52%,rgba(1,26,29,0.94)_100%)]" />
            <div className="absolute inset-0 px-6 py-3 text-white">
              <div className="absolute left-6 right-6 top-3 bottom-28">
                <div className="mx-auto flex h-full max-w-[450px] flex-col items-center justify-center text-center">
                  <div className="grid h-18 w-18 place-items-center rounded-full border border-emerald-300/65 text-emerald-300">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10">
                      <path d="M12 6c-2-1.3-4.4-2-7-2v13c2.6 0 5 .7 7 2 2-1.3 4.4-2 7-2V4c-2.6 0-5 .7-7 2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      <path d="M12 6v13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight">info<span className="text-emerald-400">Lib.</span></h1>
                    <p className="text-base tracking-[0.1em] text-emerald-100/85">LIBRARY INFORMATION SYSTEM</p>
                    <div className="mx-auto h-[2px] w-32 bg-emerald-400/70" />
                    <p className="max-w-[340px] text-base leading-relaxed text-emerald-100/78">Manage your library resources, borrowers, and transactions efficiently.</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-6 right-6 rounded-[1.5rem] border border-emerald-100/15 bg-emerald-950/35 px-4 py-3 backdrop-blur-sm">
                <p className="text-base font-semibold">Secure. Reliable. Efficient.</p>
                <p className="mt-1 text-sm text-emerald-100/80">Your library, better organized.</p>
              </div>
            </div>
          </section>

          <section className="flex h-full items-center justify-center bg-[#f4f6f8] px-5 py-3">
            <form onSubmit={handleSubmit} className="flex h-full w-full max-w-[410px] flex-col px-1 py-1" noValidate>
              <div className="flex flex-1 flex-col justify-center space-y-3">
                <header className="space-y-1 text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Welcome Back!</h2>
                  <p className="text-base text-slate-500">Sign in to continue to your account</p>
                </header>

                <div className="space-y-1">
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-700">User Name</label>
                  <div className="flex h-10 items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                    <input id="username" type="text" autoComplete="username" value={formState.username} onChange={(event) => setFormState((previous) => ({ ...previous, username: event.target.value }))} placeholder="Enter your username" className="h-full w-full bg-transparent text-sm text-slate-800 outline-none" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                  <div className="flex h-10 items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                    <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={formState.password} onChange={(event) => setFormState((previous) => ({ ...previous, password: event.target.value }))} placeholder="Enter your password" className="h-full w-full bg-transparent text-sm text-slate-800 outline-none" required />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-500 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex cursor-pointer items-center gap-3 text-slate-600">
                    <input type="checkbox" checked={formState.rememberMe} onChange={(event) => setFormState((previous) => ({ ...previous, rememberMe: event.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                    Remember me
                  </label>
                  <button type="button" className="font-semibold text-emerald-700 hover:text-emerald-800">Forgot password?</button>
                </div>

                <button type="submit" className="flex h-11 w-full items-center justify-between rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 px-5 text-base font-bold text-white shadow-[0_12px_24px_-12px_rgba(5,150,105,0.7)] transition hover:brightness-110">
                  <span className="w-8" />
                  <span>Sign In</span>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-emerald-700">?</span>
                </button>
              </div>

              <p className="mt-auto pt-3 text-center text-xs text-slate-500">© 2026 infoLib. All rights reserved.</p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default App






