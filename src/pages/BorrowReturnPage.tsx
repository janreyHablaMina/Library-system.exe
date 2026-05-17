import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Ellipsis, IdCard, Mail, Phone, Search, X, Check } from 'lucide-react'

type BorrowReturnPageProps = {
  isDarkMode: boolean
  onOpenTransactions: () => void
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
}

const borrowedRows: BorrowedRow[] = [
  { id: 1, member: 'Juan Dela Cruz', memberId: 'STU-2026-001', book: 'Atomic Habits', copyId: 'BK-2026-0001', borrowDate: 'May 1, 2026', dueDate: 'May 15, 2026', status: 'Active', avatar: '👨🏻' },
  { id: 2, member: 'Maria Santos', memberId: 'STU-2026-002', book: 'The Psychology of Money', copyId: 'BK-2026-0003', borrowDate: 'May 2, 2026', dueDate: 'May 16, 2026', status: 'Active', avatar: '👩🏻' },
  { id: 3, member: 'Ana Lim', memberId: 'STU-2026-004', book: 'Thinking, Fast and Slow', copyId: 'BK-2026-0005', borrowDate: 'May 3, 2026', dueDate: 'May 17, 2026', status: 'Overdue', avatar: '👩🏽' },
  { id: 4, member: 'Mark Anthony', memberId: 'TCH-2026-001', book: 'Deep Work', copyId: 'BK-2026-0002', borrowDate: 'May 4, 2026', dueDate: 'May 18, 2026', status: 'Active', avatar: '👨🏾' },
]

const returnedRows: ReturnedRow[] = [
  { id: 1, member: 'Liza Montero', memberId: 'STA-2026-002', book: 'Rich Dad Poor Dad', copyId: 'BK-2026-0008', returnedDate: 'May 6, 2026 10:30 AM', fine: '₱0.00', fineType: 'paid', avatar: '👩‍💼' },
  { id: 2, member: 'Visitor - Alex Tan', memberId: 'VIS-2026-001', book: 'The Power of Habit', copyId: 'BK-2026-0009', returnedDate: 'May 6, 2026 09:15 AM', fine: '₱0.00', fineType: 'paid', avatar: '🧑🏻' },
  { id: 3, member: 'Visitor - Joy Reyes', memberId: 'VIS-2026-002', book: 'How to Win Friends and Influence People', copyId: 'BK-2026-0010', returnedDate: 'May 5, 2026 04:45 PM', fine: '₱25.00', fineType: 'due', avatar: '🧑🏽' },
  { id: 4, member: 'Rogelio Cruz', memberId: 'STA-2026-001', book: 'Start With Why', copyId: 'BK-2026-0011', returnedDate: 'May 5, 2026 02:20 PM', fine: '₱0.00', fineType: 'paid', avatar: '👨‍💼' },
]

function getStatusClass(status: BorrowedRow['status']) {
  if (status === 'Active') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
}

function getFineClass(type: ReturnedRow['fineType']) {
  return type === 'paid'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
    : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
}

type MemberItem = {
  name: string
  memberId: string
  type: string
  phone: string
  email: string
  borrowedCount: number
  limit: string
  avatar: string
}

type BookItem = {
  title: string
  author: string
  isbn: string
  copyId: string
  availableCopies: number
  icon: string
}

const mockMembers: MemberItem[] = [
  { name: 'Maria Santos', memberId: 'STU-2026-002', type: 'Student', phone: '0921 456 7890', email: 'maria.santos@email.com', borrowedCount: 1, limit: '4 / 5', avatar: '👩🏻' },
  { name: 'Juan Dela Cruz', memberId: 'STU-2026-001', type: 'Student', phone: '0912 345 6789', email: 'juan.delacruz@email.com', borrowedCount: 2, limit: '3 / 5', avatar: '👨🏻' },
  { name: 'Ana Lim', memberId: 'STU-2026-004', type: 'Student', phone: '0934 567 8901', email: 'ana.lim@email.com', borrowedCount: 3, limit: '2 / 5', avatar: '👩🏽' },
  { name: 'Mark Anthony', memberId: 'TCH-2026-001', type: 'Teacher', phone: '0945 678 9012', email: 'mark.anthony@email.com', borrowedCount: 0, limit: '10 / 10', avatar: '👨🏾' },
]

