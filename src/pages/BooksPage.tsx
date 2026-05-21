import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpen, Bookmark, ChevronDown, Clock3, Download, Filter, Grid2x2,
  List, MoreHorizontal, RotateCcw, Search, Upload,
  Eye, Pencil, BookMarked, PlusCircle, RefreshCw, Trash2, AlertTriangle, X
} from 'lucide-react'
import { EditBookPage } from './EditBookPage'
import { deleteBook, listBooks, updateBook } from '../lib/tauriApi'

type BookStatus = 'Available' | 'Borrowed' | 'Overdue' | 'Archived'

type BookRow = {
  id: number
  cover: string
  title: string
  isbn: string
  author: string
  category: string
  callNumber: string
  year: number
  status: BookStatus
  available: string
}

type BooksPageProps = {
  isDarkMode: boolean
  onOpenBookDetail: () => void
  onOpenAddBook: () => void
  refreshKey?: number
  externalToastMessage?: string | null
}

const initialBooks: BookRow[] = [
  { id: 1, cover: '📙', title: 'Sosyolohiya sa Filipino', isbn: '978-621-455-010-2', author: 'Kahayon, Alicia H.', category: 'Social Sciences', callNumber: '300.72 KAH', year: 2021, status: 'Available', available: '5 / 7' },
  { id: 2, cover: '📕', title: 'Understanding Philippine Social Realities through the Filipino Family', isbn: '978-971-009-123-4', author: 'Ramirez, Mina M.', category: 'Social Sciences', callNumber: '305.23 RAM', year: 2020, status: 'Borrowed', available: '1 / 3' },
  { id: 3, cover: '📘', title: 'The Conjugal Dictatorship of Ferdinand and Imelda Marcos I', isbn: '978-971-555-001-1', author: 'Mijares, Primitivo', category: 'History', callNumber: '959.904 MIJ', year: 2018, status: 'Available', available: '2 / 4' },
  { id: 4, cover: '📗', title: 'Filipino Values Today', isbn: '978-971-100-456-7', author: 'Timberza, Florentino T.', category: 'Education', callNumber: '370.115 TIM', year: 2019, status: 'Available', available: '3 / 5' },
  { id: 5, cover: '📔', title: 'The Fateful Years', isbn: '978-621-455-789-6', author: 'Agoncillo, Teodoro A.', category: 'History', callNumber: '959.902 AGO', year: 2017, status: 'Overdue', available: '0 / 2' },
  { id: 6, cover: '📓', title: 'Philippine Constitution Explained', isbn: '978-971-888-777-1', author: 'De Vera, Hector S.', category: 'Law', callNumber: '342.59903 DEV', year: 2022, status: 'Available', available: '4 / 6' },
  { id: 7, cover: '📙', title: 'The Life and Works of Jose Rizal', isbn: '978-971-245-678-3', author: 'Tellos, Ricardo', category: 'Biography', callNumber: '920 RIZ', year: 2016, status: 'Borrowed', available: '1 / 2' },
  { id: 8, cover: '📒', title: 'Introduction to Library Science', isbn: '978-971-333-222-8', author: 'Villanueva, Ma. Teresa', category: 'Library Science', callNumber: '025.1 VIL', year: 2021, status: 'Available', available: '6 / 8' },
  { id: 9, cover: '📘', title: 'The Philippine Islands, 1493–1898', isbn: '978-971-555-025-7', author: 'Blair, Emma Helen', category: 'History', callNumber: '959.9 BLA', year: 2015, status: 'Archived', available: '0 / 5' },
  { id: 10, cover: '📙', title: 'Florante at Laura', isbn: '978-971-08-6047-0', author: 'Balagtas, Francisco', category: 'Fiction', callNumber: '899.211 BAL', year: 2019, status: 'Available', available: '7 / 7' },
  { id: 11, cover: '📗', title: 'Noli Me Tangere', isbn: '978-971-08-6046-3', author: 'Rizal, Jose', category: 'Fiction', callNumber: '899.211 RIZ', year: 2018, status: 'Borrowed', available: '2 / 5' },
  { id: 12, cover: '📕', title: 'Web Development with React and Node', isbn: '978-1-80181-234-5', author: 'Freeman, Adam', category: 'Technology', callNumber: '005.276 FRE', year: 2022, status: 'Available', available: '3 / 3' },
]

