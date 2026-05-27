import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  BookOpen,
  ChevronRight,
  Clock3,
  Edit2,
  FileText,
  Home,
  MapPin,
  Tag,
  Trash2,
  User,
  Zap,
  Archive,
  Hash
} from 'lucide-react'
import bookCoverPlaceholder from '../assets/login.avif'
import type { BookDetailData } from './BooksPage'
import { listBookBorrowTransactions, type BorrowTransaction } from '../lib/tauriApi'

type BookDetailPageProps = {
  isDarkMode: boolean
  onBack: () => void
  book: BookDetailData | null
}

type HistoryItem = {
  name: string
  initials: string
  colorClass: string
  borrowedOn: string
  dueDate: string
  returnedOn: string
  status: 'Returned' | 'Overdue'
}

export function BookDetailPage({ isDarkMode, onBack, book }: BookDetailPageProps) {
  const [history, setHistory] = useState<BorrowTransaction[]>([])
  
  useEffect(() => {
    if (book?.id) {
      listBookBorrowTransactions(book.id)
        .then(data => setHistory(data))
        .catch(err => console.error('Failed to fetch book history:', err))
    }
  }, [book?.id])

  const cardClass = isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'
  
  const coverSrc = book && (book.cover.startsWith('data:') || book.cover.startsWith('http') || book.cover.startsWith('blob:'))
    ? book.cover
    : bookCoverPlaceholder
    
  const bookTitle = book?.title ?? 'Book Details'
  const availableCount = book ? Number(book.available.split(' / ')[0] || 0) : 0
  const totalCount = book ? Number(book.available.split(' / ')[1] || 1) : 1
  const borrowedCount = totalCount - availableCount

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 md:p-6 lg:p-8 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-50/50 text-[#161a2d]'}`}>
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium">
          <button type="button" onClick={onBack} className={`flex items-center gap-1.5 transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>
            <Home size={16} />
          </button>
          <ChevronRight size={14} className={isDarkMode ? 'text-slate-600' : 'text-slate-300'} />
          <button type="button" onClick={onBack} className={`transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>
            Books
          </button>
          <ChevronRight size={14} className={isDarkMode ? 'text-slate-600' : 'text-slate-300'} />
          <span className={isDarkMode ? 'text-slate-200' : 'text-slate-900'}>{bookTitle}</span>
        </nav>

        {/* Top Hero Section */}
        <section className={`rounded-xl border ${cardClass}`}>
          <div className="grid gap-6 p-6 lg:grid-cols-[auto_1fr_auto] lg:gap-8 lg:p-8">
            {/* Cover */}
            <div className="mx-auto w-[220px] shrink-0 sm:w-[240px] lg:mx-0">
              <img 
                src={coverSrc} 
                alt={bookTitle} 
                className="aspect-[2/3] w-full rounded-2xl object-cover shadow-md"
              />
            </div>

            {/* Book Details */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{bookTitle}</h1>
                <div className="mt-4 flex items-center gap-2 text-base font-medium">
                  <User size={18} className={isDarkMode ? 'text-slate-400' : 'text-slate-400'} />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{book?.author ?? 'Unknown Author'}</span>
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Tag size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-400'} />
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Category</span>
                </div>
                <div>
                  <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${isDarkMode ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                    {book?.category ?? 'Uncategorized'}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-medium">
                  <Hash size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-400'} />
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>ISBN</span>
                </div>
                <div className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  {book?.isbn || '-'}
                </div>

                <div className="flex items-center gap-2 font-medium">
                  <MapPin size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-400'} />
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Shelf Location</span>
                </div>
                <div>
                  <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-600'}`}>
                    {book?.callNumber || '-'}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-medium">
                  <Clock3 size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-400'} />
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Status</span>
                </div>
                <div>
                  <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                    book?.isArchived
                    ? (isDarkMode ? 'bg-slate-500/30 text-slate-100' : 'bg-slate-200 text-slate-800')
                    : availableCount > 0 
                    ? (isDarkMode ? 'bg-emerald-500/25 text-emerald-100' : 'bg-emerald-100 text-emerald-800')
                    : (isDarkMode ? 'bg-rose-500/25 text-rose-100' : 'bg-rose-100 text-rose-800')
                  }`}>
                    {book?.isArchived ? 'Archived' : availableCount > 0 ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>

            {/* Copies Overview */}
            <div className="flex flex-col justify-center">
              <div className={`rounded-2xl border p-5 ${isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-100 bg-white shadow-sm'}`}>
                <h3 className="mb-4 text-base font-bold">Copies Overview</h3>
                <div className="flex gap-4">
                  <div className={`flex flex-col items-center justify-center rounded-xl border p-4 min-w-[90px] ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Copies</span>
                    <span className={`mt-2 text-2xl font-black ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>{totalCount}</span>
                  </div>
                  <div className={`flex flex-col items-center justify-center rounded-xl border p-4 min-w-[90px] ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Available</span>
                    <span className={`mt-2 text-2xl font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`}>{availableCount}</span>
                  </div>
                  <div className={`flex flex-col items-center justify-center rounded-xl border p-4 min-w-[90px] ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Borrowed</span>
                    <span className={`mt-2 text-2xl font-black ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`}>{borrowedCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lower Section (Description & History + Sidebar) */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          
          <div className="space-y-6">
            {/* Description */}
            <section className={`rounded-xl border p-6 sm:p-8 ${cardClass}`}>
              <div className="mb-4 flex items-center gap-2">
                <FileText size={20} className={isDarkMode ? 'text-slate-400' : 'text-emerald-600'} />
                <h2 className="text-lg font-bold">Description</h2>
              </div>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {bookTitle} is a young wizard who discovers his magical heritage on his eleventh birthday when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry. He then embarks on an incredible adventure with his friends, learns about the wizarding world, and faces the dark wizard who killed his parents.
              </p>
            </section>

            {/* Borrow History */}
            <section className={`rounded-xl border overflow-hidden ${cardClass}`}>
              <div className="flex items-center justify-between border-b p-6 sm:px-8 sm:py-6 text-sm font-semibold border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Clock3 size={20} className={isDarkMode ? 'text-slate-400' : 'text-emerald-600'} />
                  <h2 className="text-lg font-bold">Borrow History</h2>
                </div>
                <button type="button" className={`text-[13px] font-bold transition-colors hover:underline ${isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}>
                  View all &rarr;
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                    <tr>
                      <th className="px-4 py-3 font-semibold">Borrower</th>
                      <th className="px-4 py-3 font-semibold">Borrowed On</th>
                      <th className="px-4 py-3 font-semibold">Due Date</th>
                      <th className="px-4 py-3 font-semibold">Returned On</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                      {history.length > 0 ? history.map((log) => {
                        const initials = log.memberName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                        return (
                          <tr key={log.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {log.memberProfilePhotoData ? (
                                  <img src={log.memberProfilePhotoData} alt={log.memberName} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                                ) : (
                                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {initials}
                                  </div>
                                )}
                                <span className="font-semibold">{log.memberName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">{log.borrowDate}</td>
                            <td className="px-4 py-3">{log.dueDate}</td>
                            <td className="px-4 py-3">{log.returnDate || '—'}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                                log.status.toLowerCase() === 'returned' 
                                ? (isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-600')
                                : log.status.toLowerCase() === 'overdue'
                                ? (isDarkMode ? 'bg-rose-500/15 text-rose-300' : 'bg-rose-50 text-rose-600')
                                : (isDarkMode ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-600')
                              }`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        )
                      }) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                            No borrow history found for this book.
                          </td>
                        </tr>
                      )}
                    </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className={`rounded-xl border p-6 sm:p-8 ${cardClass}`}>
              <div className="mb-6 flex items-center gap-2">
                <Zap size={20} className={isDarkMode ? 'text-slate-400' : 'text-emerald-600'} />
                <h2 className="text-lg font-bold">Quick Actions</h2>
              </div>
              <div className="flex flex-col gap-3">
                <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700">
                  <BookOpen size={18} />
                  Borrow Book
                </button>
                <button type="button" className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-slate-700 bg-transparent hover:bg-slate-800 text-slate-200' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                  <Edit2 size={16} />
                  Edit Book
                </button>
                <button type="button" className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-slate-700 bg-transparent hover:bg-slate-800 text-slate-200' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                  <Archive size={16} />
                  Archive Book
                </button>
                <button type="button" className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-rose-900/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400' : 'border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-600'}`}>
                  <Trash2 size={16} />
                  Delete Book
                </button>
              </div>
            </section>
          </aside>

        </div>
      </div>
    </div>
  )
}
