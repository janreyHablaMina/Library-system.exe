import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { listen } from '@tauri-apps/api/event'
import { AlertTriangle, ArrowLeft, ArrowLeftRight, ArrowRight, BarChart3, Bell, BookOpen, BookPlus, Bookmark, Calendar, ChevronRight, Clock3, Feather, FileText, Grid2x2, LayoutDashboard, Library, Lock, LogOut, Mail, MessageCircle, Moon, RotateCcw, Search, Settings2, Shield, Sun, Undo2, UserCircle, UserPlus, Users, UsersRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import heroImage from './assets/login.avif'
import { BooksPage } from './pages/BooksPage'
import type { BookDetailData } from './pages/BooksPage'
import { AddBookPage } from './pages/AddBookPage'
import type { AddBookFormData } from './pages/AddBookPage'
import { MembersPage } from './pages/MembersPage'
import { MemberDetailPage } from './pages/MemberDetailPage'
import { BorrowReturnPage } from './pages/BorrowReturnPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { BookDetailPage } from './pages/BookDetailPage'
import { TransactionDetailPage } from './pages/TransactionDetailPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { AuthorsPage } from './pages/AuthorsPage'
import { AuthorDetailPage } from './pages/AuthorDetailPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { ReservationsPage } from './pages/ReservationsPage'
import { StaffPage } from './pages/StaffPage'
import { getSetting, getTrialDaysRemaining, verifyLicenseKey, getLicenseStatus, createBook, expandMainWindow, getActiveSession, getEmailLogStats, listAuthors, listBooks, listBorrowTransactions, listMembers, listNotifications, listEmailLogs, login as loginWithDb, logout as logoutFromDb, markAllNotificationsRead, markNotificationAsRead, restoreLoginWindow, runAutomaticEmailReminders, searchAuthors, searchBooks, searchMembers, syncNotifications, type NotificationItem, type EmailLog } from './lib/tauriApi'


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

const navItems = [
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
] as const

type ActivePage = (typeof navItems)[number]['id'] | 'All Transactions'



type DashboardStats = {
  totalBooks: number
  availableBooks: number
  borrowedBooks: number
  overdueBooks: number
  totalMembers: number
  totalAuthors: number
  emailsSentToday: number
  failedEmails: number
  pendingEmails: number
}
type RecentBorrowedItem = {
  id: number
  bookTitle: string
  memberName: string
  borrowDateLabel: string
  bookCoverData: string | null
}
type OverdueReturnItem = {
  id: number
  bookTitle: string
  memberName: string
  overdueLabel: string
  memberPhotoData: string | null
}
type BorrowedCategoryItem = {
  category: string
  count: number
  percent: number
}
type LowStockItem = {
  key: string
  title: string
  coverData: string | null
  available: number
  total: number
  level: 'Low' | 'Out'
}
type UpcomingDueItem = {
  id: number
  bookTitle: string
  memberName: string
  dueDateLabel: string
  memberPhotoData: string | null
}
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

function getGreetingForDate(date: Date) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatDisplayName(username: string | null) {
  if (!username) return 'Admin'
  return username
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Admin'
}

function DashboardShell({ onLogout, licenseStatus, trialDays }: { onLogout: () => Promise<void> | void, licenseStatus: string, trialDays: number }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const [activeUsername, setActiveUsername] = useState<string | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePage, setActivePage] = useState<ActivePage>('Dashboard')
  const [activeSettingsTab, setActiveSettingsTab] = useState('Overview')
  const [libraryName, setLibraryName] = useState('infoLib')
  const [libraryLogo, setLibraryLogo] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const loadProfile = async () => {
       try {
          const name = await getSetting('library.name')
          const logo = await getSetting('library.logo_data')
          if (mounted) {
             setLibraryName(name || 'infoLib')
             setLibraryLogo(logo || null)
          }
       } catch (e) {
          // ignore
       }
    }
    loadProfile()

    const handleUpdate = (e: any) => {
       if (e.detail?.key === 'library.name') setLibraryName(e.detail.value || 'infoLib')
       if (e.detail?.key === 'library.logo_data') setLibraryLogo(e.detail.value || null)
    }
    window.addEventListener('setting-updated', handleUpdate)
    return () => {
       mounted = false
       window.removeEventListener('setting-updated', handleUpdate)
    }
  }, [])

  const [isAddBookOpen, setIsAddBookOpen] = useState(false)
  const [booksRefreshKey, setBooksRefreshKey] = useState(0)
  const [booksToastMessage, setBooksToastMessage] = useState<string | null>(null)
  const [isBookDetailOpen, setIsBookDetailOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookDetailData | null>(null)
  const [isTransactionDetailOpen, setIsTransactionDetailOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const [isMemberDetailOpen, setIsMemberDetailOpen] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null)
  const [memberAddModalTrigger, setMemberAddModalTrigger] = useState(0)
  const [isAuthorDetailOpen, setIsAuthorDetailOpen] = useState(false)
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null)
  const [transactionActiveTab, setTransactionActiveTab] = useState<'all' | 'borrowed' | 'returned' | 'overdue'>('all')
  const [borrowPrefill, setBorrowPrefill] = useState<{ memberId: number, bookId: number } | null>(null)
  const [borrowReturnActiveTab, setBorrowReturnActiveTab] = useState<'borrow' | 'return'>('borrow')

  const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(false)
  const [recentMessages, setRecentMessages] = useState<EmailLog[]>([])
  const [messageError, setMessageError] = useState<string | null>(null)
  const messageMenuRef = useRef<HTMLDivElement | null>(null)

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
    totalMembers: 0,
    totalAuthors: 0,
    emailsSentToday: 0,
    failedEmails: 0,
    pendingEmails: 0,
  })
  const [recentBorrowedItems, setRecentBorrowedItems] = useState<RecentBorrowedItem[]>([])
  const [overdueReturnItems, setOverdueReturnItems] = useState<OverdueReturnItem[]>([])
  const [borrowedCategories, setBorrowedCategories] = useState<BorrowedCategoryItem[]>([])
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([])
  const [upcomingDueItems, setUpcomingDueItems] = useState<UpcomingDueItem[]>([])
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const notificationsRef = useRef<HTMLDivElement | null>(null)
  const searchContainerRef = useRef<HTMLDivElement | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [globalSearchData, setGlobalSearchData] = useState<{
    books: { id: number; title: string; author: string; cover: string | null; category: string | null; available: boolean }[]
    members: { id: number; fullName: string; memberId: string }[]
    authors: { id: number; name: string; profilePhotoData: string | null }[]
  }>({ books: [], members: [], authors: [] })

  useEffect(() => {
    let mounted = true
    if (!searchQuery.trim()) {
      setGlobalSearchData({ books: [], members: [], authors: [] })
      return
    }

    const timer = setTimeout(() => {
      const loadSearchData = async () => {
        try {
          const q = searchQuery.trim()
          const [books, members, authors] = await Promise.all([
            searchBooks(q, 5),
            searchMembers(q, 5),
            searchAuthors(q, 5)
          ])
          if (mounted) {
            setGlobalSearchData({
              books: books.map(b => ({ id: b.id, title: b.title, author: b.author, cover: b.coverData || '📘', category: b.category, available: b.available })),
              members: members.map(m => ({ id: m.id, fullName: m.fullName, memberId: m.memberId })),
              authors: authors.map(a => ({ id: a.id, name: a.name, profilePhotoData: a.profilePhotoData }))
            })
          }
        } catch (error) {
          console.error('Failed to load global search data:', error)
        }
      }
      void loadSearchData()
    }, 300)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [searchQuery])

  const refreshNotifications = async () => {
    try {
      await syncNotifications()
      await runAutomaticEmailReminders()
      const rows = await listNotifications(12)
      setNotifications(rows)
    } catch (error) {
      console.error('Failed to refresh notifications:', error)
    }
  }
  
  const handleNavigateToBorrow = (memberId: number, bookId: number) => {
    setBorrowPrefill({ memberId, bookId })
    setActivePage('Transactions')
    setBorrowReturnActiveTab('borrow')
  }

  const openTransactionsPage = (tab: 'all' | 'borrowed' | 'returned' | 'overdue' = 'all') => {
    setTransactionActiveTab(tab)
    setActivePage('All Transactions')
  }

  useEffect(() => {
    let mounted = true
    const loadActiveUser = async () => {
      try {
        const session = await getActiveSession()
        if (mounted) setActiveUsername(session?.username ?? null)
      } catch (error) {
        console.error('Failed to load active user:', error)
      }
    }
    void loadActiveUser()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date())
    }, 60 * 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
      if (!searchContainerRef.current?.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    if (activePage !== 'Books') {
      setIsAddBookOpen(false)
      setIsBookDetailOpen(false)
    }
    if (activePage !== 'Members') {
      setIsMemberDetailOpen(false)
      setSelectedMemberId(null)
    }
    if (activePage !== 'Authors') {
      setIsAuthorDetailOpen(false)
      setSelectedAuthorId(null)
    }
  }, [activePage])

  useEffect(() => {
    void refreshNotifications()
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      void refreshNotifications()
    }, 10000)

    const handleFocus = () => {
      void refreshNotifications()
    }
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void refreshNotifications()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useEffect(() => {
    let unlisten: (() => void) | null = null
    const bind = async () => {
      try {
        unlisten = await listen('notifications:refresh', () => {
          void refreshNotifications()
        })
      } catch (error) {
        console.error('Failed to bind notifications event listener:', error)
      }
    }
    void bind()
    return () => {
      if (unlisten) unlisten()
    }
  }, [])

    useEffect(() => {
    if (activePage !== 'Dashboard') return

    const loadDashboardStats = async () => {
      try {
        const [books, members, authors, transactions, emailStats] = await Promise.all([
          listBooks(5000),
          listMembers(5000),
          listAuthors(5000),
          listBorrowTransactions(undefined, 5000),
          getEmailLogStats(),
        ])
        const now = Date.now()
        const activeBorrowTx = transactions.filter((tx) => tx.status === 'Active' || tx.status === 'Borrowed')
        const overdueActiveTx = activeBorrowTx.filter((tx) => {
          const due = new Date(tx.dueDate).getTime()
          return !Number.isNaN(due) && due < now
        })

        setDashboardStats({
          totalBooks: books.length,
          availableBooks: books.filter((book) => book.available).length,
          borrowedBooks: activeBorrowTx.length,
          overdueBooks: overdueActiveTx.length,
          totalMembers: members.length,
          totalAuthors: authors.length,
          emailsSentToday: emailStats.sentToday,
          failedEmails: emailStats.failed,
          pendingEmails: emailStats.pending,
        })
        setRecentBorrowedItems(
          activeBorrowTx
            .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime())
            .slice(0, 5)
            .map((tx) => ({
              id: tx.id,
              bookTitle: tx.bookTitle,
              memberName: tx.memberName,
              bookCoverData: tx.bookCoverData ?? null,
              borrowDateLabel: Number.isNaN(new Date(tx.borrowDate).getTime())
                ? '-'
                : new Date(tx.borrowDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            }))
        )
        setOverdueReturnItems(
          overdueActiveTx
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 4)
            .map((tx) => {
              const due = new Date(tx.dueDate)
              const days = Number.isNaN(due.getTime())
                ? 0
                : Math.max(0, Math.floor((Date.now() - due.getTime()) / (1000 * 60 * 60 * 24)))
              return {
                id: tx.id,
                bookTitle: tx.bookTitle,
                memberName: tx.memberName,
                overdueLabel: `${days} day${days === 1 ? '' : 's'}`,
                memberPhotoData: tx.memberProfilePhotoData ?? null,
              }
            })
        )
        const categoryByBookId = new Map<number, string>()
        for (const book of books) {
          categoryByBookId.set(book.id, book.category?.trim() || 'Uncategorized')
        }
        const txCoverByTitle = new Map<string, string>()
        for (const tx of transactions) {
          if (!tx.bookCoverData) continue
          const key = tx.bookTitle.trim().toLowerCase()
          if (!txCoverByTitle.has(key)) txCoverByTitle.set(key, tx.bookCoverData)
        }
        const borrowedTx = transactions.filter((tx) => tx.status === 'Active' || tx.status === 'Borrowed' || tx.status === 'Returned' || tx.status === 'Overdue')
        const counts = new Map<string, number>()
        for (const tx of borrowedTx) {
          const category = categoryByBookId.get(tx.bookId) || 'Uncategorized'
          counts.set(category, (counts.get(category) || 0) + 1)
        }
        const total = borrowedTx.length
        setBorrowedCategories(
          Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([category, count]) => ({
              category,
              count,
              percent: total > 0 ? (count / total) * 100 : 0,
            }))
        )
        const byTitle = new Map<string, { title: string; coverData: string | null; available: number; total: number }>()
        for (const book of books) {
          const key = `${book.title.trim().toLowerCase()}|${book.author.trim().toLowerCase()}`
          const fallbackCover = txCoverByTitle.get(book.title.trim().toLowerCase()) ?? null
          const row = byTitle.get(key) ?? { title: book.title, coverData: book.coverData ?? fallbackCover, available: 0, total: 0 }
          if (!row.coverData && book.coverData) row.coverData = book.coverData
          if (!row.coverData && fallbackCover) row.coverData = fallbackCover
          row.total += book.totalCopies
          row.available += book.available
          byTitle.set(key, row)
        }
        setLowStockItems(
          Array.from(byTitle.entries())
            .map(([key, row]) => ({
              key,
              title: row.title,
              coverData: row.coverData,
              available: row.available,
              total: row.total,
              level: (row.available === 0 ? 'Out' : 'Low') as 'Out' | 'Low',
            }))
            .filter((row) => row.available <= 1)
            .sort((a, b) => {
              if (a.level !== b.level) return a.level === 'Out' ? -1 : 1
              if (a.available !== b.available) return a.available - b.available
              return b.total - a.total
            })
            .slice(0, 4)
        )
        setUpcomingDueItems(
          activeBorrowTx
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 3)
            .map((tx) => ({
              id: tx.id,
              bookTitle: tx.bookTitle,
              memberName: tx.memberName,
              memberPhotoData: tx.memberProfilePhotoData ?? members.find((member) => member.id === tx.memberId)?.profilePhotoData ?? null,
              dueDateLabel: Number.isNaN(new Date(tx.dueDate).getTime())
                ? '-'
                : new Date(tx.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            }))
        )
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      }
    }

    void loadDashboardStats()
  }, [activePage, booksRefreshKey])
