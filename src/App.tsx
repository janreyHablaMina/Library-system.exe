import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Bell, BookOpen, BookPlus, Bookmark, Clock3, FileText, Mail, MessageCircle, Moon, Search, Sun, Undo2, UserPlus, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import heroImage from './assets/login.avif'
import { BooksPage } from './pages/BooksPage'
import { MembersPage } from './pages/MembersPage'
import { BorrowReturnPage } from './pages/BorrowReturnPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { BookDetailPage } from './pages/BookDetailPage'
import { TransactionDetailPage } from './pages/TransactionDetailPage'
import { ReportsPage } from './pages/ReportsPage'

type LoginFormState = {
  username: string
  password: string
  rememberMe: boolean
}

type NavItem = {
  label: string
}

const initialState: LoginFormState = {
  username: '',
  password: '',
  rememberMe: true,
}

const navItems: NavItem[] = [
  { label: 'Overview' },
  { label: 'Books' },
  { label: 'Members' },
  { label: 'Authors' },
  { label: 'Categories' },
  { label: 'Borrow / Return' },
  { label: 'Reports' },
  { label: 'Settings' },
]

type ActivityItem = {
  title: string
  detail: string
  date: string
  time: string
  icon: string
  iconClass: string
}

const todayActivityItems: ActivityItem[] = [
  {
    title: 'New book added',
    detail: '"Philippine Constitution"',
    date: 'May 6, 2026',
    time: '1:02 PM',
    icon: '📖',
    iconClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Book borrowed',
    detail: 'by Maria Santos',
    date: 'May 6, 2026',
    time: '12:45 PM',
    icon: '↩',
    iconClass: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'Book returned',
    detail: 'by Juan Dela Cruz',
    date: 'May 6, 2026',
    time: '11:30 AM',
    icon: '⟳',
    iconClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'New member added',
    detail: 'Pedro Reyes',
    date: 'May 6, 2026',
    time: '10:15 AM',
    icon: '👤',
    iconClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Book borrowed',
    detail: 'by Ana Lim',
    date: 'May 6, 2026',
    time: '9:05 AM',
    icon: '↩',
    iconClass: 'bg-amber-50 text-amber-600',
  },
]

type QuickReportItem = {
  label: string
  icon: LucideIcon
}

const quickReportItems: QuickReportItem[] = [
  { label: 'Books by Category', icon: FileText },
  { label: 'Top Borrowed Books', icon: FileText },
  { label: 'Overdue Books Report', icon: FileText },
  { label: 'Monthly Activities', icon: FileText },
]