const mockBooks: BookItem[] = [
  { title: 'The Mindful Leader', author: 'Michael Bungay Stanier', isbn: '978-1524761540', copyId: 'BK-2026-0007', availableCopies: 3, icon: '📘' },
  { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', copyId: 'BK-2026-0001', availableCopies: 5, icon: '📙' },
  { title: 'The Psychology of Money', author: 'Morgan Housel', isbn: '978-0857197689', copyId: 'BK-2026-0003', availableCopies: 2, icon: '📗' },
  { title: 'Deep Work', author: 'Cal Newport', isbn: '978-1455586691', copyId: 'BK-2026-0002', availableCopies: 4, icon: '📕' },
]

export function BorrowReturnPage({ isDarkMode, onOpenTransactions }: BorrowReturnPageProps) {
  const [activeTab, setActiveTab] = useState<'borrow' | 'return'>('borrow')
  const [borrowDate, setBorrowDate] = useState('2026-05-06')
  const [dueDate, setDueDate] = useState('2026-05-20')

  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null)
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null)

  const [memberSearchQuery, setMemberSearchQuery] = useState('')
  const [showMemberDropdown, setShowMemberDropdown] = useState(false)

  const [bookSearchQuery, setBookSearchQuery] = useState('')
  const [showBookDropdown, setShowBookDropdown] = useState(false)

  const [showToast, setShowToast] = useState<string | null>(null)

  const memberDropdownRef = useRef<HTMLDivElement>(null)
  const bookDropdownRef = useRef<HTMLDivElement>(null)

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
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const filteredMembersList = mockMembers.filter(m => 
    m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || 
    m.memberId.toLowerCase().includes(memberSearchQuery.toLowerCase())
  )

  const filteredBooksList = mockBooks.filter(b => 
    b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) || 
    b.isbn.includes(bookSearchQuery)
  )

  const handleConfirmAction = () => {
    if (!selectedMember) {
      alert("Please select a member first.")
      return
    }
    if (!selectedBook) {
      alert("Please select a book first.")
      return
    }
    if (activeTab === 'borrow') {
      setShowToast(`Successfully borrowed "${selectedBook.title}" to ${selectedMember.name}!`)
    } else {
      setShowToast(`Successfully returned "${selectedBook.title}" from ${selectedMember.name}!`)
    }
    setSelectedMember(null)
    setSelectedBook(null)
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="p-5">
        <div>
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Borrow / Return</h2>
          <p className={`mt-1 text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage book borrowing and returns.</p>
        </div>

        <div className={`mt-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex gap-2">
            <button type="button" onClick={() => setActiveTab('borrow')} className={`h-10 border-b-2 px-4 text-sm font-semibold ${activeTab === 'borrow' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500'}`}>Borrow Book</button>
            <button type="button" onClick={() => setActiveTab('return')} className={`h-10 border-b-2 px-4 text-sm font-semibold ${activeTab === 'return' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500'}`}>Return Book</button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1.3fr]">
          <article className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{activeTab === 'borrow' ? 'Borrow Book' : 'Return Book'}</h3>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{activeTab === 'borrow' ? 'Select member and book details to borrow.' : 'Select returned book details and complete return process.'}</p>

            <div className="mt-4 space-y-4">
              <div className="relative space-y-2" ref={memberDropdownRef}>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>1. Select Member</p>
                <label className={`group flex h-11 items-center rounded-xl border px-3 transition-all ${
                  selectedMember 
                    ? (isDarkMode ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-emerald-500 bg-emerald-50/50')
                    : (isDarkMode ? 'border-slate-700 focus-within:border-emerald-500 bg-[#0f1f49]/30' : 'border-slate-200 focus-within:border-emerald-500 bg-slate-55')
                }`}>
                  {selectedMember ? (
                    <Check size={16} className="mr-2 text-emerald-500 animate-[scaleIn_0.2s_ease-out]" />
                  ) : (
                    <Search size={16} className={`mr-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  )}
                  <input
                    value={selectedMember ? selectedMember.name : memberSearchQuery}
                    onChange={(e) => {
                      setMemberSearchQuery(e.target.value)
                      setShowMemberDropdown(true)
                      if (selectedMember) {
                        setSelectedMember(null)
                      }
                    }}
                    onFocus={() => setShowMemberDropdown(true)}
                    placeholder="Search by name, member ID or scan card..."
                    className={`w-full bg-transparent text-sm outline-none ${selectedMember ? 'font-semibold text-emerald-600 dark:text-emerald-400' : (isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400')}`}
                  />
                  {selectedMember && (
                    <span className="mr-2 shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-[fadeIn_0.15s_ease-out]">
                      Selected
                    </span>
                  )}
                  <ChevronDown size={16} className={selectedMember ? 'text-emerald-500' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')} />
                </label>

                {showMemberDropdown && (
                  <div className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border p-1.5 shadow-xl ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    {filteredMembersList.length > 0 ? (
                      filteredMembersList.map((m) => (
                        <button
                          key={m.memberId}
                          type="button"
                          onClick={() => {
                            setSelectedMember(m)
                            setShowMemberDropdown(false)
                            setMemberSearchQuery('')
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                        >
                          <span>{m.avatar}</span>
                          <div className="flex-1">
                            <p className={isDarkMode ? 'text-slate-100' : 'text-slate-900'}>{m.name}</p>
                            <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{m.memberId} • {m.type}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className={`p-3 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No members found</p>
                    )}
                  </div>
                )}

                {selectedMember && (
                  <div className={`relative rounded-xl border p-3 animate-[fadeIn_0.15s_ease-out] ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50/40'}`}>
                    <button
                      type="button"
                      onClick={() => setSelectedMember(null)}
                      className={`absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                    >
                      <X size={13} />
                    </button>
                    <div className="grid gap-3 md:grid-cols-[1.25fr_1fr_auto_auto] md:items-center pr-8">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>{selectedMember.avatar}</span>
                        <div className="min-w-0">
                          <p className={`truncate font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedMember.name}</p>
                          <p className={`truncate text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedMember.memberId} • {selectedMember.type}</p>
                        </div>
                      </div>
                      <div className="grid min-w-0 gap-1 text-xs">
                        <p className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}><Phone size={13} />{selectedMember.phone}</p>
                        <p className={`flex min-w-0 items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}><Mail size={13} /><span className="truncate">{selectedMember.email}</span></p>
                      </div>
                      <div className="text-xs md:min-w-[84px] md:text-center">
                        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Borrowed Books</p>
                        <p className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{selectedMember.borrowedCount}</p>
                      </div>
                      <div className="text-xs md:min-w-[96px] md:text-center">
                        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Available Limit</p>
                        <p className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{selectedMember.limit}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative space-y-2" ref={bookDropdownRef}>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>2. Select Book</p>
                <label className={`group flex h-11 items-center rounded-xl border px-3 transition-all ${
                  selectedBook 
                    ? (isDarkMode ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-emerald-500 bg-emerald-50/50')
                    : (isDarkMode ? 'border-slate-700 focus-within:border-emerald-500 bg-[#0f1f49]/30' : 'border-slate-200 focus-within:border-emerald-500 bg-slate-55')
                }`}>
                  {selectedBook ? (
                    <Check size={16} className="mr-2 text-emerald-500 animate-[scaleIn_0.2s_ease-out]" />
                  ) : (
                    <Search size={16} className={`mr-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  )}
                  <input
                    value={selectedBook ? selectedBook.title : bookSearchQuery}
                    onChange={(e) => {
                      setBookSearchQuery(e.target.value)
                      setShowBookDropdown(true)
                      if (selectedBook) {
                        setSelectedBook(null)
                      }
                    }}
                    onFocus={() => setShowBookDropdown(true)}
                    placeholder="Search by title, ISBN or scan barcode..."
                    className={`w-full bg-transparent text-sm outline-none ${selectedBook ? 'font-semibold text-emerald-600 dark:text-emerald-400' : (isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400')}`}
                  />
                  {selectedBook && (
                    <span className="mr-2 shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-[fadeIn_0.15s_ease-out]">
                      Selected
                    </span>
                  )}
                  <ChevronDown size={16} className={selectedBook ? 'text-emerald-500' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')} />
                </label>

                {showBookDropdown && (
                  <div className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border p-1.5 shadow-xl ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    {filteredBooksList.length > 0 ? (
                      filteredBooksList.map((b) => (
                        <button
                          key={b.copyId}
                          type="button"
                          onClick={() => {
                            setSelectedBook(b)
                            setShowBookDropdown(false)
                            setBookSearchQuery('')
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-55'}`}
                        >
                          <span className="text-lg">{b.icon}</span>
                          <div className="flex-1">
                            <p className={isDarkMode ? 'text-slate-100' : 'text-slate-900'}>{b.title}</p>
                            <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{b.author} • {b.isbn}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className={`p-3 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No books found</p>
                    )}
                  </div>
                )}

                {selectedBook && (
                  <div className={`relative rounded-xl border p-3 animate-[fadeIn_0.15s_ease-out] ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50/40'}`}>
                    <button
                      type="button"
                      onClick={() => setSelectedBook(null)}
                      className={`absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                    >
                      <X size={13} />
                    </button>
                    <div className="flex items-center justify-between gap-3 pr-8">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-16 w-11 place-items-center rounded ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>{selectedBook.icon}</div>
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedBook.title}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Author: {selectedBook.author}</p>
                          <p className={`mt-1 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>ISBN: {selectedBook.isbn} • Copy ID: {selectedBook.copyId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Available Copies</p>
                        <p className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{selectedBook.availableCopies}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>3. Borrow Date</p>
                  <label className={`flex h-11 items-center rounded-xl border px-3 text-sm ${isDarkMode ? 'border-slate-700 text-slate-200' : 'border-slate-200 text-slate-700'}`}>
                    <input
                      type="date"
                      value={borrowDate}
                      onChange={(event) => setBorrowDate(event.target.value)}
                      className={`date-input w-full bg-transparent outline-none ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}
                    />
                  </label>
                </div>
                <div>
                  <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>4. Due Date</p>
                  <label className={`flex h-11 items-center rounded-xl border px-3 text-sm ${isDarkMode ? 'border-slate-700 text-slate-200' : 'border-slate-200 text-slate-700'}`}>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(event) => setDueDate(event.target.value)}
                      className={`date-input w-full bg-transparent outline-none ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}
                    />
                  </label>
                  <p className="mt-1 text-xs font-semibold text-emerald-600">Borrowing period: 14 days</p>
                </div>
              </div>

              <div>
                <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>5. Notes (Optional)</p>
                <textarea maxLength={200} placeholder="Add any notes here..." className={`min-h-20 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'}`} />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>0 / 200</p>
              </div>

              <button type="button" onClick={handleConfirmAction} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700">
                <IdCard size={15} />
                {activeTab === 'borrow' ? 'Confirm Borrow' : 'Confirm Return'}
              </button>
            </div>
          </article>

          <div className="space-y-4">
            <article className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Current Borrowed Books (4)</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Books currently borrowed by members.</p>
                </div>
                <button type="button" onClick={onOpenTransactions} className="text-sm font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-left text-sm">
                  <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                    <tr>
                      <th className="px-4 py-3 font-semibold">Member</th>
                      <th className="px-3 py-3 font-semibold">Book</th>
                      <th className="px-3 py-3 font-semibold">Borrow Date</th>
                      <th className="px-3 py-3 font-semibold">Due Date</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                      <th className="px-3 py-3 font-semibold text-right"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowedRows.map((row) => (
                      <tr key={row.id} className={`border-t ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`grid h-9 w-9 place-items-center rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{row.avatar}</span>
                            <div><p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.member}</p><p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{row.memberId}</p></div>
                          </div>
                        </td>
                        <td className="px-3 py-3"><p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.book}</p><p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Copy ID: {row.copyId}</p></td>
                        <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.borrowDate}</td>
                        <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.dueDate}</td>
                        <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(row.status)}`}>{row.status}</span></td>
                        <td className="px-3 py-3 text-right"><button type="button" className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Ellipsis size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Recent Returned (4)</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Recently returned books.</p>
                </div>
                <button type="button" onClick={onOpenTransactions} className="text-sm font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-left text-sm">
                  <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                    <tr>
                      <th className="px-4 py-3 font-semibold">Member</th>
                      <th className="px-3 py-3 font-semibold">Book</th>
                      <th className="px-3 py-3 font-semibold">Returned Date</th>
                      <th className="px-3 py-3 font-semibold">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnedRows.map((row) => (
                      <tr key={row.id} className={`border-t ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`grid h-9 w-9 place-items-center rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{row.avatar}</span>
                            <div><p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.member}</p><p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{row.memberId}</p></div>
                          </div>
                        </td>
                        <td className="px-3 py-3"><p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.book}</p><p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Copy ID: {row.copyId}</p></td>
                        <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.returnedDate}</td>
                        <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${getFineClass(row.fineType)}`}>{row.fine}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </div>
      </section>

      {showToast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-xl transition-all duration-300 animate-[fadeIn_0.2s_ease-out] ${
          isDarkMode 
            ? 'border-slate-700 bg-slate-900 text-slate-100' 
            : 'border-slate-200 bg-white text-slate-800'
        }`}>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <span className="text-sm font-bold">✓</span>
          </div>
          <p className="text-sm font-semibold">{showToast}</p>
        </div>
      )}
    </div>
  )
}
