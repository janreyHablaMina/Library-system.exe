import { Toast } from '../components/ui/Toast'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpen, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Clock3, Download, Filter, Grid2x2,
  List, MoreHorizontal, RotateCcw, Search,
  Eye, Pencil, BookMarked, Trash2, AlertTriangle, X, Archive
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
  shelfLocation: string
  callNumber: string
  year: number
  status: BookStatus
  available: string
  borrowedCopies?: number
  isArchived?: boolean
}

export type BookDetailData = BookRow

type BooksPageProps = {
  isDarkMode: boolean
  onOpenBookDetail: (book: BookDetailData) => void
  onOpenAddBook: () => void
  refreshKey?: number
  externalToastMessage?: string | null
}

const initialBooks: BookRow[] = [
  { id: 1, cover: '📚', title: 'Sosyolohiya sa Filipino', isbn: '978-621-455-010-2', author: 'Kahayon, Alicia H.', category: 'Social Sciences', shelfLocation: '300.72 KAH', callNumber: '300.72 KAH', year: 2021, status: 'Available', available: '5 / 7' },
  { id: 2, cover: '📕', title: 'Understanding Philippine Social Realities through the Filipino Family', isbn: '978-971-009-123-4', author: 'Ramirez, Mina M.', category: 'Social Sciences', shelfLocation: '305.23 RAM', callNumber: '305.23 RAM', year: 2020, status: 'Borrowed', available: '1 / 3' },
  { id: 3, cover: '📘', title: 'The Conjugal Dictatorship of Ferdinand and Imelda Marcos I', isbn: '978-971-555-001-1', author: 'Mijares, Primitivo', category: 'History', shelfLocation: '959.904 MIJ', callNumber: '959.904 MIJ', year: 2018, status: 'Available', available: '2 / 4' },
  { id: 4, cover: '📗', title: 'Filipino Values Today', isbn: '978-971-100-456-7', author: 'Timberza, Florentino T.', category: 'Education', shelfLocation: '370.115 TIM', callNumber: '370.115 TIM', year: 2019, status: 'Available', available: '3 / 5' },
  { id: 5, cover: '📙', title: 'The Fateful Years', isbn: '978-621-455-789-6', author: 'Agoncillo, Teodoro A.', category: 'History', shelfLocation: '959.902 AGO', callNumber: '959.902 AGO', year: 2017, status: 'Overdue', available: '0 / 2' },
  { id: 6, cover: '📙', title: 'Philippine Constitution Explained', isbn: '978-971-888-777-1', author: 'De Vera, Hector S.', category: 'Law', shelfLocation: '342.59903 DEV', callNumber: '342.59903 DEV', year: 2022, status: 'Available', available: '4 / 6' },
  { id: 7, cover: '📚', title: 'The Life and Works of Jose Rizal', isbn: '978-971-245-678-3', author: 'Tellos, Ricardo', category: 'Biography', shelfLocation: '920 RIZ', callNumber: '920 RIZ', year: 2016, status: 'Borrowed', available: '1 / 2' },
  { id: 8, cover: '📓', title: 'Introduction to Library Science', isbn: '978-971-333-222-8', author: 'Villanueva, Ma. Teresa', category: 'Library Science', shelfLocation: '025.1 VIL', callNumber: '025.1 VIL', year: 2021, status: 'Available', available: '6 / 8' },
  { id: 9, cover: '📘', title: 'The Philippine Islands, 1493-1898', isbn: '978-971-555-025-7', author: 'Blair, Emma Helen', category: 'History', shelfLocation: '959.9 BLA', callNumber: '959.9 BLA', year: 2015, status: 'Archived', available: '0 / 5' },
  { id: 10, cover: '📚', title: 'Florante at Laura', isbn: '978-971-08-6047-0', author: 'Balagtas, Francisco', category: 'Fiction', shelfLocation: '899.211 BAL', callNumber: '899.211 BAL', year: 2019, status: 'Available', available: '7 / 7' },
  { id: 11, cover: '📗', title: 'Noli Me Tangere', isbn: '978-971-08-6046-3', author: 'Rizal, Jose', category: 'Fiction', shelfLocation: '899.211 RIZ', callNumber: '899.211 RIZ', year: 2018, status: 'Borrowed', available: '2 / 5' },
  { id: 12, cover: '📕', title: 'Web Development with React and Node', isbn: '978-1-80181-234-5', author: 'Freeman, Adam', category: 'Technology', shelfLocation: '005.276 FRE', callNumber: '005.276 FRE', year: 2022, status: 'Available', available: '3 / 3' },
]