function getStatusClass(status: BookStatus) {
  if (status === 'Available') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  if (status === 'Borrowed') return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
  if (status === 'Archived') return 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
}

function getCategoryClass(category: string) {
  switch (category) {
    case 'Social Sciences':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
    case 'History':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
    case 'Education':
      return 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
    case 'Law':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
    case 'Biography':
      return 'bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300'
    case 'Fiction':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
    case 'Technology':
      return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300'
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  }
}

// ─── Book Actions Dropdown Menu ───────────────────────────────────────────────
type BookActionsMenuProps = {
  isDarkMode: boolean
  onViewDetails: () => void
  onEdit: () => void
  onDelete: () => void
}

function BookActionsMenu({ isDarkMode, onViewDetails, onEdit, onDelete }: BookActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleToggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpward(spaceBelow < 185)
    }
    setOpen(v => !v)
  }

  const surface = isDarkMode
    ? 'bg-[#0f172a] border-slate-700 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
    : 'bg-white border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'

  const itemBase =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-100 text-left'
  const itemNormal = isDarkMode
    ? 'text-slate-200 hover:bg-slate-800'
    : 'text-slate-700 hover:bg-slate-50'
  const itemDanger = isDarkMode
    ? 'text-rose-400 hover:bg-rose-500/10'
    : 'text-rose-600 hover:bg-rose-50'
  const divider = isDarkMode ? 'border-slate-700/60' : 'border-slate-100'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id={`book-actions-btn-${Math.random()}`}
        onClick={handleToggle}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 ${
          open
            ? isDarkMode
              ? 'border-slate-500 bg-slate-700 text-slate-100'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : isDarkMode
              ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
        aria-label="Book actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-52 rounded-xl border p-1.5 ${surface} animate-[fadeIn_0.12s_ease] ${
            openUpward 
              ? 'bottom-full mb-1.5 origin-bottom-right' 
              : 'top-full mt-1.5 origin-top-right'
          }`}
          role="menu"
          style={{ animation: openUpward ? 'bookMenuInUp 0.13s cubic-bezier(0.16,1,0.3,1)' : 'bookMenuInDown 0.13s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <style>{`
            @keyframes bookMenuInDown {
              from { opacity: 0; transform: scale(0.95) translateY(-6px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
            @keyframes bookMenuInUp {
              from { opacity: 0; transform: scale(0.95) translateY(6px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
          `}</style>

          {/* Group 1 */}
          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={() => { setOpen(false); onViewDetails(); }}
          >
            <Eye size={15} className="shrink-0 text-sky-500" />
            View Details
          </button>
          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={() => { setOpen(false); onEdit(); }}
          >
            <Pencil size={15} className="shrink-0 text-violet-500" />
            Edit Book
          </button>
          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <BookMarked size={15} className="shrink-0 text-emerald-500" />
            Borrow Book
          </button>

          <div className={`my-1.5 border-t ${divider}`} />

          {/* Group 3 — Danger */}
          <button
            type="button"
            className={`${itemBase} ${itemDanger}`}
            role="menuitem"
            onClick={() => { setOpen(false); onDelete(); }}
          >
            <Trash2 size={15} className="shrink-0" />
            Delete Book
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function BooksPage({ isDarkMode, onOpenBookDetail, onOpenAddBook, refreshKey = 0, externalToastMessage = null }: BooksPageProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [bookList, setBookList] = useState<BookRow[]>(initialBooks)
  const [bookToDelete, setBookToDelete] = useState<BookRow | null>(null)
  
  // State for editing book details (renders full EditBookPage overlay)
  const [bookToEdit, setBookToEdit] = useState<BookRow | null>(null)

  const [showToast, setShowToast] = useState<string | null>(null)

  useEffect(() => {
    const loadBooksFromDb = async () => {
      try {
        const rows = await listBooks(500)
        const mapped: BookRow[] = rows.map((row) => ({
          id: row.id,
          cover: row.coverData || '📘',
          title: row.title,
          isbn: row.isbn ?? '-',
          author: row.author,
          category: 'Uncategorized',
          callNumber: '-',
          year: new Date(row.createdAt).getFullYear() || new Date().getFullYear(),
          status: row.available ? 'Available' : 'Borrowed',
          available: row.available ? '1 / 1' : '0 / 1',
        }))
        setBookList(mapped.length > 0 ? mapped : [])
      } catch (error) {
        console.error('Failed to load books from DB:', error)
      }
    }

    loadBooksFromDb()
  }, [refreshKey])

  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedAuthor, setSelectedAuthor] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')
  const [activeStatTab, setActiveStatTab] = useState<'All Books' | 'Available' | 'Borrowed' | 'Overdue' | 'Archived'>('All Books')

  // Dynamically pull all unique authors from your book list
  const uniqueAuthors = useMemo(() => {
    return Array.from(new Set(bookList.map(b => b.author))).sort()
  }, [bookList])

  // Filter dynamic helper
  const filteredBooks = bookList.filter((book) => {
    // 1. Stat Tab Filter
    if (activeStatTab === 'Available' && book.status !== 'Available') return false
    if (activeStatTab === 'Borrowed' && book.status !== 'Borrowed') return false
    if (activeStatTab === 'Overdue' && book.status !== 'Overdue') return false
    if (activeStatTab === 'Archived' && book.status !== 'Archived') return false
    if (activeStatTab === 'All Books' && book.status === 'Archived' && selectedStatus !== 'Archived') {
      return false
    }

    // 2. Status Dropdown
    if (selectedStatus !== 'All' && book.status !== selectedStatus) return false

    // 3. Category Dropdown
    if (selectedCategory !== 'All' && book.category !== selectedCategory) return false

    // 4. Author Dropdown
    if (selectedAuthor !== 'All' && book.author !== selectedAuthor) return false

    // 5. Year Dropdown
    if (selectedYear !== 'All' && String(book.year) !== selectedYear) return false

    // 6. Search input
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      const matchTitle = book.title.toLowerCase().includes(term)
      const matchAuthor = book.author.toLowerCase().includes(term)
      const matchIsbn = book.isbn.toLowerCase().includes(term)
      const matchCallNumber = book.callNumber.toLowerCase().includes(term)
      if (!matchTitle && !matchAuthor && !matchIsbn && !matchCallNumber) return false
    }

    return true
  })

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setSelectedAuthor('All')
    setSelectedStatus('All')
    setSelectedYear('All')
    setActiveStatTab('All Books')
  }

  // Auto-dismiss toast
  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(t)
    }
  }, [showToast])

  useEffect(() => {
    if (externalToastMessage) {
      setShowToast(externalToastMessage)
    }
  }, [externalToastMessage])

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      try {
        await deleteBook(bookToDelete.id)
      } catch (error) {
        console.error('Failed to delete book:', error)
      }
      setBookList(prev => prev.filter(b => b.id !== bookToDelete.id))
      setShowToast(`Successfully deleted "${bookToDelete.title}"`)
      setBookToDelete(null)
    }
  }

  // Render Full Screen Edit Page if active
  if (bookToEdit) {
    return (
      <EditBookPage
        book={bookToEdit}
        isDarkMode={isDarkMode}
        onBack={() => setBookToEdit(null)}
        onSave={(updatedBook) => {
          const normalizedBook: BookRow = {
            ...updatedBook,
            status: (updatedBook.status === 'Archived' ? 'Archived' : updatedBook.status) as BookStatus,
          }
          const persist = async () => {
            try {
              await updateBook({
                id: normalizedBook.id,
                title: normalizedBook.title,
                author: normalizedBook.author,
                isbn: normalizedBook.isbn === '-' ? null : normalizedBook.isbn,
                coverData: normalizedBook.cover.startsWith('data:') ? normalizedBook.cover : null,
                available: normalizedBook.status === 'Available',
              })
            } catch (error) {
              console.error('Failed to update book:', error)
            }
          }
          void persist()
          setBookList((prev) => prev.map((b) => (b.id === normalizedBook.id ? normalizedBook : b)))
          setShowToast(`Successfully updated "${normalizedBook.title}"`)
          setBookToEdit(null)
        }}
      />
    )
  }

  const cardClass = isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg animate-slide-in">
          <span>{showToast}</span>
          <button onClick={() => setShowToast(null)} className="rounded p-0.5 hover:bg-emerald-500">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Styled Confirmation Modal (Delete) */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${cardClass}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-6">Delete Book</h3>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Are you sure you want to delete <span className="font-semibold text-rose-500">"{bookToDelete.title}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setBookToDelete(null)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
                  isDarkMode
                    ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Yes, Delete Book
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Books</h2>
            <p className={`mt-1 text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage all library books and materials</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenAddBook}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <span className="text-lg leading-none">+</span>
              Add Book
            </button>
            <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <Upload size={15} />
              Import
            </button>
            <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <Download size={15} />
              Export
            </button>
          </div>
        </div>

        <div className={`mt-5 overflow-x-auto rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
          <div className={`flex min-w-[880px] items-center gap-2 px-3 py-3 ${isDarkMode ? 'bg-[#0b1738]' : 'bg-white'}`}>
            {[
              { label: 'All Books', value: String(bookList.filter(b => b.status !== 'Archived').length), icon: BookOpen },
              { label: 'Available', value: String(bookList.filter(b => b.status === 'Available').length), icon: Bookmark },
              { label: 'Borrowed', value: String(bookList.filter(b => b.status === 'Borrowed').length), icon: RotateCcw },
              { label: 'Overdue', value: String(bookList.filter(b => b.status === 'Overdue').length), icon: Clock3 },
              { label: 'Archived', value: String(bookList.filter(b => b.status === 'Archived').length), icon: Filter },
            ].map((item) => {
              const ItemIcon = item.icon
              const isActive = activeStatTab === item.label
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveStatTab(item.label as any)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'border border-emerald-600 bg-emerald-600 text-white'
                      : isDarkMode
                        ? 'border border-slate-700 bg-[#0f1f49] text-slate-300 hover:bg-slate-800'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ItemIcon size={15} />
                  {item.label}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-emerald-500 text-white' : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                    {item.value}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={`mt-4 overflow-hidden lg:overflow-visible rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
          <div className={`flex flex-wrap items-center gap-3 border-b p-3 rounded-t-xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <label className={`group flex h-11 min-w-[280px] flex-1 items-center rounded-xl border px-3 ${isDarkMode ? 'border-slate-700 focus-within:border-emerald-500' : 'border-slate-200 focus-within:border-emerald-500'}`}>
              <Search size={16} className={`mr-2 ${isDarkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`}
                placeholder="Search by title, author, ISBN, or call number..."
              />
            </label>
            
            {/* Category Select */}
            <div className="relative">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`h-11 appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm outline-none min-w-[150px] ${
                  isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <option value="All">Category: All</option>
                {['Social Sciences', 'History', 'Education', 'Law', 'Biography', 'Library Science', 'Fiction', 'Technology'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>

            {/* Author Select */}
            <div className="relative">
              <select 
                value={selectedAuthor} 
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className={`h-11 appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm outline-none min-w-[160px] max-w-[200px] truncate ${
                  isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <option value="All">Author: All</option>
                {uniqueAuthors.map(auth => (
                  <option key={auth} value={auth}>{auth}</option>
                ))}
              </select>
              <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>

            {/* Status Select */}
            <div className="relative">
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`h-11 appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm outline-none min-w-[140px] ${
                  isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <option value="All">Status: All</option>
                {['Available', 'Borrowed', 'Overdue', 'Archived'].map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>


            {/* Year Select */}
            <div className="relative">
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`h-11 appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm outline-none min-w-[120px] ${
                  isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <option value="All">Year: All</option>
                {['2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'].map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
              <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>

            <button 
              type="button" 
              onClick={handleResetFilters}
              className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors duration-150 ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              <RotateCcw size={15} />
              Reset
            </button>
            <div className="ml-auto flex gap-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`grid h-11 w-11 place-items-center rounded-xl ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : isDarkMode ? 'border border-slate-700 text-slate-300' : 'border border-slate-200 text-slate-600'}`}
              >
                <List size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`grid h-11 w-11 place-items-center rounded-xl ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : isDarkMode ? 'border border-slate-700 text-slate-300' : 'border border-slate-200 text-slate-600'}`}
              >
                <Grid2x2 size={16} />
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className={`relative z-10 ${isDarkMode ? 'overflow-x-auto lg:overflow-visible bg-[#0b1738]' : 'overflow-x-auto lg:overflow-visible bg-white'}`}>
              <table className="min-w-[980px] w-full text-left text-sm">
                <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                  <tr>
                    <th className="px-4 py-3 font-semibold"><input type="checkbox" /></th>
                    <th className="px-3 py-3 font-semibold">Book</th>
                    <th className="px-3 py-3 font-semibold">Author</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Call Number</th>
                    <th className="px-3 py-3 font-semibold">Year</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Available Copies</th>
                    <th className="px-3 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <td className="px-4 py-3 align-top"><input type="checkbox" /></td>
                      <td className="px-3 py-3">
                        <div className="flex items-start gap-3">
                          <span className={`grid h-12 w-9 place-items-center rounded text-xl overflow-hidden shrink-0 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            {book.cover.startsWith('data:') || book.cover.startsWith('http') || book.cover.startsWith('blob:') ? (
                              <img src={book.cover} alt="" className="h-full w-full object-cover" />
                            ) : (
                              book.cover
                            )}
                          </span>
                          <div>
                            <button type="button" onClick={onOpenBookDetail} className={`text-left font-semibold hover:underline ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{book.title}</button>
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ISBN: {book.isbn}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{book.author}</td>
                      <td className="px-3 py-3">
                        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${getCategoryClass(book.category)}`}>{book.category}</span>
                      </td>
                      <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{book.callNumber}</td>
                      <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{book.year}</td>
                      <td className="px-3 py-3">
                        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(book.status)}`}>{book.status}</span>
                      </td>
                      <td className={`px-3 py-3 font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{book.available}</td>
                      <td className="px-3 py-3 text-right">
                        <BookActionsMenu isDarkMode={isDarkMode} onViewDetails={onOpenBookDetail} onEdit={() => setBookToEdit(book)} onDelete={() => setBookToDelete(book)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 ${isDarkMode ? 'bg-[#0b1738]' : 'bg-white'}`}>
              {filteredBooks.map((book) => (
                <article key={book.id} className={`flex h-full flex-col rounded-xl border p-3 ${
                  isDarkMode
                    ? 'border-slate-700 bg-[#0b1738]'
                    : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-start justify-between">
                    <span className={`grid h-24 w-16 place-items-center rounded-lg text-4xl overflow-hidden shrink-0 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      {book.cover.startsWith('data:') || book.cover.startsWith('http') || book.cover.startsWith('blob:') ? (
                        <img src={book.cover} alt="" className="h-full w-full object-cover" />
                      ) : (
                        book.cover
                      )}
                    </span>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getStatusClass(book.status)}`}>{book.status}</span>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{book.available} copies</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button type="button" onClick={onOpenBookDetail} className={`line-clamp-2 text-left text-sm font-semibold leading-5 hover:underline ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{book.title}</button>
                    <p className={`mt-1.5 text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{book.author}</p>
                    <p className={`mt-1 text-xs font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>ISBN: {book.isbn}</p>
                  </div>

                  <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${getCategoryClass(book.category)}`}>{book.category}</span>
                      <BookActionsMenu isDarkMode={isDarkMode} onViewDetails={onOpenBookDetail} onEdit={() => setBookToEdit(book)} onDelete={() => setBookToDelete(book)} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
            <p>Showing 1 to {filteredBooks.length} of {filteredBooks.length} books</p>
            <div className="flex items-center gap-2">
              <select className={`h-9 rounded-lg border px-3 text-sm ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                <option>10 per page</option>
              </select>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>{'<'}</button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">1</button>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>2</button>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>3</button>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>{'>'}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
