import { Toast } from '../components/ui/Toast'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import {
  createBorrowTransaction,
  listBooks,
  listCategories,
  listBorrowTransactions,
  listMembers,
  returnBorrowTransaction,
  getSetting,
  type Book,
  type BorrowTransaction,
  type Member,
} from '../lib/tauriApi'
import { DynamicBookCover } from '../components/ui/DynamicBookCover'

type BorrowReturnPageProps = {
  isDarkMode: boolean
  onOpenTransactions: (tab: 'all' | 'borrowed' | 'returned' | 'overdue') => void
  initialTab?: 'borrow' | 'return'
  prefillBorrowData?: { memberId?: number, bookId: number } | null
  onClearPrefill?: () => void
}

type MemberItem = {
  id: number
  name: string
  memberId: string
  type: string
  borrowedCount: number
  limit: string
  avatar: string
  profilePhotoData: string | null
}

type BookItem = {
  id: number
  title: string
  author: string
  isbn: string
  copyId: string
  availableCopies: number
  totalCopies: number
  available: boolean
  icon: string
  coverData: string | null
  categoryColor?: string
}

type BorrowedRow = {
  id: number
  member: string
  memberId: string
  book: string
  copyId: string
  borrowDate: string
  dueDate: string
  status: 'Active' | 'Overdue'
  avatar: string
  profilePhotoData: string | null
}

type ReturnedRow = {
  id: number
  member: string
  memberId: string
  book: string
  copyId: string
  returnedDate: string
  fine: string
  fineType: 'paid' | 'due'
  avatar: string
  profilePhotoData: string | null
}

function getStatusClass(status: BorrowedRow['status']) {
  if (status === 'Active') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
}

function getFineClass(type: ReturnedRow['fineType']) {
  return type === 'paid'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
    : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
}