function getStatusClass(status: BookStatus, isDarkMode: boolean) {
  if (status === 'Available') {
    return isDarkMode
      ? 'bg-emerald-500/25 text-emerald-100 border border-emerald-500/30'
      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
  }
  if (status === 'Borrowed') {
    return isDarkMode
      ? 'bg-amber-500/25 text-amber-100 border border-amber-500/30'
      : 'bg-amber-100 text-amber-800 border border-amber-200'
  }
  if (status === 'Archived') {
    return isDarkMode
      ? 'bg-zinc-500/30 text-zinc-100 border border-zinc-500/30'
      : 'bg-zinc-200 text-zinc-800 border border-zinc-300'
  }
  return isDarkMode
    ? 'bg-rose-500/25 text-rose-100 border border-rose-500/30'
    : 'bg-rose-100 text-rose-800 border border-rose-200'
}

// ─── Book Actions Dropdown Menu ───────────────────────────────────────────────
type BookActionsMenuProps = {
  isDarkMode: boolean
  isArchived: boolean
  onViewDetails: () => void
  onEdit: () => void
  onDelete: () => void
  onArchive: () => void
}

function BookActionsMenu({ isDarkMode, isArchived, onViewDetails, onEdit, onDelete, onArchive }: BookActionsMenuProps) {
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
    ? 'bg-[#18181B] border-zinc-700 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
    : 'bg-white border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'

  const itemBase =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-100 text-left'
  const itemNormal = isDarkMode
    ? 'text-zinc-200 hover:bg-zinc-800'
    : 'text-zinc-700 hover:bg-zinc-50'
  const itemDanger = isDarkMode
    ? 'text-rose-400 hover:bg-rose-500/10'
    : 'text-rose-600 hover:bg-rose-50'
  const divider = isDarkMode ? 'border-zinc-700/60' : 'border-zinc-100'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id={`book-actions-btn-${Math.random()}`}
        onClick={handleToggle}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 ${
          open
            ? isDarkMode
              ? 'border-zinc-500 bg-zinc-700 text-zinc-100'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : isDarkMode
              ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
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
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={() => { setOpen(false); onArchive(); }}
          >
            <Archive size={15} className="shrink-0 text-amber-500" />
            {isArchived ? 'Unarchive Book' : 'Archive Book'}
          </button>
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
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)
  const [selectedBookIds, setSelectedBookIds] = useState<Set<number>>(() => new Set())
  const selectAllRef = useRef<HTMLInputElement>(null)
  
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
          category: row.category ?? 'Uncategorized',
          shelfLocation: row.shelfLocation ?? '-',
          callNumber: row.shelfLocation ?? '-',
          year: new Date(row.createdAt).getFullYear() || new Date().getFullYear(),
          status: row.isArchived ? 'Archived' : (row.available > 0 ? 'Available' : 'Borrowed'),
          available: `${row.available} / ${row.totalCopies}`,
          borrowedCopies: Math.max(0, row.totalCopies - row.available),
          isArchived: row.isArchived,
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

  // Dynamically compute unique categories and authors
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(bookList.map(b => b.category))).filter(Boolean).sort()
  }, [bookList])

  const uniqueAuthors = useMemo(() => {
    return Array.from(new Set(bookList.map(b => b.author))).filter(Boolean).sort()
  }, [bookList])
  const [activeStatTab, setActiveStatTab] = useState<'All Books' | 'Available' | 'Borrowed' | 'Overdue' | 'Archived'>('All Books')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedAuthor, activeStatTab, itemsPerPage])


  // Filter dynamic helper
  const filteredBooks = bookList.filter((book) => {
    const [availableCopies = 0, totalCopies = 0] = book.available.split('/').map((value) => Number(value.trim()) || 0)
    const borrowedCopies = book.borrowedCopies ?? Math.max(0, totalCopies - availableCopies)

    // 1. Stat Tab Filter
    if (activeStatTab === 'Available' && (book.isArchived || availableCopies < 1)) return false
    if (activeStatTab === 'Borrowed' && (book.isArchived || borrowedCopies < 1)) return false
    if (activeStatTab === 'Overdue' && book.status !== 'Overdue') return false
    if (activeStatTab === 'Archived' && book.status !== 'Archived') return false
    if (activeStatTab === 'All Books' && book.status === 'Archived') {
      return false
    }

    // 3. Category Dropdown
    if (selectedCategory !== 'All' && book.category !== selectedCategory) return false

    // 4. Author Dropdown
    if (selectedAuthor !== 'All' && book.author !== selectedAuthor) return false

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

  const getBookCopyCounts = (book: BookRow) => {
    const [availableCopies = 0, totalCopies = 0] = book.available.split('/').map((value) => Number(value.trim()) || 0)
    return {
      availableCopies,
      totalCopies,
      borrowedCopies: book.borrowedCopies ?? Math.max(0, totalCopies - availableCopies),
    }
  }

  const getDisplayedStatus = (book: BookRow): BookStatus => {
    if (book.isArchived) return 'Archived'
    if (activeStatTab === 'Borrowed') return 'Borrowed'
    if (activeStatTab === 'Overdue') return 'Overdue'
    if (activeStatTab === 'Available') return 'Available'
    return book.status
  }

  const getDisplayedCopies = (book: BookRow) => {
    const counts = getBookCopyCounts(book)
    if (activeStatTab === 'Borrowed') return `${counts.borrowedCopies} / ${counts.totalCopies}`
    return `${counts.availableCopies} / ${counts.totalCopies}`
  }

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const paginatedBookIds = paginatedBooks.map((book) => book.id)
  const selectedCount = selectedBookIds.size
  const allPageBooksSelected = paginatedBookIds.length > 0 && paginatedBookIds.every((id) => selectedBookIds.has(id))
  const somePageBooksSelected = paginatedBookIds.some((id) => selectedBookIds.has(id))

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = somePageBooksSelected && !allPageBooksSelected
    }
  }, [allPageBooksSelected, somePageBooksSelected])

  useEffect(() => {
    setSelectedBookIds((prev) => {
      const existingIds = new Set(bookList.map((book) => book.id))
      const next = new Set([...prev].filter((id) => existingIds.has(id)))
      return next.size === prev.size ? prev : next
    })
  }, [bookList])

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setSelectedAuthor('All')
    setActiveStatTab('All Books')
  }

  const handleExportBooks = () => {
    if (filteredBooks.length === 0) {
      setShowToast('No books match the current filters.')
      return
    }

    const escapeCsvValue = (value: string | number) => {
      const text = String(value)
      return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
    }

    const headers = [
      'ID',
      'Title',
      'Author',
      'ISBN',
      'Category',
      'Shelf Location',
      'Call Number',
      'Year',
      'Status',
      'Available Copies',
      'Borrowed Copies',
      'Total Copies',
    ]
    const rows = filteredBooks.map((book) => {
      const [availableCopies = '', totalCopies = ''] = book.available.split('/').map((value) => value.trim())
      return [
        book.id,
        book.title,
        book.author,
        book.isbn,
        book.category,
        book.shelfLocation,
        book.callNumber,
        book.year,
        book.status,
        availableCopies,
        Math.max(0, Number(totalCopies) - Number(availableCopies)),
        totalCopies,
      ].map(escapeCsvValue).join(',')
    })
    const csv = `\uFEFF${headers.map(escapeCsvValue).join(',')}\r\n${rows.join('\r\n')}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)

    link.href = url
    link.download = `books-export-${date}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setShowToast(`Exported ${filteredBooks.length} book${filteredBooks.length === 1 ? '' : 's'} to CSV.`)
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

  const handleTogglePageSelection = () => {
    setSelectedBookIds((prev) => {
      const next = new Set(prev)
      if (allPageBooksSelected) {
        paginatedBookIds.forEach((id) => next.delete(id))
      } else {
        paginatedBookIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  const handleToggleBookSelection = (bookId: number) => {
    setSelectedBookIds((prev) => {
      const next = new Set(prev)
      if (next.has(bookId)) {
        next.delete(bookId)
      } else {
        next.add(bookId)
      }
      return next
    })
  }

  const handleBulkArchive = async () => {
    const selectedBooks = bookList.filter((book) => selectedBookIds.has(book.id))
    if (selectedBooks.length === 0) return

    await Promise.all(selectedBooks.map((book) => updateBook({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category === 'Uncategorized' ? null : book.category,
      isbn: book.isbn === '-' ? null : book.isbn,
      coverData: book.cover.startsWith('data:') ? book.cover : null,
      available: Number(book.available.split(' / ')[0] || '0'),
      totalCopies: Number(book.available.split(' / ')[1] || '1'),
      isArchived: true,
    })))

    setBookList(prev => prev.map(book => selectedBookIds.has(book.id) ? { ...book, status: 'Archived', isArchived: true } : book))
    setShowToast(`Successfully archived ${selectedBooks.length} selected book${selectedBooks.length === 1 ? '' : 's'}`)
    setSelectedBookIds(new Set())
  }

  const handleBulkDeleteConfirm = async () => {
    const selectedBooks = bookList.filter((book) => selectedBookIds.has(book.id))
    if (selectedBooks.length === 0) return

    await Promise.all(selectedBooks.map((book) => deleteBook(book.id)))
    setBookList(prev => prev.filter(book => !selectedBookIds.has(book.id)))
    setShowToast(`Successfully deleted ${selectedBooks.length} selected book${selectedBooks.length === 1 ? '' : 's'}`)
    setSelectedBookIds(new Set())
    setShowBulkDeleteConfirm(false)
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
            shelfLocation: updatedBook.callNumber,
            callNumber: updatedBook.callNumber,
            status: updatedBook.status as BookStatus,
            borrowedCopies: Math.max(
              0,
              Number(updatedBook.available.split(' / ')[1] || '0') - Number(updatedBook.available.split(' / ')[0] || '0'),
            ),
          }
          const persist = async () => {
            try {
              await updateBook({
                id: normalizedBook.id,
                title: normalizedBook.title,
                author: normalizedBook.author,
                category: normalizedBook.category === 'Uncategorized' ? null : normalizedBook.category,
                isbn: normalizedBook.isbn === '-' ? null : normalizedBook.isbn,
                coverData: normalizedBook.cover.startsWith('data:') ? normalizedBook.cover : null,
                available: Number(normalizedBook.available.split(' / ')[0] || '0'),
                totalCopies: Number(normalizedBook.available.split(' / ')[1] || '1'),
                isArchived: normalizedBook.status === 'Archived',
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

  const cardClass = isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <Toast message={showToast} onClose={() => setShowToast(null)} isDarkMode={isDarkMode} />

      {/* Styled Confirmation Modal (Delete) */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${cardClass}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-6">Delete Book</h3>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
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
                    ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
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

      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${cardClass}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-6">Delete Selected Books</h3>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Delete {selectedCount} selected book{selectedCount === 1 ? '' : 's'}? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(false)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
                  isDarkMode
                    ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDeleteConfirm}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Yes, Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Books</h2>
            <p className={`mt-1 text-base ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Manage all library books and materials</p>
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
            <button type="button" onClick={handleExportBooks} className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
              <Download size={15} />
              Export
            </button>
          </div>
        </div>

        <div className={`mt-5 overflow-x-auto rounded-xl border ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
          <div className={`flex min-w-[880px] items-center gap-2 px-3 py-3 ${isDarkMode ? 'bg-[#18181B]' : 'bg-white'}`}>
            {[
              { label: 'All Books', value: String(bookList.filter(b => b.status !== 'Archived').length), icon: BookOpen },
              { label: 'Available', value: String(bookList.filter((book) => !book.isArchived && getBookCopyCounts(book).availableCopies > 0).length), icon: Bookmark },
              { label: 'Borrowed', value: String(bookList.filter((book) => !book.isArchived && getBookCopyCounts(book).borrowedCopies > 0).length), icon: RotateCcw },
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
                        ? 'border border-zinc-700 bg-[#27272A] text-zinc-300 hover:bg-zinc-800'
                        : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <ItemIcon size={15} />
                  {item.label}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-emerald-500 text-white' : isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                    {item.value}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={`mt-4 overflow-hidden lg:overflow-visible rounded-xl border ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
          <div className={`flex flex-wrap items-center gap-3 border-b p-3 rounded-t-xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <label className={`group flex h-11 min-w-[280px] flex-1 items-center rounded-xl border px-3 ${isDarkMode ? 'border-zinc-700 focus-within:border-emerald-500' : 'border-zinc-200 focus-within:border-emerald-500'}`}>
              <Search size={16} className={`mr-2 ${isDarkMode ? 'text-zinc-500 group-focus-within:text-emerald-400' : 'text-zinc-400 group-focus-within:text-emerald-600'}`} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400'}`}
                placeholder="Search by title, author, ISBN, or call number..."
              />
            </label>
            
            {/* Category Select */}
            <div className="relative">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`h-11 appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm outline-none min-w-[150px] max-w-[200px] truncate ${
                  isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'
                }`}
              >
                <option value="All">Category: All</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
            </div>

            {/* Author Select */}
            <div className="relative">
              <select 
                value={selectedAuthor} 
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className={`h-11 appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm outline-none min-w-[160px] max-w-[200px] truncate ${
                  isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'
                }`}
              >
                <option value="All">Author: All</option>
                {uniqueAuthors.map(auth => (
                  <option key={auth} value={auth}>{auth}</option>
                ))}
              </select>
              <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
            </div>
            <button 
              type="button" 
              onClick={handleResetFilters}
              className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors duration-150 ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
            >
              <RotateCcw size={15} />
              Reset
            </button>
            <div className="ml-auto flex gap-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`grid h-11 w-11 place-items-center rounded-xl ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : isDarkMode ? 'border border-zinc-700 text-zinc-300' : 'border border-zinc-200 text-zinc-600'}`}
              >
                <List size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`grid h-11 w-11 place-items-center rounded-xl ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : isDarkMode ? 'border border-zinc-700 text-zinc-300' : 'border border-zinc-200 text-zinc-600'}`}
              >
                <Grid2x2 size={16} />
              </button>
            </div>
          </div>

          {selectedCount > 0 && (
            <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 ${
              isDarkMode ? 'border-zinc-700 bg-emerald-500/10 text-zinc-200' : 'border-zinc-200 bg-emerald-50 text-zinc-700'
            }`}>
              <p className="text-sm font-semibold">{selectedCount} selected</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleBulkArchive}
                  className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${
                    isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <Archive size={15} />
                  Archive
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkDeleteConfirm(true)}
                  className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${
                    isDarkMode ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20' : 'border-rose-200 bg-white text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <Trash2 size={15} />
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBookIds(new Set())}
                  className={`grid h-9 w-9 place-items-center rounded-lg border ${
                    isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
                  aria-label="Clear selection"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          )}

          {viewMode === 'list' ? (
            <div className={`relative z-10 ${isDarkMode ? 'overflow-x-auto lg:overflow-visible bg-[#18181B]' : 'overflow-x-auto lg:overflow-visible bg-white'}`}>
              <table className="min-w-[980px] w-full text-left text-sm">
                <thead className={isDarkMode ? 'bg-[#27272A] text-zinc-300' : 'bg-zinc-50 text-zinc-600'}>
                  <tr>
                    <th className="px-4 py-3 font-semibold">
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        className="app-choice-input"
                        checked={allPageBooksSelected}
                        onChange={handleTogglePageSelection}
                        aria-label="Select all books on this page"
                      />
                    </th>
                    <th className="px-3 py-3 font-semibold">Book</th>
                    <th className="px-3 py-3 font-semibold">Author</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">{activeStatTab === 'Borrowed' ? 'Borrowed Copies' : 'Available Copies'}</th>
                    <th className="px-3 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((book) => (
                    <tr key={book.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-zinc-700 hover:bg-[#3F3F46]' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                      <td className="px-4 py-3 align-top">
                        <input
                          type="checkbox"
                          className="app-choice-input"
                          checked={selectedBookIds.has(book.id)}
                          onChange={() => handleToggleBookSelection(book.id)}
                          aria-label={`Select ${book.title}`}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-start gap-3">
                          <span className={`grid h-12 w-9 place-items-center rounded text-xl overflow-hidden shrink-0 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                            {book.cover.startsWith('data:') || book.cover.startsWith('http') || book.cover.startsWith('blob:') ? (
                              <img src={book.cover} alt="" className="h-full w-full object-cover" />
                            ) : (
                              book.cover
                            )}
                          </span>
                          <div>
                            <button type="button" onClick={() => onOpenBookDetail(book)} className={`text-left font-semibold hover:underline ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{book.title}</button>
                            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>ISBN: {book.isbn}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-3 py-3 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{book.author}</td>
                      <td className="px-3 py-3">
                        <span className={`text-sm ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{book.category}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(getDisplayedStatus(book), isDarkMode)}`}>{getDisplayedStatus(book)}</span>
                      </td>
                      <td className={`px-3 py-3 font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{getDisplayedCopies(book)}</td>
                      <td className="px-3 py-3 text-right">
                        <BookActionsMenu isDarkMode={isDarkMode} isArchived={Boolean(book.isArchived)} onViewDetails={() => onOpenBookDetail(book)} onEdit={() => setBookToEdit(book)} onDelete={() => setBookToDelete(book)} onArchive={async () => {
                          try {
                            const nextArchived = !book.isArchived
                            const availableCopies = Number(book.available.split(' / ')[0] || '0')
                            await updateBook({
                              id: book.id,
                              title: book.title,
                              author: book.author,
                              category: book.category === 'Uncategorized' ? null : book.category,
                              isbn: book.isbn === '-' ? null : book.isbn,
                              coverData: book.cover.startsWith('data:') ? book.cover : null,
                              available: availableCopies,
                              totalCopies: Number(book.available.split(' / ')[1] || '1'),
                              isArchived: nextArchived,
                            })
                            setBookList(prev => prev.map(b => b.id === book.id ? {
                              ...b,
                              status: nextArchived ? 'Archived' : (availableCopies > 0 ? 'Available' : 'Borrowed'),
                              isArchived: nextArchived,
                            } : b))
                            setShowToast(`Successfully ${nextArchived ? 'archived' : 'unarchived'} "${book.title}"`)
                          } catch (error) {
                            console.error('Failed to update book archive status:', error)
                            setShowToast('Failed to update the book archive status.')
                          }
                        }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 ${isDarkMode ? 'bg-[#18181B]' : 'bg-white'}`}>
              {paginatedBooks.map((book) => (
                <article key={book.id} className={`flex h-full flex-col rounded-xl border p-3 ${
                  isDarkMode
                    ? 'border-zinc-700 bg-[#18181B]'
                    : 'border-zinc-200 bg-white'
                }`}>
                  <div className="flex items-start justify-between">
                    <span className={`grid h-24 w-16 place-items-center rounded-lg text-4xl overflow-hidden shrink-0 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                      {book.cover.startsWith('data:') || book.cover.startsWith('http') || book.cover.startsWith('blob:') ? (
                        <img src={book.cover} alt="" className="h-full w-full object-cover" />
                      ) : (
                        book.cover
                      )}
                    </span>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getStatusClass(getDisplayedStatus(book), isDarkMode)}`}>{getDisplayedStatus(book)}</span>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        {getDisplayedCopies(book)} {activeStatTab === 'Borrowed' ? 'borrowed' : 'available'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button type="button" onClick={() => onOpenBookDetail(book)} className={`line-clamp-2 text-left text-sm font-semibold leading-5 hover:underline ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{book.title}</button>
                    <p className={`mt-1.5 text-xs font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{book.author}</p>
                    <p className={`mt-1 text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>ISBN: {book.isbn}</p>
                  </div>

                  <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{book.category}</span>
                      <BookActionsMenu isDarkMode={isDarkMode} isArchived={Boolean(book.isArchived)} onViewDetails={() => onOpenBookDetail(book)} onEdit={() => setBookToEdit(book)} onDelete={() => setBookToDelete(book)} onArchive={async () => {
                        try {
                          const nextArchived = !book.isArchived
                          const availableCopies = Number(book.available.split(' / ')[0] || '0')
                          await updateBook({
                            id: book.id,
                            title: book.title,
                            author: book.author,
                            category: book.category === 'Uncategorized' ? null : book.category,
                            isbn: book.isbn === '-' ? null : book.isbn,
                            coverData: book.cover.startsWith('data:') ? book.cover : null,
                            available: availableCopies,
                            totalCopies: Number(book.available.split(' / ')[1] || '1'),
                            isArchived: nextArchived,
                          })
                          setBookList(prev => prev.map(b => b.id === book.id ? {
                            ...b,
                            status: nextArchived ? 'Archived' : (availableCopies > 0 ? 'Available' : 'Borrowed'),
                            isArchived: nextArchived,
                          } : b))
                          setShowToast(`Successfully ${nextArchived ? 'archived' : 'unarchived'} "${book.title}"`)
                        } catch (error) {
                          console.error('Failed to update book archive status:', error)
                          setShowToast('Failed to update the book archive status.')
                        }
                      }} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className={`relative z-0 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-600'}`}>
            <p>Showing {filteredBooks.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredBooks.length)} of {filteredBooks.length} books</p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className={`h-10 min-w-[150px] appearance-none rounded-lg border py-2 pl-4 pr-10 text-sm font-medium outline-none transition-colors ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200 hover:bg-zinc-800 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus:border-emerald-500'}`}>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:border-zinc-800 disabled:text-zinc-600 disabled:hover:bg-transparent'
                    : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:border-zinc-100 disabled:text-zinc-300 disabled:hover:bg-white'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    type="button" 
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage 
                      ? "grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" 
                      : `grid h-10 w-10 place-items-center rounded-lg border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:border-zinc-800 disabled:text-zinc-600 disabled:hover:bg-transparent'
                    : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:border-zinc-100 disabled:text-zinc-300 disabled:hover:bg-white'
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


