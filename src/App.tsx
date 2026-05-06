import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Bell, BookOpen, BookPlus, Bookmark, Clock3, FileText, Mail, MessageCircle, Moon, Search, Sun, Undo2, UserPlus, Users } from 'lucide-react'
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
    <main className="min-h-screen bg-white p-0 text-slate-800">
      <div className="flex min-h-screen w-full overflow-hidden border border-slate-200 bg-white">
        <aside className={`hidden shrink-0 border-r border-slate-200 bg-white transition-all duration-200 lg:flex lg:flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
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
              <form className="group flex h-12 w-[520px] items-center rounded-full border border-slate-200 bg-white px-4 focus-within:border-emerald-500" role="search">
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

          <div className="min-h-0 flex-1 overflow-auto bg-[#f8fafc] p-4">
            <section className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Good morning, Admin! 👋</h2>
                  <p className="mt-1 text-sm text-slate-500">Here&apos;s what&apos;s happening in your library today.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <button type="button" className="flex min-w-[160px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <BookPlus size={18} className="text-emerald-600" />
                    Add Book
                  </button>
                  <button type="button" className="flex min-w-[160px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <ArrowRight size={18} className="text-emerald-600" />
                    Borrow Book
                  </button>
                  <button type="button" className="flex min-w-[160px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <Undo2 size={18} className="text-amber-500" />
                    Return Book
                  </button>
                  <button type="button" className="flex min-w-[160px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <UserPlus size={18} className="text-emerald-600" />
                    Add Member
                  </button>
                </div>
              </div>
            </section>

            <section className="grid gap-3 px-5 pb-3 sm:grid-cols-2 xl:grid-cols-6">
              <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)]">
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2"><BookOpen size={18} className="text-emerald-600" /></div>
                  <p className="text-sm font-semibold text-slate-600">Total Books</p>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">6,619</p>
                <p className="mt-1 text-sm font-semibold text-emerald-600">↑ 12 this month</p>
                <svg viewBox="0 0 100 16" aria-hidden="true" className="mt-3 -mx-4 h-5 w-[calc(100%+2rem)]">
                  <path d="M0 10 L12 11 L22 8 L32 9 L42 7 L52 10 L62 8 L72 9 L82 6 L100 5" fill="none" stroke="#2563eb" strokeOpacity="0.22" strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M0 10 L12 11 L22 8 L32 9 L42 7 L52 10 L62 8 L72 9 L82 6 L100 5" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </article>
              <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)]">
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2"><Bookmark size={18} className="text-emerald-600" /></div>
                  <p className="text-sm font-semibold text-slate-600">Available Books</p>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">5,547</p>
                <p className="mt-1 text-sm font-semibold text-emerald-600">↑ 18 this month</p>
                <svg viewBox="0 0 100 16" aria-hidden="true" className="mt-3 -mx-4 h-5 w-[calc(100%+2rem)]">
                  <path d="M0 9 L12 8 L22 10 L32 7 L42 9 L52 6 L62 8 L72 5 L82 7 L100 4" fill="none" stroke="#22c55e" strokeOpacity="0.22" strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M0 9 L12 8 L22 10 L32 7 L42 9 L52 6 L62 8 L72 5 L82 7 L100 4" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </article>
              <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)]">
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-amber-50 p-2"><Undo2 size={18} className="text-amber-500" /></div>
                  <p className="text-sm font-semibold text-slate-600">Borrowed Books</p>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">320</p>
                <p className="mt-1 text-sm font-semibold text-amber-500">+ 8 this month</p>
                <svg viewBox="0 0 100 16" aria-hidden="true" className="mt-3 -mx-4 h-5 w-[calc(100%+2rem)]">
                  <path d="M0 10 L12 9 L22 11 L32 8 L42 10 L52 7 L62 9 L72 8 L82 6 L100 7" fill="none" stroke="#f59e0b" strokeOpacity="0.22" strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M0 10 L12 9 L22 11 L32 8 L42 10 L52 7 L62 9 L72 8 L82 6 L100 7" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </article>
              <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)]">
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-rose-50 p-2"><Clock3 size={18} className="text-rose-500" /></div>
                  <p className="text-sm font-semibold text-slate-600">Overdue Books</p>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">45</p>
                <p className="mt-1 text-sm font-semibold text-rose-500">+ 5 from yesterday</p>
                <svg viewBox="0 0 100 16" aria-hidden="true" className="mt-3 -mx-4 h-5 w-[calc(100%+2rem)]">
                  <path d="M0 11 L12 8 L22 10 L32 6 L42 9 L52 7 L62 10 L72 6 L82 8 L100 7" fill="none" stroke="#ef4444" strokeOpacity="0.22" strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M0 11 L12 8 L22 10 L32 6 L42 9 L52 7 L62 10 L72 6 L82 8 L100 7" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </article>
              <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)]">
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2"><Users size={18} className="text-emerald-600" /></div>
                  <p className="text-sm font-semibold text-slate-600">Total Members</p>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">1,245</p>
                <p className="mt-1 text-sm font-semibold text-emerald-600">↑ 25 this month</p>
                <svg viewBox="0 0 100 16" aria-hidden="true" className="mt-3 -mx-4 h-5 w-[calc(100%+2rem)]">
                  <path d="M0 10 L12 7 L22 9 L32 6 L42 8 L52 7 L62 9 L72 6 L82 8 L100 5" fill="none" stroke="#8b5cf6" strokeOpacity="0.22" strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M0 10 L12 7 L22 9 L32 6 L42 8 L52 7 L62 9 L72 6 L82 8 L100 5" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </article>
              <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)]">
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2"><BookPlus size={18} className="text-emerald-600" /></div>
                  <p className="text-sm font-semibold text-slate-600">New Books</p>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">12</p>
                <p className="mt-1 text-sm font-semibold text-emerald-600">↑ 12 this month</p>
                <svg viewBox="0 0 100 16" aria-hidden="true" className="mt-3 -mx-4 h-5 w-[calc(100%+2rem)]">
                  <path d="M0 11 L12 9 L22 10 L32 8 L42 9 L52 7 L62 8 L72 6 L82 7 L100 5" fill="none" stroke="#14b8a6" strokeOpacity="0.22" strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M0 11 L12 9 L22 10 L32 8 L42 9 L52 7 L62 8 L72 6 L82 7 L100 5" fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </article>
            </section>

            <section className="grid gap-3 px-5 pb-3 xl:grid-cols-3">
              <article className="rounded-xl border border-slate-100 bg-white p-4 xl:col-span-1">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800">Recent Borrowed Books</h3>
                  <button className="text-sm font-semibold text-emerald-700">View all</button>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3"><span>Sosyolohiya sa Filipino</span><span className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">May 6, 2026</span></div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3"><span>Understanding Philippine social realities</span><span className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">May 5, 2026</span></div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3"><span>The conjugal dictatorship...</span><span className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">May 4, 2026</span></div>
                  <div className="flex items-center justify-between"><span>Filipino values today</span><span className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">May 3, 2026</span></div>
                </div>
              </article>

              <article className="rounded-xl border border-slate-100 bg-white p-4 xl:col-span-1">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800">Overdue Returns</h3>
                  <button className="text-sm font-semibold text-emerald-700">View all</button>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3"><span>How to read a newspaper</span><span className="rounded bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">5 days</span></div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3"><span>Peryodismo sa Pilipino</span><span className="rounded bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">3 days</span></div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3"><span>Ulat ng unang pambansang...</span><span className="rounded bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">2 days</span></div>
                  <div className="flex items-center justify-between"><span>Sociology in the Philippine setting</span><span className="rounded bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">1 day</span></div>
                </div>
              </article>

              <article className="rounded-xl border border-slate-100 bg-white p-4 xl:col-span-1">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800">Today&apos;s Activity</h3>
                  <button className="text-sm font-semibold text-emerald-700">View all</button>
                </div>
                <div className="space-y-3 text-sm">
                  <p><span className="font-semibold text-slate-500">1:02 PM</span> New book added</p>
                  <p><span className="font-semibold text-slate-500">12:45 PM</span> Book borrowed</p>
                  <p><span className="font-semibold text-slate-500">11:30 AM</span> Book returned</p>
                  <p><span className="font-semibold text-slate-500">10:15 AM</span> New member added</p>
                  <p><span className="font-semibold text-slate-500">9:05 AM</span> Book borrowed</p>
                </div>
              </article>
            </section>

            <section className="grid gap-3 px-5 pb-5 xl:grid-cols-4">
              <article className="rounded-xl border border-slate-100 bg-white p-4">
                <h3 className="mb-3 text-xl font-bold text-slate-800">Most Borrowed Categories</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>Sociology 35% (452)</p><p>History 28% (361)</p><p>Education 17% (219)</p><p>Language 12% (154)</p><p>Others 8% (102)</p>
                </div>
              </article>
              <article className="rounded-xl border border-slate-100 bg-white p-4">
                <h3 className="mb-3 text-xl font-bold text-slate-800">Low Stock / Missing Copies</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>The life-style of the Badjaos</p><p>Badjaw</p><p>Sulu studies 1</p><p>The food and culture of the Tausug</p>
                </div>
              </article>
              <article className="rounded-xl border border-slate-100 bg-white p-4">
                <h3 className="mb-3 text-xl font-bold text-slate-800">Quick Reports</h3>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2"><FileText size={14} />Books by Category</p>
                  <p className="flex items-center gap-2"><FileText size={14} />Top Borrowed Books</p>
                  <p className="flex items-center gap-2"><FileText size={14} />Overdue Books Report</p>
                  <p className="flex items-center gap-2"><FileText size={14} />Monthly Activities</p>
                </div>
              </article>
              <article className="rounded-xl border border-slate-100 bg-white p-4">
                <h3 className="mb-3 text-xl font-bold text-slate-800">Upcoming Due Dates</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center justify-between"><span>Sosyolohiya sa Filipino</span><span className="rounded bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">May 11, 2026</span></p>
                  <p className="flex items-center justify-between"><span>Filipino values today</span><span className="rounded bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">May 10, 2026</span></p>
                  <p className="flex items-center justify-between"><span>Understanding Philippine...</span><span className="rounded bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">May 9, 2026</span></p>
                </div>
              </article>
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