const unreadNotifications = notifications.filter((item) => !item.isRead).length
const greetingText = getGreetingForDate(currentTime)
const greetingName = formatDisplayName(activeUsername)

  const formatNotificationTime = (isoDate: string) => {
    const dt = new Date(isoDate)
    if (Number.isNaN(dt.getTime())) return ''
    const diffMs = Date.now() - dt.getTime()
    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour
    if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))}m ago`
    if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`
    return `${Math.floor(diffMs / day)}d ago`
  }

  const handleOpenNotifications = async () => {
    setIsNotificationsOpen((v) => !v)
    await refreshNotifications()
  }

  const handleReadNotification = async (id: number) => {
    try {
      await markNotificationAsRead(id)
      const rows = await listNotifications(12)
      setNotifications(rows)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleReadAllNotifications = async () => {
    try {
      await markAllNotificationsRead()
      const rows = await listNotifications(12)
      setNotifications(rows)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await onLogout()
      setShowLogoutConfirm(false)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleSaveBook = async (data: AddBookFormData) => {
    const coverData = await new Promise<string | null>((resolve) => {
      if (!data.coverFile) {
        resolve(null)
        return
      }
      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(data.coverFile)
    })

    await createBook({
      title: data.title.trim(),
      author: data.author.trim(),
      category: data.category.trim() || null,
      isbn: data.isbn.trim() || null,
      coverData,
      shelfLocation: data.shelfLocation.trim() || null,
      totalCopies: data.numberOfCopies,
    })
    setBooksRefreshKey((value) => value + 1)
    setBooksToastMessage(`Successfully added "${data.title.trim()}"`)
  }

  const dashboardTheme = isDarkMode
    ? {
        main: 'bg-[#181818] text-[#cccccc]',
        frame: 'border-[#2b2b2b] bg-[#181818]',
        aside: 'border-[#27272A] bg-[#18181B] relative overflow-hidden shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)] z-20',
        asideTitle: 'text-white',
        asideSub: 'text-[#D4D4D8]',
        asideHover: 'hover:bg-gradient-to-r hover:from-[#27272A]/80 hover:to-transparent hover:text-white hover:translate-x-1',
        asideActive: 'bg-gradient-to-r from-emerald-500/15 to-transparent border-l-[3px] border-[#10B981] text-[#34D399] drop-shadow-[0_2px_4px_rgba(16,185,129,0.2)]',
        asideIdle: 'border-l-[3px] border-transparent text-[#D4D4D8]',
        profileCard: 'backdrop-blur-xl bg-[#27272A]/40 border border-[#3F3F46]/50 shadow-lg',
        avatarBg: 'bg-[#27272A] border-[#3F3F46]/50',
        rowBorder: 'border-[#27272A]',
        navActive: 'bg-[linear-gradient(90deg,#34d399_0%,#10b981_100%)] text-white shadow-[0_14px_22px_-16px_rgba(16,185,129,0.95)]',
        navIdle: 'text-emerald-50/90 hover:bg-emerald-700/40',
        header: 'border-[#2b2b2b] bg-[#1e1e1e]',
        search: 'border-[#3c3c3c] bg-[#1e1e1e]',
        searchIcon: 'text-[#858585] group-focus-within:text-emerald-400',
        searchInput: 'text-[#cccccc] placeholder:text-[#858585]',
        iconBtn: 'text-[#cccccc] hover:bg-[#2b2b2b]',
        profileBorder: 'border-emerald-800/60',
        profileName: 'text-emerald-50',
        profileRole: 'text-emerald-200/75',
        contentBg: 'bg-[#181818]',
        greetingTitle: 'text-[#cccccc]',
        greetingSub: 'text-[#858585]',
        quickAction: 'border-[#2b2b2b] bg-[#1e1e1e] text-[#cccccc] hover:bg-[#2b2b2b]',
        cardPanel: 'border-[#2b2b2b] bg-[#1e1e1e]',
        cardTitle: 'text-[#cccccc]',
        cardText: 'text-[#cccccc]',
        cardMuted: 'text-[#858585]',
      }
    : {
        main: 'bg-white text-zinc-800',
        frame: 'border-zinc-200 bg-white',
        aside: 'border-[#27272A] bg-[#18181B] relative overflow-hidden shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)] z-20',
        asideTitle: 'text-white',
        asideSub: 'text-[#D4D4D8]',
        asideHover: 'hover:bg-gradient-to-r hover:from-[#27272A]/80 hover:to-transparent hover:text-white hover:translate-x-1',
        asideActive: 'bg-gradient-to-r from-emerald-500/15 to-transparent border-l-[3px] border-[#10B981] text-[#34D399] drop-shadow-[0_2px_4px_rgba(16,185,129,0.2)]',
        asideIdle: 'border-l-[3px] border-transparent text-[#D4D4D8]',
        profileCard: 'backdrop-blur-xl bg-[#27272A]/40 border border-[#3F3F46]/50 shadow-lg',
        avatarBg: 'bg-[#27272A] border-[#3F3F46]/50',
        rowBorder: 'border-[#27272A]',
        navActive: 'bg-emerald-600 text-white shadow-[0_10px_20px_-10px_rgba(5,150,105,0.85)]',
        navIdle: 'text-zinc-600 hover:bg-zinc-100',
        header: 'border-zinc-200 bg-white',
        search: 'border-zinc-200 bg-white',
        searchIcon: 'text-zinc-400 group-focus-within:text-emerald-600',
        searchInput: 'text-zinc-700 placeholder:text-zinc-400',
        iconBtn: 'text-zinc-600 hover:bg-zinc-100',
        profileBorder: 'border-emerald-800/55',
        profileName: 'text-zinc-900',
        profileRole: 'text-zinc-500',
        contentBg: 'bg-[#f8fafc]',
        greetingTitle: 'text-zinc-900',
        greetingSub: 'text-zinc-500',
        quickAction: 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50',
        cardPanel: 'border-zinc-200 bg-white',
        cardTitle: 'text-zinc-800',
        cardText: 'text-zinc-700',
        cardMuted: 'text-zinc-500',
      }

  return (
    <main className={`h-screen overflow-hidden p-0 ${dashboardTheme.main} ${isDarkMode ? 'dashboard-dark' : ''}`}>
      <div className={`flex h-full w-full overflow-hidden ${dashboardTheme.frame}`}>
        <aside className={`hidden h-full shrink-0 border-r transition-all duration-200 lg:flex lg:flex-col ${dashboardTheme.aside} ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
          {/* Subtle glow for dark mode */}
          {isDarkMode && (
            <div className="pointer-events-none absolute left-0 top-0 h-96 w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-[#18181B]/5 to-transparent" />
          )}
          <div className={`relative z-10 flex flex-col gap-6 px-4 pt-12 pb-6`}>
            <div className="flex items-center gap-3">
              <div className={`grid place-items-center rounded-full shadow-sm ${dashboardTheme.avatarBg} ${sidebarCollapsed ? 'h-10 w-10 mx-auto' : 'h-10 w-10 shrink-0'}`}>
                <div className="grid place-items-center rounded-full border-2 border-[#10B981] font-black text-[#10B981] h-8 w-8 text-xs">CC</div>
              </div>
              {!sidebarCollapsed ? (
                <div className="flex flex-col">
                  <p className={`text-base font-black tracking-tight ${dashboardTheme.asideTitle}`}>info<span className="text-[#10B981]">Lib</span></p>
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${dashboardTheme.asideSub}`}>Admin Workspace</p>
                </div>
              ) : null}
            </div>
          </div>

          <nav className="relative z-10 flex flex-1 flex-col overflow-y-auto px-3 pt-6 pb-5 text-sm space-y-6">
                {/* Top Section - Dashboard */}
                <div>
                   {(() => {
                     const DashIcon = navItems[0].icon;
                     return (
                       <button
                        key={navItems[0].id}
                        onClick={() => setActivePage(navItems[0].id as any)}
                        className={`group flex w-full items-center gap-3 rounded-xl py-2.5 transition-all duration-200 ${sidebarCollapsed ? 'justify-center px-1' : 'px-3'} ${
                          activePage === navItems[0].id
                            ? dashboardTheme.asideActive
                            : `${dashboardTheme.asideIdle} ${dashboardTheme.asideHover}`
                        }`}
                      >
                        <DashIcon size={16} className="" />
                        {!sidebarCollapsed ? <span className="flex-1 text-left font-medium text-xs">{navItems[0].label}</span> : null}
                      </button>
                     )
                   })()}
                </div>

                {/* LIBRARY Section */}
                <div>
                  {!sidebarCollapsed ? <div className="mb-2 px-3"><span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Library</span></div> : null}
                  <div className="space-y-1">
                    {navItems.slice(1, 5).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActivePage(item.id as any)
                          if (item.id === 'Members') setMemberAddModalTrigger(0)
                        }}
                        className={`group flex w-full items-center gap-3 rounded-xl py-2.5 transition-all duration-200 ${sidebarCollapsed ? 'justify-center px-1' : 'px-3'} ${
                          activePage === item.id
                            ? dashboardTheme.asideActive
                            : `${dashboardTheme.asideIdle} ${dashboardTheme.asideHover}`
                        }`}
                      >
                        <item.icon size={16} className="" />
                        {!sidebarCollapsed ? <span className="flex-1 text-left font-medium text-xs">{item.label}</span> : null}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CIRCULATION Section */}
                <div>
                  {!sidebarCollapsed ? <div className="mb-2 px-3"><span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Circulation</span></div> : null}
                  <div className="space-y-1">
                    {navItems.slice(5, 7).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActivePage(item.id as any)
                          if (item.id === 'Members') setMemberAddModalTrigger(0)
                        }}
                        className={`group flex w-full items-center gap-3 rounded-xl py-2.5 transition-all duration-200 ${sidebarCollapsed ? 'justify-center px-1' : 'px-3'} ${
                          activePage === item.id
                            ? dashboardTheme.asideActive
                            : `${dashboardTheme.asideIdle} ${dashboardTheme.asideHover}`
                        }`}
                      >
                        <item.icon size={16} className="" />
                        {!sidebarCollapsed ? <span className="flex-1 text-left font-medium text-xs">{item.label}</span> : null}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MANAGEMENT Section */}
                <div className="mt-auto pt-6">
                  {!sidebarCollapsed ? <div className="mb-2 px-3"><span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Management</span></div> : null}
                  <div className="space-y-1">
                    {navItems.slice(7, 9).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActivePage(item.id as any)
                          if (item.id === 'Members') setMemberAddModalTrigger(0)
                        }}
                        className={`group flex w-full items-center gap-3 rounded-xl py-2.5 transition-all duration-200 ${sidebarCollapsed ? 'justify-center px-1' : 'px-3'} ${
                          activePage === item.id
                            ? dashboardTheme.asideActive
                            : `${dashboardTheme.asideIdle} ${dashboardTheme.asideHover}`
                        }`}
                      >
                        <item.icon size={16} className="" />
                        {!sidebarCollapsed ? <span className="flex-1 text-left font-medium text-xs">{item.label}</span> : null}
                      </button>
                    ))}
                  </div>
                </div>
          </nav>

          <div className={`relative z-10 mt-auto border-t ${dashboardTheme.rowBorder} p-3`}>
            <button
              onClick={() => {
                setActivePage('Settings')
                setActiveSettingsTab('Overview')
              }}
              className={`group flex w-full items-center gap-3 rounded-xl py-2.5 transition-all duration-200 ${sidebarCollapsed ? 'justify-center px-1' : 'px-3'} ${
                activePage === 'Settings'
                  ? dashboardTheme.asideActive
                  : `${dashboardTheme.asideIdle} ${dashboardTheme.asideHover}`
              }`}
            >
              <Settings2 size={16} className="" />
              {!sidebarCollapsed ? <span className="flex-1 text-left font-medium text-xs">Settings</span> : null}
            </button>
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          {licenseStatus === 'trial' && (
          <div className="bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm flex items-center justify-center gap-2">
            <AlertTriangle size={16} />
            <span>You are on a free trial. You have {trialDays} {trialDays === 1 ? 'day' : 'days'} remaining before your license expires.</span>
          </div>
        )}
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
              <div ref={searchContainerRef} className="relative group flex h-12 w-[520px] items-center rounded-full border focus-within:border-emerald-500 transition-colors bg-transparent z-50">
                <form className={`flex w-full h-full items-center rounded-full px-4 ${dashboardTheme.search}`} role="search" onSubmit={(e) => e.preventDefault()}>
                  <label htmlFor="header-search" className="sr-only">Search library records</label>
                  <Search size={16} className={`mr-3 transition-colors ${dashboardTheme.searchIcon}`} />
                  <input
                    id="header-search"
                    type="search"
                    placeholder="Search books, members, authors..."
                    className={`w-full bg-transparent text-sm font-light placeholder:font-light outline-none ${dashboardTheme.searchInput}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                  />
                </form>

                {isSearchFocused && searchQuery.length > 0 && (
                  <div className={`absolute top-[calc(100%+8px)] left-0 w-full rounded-xl border shadow-xl overflow-hidden ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-white'}`}>
                    <div className="max-h-96 overflow-y-auto py-2">
                      {(() => {
                        const bMatches = globalSearchData.books;
                        const mMatches = globalSearchData.members;
                        const aMatches = globalSearchData.authors;
                        const hasResults = bMatches.length > 0 || mMatches.length > 0 || aMatches.length > 0;

                        if (!hasResults) {
                          return <div className={`px-4 py-3 text-sm text-center ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>No results found for "{searchQuery}"</div>;
                        }

                        return (
                          <>
                            {bMatches.length > 0 && (
                              <div className="mb-2">
                                <div className={`px-4 py-1 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Books</div>
                                {bMatches.map(b => (
                                  <button
                                    key={`book-${b.id}`}
                                    type="button"
                                    className={`w-full text-left px-4 py-2 text-sm flex gap-3 items-center transition-colors ${isDarkMode ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-50'}`}
                                    onClick={() => {
                                      setIsSearchFocused(false);
                                      setSearchQuery('');
                                      setActivePage('Books');
                                      setIsAddBookOpen(false);
                                      listBooks().then(books => {
                                        const book = books.find(x => x.id === b.id);
                                        if (book) {
                                          setSelectedBook({
                                            id: book.id,
                                            cover: book.coverData || '📘',
                                            title: book.title,
                                            isbn: book.isbn ?? '-',
                                            author: book.author,
                                            category: book.category ?? 'Uncategorized',
                                            callNumber: '-',
                                            year: new Date(book.createdAt).getFullYear() || new Date().getFullYear(),
                                            status: book.available ? 'Available' : 'Borrowed',
                                            available: book.available ? '1 / 1' : '0 / 1',
                                          });
                                          setIsBookDetailOpen(true);
                                        }
                                      });
                                    }}
                                  >
                                    <span className={`grid h-12 w-9 place-items-center rounded overflow-hidden shrink-0 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                      {b.cover && (b.cover.startsWith('data:') || b.cover.startsWith('http') || b.cover.startsWith('blob:')) ? (
                                        <img src={b.cover} alt="" className="h-full w-full object-cover" />
                                      ) : (
                                        <span className="text-xl">{b.cover}</span>
                                      )}
                                    </span>
                                    <div className="flex flex-col flex-1 min-w-0">
                                      <span className={`font-semibold truncate ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{b.title}</span>
                                      <span className={`text-xs truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{b.author}</span>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0 gap-1">
                                      {b.category && (
                                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                                          {b.category}
                                        </span>
                                      )}
                                      <span className={`text-[10px] font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        {b.available ? '1 / 1' : '0 / 1'} copies
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}

                            {mMatches.length > 0 && (
                              <div className="mb-2">
                                <div className={`px-4 py-1 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Members</div>
                                {mMatches.map(m => (
                                  <button
                                    key={`member-${m.id}`}
                                    type="button"
                                    className={`w-full text-left px-4 py-2 text-sm flex flex-col transition-colors ${isDarkMode ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-50'}`}
                                    onClick={() => {
                                      setIsSearchFocused(false);
                                      setSearchQuery('');
                                      setActivePage('Members');
                                      setMemberAddModalTrigger(0);
                                      setSelectedMemberId(m.id);
                                      setIsMemberDetailOpen(true);
                                    }}
                                  >
                                    <span className={`font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{m.fullName}</span>
                                    <span className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>ID: {m.memberId}</span>
                                  </button>
                                ))}
                              </div>
                            )}

                            {aMatches.length > 0 && (
                              <div>
                                <div className={`px-4 py-1 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Authors</div>
                                {aMatches.map(a => (
                                  <button
                                    key={`author-${a.id}`}
                                    type="button"
                                    className={`w-full text-left px-4 py-2 text-sm flex gap-3 items-center transition-colors ${isDarkMode ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-50'}`}
                                    onClick={() => {
                                      setIsSearchFocused(false);
                                      setSearchQuery('');
                                      setActivePage('Authors');
                                      setSelectedAuthorId(a.id);
                                      setIsAuthorDetailOpen(true);
                                    }}
                                  >
                                    <span className={`grid h-8 w-8 place-items-center overflow-hidden rounded-full shrink-0 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                      {a.profilePhotoData ? (
                                        <img src={a.profilePhotoData} alt={`${a.name} profile`} className="h-full w-full object-cover" />
                                      ) : (
                                        <span className={`text-xs font-bold ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                          {a.name.slice(0, 1).toUpperCase()}
                                        </span>
                                      )}
                                    </span>
                                    <span className={`font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{a.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-auto flex items-center gap-4">
                <div className="hidden items-center gap-2 lg:flex">
                  <div className={`mr-3 pr-4 hidden items-center gap-5 border-r ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} lg:flex`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`grid h-8 w-8 place-items-center rounded-full ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Calendar size={14} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Date</span>
                        <span className={`text-xs font-semibold leading-tight ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                          {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className={`grid h-8 w-8 place-items-center rounded-full ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                        <Clock3 size={14} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Time</span>
                        <span className={`text-xs font-semibold tabular-nums leading-tight ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                          {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDarkMode((value) => !value)}
                    className={`rounded-lg p-2 ${dashboardTheme.iconBtn}`}
                    aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    title={isDarkMode ? 'Light mode' : 'Dark mode'}
                  >
                    {isDarkMode ? <Sun size={18} strokeWidth={1.9} /> : <Moon size={18} strokeWidth={1.9} />}
                  </button>
                                    <div ref={messageMenuRef} className="relative">
                    <button 
                      type="button" 
                      onClick={() => setIsMessageMenuOpen((v) => !v)}
                      className={`relative rounded-lg p-2 ${isMessageMenuOpen ? 'bg-emerald-500/10 text-emerald-500' : dashboardTheme.iconBtn}`} 
                      aria-label="Open messages"
                    >
                      <MessageCircle size={18} strokeWidth={1.9} />
                      <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] text-[10px] font-bold text-white">{recentMessages.length > 0 ? recentMessages.length : 3}</span>
                    </button>
                    {isMessageMenuOpen && (
                      <div className={`absolute right-0 top-11 z-30 w-80 overflow-hidden rounded-xl border shadow-2xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
                        <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                          <h3 className={`text-sm font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Recent Outbound Messages</h3>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'}`}>
                            {recentMessages.length} New
                          </span>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {messageError ? (
                            <div className="px-4 py-8 text-center text-sm text-red-500">
                              {messageError}
                            </div>
                          ) : recentMessages.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-zinc-500">
                              No recent messages.
                            </div>
                          ) : (
                            <div className={`divide-y ${isDarkMode ? 'divide-zinc-800/50' : 'divide-zinc-100'}`}>
                              {recentMessages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col gap-1 p-4 transition-colors ${isDarkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50'}`}>
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                                      To: {msg.borrowerName}
                                    </p>
                                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                      msg.status === 'Sent' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                      : msg.status === 'Failed' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                      : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                    }`}>
                                      {msg.status}
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {msg.emailType} • {new Date(msg.sentAt).toLocaleDateString()} {new Date(msg.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </p>
                                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                                    Reminder for <span className="font-semibold text-emerald-600 dark:text-emerald-400">{msg.bookTitle}</span>
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => setIsMessageMenuOpen(false)}
                          className={`w-full border-t p-3 text-center text-xs font-bold transition-colors ${isDarkMode ? 'border-zinc-800 text-emerald-500 hover:bg-zinc-800/50' : 'border-zinc-100 text-emerald-600 hover:bg-zinc-50'}`}
                        >
                          Close Menu
                        </button>
                      </div>
                    )}
                  </div>
                  <button type="button" className={`relative rounded-lg p-2 ${dashboardTheme.iconBtn}`} aria-label="Open inbox">
                    <Mail size={18} strokeWidth={1.9} />
                    <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">5</span>
                  </button>
                  <div ref={notificationsRef} className="relative">
                    <button type="button" onClick={() => void handleOpenNotifications()} className={`relative rounded-lg p-2 ${dashboardTheme.iconBtn}`} aria-label="Open notifications">
                      <Bell size={18} strokeWidth={1.9} />
                      {unreadNotifications > 0 ? (
                        <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                          {unreadNotifications > 9 ? '9+' : unreadNotifications}
                        </span>
                      ) : null}
                    </button>
                    {isNotificationsOpen ? (
                      <div className={`absolute right-0 top-11 z-30 w-80 rounded-xl border p-2 shadow-xl ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-white'}`}>
                        <div className="mb-2 flex items-center justify-between px-2 py-1">
                          <p className={`text-sm font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Notifications</p>
                          <button type="button" onClick={() => void handleReadAllNotifications()} className="text-[11px] font-semibold text-emerald-600 hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-80 overflow-auto">
                          {notifications.length === 0 ? (
                            <p className={`px-2 py-6 text-center text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>No notifications yet.</p>
                          ) : notifications.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => void handleReadNotification(item.id)}
                              className={`mb-1 w-full rounded-lg px-2 py-2 text-left transition ${item.isRead ? (isDarkMode ? 'bg-transparent hover:bg-zinc-800/60' : 'bg-transparent hover:bg-zinc-50') : (isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/15' : 'bg-emerald-50 hover:bg-emerald-100')}`}
                            >
                              <p className={`text-xs font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{item.title}</p>
                              <p className={`mt-0.5 text-[11px] ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{item.message}</p>
                              <p className={`mt-1 text-[10px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{formatNotificationTime(item.createdAt)}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div ref={profileMenuRef} className={`relative hidden items-center gap-3 border-l pl-4 md:flex ${dashboardTheme.profileBorder}`}>
                  <div className={`grid h-11 w-11 place-items-center rounded-full font-bold uppercase tracking-wider shrink-0 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                    {activeUsername ? activeUsername.slice(0, 2) : 'AD'}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold truncate max-w-[120px] ${dashboardTheme.profileName}`}>{formatDisplayName(activeUsername)}</p>
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
                    <div id="profile-menu" role="menu" className={`absolute right-0 top-14 z-20 w-52 rounded-xl border p-1.5 shadow-xl ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-white'}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false)
                        }}
                        role="menuitem"
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${isDarkMode ? 'text-zinc-200 hover:bg-zinc-800/60' : 'text-zinc-700 hover:bg-zinc-50'}`}
                      >
                        <UserCircle size={16} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                        My Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false)
                        }}
                        role="menuitem"
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${isDarkMode ? 'text-zinc-200 hover:bg-zinc-800/60' : 'text-zinc-700 hover:bg-zinc-50'}`}
                      >
                        <Lock size={16} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                        Change Password
                      </button>
                      <div className={`my-1 h-px w-full ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false)
                          setShowLogoutConfirm(true)
                        }}
                        role="menuitem"
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition-colors ${isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'}`}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          {activePage === 'Books' ? (
            isAddBookOpen ? (
              <AddBookPage
                isDarkMode={isDarkMode}
                onBack={() => setIsAddBookOpen(false)}
                onSave={handleSaveBook}
              />
            ) : isBookDetailOpen ? (
              <BookDetailPage
                isDarkMode={isDarkMode}
                onBack={() => setIsBookDetailOpen(false)}
                book={selectedBook}
                onViewAllTransactions={() => {
                  setIsBookDetailOpen(false)
                  setTransactionActiveTab('all')
                  setActivePage('All Transactions')
                }}
              />
            ) : (
              <BooksPage
                isDarkMode={isDarkMode}
                refreshKey={booksRefreshKey}
                externalToastMessage={booksToastMessage}
                onOpenBookDetail={(book) => {
                  setSelectedBook(book)
                  setIsAddBookOpen(false)
                  setIsBookDetailOpen(true)
                }}
                onOpenAddBook={() => {
                  setIsBookDetailOpen(false)
                  setBooksToastMessage(null)
                  setIsAddBookOpen(true)
                }}
              />
            )
          ) : activePage === 'Members' ? (
            isMemberDetailOpen ? (
              <MemberDetailPage
                isDarkMode={isDarkMode}
                onBack={() => setIsMemberDetailOpen(false)}
                memberId={selectedMemberId || undefined}
              />
            ) : (
              <MembersPage
                isDarkMode={isDarkMode}
                openAddModalTrigger={memberAddModalTrigger}
                onOpenMemberDetail={(memberId) => {
                  setSelectedMemberId(memberId)
                  setIsMemberDetailOpen(true)
                }}
              />
            )
          ) : activePage === 'Transactions' ? (
            <BorrowReturnPage
                key={borrowReturnActiveTab}
                isDarkMode={isDarkMode}
                initialTab={borrowReturnActiveTab}
                prefillBorrowData={borrowPrefill}
                onOpenTransactions={(tab) => {
                  setTransactionActiveTab(tab)
                  setActivePage('All Transactions')
                }}
              />
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
                onBack={() => setActivePage('Transactions')}
                onOpenTransactionDetail={(id) => {
                  setSelectedTransactionId(id)
                  setIsTransactionDetailOpen(true)
                }}
                initialTab={transactionActiveTab}
              />
            )
          ) : activePage === 'Reports' ? (
            <ReportsPage
              isDarkMode={isDarkMode}
              onViewOverdueActivity={() => {
                setTransactionActiveTab('overdue')
                setActivePage('All Transactions')
              }}
              onViewTopMembers={() => {
                setActivePage('Members')
                setMemberAddModalTrigger(0)
              }}
            />
          ) : activePage === 'Settings' ? (
            <SettingsPage isDarkMode={isDarkMode} activeTab={activeSettingsTab} onTabChange={setActiveSettingsTab} />
          ) : activePage === 'Authors' ? (
            isAuthorDetailOpen ? (
              <AuthorDetailPage
                isDarkMode={isDarkMode}
                onBack={() => setIsAuthorDetailOpen(false)}
                authorId={selectedAuthorId || undefined}
              />
            ) : (
              <AuthorsPage
                isDarkMode={isDarkMode}
                onOpenAuthorDetail={(authorId) => {
                  setSelectedAuthorId(authorId)
                  setIsAuthorDetailOpen(true)
                }}
              />
            )
          ) : activePage === 'Categories' ? (
            <CategoriesPage isDarkMode={isDarkMode} />
          ) : activePage === 'Reservations' ? (
            <ReservationsPage
              isDarkMode={isDarkMode}
              onOpenTransactionDetail={(id) => {
                setSelectedTransactionId(id)
                setIsTransactionDetailOpen(true)
                setActivePage('All Transactions')
              }}
              onNavigateToBorrow={(memberId, bookId) => {
                setBorrowPrefill({ memberId, bookId })
                setBorrowReturnActiveTab('borrow')
                setActivePage('Transactions')
              }}
            />
          ) : activePage === 'Staff' ? (
            <StaffPage isDarkMode={isDarkMode} />
          ) : (

          <div className={`min-h-0 flex-1 overflow-auto p-4 ${dashboardTheme.contentBg}`}>
            <section className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className={`text-3xl font-black ${dashboardTheme.greetingTitle}`}>{greetingText}, {greetingName}! 👋</h2>
                  <p className={`mt-1 text-sm ${dashboardTheme.greetingSub}`}>Here&apos;s what&apos;s happening in your library today.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('Books')
                      setIsAddBookOpen(true)
                    }}
                    className={`flex min-w-[160px] items-center gap-3 rounded-xl border px-5 py-3 text-sm font-medium ${dashboardTheme.quickAction}`}
                  >
                    <BookPlus size={18} className="text-emerald-600" />
                    Add Book
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBorrowReturnActiveTab('borrow')
                      setActivePage('Transactions')
                    }}
                    className={`flex min-w-[160px] items-center gap-3 rounded-xl border px-5 py-3 text-sm font-medium ${dashboardTheme.quickAction}`}
                  >
                    <ArrowRight size={18} className="text-emerald-600" />
                    Borrow Book
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBorrowReturnActiveTab('return')
                      setActivePage('Transactions')
                    }}
                    className={`flex min-w-[160px] items-center gap-3 rounded-xl border px-5 py-3 text-sm font-medium ${dashboardTheme.quickAction}`}
                  >
                    <Undo2 size={18} className="text-amber-500" />
                    Return Book
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('Members')
                      setMemberAddModalTrigger((value) => value + 1)
                    }}
                    className={`flex min-w-[160px] items-center gap-3 rounded-xl border px-5 py-3 text-sm font-medium ${dashboardTheme.quickAction}`}
                  >
                    <UserPlus size={18} className="text-emerald-600" />
                    Add Member
                  </button>
                </div>
              </div>
            </section>

            <section className="px-5 pb-2">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${dashboardTheme.cardTitle} mb-3`}>Library Overview</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2"><BookOpen size={18} className="text-emerald-600" /></div>
                  <p className="text-sm font-semibold text-zinc-600">Total Books</p>
                </div>
                <p className="text-3xl font-extrabold text-zinc-900">{dashboardStats.totalBooks.toLocaleString('en-US')}</p>
              </article>
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2"><Bookmark size={18} className="text-emerald-600" /></div>
                  <p className="text-sm font-semibold text-zinc-600">Available Books</p>
                </div>
                <p className="text-3xl font-extrabold text-zinc-900">{dashboardStats.availableBooks.toLocaleString('en-US')}</p>
              </article>
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-amber-50 p-2"><Undo2 size={18} className="text-amber-500" /></div>
                  <p className="text-sm font-semibold text-zinc-600">Borrowed Books</p>
                </div>
                <p className="text-3xl font-extrabold text-zinc-900">{dashboardStats.borrowedBooks.toLocaleString('en-US')}</p>
              </article>
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-rose-50 p-2"><Clock3 size={18} className="text-rose-500" /></div>
                  <p className="text-sm font-semibold text-zinc-600">Overdue Books</p>
                </div>
                <p className="text-3xl font-extrabold text-zinc-900">{dashboardStats.overdueBooks.toLocaleString('en-US')}</p>
              </article>
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2"><Users size={18} className="text-emerald-600" /></div>
                  <p className="text-sm font-semibold text-zinc-600">Total Members</p>
                </div>
                <p className="text-3xl font-extrabold text-zinc-900">{dashboardStats.totalMembers.toLocaleString('en-US')}</p>
              </article>
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2"><BookPlus size={18} className="text-emerald-600" /></div>
                  <p className="text-sm font-semibold text-zinc-600">Total Authors</p>
                </div>
                <p className="text-3xl font-extrabold text-zinc-900">{dashboardStats.totalAuthors.toLocaleString('en-US')}</p>
              </article>
              </div>
            </section>

            <section className="px-5 pb-3 mt-2">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${dashboardTheme.cardTitle} mb-3`}>Email Activity</h3>
              <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
                <button type="button" onClick={() => { setActivePage('Settings'); setActiveSettingsTab('Email Logs') }} className={`rounded-xl border p-4 text-left shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-sky-50 p-2"><Mail size={18} className="text-sky-600" /></div>
                    <p className="text-sm font-semibold text-zinc-600">Emails Sent Today</p>
                  </div>
                  <p className="text-3xl font-extrabold text-zinc-900">{dashboardStats.emailsSentToday.toLocaleString('en-US')}</p>
                  <p className="mt-1 text-sm font-semibold text-sky-600">View email logs</p>
                </button>
                <button type="button" onClick={() => { setActivePage('Settings'); setActiveSettingsTab('Email Logs') }} className={`rounded-xl border p-4 text-left shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-rose-50 p-2"><AlertTriangle size={18} className="text-rose-500" /></div>
                    <p className="text-sm font-semibold text-zinc-600">Failed Emails</p>
                  </div>
                  <p className="text-3xl font-extrabold text-zinc-900">{dashboardStats.failedEmails.toLocaleString('en-US')}</p>
                  <p className="mt-1 text-sm font-semibold text-rose-500">Needs attention</p>
                </button>
                <button type="button" onClick={() => { setActivePage('Settings'); setActiveSettingsTab('Email Logs') }} className={`rounded-xl border p-4 text-left shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-amber-50 p-2"><Clock3 size={18} className="text-amber-500" /></div>
                    <p className="text-sm font-semibold text-zinc-600">Pending Emails</p>
                  </div>
                  <p className="text-3xl font-extrabold text-zinc-900">{dashboardStats.pendingEmails.toLocaleString('en-US')}</p>
                  <p className="mt-1 text-sm font-semibold text-amber-500">Queued reminders</p>
                </button>
              </div>
            </section>

            <section className="grid gap-3 px-5 pb-4 xl:grid-cols-[40fr_35fr_25fr]">
              <article className={`overflow-hidden rounded-2xl border shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Recent Borrowed Books</h3>
                  <button type="button" onClick={() => openTransactionsPage('borrowed')} className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div>
                  {recentBorrowedItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`grid grid-cols-1 gap-2 px-4 py-2.5 transition-colors duration-150 hover:bg-zinc-50 md:grid-cols-[40px_1.8fr_1fr_auto] md:items-center ${
                        idx < recentBorrowedItems.length - 1 ? 'border-b border-zinc-100' : ''
                      }`}
                    >
                      <div className="grid h-11 w-8 place-items-center overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 text-base">
                        {item.bookCoverData ? (
                          <img src={item.bookCoverData} alt={`${item.bookTitle} cover`} className="h-full w-full object-cover" />
                        ) : (
                          'B'
                        )}
                      </div>
                      <div><p className="text-sm leading-snug font-semibold text-zinc-900">{item.bookTitle}</p><p className="text-xs text-zinc-500">Borrow transaction</p></div>
                      <div><p className="text-[11px] font-semibold text-zinc-500">Borrowed by</p><p className="text-sm font-semibold text-zinc-700">{item.memberName}</p></div>
                      <span className="w-fit rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{item.borrowDateLabel}</span>
                    </div>
                  ))}
                  {recentBorrowedItems.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-zinc-500">No borrowed books yet.</p>
                  ) : null}
                </div>
              </article>

              <article className={`overflow-hidden rounded-2xl border shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Overdue Returns</h3>
                  <button type="button" onClick={() => openTransactionsPage('overdue')} className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div>
                  {overdueReturnItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`grid grid-cols-1 gap-2 px-4 py-3 transition-colors duration-150 hover:bg-zinc-50 md:grid-cols-[40px_1.8fr_1fr_auto] md:items-center ${
                        idx < overdueReturnItems.length - 1 ? 'border-b border-zinc-100' : ''
                      }`}
                    >
                      <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                        {item.memberPhotoData ? (
                          <img src={item.memberPhotoData} alt={`${item.memberName} profile`} className="h-full w-full object-cover" />
                        ) : (
                          item.memberName.trim().charAt(0).toUpperCase()
                        )}
                      </div>
                      <div><p className="text-sm leading-snug font-semibold text-zinc-900">{item.bookTitle}</p><p className="text-xs text-zinc-500">Overdue transaction</p></div>
                      <p className="text-sm font-semibold text-zinc-700">{item.memberName}</p>
                      <span className="w-fit rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">{item.overdueLabel}</span>
                    </div>
                  ))}
                  {overdueReturnItems.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-zinc-500">No overdue returns.</p>
                  ) : null}
                </div>
              </article>

              <article className={`rounded-2xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-3 flex items-center justify-between pb-3">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Today&apos;s Activity</h3>
                  <button type="button" onClick={() => setActivePage('Reports')} className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div className="space-y-0">
                  {notifications.slice(0, 6).map((item, idx) => {
                    const dt = new Date(item.createdAt)
                    const dateText = Number.isNaN(dt.getTime()) ? '-' : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    const timeText = Number.isNaN(dt.getTime()) ? '-' : dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                    return (
                      <div
                        key={item.id}
                        className={`-mx-4 grid grid-cols-[1fr_auto] items-start gap-2 px-4 py-2.5 transition-colors duration-150 hover:bg-zinc-50 ${
                          idx < Math.min(6, notifications.length) - 1 ? 'border-b border-zinc-100' : ''
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                          <p className="text-xs font-medium text-zinc-500">{item.message}</p>
                        </div>
                        <p className="pt-1 text-right text-xs font-semibold text-zinc-500">{dateText}<br />{timeText}</p>
                      </div>
                    )
                  })}
                  {notifications.length === 0 ? (
                    <p className="px-1 py-2 text-sm text-zinc-500">No activity yet.</p>
                  ) : null}
                </div>
              </article>
            </section>

            <section className="grid gap-3 px-5 pb-5 xl:grid-cols-3">
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Most Borrowed Categories</h3>
                  <button type="button" onClick={() => setActivePage('Reports')} className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div className="flex min-h-[220px] items-center">
                  {(() => {
                    const colors = ['#10b981', '#34d399', '#6ee7b7', '#059669', '#d1d5db']
                    const total = borrowedCategories.reduce((sum, item) => sum + item.count, 0)
                    let current = 0
                    const source = borrowedCategories.length > 0 ? borrowedCategories : [{ category: 'No data', count: 1, percent: 100 }]
                    const stops = source.map((item, idx) => {
                      const pct = total > 0 ? (item.count / total) * 100 : item.percent
                      const start = current
                      const end = current + pct
                      current = end
                      return `${colors[idx % colors.length]} ${start.toFixed(1)}% ${end.toFixed(1)}%`
                    })
                    const bg = `conic-gradient(${stops.join(', ')})`
                    return (
                      <div className="grid w-full gap-4 md:grid-cols-[190px_1fr] md:items-center md:justify-center">
                        <div className="mx-auto h-36 w-36 rounded-full p-7" style={{ background: bg }}>
                          <div className="h-full w-full rounded-full bg-white" />
                        </div>
                        <div className="mx-auto w-full max-w-[220px] space-y-2.5 text-xs text-zinc-600">
                          {borrowedCategories.length > 0 ? borrowedCategories.map((item, idx) => (
                            <p key={item.category} className="flex items-center justify-between gap-2">
                              <span className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[idx % colors.length] }} />
                                {item.category}
                              </span>
                              <span className="font-semibold text-zinc-700">{item.percent.toFixed(1)}% ({item.count})</span>
                            </p>
                          )) : <p className="text-zinc-500">No borrow data yet.</p>}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </article>
              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Low Stock / Missing Copies</h3>
                  <button type="button" onClick={() => setActivePage('Books')} className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div className="space-y-0 text-xs">
                  {lowStockItems.map((item, idx) => (
                    <div key={item.key} className={`flex items-start justify-between gap-3 rounded-md px-1 py-2 transition-colors duration-150 hover:bg-zinc-50 ${idx < lowStockItems.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                      <div className="min-w-0 flex items-start gap-2.5">
                        <div className="grid h-11 w-8 place-items-center overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 text-base text-zinc-600">
                          {item.coverData ? (
                            <img src={item.coverData} alt={`${item.title} cover`} className="h-full w-full object-cover" />
                          ) : (
                            'B'
                          )}
                        </div>
                        <div>
                        <p className="flex items-center gap-2 text-sm font-semibold text-zinc-800"><span className={`h-2.5 w-2.5 rounded-full ${item.level === 'Out' ? 'bg-rose-500' : 'bg-amber-500'}`} />{item.title}</p>
                        <p className="pl-4 text-xs text-zinc-500">Available: {item.available} / Total: {item.total}</p>
                        </div>
                      </div>
                      <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${item.level === 'Out' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{item.level}</span>
                    </div>
                  ))}
                  {lowStockItems.length === 0 ? (
                    <p className="px-1 py-2 text-sm text-zinc-500">No low stock or missing copies.</p>
                  ) : null}
                </div>
              </article>

              <article className={`rounded-xl border p-4 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${dashboardTheme.cardPanel}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-base font-bold ${dashboardTheme.cardTitle}`}>Upcoming Due Dates</h3>
                  <button type="button" onClick={() => openTransactionsPage('overdue')} className="text-xs font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
                </div>
                <div className="space-y-0">
                  {upcomingDueItems.map((item, idx) => (
                    <div key={item.id} className={`flex items-start justify-between gap-3 rounded-md px-2 py-2 transition-colors duration-150 hover:bg-zinc-50 ${idx < upcomingDueItems.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                          {item.memberPhotoData ? (
                            <img src={item.memberPhotoData} alt={`${item.memberName} profile`} className="h-full w-full object-cover" />
                          ) : (
                            item.memberName.trim().charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-800">{item.bookTitle}</p>
                          <p className="text-xs font-medium text-zinc-500">{item.memberName}</p>
                        </div>
                      </div>
                      <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">{item.dueDateLabel}</span>
                    </div>
                  ))}
                  {upcomingDueItems.length === 0 ? (
                    <p className="px-2 py-2 text-sm text-zinc-500">No upcoming due dates.</p>
                  ) : null}
                </div>
              </article>
            </section>
          </div>
          )}
        </section>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-bold leading-6 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Logout</h3>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Are you sure you want to log out of your account?
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}


function LicenseActivationScreen({ onActivated, onStartTrial }: { onActivated: () => void, onStartTrial: () => void }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [isActivating, setIsActivating] = useState(false)

  const handleActivate = async (e: FormEvent) => {
    e.preventDefault()
    if (!key.trim()) {
      setError('Please enter a license key.')
      return
    }
    
    setIsActivating(true)
    setError('')
    try {
      const isValid = await verifyLicenseKey(key)
      if (isValid) {
        onActivated()
      } else {
        setError('Invalid license key. Please check and try again.')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setIsActivating(false)
    }
  }

  return (
    <main className="flex h-screen w-full items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#18181B] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-100">License Activation</h1>
          <p className="mt-2 text-sm text-zinc-400">Your 7-day free trial has expired. Please enter your license key to unlock the Library System permanently.</p>
        </div>

        <form onSubmit={handleActivate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">License Key</label>
            <input 
              type="text" 
              value={key}
              onChange={(e) => { setError(''); setKey(e.target.value.toUpperCase()) }}
              placeholder="LIB-XXXX-XXXX-XXXX" 
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-center font-mono text-lg font-bold tracking-widest text-zinc-100 outline-none transition-colors focus:border-emerald-500 focus:bg-zinc-800"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-center text-sm font-semibold text-rose-400">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isActivating}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            {isActivating ? 'Verifying...' : 'Activate License'}
          </button>
        </form>
      </div>
    </main>
  )
}

function App() {
  const [formState, setFormState] = useState<LoginFormState>(initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  const [licenseStatus, setLicenseStatus] = useState<'checking' | 'active' | 'trial' | 'expired'>('checking')
  const [trialDays, setTrialDays] = useState(7)

  useEffect(() => {
    let mounted = true
    const checkLicense = async () => {
      try {
        const status = await getLicenseStatus()
        if (mounted) {
          setLicenseStatus(status)
          if (status === 'trial') {
            const days = await getTrialDaysRemaining()
            setTrialDays(days)
          }
        }
      } catch (err) {
        if (mounted) setLicenseStatus('expired')
      }
    }
    checkLicense()
  }, [])


  useEffect(() => {
    if (!isAuthenticated) return

    let mounted = true
    const expandWindow = async () => {
      try {
        await expandMainWindow()
      } catch (error) {
        if (mounted) {
          console.error('Window expand failed:', error)
        }
      }
    }

    expandWindow()
    return () => {
      mounted = false
    }
  }, [isAuthenticated])

  useEffect(() => {
    let mounted = true
    const loadSession = async () => {
      try {
        const session = await getActiveSession()
        if (mounted) {
          setIsAuthenticated(Boolean(session))
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        if (mounted) {
          setIsCheckingSession(false)
        }
      }
    }
    loadSession()
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const username = formState.username.trim()
    const password = formState.password.trim()

    if (!username || !password) {
      setLoginError('Please enter both username and password.')
      return
    }

    setIsSigningIn(true)
    try {
      const isValid = await loginWithDb({ username, password })
      if (isValid) {
        setLoginError('')
        setIsAuthenticated(true)
        return
      }
      setLoginError('Invalid username or password. Please try again.')
    } catch (error) {
      console.error('Login failed:', error)
      setLoginError('Unable to sign in right now. Please try again.')
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutFromDb()
      await restoreLoginWindow()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setFormState(initialState)
      setShowPassword(false)
      setLoginError('')
      setIsAuthenticated(false)
    }
  }

  
  if (licenseStatus === 'checking' || isCheckingSession) {
    return (
      <main className="grid h-screen place-items-center bg-[#f4f6f8] text-zinc-600">
        <p className="text-sm font-semibold">Loading session...</p>
      </main>
    )
  }

  if (licenseStatus === 'expired') {
    return <LicenseActivationScreen onActivated={() => setLicenseStatus('active')} onStartTrial={() => setLicenseStatus('trial')} />
  }

  if (isAuthenticated) {

    return <DashboardShell onLogout={handleLogout} licenseStatus={licenseStatus} trialDays={trialDays} />
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
                  <h2 className="text-3xl font-extrabold tracking-tight text-zinc-800">Welcome Back!</h2>
                  <p className="text-base text-zinc-500">Sign in to continue to your account</p>
                </header>

                <div className="space-y-1">
                  <label htmlFor="username" className="block text-sm font-semibold text-zinc-700">User Name</label>
                  <div className="flex h-10 items-center rounded-xl border border-zinc-300 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                    <input id="username" type="text" autoComplete="username" value={formState.username} onChange={(event) => { setLoginError(''); setFormState((previous) => ({ ...previous, username: event.target.value })) }} placeholder="Enter your username" className="h-full w-full bg-transparent text-sm text-zinc-800 outline-none" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-semibold text-zinc-700">Password</label>
                  <div className="flex h-10 items-center rounded-xl border border-zinc-300 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                    <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={formState.password} onChange={(event) => { setLoginError(''); setFormState((previous) => ({ ...previous, password: event.target.value })) }} placeholder="Enter your password" className="h-full w-full bg-transparent text-sm text-zinc-800 outline-none" required />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-zinc-500 hover:text-zinc-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {loginError ? (
                    <p role="alert" aria-live="assertive" className="inline-flex items-center gap-2 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-rose-100 text-[10px] font-bold">!</span>
                      {loginError}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex cursor-pointer items-center gap-3 text-zinc-600">
                    <input type="checkbox" checked={formState.rememberMe} onChange={(event) => setFormState((previous) => ({ ...previous, rememberMe: event.target.checked }))} className="h-4 w-4 rounded border-zinc-300 text-emerald-600" />
                    Remember me
                  </label>
                  <button type="button" className="font-semibold text-emerald-700 hover:text-emerald-800">Forgot password?</button>
                </div>

                <button type="submit" disabled={isSigningIn} className="flex h-11 w-full items-center justify-between rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 px-5 text-base font-bold text-white shadow-[0_12px_24px_-12px_rgba(5,150,105,0.7)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70">
                  <span className="w-8" />
                  <span>{isSigningIn ? 'Signing In...' : 'Sign In'}</span>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-emerald-700">?</span>
                </button>
              </div>

              <p className="mt-auto pt-3 text-center text-xs text-zinc-500">© 2026 infoLib. All rights reserved.</p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
