export function BorrowReturnPage({ isDarkMode, onOpenTransactions, initialTab = 'borrow', prefillBorrowData, onClearPrefill }: BorrowReturnPageProps) {
  const [activeTab, setActiveTab] = useState<'borrow' | 'return'>(initialTab)
  const today = new Date().toISOString().slice(0, 10)
  const plus14 = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const [borrowDate, setBorrowDate] = useState(today)
  const [dueDate, setDueDate] = useState(plus14)
  const [returnDate, setReturnDate] = useState(today)
  const [notes, setNotes] = useState('')
  const [showToast, setShowToast] = useState<string | null>(null)

  const [members, setMembers] = useState<MemberItem[]>([])
  const [books, setBooks] = useState<BookItem[]>([])
  const [activeRows, setActiveRows] = useState<BorrowedRow[]>([])
  const [returnedRows, setReturnedRows] = useState<ReturnedRow[]>([])
  const [defaultLoanDays, setDefaultLoanDays] = useState<number>(14)

  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null)
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null)

  const [memberSearchQuery, setMemberSearchQuery] = useState('')
  const [showMemberDropdown, setShowMemberDropdown] = useState(false)
  const [bookSearchQuery, setBookSearchQuery] = useState('')
  const [showBookDropdown, setShowBookDropdown] = useState(false)

  const memberDropdownRef = useRef<HTMLDivElement>(null)
  const bookDropdownRef = useRef<HTMLDivElement>(null)

  const avatarFromName = (name: string) => (name.trim().charAt(0).toUpperCase() || 'M')
  const getMemberPhotoSrc = (photo: string | null) => {
    if (!photo) return null
    const normalized = photo.trim()
    if (!normalized) return null
    if (normalized.startsWith('data:image/') || normalized.startsWith('http') || normalized.startsWith('blob:')) {
      return normalized
    }
    return null
  }
  const getBookCoverSrc = (cover: string | null) => {
    if (!cover) return null
    const normalized = cover.trim()
    if (!normalized) return null
    if (normalized.startsWith('data:image/') || normalized.startsWith('http') || normalized.startsWith('blob:')) {
      return normalized
    }
    return null
  }

  const mapMembers = (rows: Member[]): MemberItem[] => rows.map((m) => ({
    id: m.id,
    name: m.fullName,
    memberId: m.memberId,
    type: m.memberType,
    borrowedCount: m.borrowed,
    limit: m.memberType.toLowerCase() === 'teacher' ? `${10 - m.borrowed} / 10` : `${5 - m.borrowed} / 5`,
    avatar: avatarFromName(m.fullName),
    profilePhotoData: m.profilePhotoData || null,
  }))

  const mapBooks = (rows: Book[], catMap: Record<string, string>): BookItem[] => rows.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    isbn: b.isbn || '-',
    copyId: `BK-${String(b.id).padStart(6, '0')}`,
    availableCopies: b.available,
    totalCopies: b.totalCopies,
    available: b.available > 0,
    icon: '📘',
    coverData: b.coverData || null,
    categoryColor: catMap[b.category || ''],
  }))

  const mapActiveRows = (rows: BorrowTransaction[], memberMap: Map<string, MemberItem>): BorrowedRow[] => rows.map((t) => {
    const due = new Date(t.dueDate)
    const now = new Date()
    const status: 'Active' | 'Overdue' = due < now ? 'Overdue' : 'Active'
    const matchedMember = memberMap.get(t.memberCode)
    return {
      id: t.id,
      member: t.memberName,
      memberId: t.memberCode,
      book: t.bookTitle,
      copyId: `BK-${String(t.bookId).padStart(6, '0')}`,
      borrowDate: new Date(t.borrowDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueDate: new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status,
      avatar: avatarFromName(t.memberName),
      profilePhotoData: matchedMember?.profilePhotoData || null,
    }
  })

  const mapReturnedRows = (rows: BorrowTransaction[], memberMap: Map<string, MemberItem>): ReturnedRow[] => rows.map((t) => {
    const matchedMember = memberMap.get(t.memberCode)
    return {
      id: t.id,
      member: t.memberName,
      memberId: t.memberCode,
      book: t.bookTitle,
      copyId: `BK-${String(t.bookId).padStart(6, '0')}`,
      returnedDate: t.returnDate
        ? new Date(t.returnDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '-',
      fine: `PHP ${t.fine.toFixed(2)}`,
      fineType: t.fine > 0 ? 'due' : 'paid',
      avatar: avatarFromName(t.memberName),
      profilePhotoData: matchedMember?.profilePhotoData || null,
    }
  })

  const loadData = async () => {
    try {
      const [mRows, bRows, activeTx, returnedTx, loanPeriodStr, categories] = await Promise.all([
        listMembers(1000),
        listBooks(2000),
        listBorrowTransactions('Active', 500),
        listBorrowTransactions('Returned', 500),
        getSetting('general.default_loan_period'),
        listCategories(1000),
      ])
      const mappedMembers = mapMembers(mRows)
      const memberMap = new Map(mappedMembers.map((m) => [m.memberId, m]))
      
      const catMap: Record<string, string> = {}
      for (const cat of categories) {
        if (cat.color) {
          catMap[cat.name] = cat.color
        }
      }

      setMembers(mappedMembers)
      setBooks(mapBooks(bRows, catMap))
      setActiveRows(mapActiveRows(activeTx, memberMap))
      setReturnedRows(mapReturnedRows(returnedTx, memberMap))
      const loanDays = loanPeriodStr ? parseInt(loanPeriodStr, 10) : 14
      setDefaultLoanDays(loanDays)
      setDueDate(new Date(Date.now() + loanDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
    } catch {
      setShowToast('Failed to load borrow/return data.')
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  useEffect(() => {
    if (prefillBorrowData && members.length > 0 && books.length > 0) {
      if (prefillBorrowData.memberId) {
        const mem = members.find(m => m.id === prefillBorrowData.memberId)
        if (mem) setSelectedMember(mem)
      }
      
      const bk = books.find(b => b.id === prefillBorrowData.bookId)
      if (bk) setSelectedBook(bk)
    }
  }, [prefillBorrowData, members, books])


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target as Node)) {
        setShowMemberDropdown(false)
      }
      if (bookDropdownRef.current && !bookDropdownRef.current.contains(event.target as Node)) {
        setShowBookDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!showToast) return
    const timer = setTimeout(() => setShowToast(null), 2800)
    return () => clearTimeout(timer)
  }, [showToast])

  const filteredMembersList = useMemo(() => {
    let source = members
    if (activeTab === 'return') {
      const activeMemberIds = new Set(activeRows.map(r => r.memberId))
      source = source.filter(m => activeMemberIds.has(m.memberId))
    }
    return source.filter((m) =>
      m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(memberSearchQuery.toLowerCase()),
    )
  }, [members, memberSearchQuery, activeTab, activeRows])

  const borrowModeBooks = useMemo(() => books.filter((b) => b.available), [books])

  const returnModeBooks = useMemo(() => {
    if (!selectedMember) return []
    const activeForMember = activeRows.filter((r) => r.memberId === selectedMember.memberId)
    const ids = new Set(activeForMember.map((r) => r.copyId))
    return books.filter((b) => ids.has(b.copyId))
  }, [books, activeRows, selectedMember])

  const filteredBooksList = useMemo(() => {
    const source = activeTab === 'borrow' ? borrowModeBooks : returnModeBooks
    return source.filter((b) => b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) || b.isbn.includes(bookSearchQuery))
  }, [borrowModeBooks, returnModeBooks, activeTab, bookSearchQuery])

  const handleConfirmAction = async () => {
    if (!selectedMember || !selectedBook) {
      setShowToast('Please select both member and book first.')
      return
    }

    try {
      if (activeTab === 'borrow') {
        await createBorrowTransaction({
          memberId: selectedMember.id,
          bookId: selectedBook.id,
          borrowDate,
          dueDate,
          notes: notes.trim() || null,
        })
        setShowToast(`Successfully borrowed "${selectedBook.title}" to ${selectedMember.name}!`)
        onClearPrefill?.()
      } else {
        const tx = (await listBorrowTransactions('Active', 500)).find(
          (item) => item.memberId === selectedMember.id && item.bookId === selectedBook.id,
        )
        if (!tx) {
          setShowToast('No active borrow transaction found for this member/book.')
          return
        }
        await returnBorrowTransaction({ transactionId: tx.id, returnDate })
        setShowToast(`Successfully returned "${selectedBook.title}" from ${selectedMember.name}!`)
      }

      setSelectedMember(null)
      setSelectedBook(null)
      setMemberSearchQuery('')
      setBookSearchQuery('')
      setNotes('')
      setBorrowDate(new Date().toISOString().slice(0, 10))
      setDueDate(new Date(Date.now() + defaultLoanDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
      await loadData()
    } catch (error) {
      console.error('Borrow/Return transaction failed:', error)
      setShowToast(typeof error === 'string' ? error : (error instanceof Error ? error.message : 'Transaction failed.'))
    }
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <section className="p-5">
        <div>
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Borrow / Return</h2>
          <p className={`mt-1 text-base ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Manage book borrowing and returns.</p>
        </div>

        <div className={`mt-4 border-b ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
          <div className="flex gap-2">
            <button type="button" onClick={() => setActiveTab('borrow')} className={`h-10 border-b-2 px-4 text-sm font-semibold ${activeTab === 'borrow' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-zinc-500'}`}>Borrow Book</button>
            <button type="button" onClick={() => setActiveTab('return')} className={`h-10 border-b-2 px-4 text-sm font-semibold ${activeTab === 'return' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-zinc-500'}`}>Return Book</button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1.3fr]">
          <article className={`rounded-xl border p-4 ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{activeTab === 'borrow' ? 'Borrow Book' : 'Return Book'}</h3>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{activeTab === 'borrow' ? 'Select member and book details to borrow.' : 'Select returned book details and complete return process.'}</p>

            <div className="mt-4 space-y-4">
              <div className="relative space-y-2" ref={memberDropdownRef}>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>1. Select Member</p>
                <label className={`group flex h-11 items-center rounded-xl border px-3 ${isDarkMode ? 'border-zinc-700 bg-[#27272A]/30' : 'border-zinc-200 bg-white'}`}>
                  {selectedMember ? <Check size={16} className="mr-2 text-emerald-500" /> : <Search size={16} className={`mr-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />}
                  <input
                    value={selectedMember ? selectedMember.name : memberSearchQuery}
                    onChange={(e) => {
                      setMemberSearchQuery(e.target.value)
                      setShowMemberDropdown(true)
                      if (selectedMember) setSelectedMember(null)
                    }}
                    onFocus={() => setShowMemberDropdown(true)}
                    placeholder="Search by name, member ID or scan card..."
                    className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400'}`}
                  />
                  <ChevronDown size={16} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                </label>

                {showMemberDropdown && (
                  <div className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border p-1.5 shadow-xl ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}>
                    {filteredMembersList.map((m) => (
                      <button
                        key={m.memberId}
                        type="button"
                        onClick={() => { setSelectedMember(m); setShowMemberDropdown(false); setMemberSearchQuery('') }}
                        className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-semibold ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}
                      >
                        <span className={`grid h-7 w-7 place-items-center overflow-hidden rounded-full ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                          {getMemberPhotoSrc(m.profilePhotoData) ? (
                            <img src={getMemberPhotoSrc(m.profilePhotoData) as string} alt={`${m.name} avatar`} className="h-full w-full object-cover" />
                          ) : (
                            m.avatar
                          )}
                        </span>
                        <div className="flex-1">
                          <p className={isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}>{m.name}</p>
                          <p className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{m.memberId} • {m.type}</p>
                        </div>
                      </button>
                    ))}
                    {filteredMembersList.length === 0 ? <p className={`p-3 text-center text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>No members found</p> : null}
                  </div>
                )}

                {selectedMember && (
                  <div className={`relative rounded-xl border p-3 animate-[fadeIn_0.15s_ease-out] ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-zinc-50/40'}`}>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full text-base ${isDarkMode ? 'bg-zinc-800' : 'bg-white border'}`}>
                          {getMemberPhotoSrc(selectedMember.profilePhotoData) ? (
                            <img src={getMemberPhotoSrc(selectedMember.profilePhotoData) as string} alt={`${selectedMember.name} profile`} className="h-full w-full object-cover" />
                          ) : (
                            selectedMember.avatar
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className={`truncate font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{selectedMember.name}</p>
                          <p className={`truncate text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{selectedMember.memberId} • {selectedMember.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="text-xs md:text-center">
                          <p className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}>Borrowed Books</p>
                          <p className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>{selectedMember.borrowedCount}</p>
                        </div>
                        <div className="text-xs md:text-center">
                          <p className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}>Available Limit</p>
                          <p className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>{selectedMember.limit}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedMember(null)}
                          className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative space-y-2" ref={bookDropdownRef}>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>2. Select Book</p>
                <label className={`group flex h-11 items-center rounded-xl border px-3 ${isDarkMode ? 'border-zinc-700 bg-[#27272A]/30' : 'border-zinc-200 bg-white'}`}>
                  {selectedBook ? <Check size={16} className="mr-2 text-emerald-500" /> : <Search size={16} className={`mr-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />}
                  <input
                    value={selectedBook ? selectedBook.title : bookSearchQuery}
                    onChange={(e) => {
                      setBookSearchQuery(e.target.value)
                      setShowBookDropdown(true)
                      if (selectedBook) setSelectedBook(null)
                    }}
                    onFocus={() => setShowBookDropdown(true)}
                    placeholder={activeTab === 'borrow' ? 'Search by title, ISBN or scan barcode...' : 'Search borrowed book to return...'}
                    className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400'}`}
                  />
                  <ChevronDown size={16} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                </label>

                {showBookDropdown && (
                  <div className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border p-1.5 shadow-xl ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}>
                    {filteredBooksList.map((b) => (
                      <button
                        key={b.copyId}
                        type="button"
                        onClick={() => { setSelectedBook(b); setShowBookDropdown(false); setBookSearchQuery('') }}
                        className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-semibold ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}
                      >
                        <span className={`grid h-9 w-7 place-items-center overflow-hidden rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                          {getBookCoverSrc(b.coverData) ? (
                            <img src={getBookCoverSrc(b.coverData) as string} alt={`${b.title} cover`} className="h-full w-full object-cover" />
                          ) : (
                            <DynamicBookCover title={b.title} author={b.author} seed={b.id} baseColor={b.categoryColor} compact />
                          )}
                        </span>
                        <div className="flex-1">
                          <p className={isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}>{b.title}</p>
                          <div className={`flex justify-between items-center text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            <span>{b.author} • {b.isbn}</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{b.availableCopies} / {b.totalCopies} Available</span>
                          </div>
                        </div>
                      </button>
                    ))}
                    {filteredBooksList.length === 0 ? <p className={`p-3 text-center text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>No books found</p> : null}
                  </div>
                )}

                {selectedBook && (
                  <div className={`relative rounded-xl border p-3 animate-[fadeIn_0.15s_ease-out] ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-zinc-50/40'}`}>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        {getBookCoverSrc(selectedBook.coverData) ? (
                          <img src={getBookCoverSrc(selectedBook.coverData) as string} alt={selectedBook.title} className="w-11 h-16 rounded object-cover border border-zinc-200 dark:border-zinc-800 shrink-0" />
                        ) : (
                          <div className={`w-11 h-16 rounded border shrink-0 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'} overflow-hidden`}>
                            <DynamicBookCover title={selectedBook.title} author={selectedBook.author} seed={selectedBook.id} baseColor={selectedBook.categoryColor} compact />
                          </div>
                        )}
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{selectedBook.title}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Author: {selectedBook.author}</p>
                          <p className={`mt-1 text-xs ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>ISBN: {selectedBook.isbn} • Copy ID: {selectedBook.copyId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="text-right text-xs">
                          <p className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}>Available Copies</p>
                          <p className={`text-xl font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>{selectedBook.availableCopies}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedBook(null)}
                          className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {activeTab === 'borrow' ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>3. Borrow Date</p>
                    <input type="date" value={borrowDate} onChange={(e) => {
                      const newBorrowDate = e.target.value;
                      setBorrowDate(newBorrowDate);
                      if (newBorrowDate) {
                        const newDue = new Date(new Date(newBorrowDate).getTime() + defaultLoanDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
                        setDueDate(newDue);
                      }
                    }} className={`h-11 w-full rounded-xl border px-3 text-sm ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`} />
                  </div>
                  <div>
                    <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>4. Due Date</p>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={`h-11 w-full rounded-xl border px-3 text-sm ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`} />
                  </div>
                </div>
              ) : (
                <div>
                  <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>3. Return Date</p>
                  <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={`h-11 w-full rounded-xl border px-3 text-sm ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`} />
                </div>
              )}

              <div>
                <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Notes (Optional)</p>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value.slice(0, 200))} maxLength={200} placeholder="Add any notes here..." className={`min-h-20 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'}`} />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{notes.length} / 200</p>
              </div>

              <button type="button" onClick={handleConfirmAction} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">
                {activeTab === 'borrow' ? 'Confirm Borrow' : 'Confirm Return'}
              </button>
            </div>
          </article>

          <div className="space-y-4">
            <article className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
              <div className={`flex items-center justify-between border-b p-4 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
                <div>
                  <h3 className={`text-[18px] font-medium ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Current Borrowed Books</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Books currently borrowed by members.</p>
                </div>
                <button type="button" onClick={() => onOpenTransactions('borrowed')} className="text-sm font-semibold text-emerald-700 hover:underline">View all →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={isDarkMode ? 'bg-[#27272A]/50 text-zinc-400' : 'bg-zinc-50 text-zinc-600'}>
                    <tr>
                      <th className="px-3 py-3 text-xs font-semibold uppercase whitespace-nowrap">Member</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase whitespace-nowrap">Book</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase whitespace-nowrap">Borrow Date</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase whitespace-nowrap">Due Date</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeRows.slice(0, 4).map((row) => (
                      <tr key={row.id} className={`border-t ${isDarkMode ? 'border-zinc-700' : 'border-zinc-100'}`}>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <span className={`grid h-8 w-8 place-items-center overflow-hidden rounded-full ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                              {getMemberPhotoSrc(row.profilePhotoData) ? (
                                <img src={getMemberPhotoSrc(row.profilePhotoData) as string} alt={`${row.member} avatar`} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-[11px] font-semibold">{row.avatar}</span>
                              )}
                            </span>
                            <span>
                              <p className={`font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{row.member}</p>
                              <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{row.memberId}</p>
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className={`font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{row.book}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Copy ID: {row.copyId}</p>
                        </td>
                        <td className={`px-3 py-3 whitespace-nowrap ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{row.borrowDate}</td>
                        <td className={`px-3 py-3 whitespace-nowrap ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{row.dueDate}</td>
                        <td className="px-3 py-3 whitespace-nowrap"><span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getStatusClass(row.status)}`}>{row.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
              <div className={`flex items-center justify-between border-b p-4 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
                <div>
                  <h3 className={`text-[18px] font-medium ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Recent Returned</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Recently returned books.</p>
                </div>
                <button type="button" onClick={() => onOpenTransactions('returned')} className="text-sm font-semibold text-emerald-700 hover:underline">View all →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={isDarkMode ? 'bg-[#27272A]/50 text-zinc-400' : 'bg-zinc-50 text-zinc-600'}>
                    <tr>
                      <th className="px-3 py-3 text-xs font-semibold uppercase whitespace-nowrap">Member</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase whitespace-nowrap">Book</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase whitespace-nowrap">Returned Date</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase whitespace-nowrap">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnedRows.slice(0, 3).map((row) => (
                      <tr key={row.id} className={`border-t ${isDarkMode ? 'border-zinc-700' : 'border-zinc-100'}`}>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <span className={`grid h-8 w-8 place-items-center overflow-hidden rounded-full ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                              {getMemberPhotoSrc(row.profilePhotoData) ? (
                                <img src={getMemberPhotoSrc(row.profilePhotoData) as string} alt={`${row.member} avatar`} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-[11px] font-semibold">{row.avatar}</span>
                              )}
                            </span>
                            <span>
                              <p className={`font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{row.member}</p>
                              <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{row.memberId}</p>
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className={`font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{row.book}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Copy ID: {row.copyId}</p>
                        </td>
                        <td className={`px-3 py-3 whitespace-nowrap ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{row.returnedDate}</td>
                        <td className="px-3 py-3 whitespace-nowrap"><span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getFineClass(row.fineType)}`}>{row.fine}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </div>
      </section>

      <Toast message={showToast} onClose={() => setShowToast(null)} isDarkMode={isDarkMode} />

    </div>
  )
}