function DashboardShell({ onLogout }: { onLogout: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePage, setActivePage] = useState<NavItem['label']>('Books')
  const [isBookDetailOpen, setIsBookDetailOpen] = useState(false)
  const [isTransactionDetailOpen, setIsTransactionDetailOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
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

  const dashboardTheme = isDarkMode
    ? {
        main: 'bg-slate-950 text-slate-100',
        frame: 'border-slate-800 bg-slate-950',
        aside: 'border-slate-800 bg-[#070f23]',
        asideTitle: 'text-emerald-400',
        asideSub: 'text-slate-400',
        navActive: 'bg-emerald-500/16 text-emerald-300',
        navIdle: 'text-slate-300 hover:bg-slate-800',
        header: 'border-slate-800 bg-[#0a1430]',
        search: 'border-slate-700 bg-[#0a1430]',
        searchIcon: 'text-slate-500 group-focus-within:text-emerald-400',
        searchInput: 'text-slate-100 placeholder:text-slate-500',
        iconBtn: 'text-slate-300 hover:bg-slate-800',
        profileBorder: 'border-slate-700',
        profileName: 'text-slate-100',
        profileRole: 'text-slate-400',
        contentBg: 'bg-[#020617]',
        greetingTitle: 'text-slate-100',
        greetingSub: 'text-slate-400',
        quickAction: 'border-slate-700 bg-[#0b1738] text-slate-100 hover:bg-[#132146]',
        cardPanel: 'border-slate-700 bg-[#0a1633]',
        cardTitle: 'text-slate-100',
        cardText: 'text-slate-300',
        cardMuted: 'text-slate-500',
      }
    : {
        main: 'bg-white text-slate-800',
        frame: 'border-slate-200 bg-white',
        aside: 'border-slate-200 bg-white',
        asideTitle: 'text-[#2f5bff]',
        asideSub: 'text-slate-500',
        navActive: 'bg-blue-100 text-blue-700',
        navIdle: 'text-slate-600 hover:bg-slate-100',
        header: 'border-slate-200 bg-white',
        search: 'border-slate-200 bg-white',
        searchIcon: 'text-slate-400 group-focus-within:text-emerald-600',
        searchInput: 'text-slate-700 placeholder:text-slate-400',
        iconBtn: 'text-slate-600 hover:bg-slate-100',
        profileBorder: 'border-slate-200',
        profileName: 'text-slate-800',
        profileRole: 'text-slate-500',
        contentBg: 'bg-[#f8fafc]',
        greetingTitle: 'text-slate-900',
        greetingSub: 'text-slate-500',
        quickAction: 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50',
        cardPanel: 'border-slate-100 bg-white',
        cardTitle: 'text-slate-800',
        cardText: 'text-slate-700',
        cardMuted: 'text-slate-500',
      }

  return (
    <main className={`h-screen overflow-hidden p-0 ${dashboardTheme.main} ${isDarkMode ? 'dashboard-dark' : ''}`}>
      <div className={`flex h-full w-full overflow-hidden border ${dashboardTheme.frame}`}>
        <aside className={`hidden h-full shrink-0 border-r transition-all duration-200 lg:flex lg:flex-col ${dashboardTheme.aside} ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <div className={`border-b py-6 ${dashboardTheme.aside} ${sidebarCollapsed ? 'px-3' : 'px-6'}`}>
            <h1 className={`font-black italic tracking-tight ${dashboardTheme.asideTitle} ${sidebarCollapsed ? 'text-2xl text-center' : 'text-4xl'}`}>infoLib</h1>
            {!sidebarCollapsed ? <p className={`mt-1 text-[10px] font-bold uppercase tracking-[0.08em] ${dashboardTheme.asideSub}`}>Library Management System</p> : null}
          </div>
          <nav className={`flex-1 space-y-1 py-5 text-sm ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setActivePage(item.label)
                  if (item.label !== 'Books') {
                    setIsBookDetailOpen(false)
                  }
                  if (item.label !== 'All Transactions' && item.label !== 'Borrow / Return') {
                    setIsTransactionDetailOpen(false)
                  }
                }}
                className={
                  item.label === activePage
                    ? `flex w-full items-center rounded-lg py-2 font-semibold ${dashboardTheme.navActive} ${sidebarCollapsed ? 'justify-center px-2' : 'gap-2 px-3'}`
                    : `flex w-full items-center rounded-lg py-2 ${dashboardTheme.navIdle} ${sidebarCollapsed ? 'justify-center px-2' : 'gap-2 px-3'}`
                }
                type="button"
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {!sidebarCollapsed ? item.label : null}
              </button>
            ))}
          </nav>
          <div className={`border-t ${dashboardTheme.profileBorder} ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
            {!sidebarCollapsed ? <p className={`text-xs ${dashboardTheme.profileRole}`}>© 2026 infoLib</p> : null}
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className={`sticky top-0 z-20 flex h-20 items-center border-b px-5 ${dashboardTheme.header}`}>
            <div className="flex w-full items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarCollapsed((value) => !value)}
                className={`grid h-10 w-10 place-items-center rounded-lg ${dashboardTheme.iconBtn}`}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <ArrowRight size={20} strokeWidth={2.2} /> : <ArrowLeft size={20} strokeWidth={2.2} />}
              </button>
              <form className={`group flex h-12 w-[520px] items-center rounded-full border px-4 focus-within:border-emerald-500 ${dashboardTheme.search}`} role="search">
                <label htmlFor="header-search" className="sr-only">Search library records</label>
                <Search size={16} className={`mr-3 transition-colors ${dashboardTheme.searchIcon}`} />
                <input
                  id="header-search"
                  type="search"
                  placeholder="Search books, members, authors, categories..."
                  className={`w-full bg-transparent text-sm font-light placeholder:font-light outline-none ${dashboardTheme.searchInput}`}
                />
              </form>
              <div className="ml-auto flex items-center gap-4">
                <div className="hidden items-center gap-2 lg:flex">
                  <button
                    type="button"
                    onClick={() => setIsDarkMode((value) => !value)}
                    className={`rounded-lg p-2 ${dashboardTheme.iconBtn}`}
                    aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    title={isDarkMode ? 'Light mode' : 'Dark mode'}
                  >
                    {isDarkMode ? <Sun size={18} strokeWidth={1.9} /> : <Moon size={18} strokeWidth={1.9} />}
                  </button>
                  <button type="button" className={`relative rounded-lg p-2 ${dashboardTheme.iconBtn}`} aria-label="Open messages">
                    <MessageCircle size={18} strokeWidth={1.9} />
                    <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
                  </button>
                  <button type="button" className={`relative rounded-lg p-2 ${dashboardTheme.iconBtn}`} aria-label="Open inbox">
                    <Mail size={18} strokeWidth={1.9} />
                    <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">5</span>
                  </button>
                  <button type="button" className={`relative rounded-lg p-2 ${dashboardTheme.iconBtn}`} aria-label="Open notifications">
                    <Bell size={18} strokeWidth={1.9} />
                    <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">2</span>
                  </button>
                </div>
                <div ref={profileMenuRef} className={`relative hidden items-center gap-3 border-l pl-4 md:flex ${dashboardTheme.profileBorder}`}>
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-violet-200 text-xl">👨🏻</div>
                  <div>
                    <p className={`text-sm font-bold ${dashboardTheme.profileName}`}>Admin User</p>
                    <p className={`text-xs ${dashboardTheme.profileRole}`}>Librarian</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((value) => !value)}
                    className={`grid h-8 w-8 place-items-center rounded-lg ${dashboardTheme.iconBtn}`}
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

          {activePage === 'Books' ? (
            isBookDetailOpen ? (
              <BookDetailPage isDarkMode={isDarkMode} onBack={() => setIsBookDetailOpen(false)} />
            ) : (
              <BooksPage isDarkMode={isDarkMode} onOpenBookDetail={() => setIsBookDetailOpen(true)} />
            )
          ) : activePage === 'Members' ? (
            <MembersPage isDarkMode={isDarkMode} />
          ) : activePage === 'Borrow / Return' ? (
            <BorrowReturnPage isDarkMode={isDarkMode} onOpenTransactions={() => setActivePage('All Transactions')} />
          ) : activePage === 'All Transactions' ? (
            isTransactionDetailOpen ? (
              <TransactionDetailPage
                isDarkMode={isDarkMode}
                onBack={() => setIsTransactionDetailOpen(false)}
                transactionId={selectedTransactionId || undefined}
              />
            ) : (
              <TransactionsPage
                isDarkMode={isDarkMode}
                onBack={() => setActivePage('Borrow / Return')}
                onOpenTransactionDetail={(id) => {
                  setSelectedTransactionId(id)
                  setIsTransactionDetailOpen(true)
                }}
              />
            )
          ) : activePage === 'Reports' ? (
            <ReportsPage isDarkMode={isDarkMode} />
          ) : (
          <div className={`min-h-0 flex-1 overflow-auto p-4 ${dashboardTheme.contentBg}`}>
            <section className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className={`text-3xl font-black ${dashboardTheme.greetingTitle}`}>Good morning, Admin! 👋</h2>
                  <p className={`mt-1 text-sm ${dashboardTheme.greetingSub}`}>Here&apos;s what&apos;s happening in your library today.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <button type="button" className={`flex min-w-[160px] items-center gap-3 rounded-xl border px-5 py-3 text-sm font-medium ${dashboardTheme.quickAction}`}>
                    <BookPlus size={18} className="text-emerald-600" />
                    Add Book
                  </button>
                  <button type="button" className={`flex min-w-[160px] items-center gap-3 rounded-xl border px-5 py-3 text-sm font-medium ${dashboardTheme.quickAction}`}>
                    <ArrowRight size={18} className="text-emerald-600" />
                    Borrow Book
                  </button>
                  <button type="button" className={`flex min-w-[160px] items-center gap-3 rounded-xl border px-5 py-3 text-sm font-medium ${dashboardTheme.quickAction}`}>
                    <Undo2 size={18} className="text-amber-500" />
                    Return Book
                  </button>
                  <button type="button" className={`flex min-w-[160px] items-center gap-3 rounded-xl border px-5 py-3 text-sm font-medium ${dashboardTheme.quickAction}`}>
                    <UserPlus size={18} className="text-emerald-600" />
                    Add Member
                  </button>
                </div>
              </div>
            </section>

            <section className="grid gap-3 px-5 pb-3 sm:grid-cols-2 xl:grid-cols-6">
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
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
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
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
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
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
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
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
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
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
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
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

            <section className="grid gap-3 px-5 pb-4 xl:grid-cols-[40fr_35fr_25fr]">
              <article className={`overflow-hidden rounded-2xl border shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Recent Borrowed Books</h3>
                  <button className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div>
                  <div className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-2.5 transition-colors duration-150 hover:bg-slate-50 md:grid-cols-[40px_1.8fr_1fr_auto] md:items-center">
                    <div className="grid h-11 w-8 place-items-center rounded-md border border-slate-200 bg-slate-50 text-base">📘</div>
                    <div><p className="text-sm leading-snug font-semibold text-slate-900">Sosyolohiya sa Filipino</p><p className="text-xs text-slate-500">Kahayon, Alicia H.</p></div>
                    <div><p className="text-[11px] font-semibold text-slate-500">Borrowed by</p><p className="text-sm font-semibold text-slate-700">Maria Santos</p></div>
                    <span className="w-fit rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">May 6, 2026</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-2.5 transition-colors duration-150 hover:bg-slate-50 md:grid-cols-[40px_1.8fr_1fr_auto] md:items-center">
                    <div className="grid h-11 w-8 place-items-center rounded-md border border-slate-200 bg-slate-50 text-base">📕</div>
                    <div><p className="text-sm leading-snug font-semibold text-slate-900">Understanding Philippine social realities through the Filipino family</p><p className="text-xs text-slate-500">Ramirez, Mina M.</p></div>
                    <div><p className="text-[11px] font-semibold text-slate-500">Borrowed by</p><p className="text-sm font-semibold text-slate-700">Juan Dela Cruz</p></div>
                    <span className="w-fit rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">May 5, 2026</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-2.5 transition-colors duration-150 hover:bg-slate-50 md:grid-cols-[40px_1.8fr_1fr_auto] md:items-center">
                    <div className="grid h-11 w-8 place-items-center rounded-md border border-slate-200 bg-slate-50 text-base">📗</div>
                    <div><p className="text-sm leading-snug font-semibold text-slate-900">The conjugal dictatorship of Ferdinand and Imelda Marcos I</p><p className="text-xs text-slate-500">Mijares, Primitivo</p></div>
                    <div><p className="text-[11px] font-semibold text-slate-500">Borrowed by</p><p className="text-sm font-semibold text-slate-700">Pedro Reyes</p></div>
                    <span className="w-fit rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">May 4, 2026</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-2.5 transition-colors duration-150 hover:bg-slate-50 md:grid-cols-[40px_1.8fr_1fr_auto] md:items-center">
                    <div className="grid h-11 w-8 place-items-center rounded-md border border-slate-200 bg-slate-50 text-base">📙</div>
                    <div><p className="text-sm leading-snug font-semibold text-slate-900">Filipino values today</p><p className="text-xs text-slate-500">Timberza, Florentino T.</p></div>
                    <div><p className="text-[11px] font-semibold text-slate-500">Borrowed by</p><p className="text-sm font-semibold text-slate-700">Ana Lim</p></div>
                    <span className="w-fit rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">May 3, 2026</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 px-4 py-2.5 transition-colors duration-150 hover:bg-slate-50 md:grid-cols-[40px_1.8fr_1fr_auto] md:items-center">
                    <div className="grid h-11 w-8 place-items-center rounded-md border border-slate-200 bg-slate-50 text-base">📓</div>
                    <div><p className="text-sm leading-snug font-semibold text-slate-900">The fateful years</p><p className="text-xs text-slate-500">Agoncillo, Teodoro A.</p></div>
                    <div><p className="text-[11px] font-semibold text-slate-500">Borrowed by</p><p className="text-sm font-semibold text-slate-700">Carlo Garcia</p></div>
                    <span className="w-fit rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">May 2, 2026</span>
                  </div>
                </div>
              </article>

              <article className={`overflow-hidden rounded-2xl border shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Overdue Returns</h3>
                  <button className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div>
                  <div className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-3 transition-colors duration-150 hover:bg-slate-50 md:grid-cols-[1.8fr_1fr_auto] md:items-center">
                    <div><p className="text-sm leading-snug font-semibold text-slate-900">How to read a newspaper</p><p className="text-xs text-slate-500">Dale, Edgar</p></div>
                    <p className="text-sm font-semibold text-slate-700">Maria Santos</p>
                    <span className="w-fit rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">5 days</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-3 transition-colors duration-150 hover:bg-slate-50 md:grid-cols-[1.8fr_1fr_auto] md:items-center">
                    <div><p className="text-sm leading-snug font-semibold text-slate-900">Peryodismo sa Pilipino</p><p className="text-xs text-slate-500">Landicho, Domingo G.</p></div>
                    <p className="text-sm font-semibold text-slate-700">Juan Dela Cruz</p>
                    <span className="w-fit rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">3 days</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-3 transition-colors duration-150 hover:bg-slate-50 md:grid-cols-[1.8fr_1fr_auto] md:items-center">
                    <div><p className="text-sm leading-snug font-semibold text-slate-900">Ulat ng unang pambansang kumperensya sa sikolohiyang Pilipino</p><p className="text-xs text-slate-500">Pambansang Samahan sa Sikolohiyang Pilipino</p></div>
                    <p className="text-sm font-semibold text-slate-700">Pedro Reyes</p>
                    <span className="w-fit rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">2 days</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 px-4 py-3 transition-colors duration-150 hover:bg-slate-50 md:grid-cols-[1.8fr_1fr_auto] md:items-center">
                    <div><p className="text-sm leading-snug font-semibold text-slate-900">Sociology in the Philippine setting</p><p className="text-xs text-slate-500">Hunt, Chester L.</p></div>
                    <p className="text-sm font-semibold text-slate-700">Ana Lim</p>
                    <span className="w-fit rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">1 day</span>
                  </div>
                </div>
              </article>

              <article className={`rounded-2xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-3 flex items-center justify-between pb-3">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Today&apos;s Activity</h3>
                  <button className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div className="space-y-0">
                  {todayActivityItems.map((item, idx) => (
                    <div
                      key={`${item.title}-${item.time}`}
                      className={`-mx-4 grid grid-cols-[44px_1fr_auto] items-start gap-2 px-4 py-2.5 transition-colors duration-150 hover:bg-slate-50 ${
                        idx < todayActivityItems.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                    >
                      <div className={`grid h-10 w-10 place-items-center rounded-full text-xl ${item.iconClass}`}>{item.icon}</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="text-xs font-medium text-slate-500">{item.detail}</p>
                      </div>
                      <p className="pt-1 text-right text-xs font-semibold text-slate-500">{item.date}<br />{item.time}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-3 px-5 pb-5 xl:grid-cols-4">
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Most Borrowed Categories</h3>
                  <button className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div className="flex min-h-[220px] items-center">
                  <div className="grid w-full gap-4 md:grid-cols-[190px_1fr] md:items-center md:justify-center">
                  <div className="mx-auto h-36 w-36 rounded-full bg-[conic-gradient(#10b981_0_35%,#34d399_35%_63%,#6ee7b7_63%_80%,#059669_80%_92%,#d1d5db_92%_100%)] p-7">
                    <div className="h-full w-full rounded-full bg-white" />
                  </div>
                    <div className="mx-auto w-full max-w-[220px] space-y-2.5 text-xs text-slate-600">
                    <p className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Sociology</span><span className="font-semibold text-slate-700">35% (452)</span></p>
                    <p className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />History</span><span className="font-semibold text-slate-700">28% (361)</span></p>
                    <p className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />Education</span><span className="font-semibold text-slate-700">17% (219)</span></p>
                    <p className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-700/70" />Language</span><span className="font-semibold text-slate-700">12% (154)</span></p>
                    <p className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-300" />Others</span><span className="font-semibold text-slate-700">8% (102)</span></p>
                  </div>
                </div>
                </div>
              </article>
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Low Stock / Missing Copies</h3>
                  <button className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div className="space-y-0 text-xs">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 rounded-md px-1 py-2 transition-colors duration-150 hover:bg-slate-50">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />The life-style of the Badjaos</p>
                      <p className="pl-4 text-xs text-slate-500">Available: 1 / Total: 2</p>
                    </div>
                    <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">Low</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 rounded-md px-1 py-2 transition-colors duration-150 hover:bg-slate-50">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Badjaw</p>
                      <p className="pl-4 text-xs text-slate-500">Available: 1 / Total: 2</p>
                    </div>
                    <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">Low</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 rounded-md px-1 py-2 transition-colors duration-150 hover:bg-slate-50">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />Sulu studies 1</p>
                      <p className="pl-4 text-xs text-slate-500">Available: 0 / Total: 1</p>
                    </div>
                    <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">Out</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 rounded-md px-1 py-2 transition-colors duration-150 hover:bg-slate-50">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />The food and culture of the Tausug</p>
                      <p className="pl-4 text-xs text-slate-500">Available: 1 / Total: 2</p>
                    </div>
                    <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">Low</span>
                  </div>
                </div>
              </article>
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Quick Reports</h3>
                </div>
                <div className="space-y-0">
                  {quickReportItems.map((item) => {
                    const ItemIcon = item.icon

                    return (
                      <button
                        key={item.label}
                        type="button"
                        className="flex w-full items-center justify-between border-b border-slate-100 last:border-b-0 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-slate-50"
                        aria-label={item.label}
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                            <ItemIcon size={13} />
                          </span>
                          {item.label}
                        </span>
                        <span className="text-slate-500">›</span>
                      </button>
                    )
                  })}
                </div>
              </article>
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Upcoming Due Dates</h3>
                  <button className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div className="space-y-0">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 rounded-md px-2 py-2 transition-colors duration-150 hover:bg-slate-50">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Sosyolohiya sa Filipino</p>
                      <p className="text-xs font-medium text-slate-500">Maria Santos</p>
                    </div>
                    <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">May 11, 2026</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 rounded-md px-2 py-2 transition-colors duration-150 hover:bg-slate-50">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Filipino values today</p>
                      <p className="text-xs font-medium text-slate-500">Juan Dela Cruz</p>
                    </div>
                    <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">May 10, 2026</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 rounded-md px-2 py-2 transition-colors duration-150 hover:bg-slate-50">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Understanding Philippine...</p>
                      <p className="text-xs font-medium text-slate-500">Pedro Reyes</p>
                    </div>
                    <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">May 9, 2026</span>
                  </div>
                </div>
              </article>
            </section>
          </div>
          )}
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














