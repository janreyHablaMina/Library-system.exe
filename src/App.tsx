import React, { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { 
  ArrowLeftRight, BarChart3, BookOpen, Calendar, Feather, Grid2x2, 
  LayoutDashboard, Settings2, UserCircle, Users 
} from 'lucide-react'
import heroImage from './assets/login.avif'

// Pages
import { BooksPage } from './pages/BooksPage'
import { MembersPage } from './pages/MembersPage'
import { BorrowReturnPage } from './pages/BorrowReturnPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { BookDetailPage } from './pages/BookDetailPage'
import { TransactionDetailPage } from './pages/TransactionDetailPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { AuthorsPage } from './pages/AuthorsPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { ReservationsPage } from './pages/ReservationsPage'
import { StaffPage } from './pages/StaffPage'

// Components
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'

// Types
import type { ActivityItem, NavItem } from './types'

type LoginFormState = {
  username: string
  password: string
  rememberMe: boolean
}

const initialState: LoginFormState = {
  username: '',
  password: '',
  rememberMe: true,
}

const navItems: NavItem[] = [
  { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'Books', icon: BookOpen, label: 'Books' },
  { id: 'Members', icon: Users, label: 'Members' },
  { id: 'Authors', icon: Feather, label: 'Authors' },
  { id: 'Categories', icon: Grid2x2, label: 'Categories' },
  { id: 'Transactions', icon: ArrowLeftRight, label: 'Borrow / Return' },
  { id: 'Reservations', icon: Calendar, label: 'Reservations' },
  { id: 'Staff', icon: UserCircle, label: 'Staff' },
  { id: 'Reports', icon: BarChart3, label: 'Reports' },
  { id: 'Settings', icon: Settings2, label: 'Settings' },
]

const todayActivityItems: ActivityItem[] = [
  {
    id: 1,
    title: 'New book added',
    detail: '"Philippine Constitution"',
    date: 'May 6, 2026',
    time: '1:02 PM',
    module: 'Books',
    updatedBy: 'Admin User',
    icon: BookOpen,
    color: 'bg-emerald-50 text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 2,
    title: 'Book borrowed',
    detail: 'by Maria Santos',
    date: 'May 6, 2026',
    time: '12:45 PM',
    module: 'Circulation',
    updatedBy: 'Admin User',
    icon: ArrowLeftRight,
    color: 'bg-amber-50 text-amber-600',
    badge: 'bg-amber-50 text-amber-600',
  },
]

function DashboardShell({ onLogout }: { onLogout: () => void }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePage, setActivePage] = useState<string>('Dashboard')
  const [activeSettingsTab, setActiveSettingsTab] = useState('Overview')
  const [isBookDetailOpen, setIsBookDetailOpen] = useState(false)
  const [isTransactionDetailOpen, setIsTransactionDetailOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)

  const dashboardTheme = isDarkMode
    ? {
        main: 'bg-[#020617] text-slate-100',
        frame: 'border-slate-800 bg-[#020617]',
        aside: 'border-emerald-900/40 bg-[linear-gradient(180deg,#052e22_0%,#064e3b_55%,#022c22_100%)]',
        asideTitle: 'text-emerald-100',
        asideSub: 'text-emerald-200/75',
        navActive: 'bg-[linear-gradient(90deg,#34d399_0%,#10b981_100%)] text-white shadow-[0_14px_22px_-16px_rgba(16,185,129,0.95)]',
        navIdle: 'text-emerald-50/90 hover:bg-emerald-700/40',
        header: 'border-slate-800 bg-[#0a1430]',
        search: 'border-slate-700 bg-[#0a1430]',
        searchIcon: 'text-slate-500 group-focus-within:text-emerald-400',
        searchInput: 'text-slate-100 placeholder:text-slate-500',
        iconBtn: 'text-slate-300 hover:bg-slate-800',
        profileBorder: 'border-emerald-800/60',
        profileName: 'text-emerald-50',
        profileRole: 'text-emerald-200/75',
        contentBg: 'bg-[#020617]',
      }
    : {
        main: 'bg-white text-slate-800',
        frame: 'border-slate-200 bg-white',
        aside: 'border-emerald-900/35 bg-[linear-gradient(180deg,#064e3b_0%,#065f46_48%,#064e3b_100%)]',
        asideTitle: 'text-emerald-50',
        asideSub: 'text-emerald-100/80',
        navActive: 'bg-[linear-gradient(90deg,#34d399_0%,#10b981_100%)] text-white shadow-[0_14px_22px_-16px_rgba(16,185,129,0.95)]',
        navIdle: 'text-emerald-50/90 hover:bg-emerald-700/35',
        header: 'border-slate-200 bg-white',
        search: 'border-slate-200 bg-white',
        searchIcon: 'text-slate-400 group-focus-within:text-emerald-600',
        searchInput: 'text-slate-700 placeholder:text-slate-400',
        iconBtn: 'text-slate-600 hover:bg-slate-100',
        profileBorder: 'border-emerald-800/55',
        profileName: 'text-slate-900',
        profileRole: 'text-slate-500',
        contentBg: 'bg-[#f8fafc]',
      }

  return (
    <main className={`h-screen overflow-hidden p-0 ${dashboardTheme.main} ${isDarkMode ? 'dashboard-dark' : ''}`}>
      <div className={`flex h-full w-full overflow-hidden border ${dashboardTheme.frame}`}>
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          activePage={activePage}
          setActivePage={setActivePage}
          setActiveSettingsTab={setActiveSettingsTab}
          theme={dashboardTheme}
          navItems={navItems}
        />

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Topbar
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            theme={dashboardTheme}
            onLogout={onLogout}
          />

          <div className={`flex-1 overflow-auto ${dashboardTheme.contentBg}`}>
            {activePage === 'Dashboard' && (
              <div className="p-8">
                <h2 className="text-3xl font-black">Dashboard Overview</h2>
                <p className="mt-1 text-slate-500">Welcome back to the library management system.</p>
              </div>
            )}
            {activePage === 'Books' && (
              <BooksPage 
                isDarkMode={isDarkMode} 
                onOpenBookDetail={() => setIsBookDetailOpen(true)} 
              />
            )}
            {activePage === 'Members' && <MembersPage isDarkMode={isDarkMode} />}
            {activePage === 'Authors' && <AuthorsPage isDarkMode={isDarkMode} />}
            {activePage === 'Categories' && <CategoriesPage isDarkMode={isDarkMode} />}
            {activePage === 'Transactions' && (
              <BorrowReturnPage 
                isDarkMode={isDarkMode} 
                onViewTransaction={(id) => {
                  setSelectedTransactionId(id);
                  setIsTransactionDetailOpen(true);
                }} 
              />
            )}
            {activePage === 'Reservations' && <ReservationsPage isDarkMode={isDarkMode} />}
            {activePage === 'Staff' && <StaffPage isDarkMode={isDarkMode} />}
            {activePage === 'Reports' && <ReportsPage isDarkMode={isDarkMode} />}
            {activePage === 'Settings' && (
              <SettingsPage 
                activeMenu={activeSettingsTab} 
                onTabChange={setActiveSettingsTab} 
                isDarkMode={isDarkMode} 
              />
            )}
          </div>
        </section>
      </div>

      {isBookDetailOpen && (
        <BookDetailPage 
          isOpen={isBookDetailOpen} 
          onClose={() => setIsBookDetailOpen(false)} 
          isDarkMode={isDarkMode} 
        />
      )}
      {isTransactionDetailOpen && selectedTransactionId && (
        <TransactionDetailPage 
          isOpen={isTransactionDetailOpen} 
          onClose={() => setIsTransactionDetailOpen(false)} 
          transactionId={selectedTransactionId}
          isDarkMode={isDarkMode} 
        />
      )}
    </main>
  )
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formState, setFormState] = useState<LoginFormState>(initialState)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formState.username.trim() && formState.password.trim()) {
      setIsAuthenticated(true)
    }
  }

  if (isAuthenticated) {
    return <DashboardShell onLogout={() => setIsAuthenticated(false)} />
  }

  return (
    <main className="h-screen overflow-hidden bg-[#03171d]">
      <div className="grid h-full lg:grid-cols-2">
        <section className="relative hidden lg:block">
          <img src={heroImage} alt="Library" className="h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#03171d] to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
            <h1 className="text-6xl font-black tracking-tight">info<span className="text-emerald-400">Lib</span></h1>
            <p className="mt-4 text-xl text-emerald-100/80">Manage your library resources with ease and precision.</p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-50 p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-slate-500">Please enter your details to sign in.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Username</label>
                <input 
                  type="text" 
                  value={formState.username}
                  onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" 
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={formState.password}
                    onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" 
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-400"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98]">
              Sign In
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
