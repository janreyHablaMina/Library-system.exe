import { useEffect, useState } from 'react'
import {
  Archive,
  ArrowLeft,
  BookCopy,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Hash,
  MapPin,
  Pencil,
  Trash2,
  User,
} from 'lucide-react'
import { DynamicBookCover } from '../components/ui/DynamicBookCover'
import { listBookBorrowTransactions, type BorrowTransaction } from '../lib/tauriApi'
import type { BookDetailData } from './BooksPage'

type BookDetailPageProps = {
  isDarkMode: boolean
  onBack: () => void
  book: BookDetailData | null
  onViewAllTransactions?: () => void
  onBorrowBook?: () => void
  onReserveBook?: () => void
  onEditBook?: () => void
  onToggleArchive?: () => Promise<void> | void
  onDeleteBook?: () => Promise<void> | void
}

function formatDate(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function BookDetailPage({
  isDarkMode,
  onBack,
  book,
  onViewAllTransactions,
  onBorrowBook,
  onReserveBook,
  onEditBook,
  onToggleArchive,
  onDeleteBook,
}: BookDetailPageProps) {
  const [history, setHistory] = useState<BorrowTransaction[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [historyPage, setHistoryPage] = useState(1)
  const [historyPerPage, setHistoryPerPage] = useState(10)

  useEffect(() => {
    if (!book?.id) return
    listBookBorrowTransactions(book.id)
      .then(setHistory)
      .catch((error) => {
        console.error('Failed to fetch book history:', error)
        setHistory([])
      })
  }, [book?.id])

  const bookTitle = book?.title ?? 'Book Details'
  const availableCount = Math.max(0, Number(book?.available.split('/')[0]?.trim() || 0))
  const totalCount = Math.max(0, Number(book?.available.split('/')[1]?.trim() || 0))
  const borrowedCount = Math.max(0, totalCount - availableCount)
  const utilization = totalCount > 0 ? Math.round((borrowedCount / totalCount) * 100) : 0
  const hasRealCover = Boolean(book?.cover && /^(data:|https?:|blob:)/.test(book.cover))
  const status = book?.isArchived ? 'Archived' : availableCount > 0 ? 'Available' : 'Fully Borrowed'
  const historyTotalPages = Math.ceil(history.length / historyPerPage)
  const safeHistoryPage = Math.min(historyPage, Math.max(1, historyTotalPages))
  const paginatedHistory = history.slice((safeHistoryPage - 1) * historyPerPage, safeHistoryPage * historyPerPage)

  const surface = isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const muted = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
  const primary = isDarkMode ? 'text-zinc-100' : 'text-zinc-900'

  const statusClass = book?.isArchived
    ? isDarkMode ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-100 text-zinc-700'
    : availableCount > 0
      ? isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
      : isDarkMode ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-50 text-amber-700'

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <div className="space-y-5 p-5">
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
          >
            <ArrowLeft size={16} />
            Back to Books
          </button>
        </header>

        <section className={`overflow-hidden rounded-2xl border ${surface}`}>
          <div className={`h-1.5 w-full ${book?.isArchived ? 'bg-zinc-400' : 'bg-emerald-500'}`} />
          <div className="grid gap-7 p-5 md:p-7 xl:grid-cols-[210px_minmax(0,1fr)_330px]">
            <div className="mx-auto h-[294px] w-[196px] overflow-hidden rounded-xl shadow-[0_20px_35px_-18px_rgba(15,23,42,0.55)] xl:mx-0">
              {hasRealCover && book ? (
                <img src={book.cover} alt={`${bookTitle} cover`} className="h-full w-full object-cover" />
              ) : (
                <DynamicBookCover title={bookTitle} author={book?.author ?? 'Unknown Author'} seed={book?.id} />
              )}
            </div>

            <div className="min-w-0 self-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>{status}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDarkMode ? 'bg-violet-500/15 text-violet-300' : 'bg-violet-50 text-violet-700'}`}>
                  {book?.category ?? 'Uncategorized'}
                </span>
              </div>

              <h2 className={`mt-4 max-w-3xl text-2xl font-bold leading-tight tracking-tight md:text-[30px] ${primary}`}>{bookTitle}</h2>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Author', value: book?.author || 'Unknown Author', icon: User },
                  { label: 'ISBN', value: book?.isbn || '-', icon: Hash },
                  { label: 'Shelf Location', value: book?.shelfLocation || '-', icon: MapPin },
                  { label: 'Publication Year', value: String(book?.year || '-'), icon: CalendarDays },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className={`flex items-start gap-3 rounded-xl border p-3.5 ${isDarkMode ? 'border-zinc-700 bg-zinc-900/30' : 'border-zinc-100 bg-zinc-50/70'}`}>
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${isDarkMode ? 'bg-zinc-800 text-emerald-400' : 'bg-white text-emerald-600'}`}>
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[11px] font-bold uppercase tracking-wide ${muted}`}>{item.label}</p>
                        <p className={`mt-1 truncate text-sm font-bold ${primary}`}>{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <aside className={`self-stretch rounded-2xl border p-5 ${isDarkMode ? 'border-zinc-700 bg-zinc-900/35' : 'border-zinc-100 bg-zinc-50/70'}`}>
              <div className="flex items-center gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                  <BookCopy size={21} />
                </div>
                <div>
                  <h3 className={`font-black ${primary}`}>Inventory Overview</h3>
                  <p className={`text-xs ${muted}`}>Current copy distribution</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { label: 'Total', value: totalCount, color: 'text-violet-500' },
                  { label: 'Available', value: availableCount, color: 'text-emerald-500' },
                  { label: 'Borrowed', value: borrowedCount, color: 'text-amber-500' },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl border px-2 py-4 text-center ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
                    <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                    <p className={`mt-1 text-[10px] font-bold uppercase tracking-wide ${muted}`}>{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs font-bold">
                  <span className={muted}>Borrowing utilization</span>
                  <span className={primary}>{utilization}%</span>
                </div>
                <div className={`h-2 overflow-hidden rounded-full ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
                  <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${utilization}%` }} />
                </div>
              </div>

              <div className={`mt-6 flex items-center gap-3 rounded-xl px-4 py-3 ${availableCount > 0 ? isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50' : isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                <CheckCircle2 size={18} className={availableCount > 0 ? 'text-emerald-500' : 'text-amber-500'} />
                <p className={`text-xs font-bold ${availableCount > 0 ? isDarkMode ? 'text-emerald-300' : 'text-emerald-700' : isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                  {availableCount > 0 ? `${availableCount} copies ready to borrow` : 'All copies are currently borrowed'}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <button
            type="button"
            onClick={onEditBook}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${isDarkMode ? 'border-blue-500/25 bg-blue-500/10 hover:bg-blue-500/15' : 'border-blue-100 bg-blue-50 hover:border-blue-200'}`}
          >
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-white text-blue-600'}`}>
              <Pencil size={20} />
            </div>
            <div>
              <p className={`font-black ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>Edit Book</p>
              <p className={`mt-0.5 text-xs ${isDarkMode ? 'text-blue-300/70' : 'text-blue-700/70'}`}>Update catalog details</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onBorrowBook}
            disabled={!book || Boolean(book.isArchived) || availableCount < 1}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? 'border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/15' : 'border-emerald-100 bg-emerald-50 hover:border-emerald-200'}`}
          >
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white text-emerald-600'}`}>
              <BookOpen size={20} />
            </div>
            <div>
              <p className={`font-black ${isDarkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>Borrow Book</p>
              <p className={`mt-0.5 text-xs ${isDarkMode ? 'text-emerald-300/70' : 'text-emerald-700/70'}`}>Open circulation with this book selected</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onReserveBook}
            disabled={!book || Boolean(book.isArchived)}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? 'border-violet-500/25 bg-violet-500/10 hover:bg-violet-500/15' : 'border-violet-100 bg-violet-50 hover:border-violet-200'}`}
          >
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${isDarkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-white text-violet-600'}`}>
              <CalendarDays size={20} />
            </div>
            <div>
              <p className={`font-black ${isDarkMode ? 'text-violet-200' : 'text-violet-800'}`}>Reserve Book</p>
              <p className={`mt-0.5 text-xs ${isDarkMode ? 'text-violet-300/70' : 'text-violet-700/70'}`}>Create a reservation for a member</p>
            </div>
          </button>

          <button
            type="button"
            onClick={async () => {
              setIsMutating(true)
              try {
                await onToggleArchive?.()
              } finally {
                setIsMutating(false)
              }
            }}
            disabled={!book || isMutating}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? 'border-amber-500/25 bg-amber-500/10 hover:bg-amber-500/15' : 'border-amber-100 bg-amber-50 hover:border-amber-200'}`}
          >
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-white text-amber-600'}`}>
              <Archive size={20} />
            </div>
            <div>
              <p className={`font-black ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>{book?.isArchived ? 'Unarchive Book' : 'Archive Book'}</p>
              <p className={`mt-0.5 text-xs ${isDarkMode ? 'text-amber-300/70' : 'text-amber-700/70'}`}>Change catalog availability</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={!book || isMutating}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? 'border-rose-500/25 bg-rose-500/10 hover:bg-rose-500/15' : 'border-rose-100 bg-rose-50 hover:border-rose-200'}`}
          >
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${isDarkMode ? 'bg-rose-500/20 text-rose-300' : 'bg-white text-rose-600'}`}>
              <Trash2 size={20} />
            </div>
            <div>
              <p className={`font-black ${isDarkMode ? 'text-rose-200' : 'text-rose-700'}`}>Delete Book</p>
              <p className={`mt-0.5 text-xs ${isDarkMode ? 'text-rose-300/70' : 'text-rose-600/70'}`}>Permanently remove record</p>
            </div>
          </button>
        </section>

        <section className={`overflow-hidden rounded-2xl border ${surface}`}>
          <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 md:px-6 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${isDarkMode ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-50 text-sky-600'}`}>
                <Clock3 size={19} />
              </div>
              <div>
                <h3 className={`font-black ${primary}`}>Borrowing History</h3>
                <p className={`text-xs ${muted}`}>{history.length} transaction{history.length === 1 ? '' : 's'} recorded</p>
              </div>
            </div>
            <button type="button" onClick={onViewAllTransactions} className="text-xs font-bold text-emerald-600 hover:underline">
              View all transactions
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className={isDarkMode ? 'bg-zinc-900/45 text-zinc-400' : 'bg-zinc-50 text-zinc-500'}>
                <tr>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide">Borrower</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Borrowed</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Due Date</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Returned</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.length > 0 ? paginatedHistory.map((log) => {
                  const initials = log.memberName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
                  const statusName = log.status.toLowerCase()
                  const badge = statusName === 'returned'
                    ? isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                    : statusName === 'overdue'
                      ? isDarkMode ? 'bg-rose-500/15 text-rose-300' : 'bg-rose-50 text-rose-700'
                      : isDarkMode ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-50 text-sky-700'
                  return (
                    <tr key={log.id} className={`border-t ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800/50' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {log.memberProfilePhotoData ? (
                            <img src={log.memberProfilePhotoData} alt="" className="h-9 w-9 rounded-full object-cover" />
                          ) : (
                            <div className={`grid h-9 w-9 place-items-center rounded-full text-xs font-black ${isDarkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>{initials}</div>
                          )}
                          <div>
                            <p className={`font-bold ${primary}`}>{log.memberName}</p>
                            <p className={`text-xs ${muted}`}>{log.memberCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-4 ${muted}`}>{formatDate(log.borrowDate)}</td>
                      <td className={`px-4 py-4 ${muted}`}>{formatDate(log.dueDate)}</td>
                      <td className={`px-4 py-4 ${muted}`}>{formatDate(log.returnDate)}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badge}`}>{log.status}</span>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center">
                      <BookOpen size={28} className={`mx-auto ${muted}`} />
                      <p className={`mt-3 text-sm font-bold ${primary}`}>No borrowing history yet</p>
                      <p className={`mt-1 text-xs ${muted}`}>Transactions for this title will appear here.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm ${isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-600'}`}>
            <p>
              Showing {history.length > 0 ? (safeHistoryPage - 1) * historyPerPage + 1 : 0} to {Math.min(safeHistoryPage * historyPerPage, history.length)} of {history.length} transactions
            </p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={historyPerPage}
                  onChange={(event) => {
                    setHistoryPerPage(Number(event.target.value))
                    setHistoryPage(1)
                  }}
                  className={`h-10 min-w-[150px] appearance-none rounded-lg border py-2 pl-4 pr-10 text-sm font-medium outline-none transition-colors ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200 hover:bg-zinc-800 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus:border-emerald-500'}`}
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${muted}`} />
              </div>
              <button
                type="button"
                onClick={() => setHistoryPage((page) => Math.max(1, page - 1))}
                disabled={safeHistoryPage === 1}
                className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800 disabled:text-zinc-600' : 'border-zinc-200 hover:bg-zinc-50 disabled:text-zinc-300'}`}
                aria-label="Previous history page"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: historyTotalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setHistoryPage(page)}
                    className={page === safeHistoryPage
                      ? 'grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                      : `grid h-10 w-10 place-items-center rounded-lg border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setHistoryPage((page) => Math.min(historyTotalPages, page + 1))}
                disabled={safeHistoryPage === historyTotalPages || historyTotalPages === 0}
                className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800 disabled:text-zinc-600' : 'border-zinc-200 hover:bg-zinc-50 disabled:text-zinc-300'}`}
                aria-label="Next history page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${surface}`}>
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rose-500/10 text-rose-500">
                <Trash2 size={21} />
              </div>
              <div>
                <h3 className={`text-lg font-black ${primary}`}>Delete Book</h3>
                <p className={`mt-2 text-sm leading-6 ${muted}`}>
                  Delete <span className="font-bold text-rose-500">"{bookTitle}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className={`h-10 rounded-xl border px-4 text-sm font-bold ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>Cancel</button>
              <button
                type="button"
                disabled={isMutating}
                onClick={async () => {
                  setIsMutating(true)
                  try {
                    await onDeleteBook?.()
                    setShowDeleteConfirm(false)
                  } finally {
                    setIsMutating(false)
                  }
                }}
                className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {isMutating ? 'Deleting...' : 'Yes, Delete Book'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
