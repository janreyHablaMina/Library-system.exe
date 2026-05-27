import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, ArrowLeft, BookMarked, BookOpen, Calendar, Clock, Copy, Eye, Feather, Globe, Mail, MoreHorizontal, Pencil, Quote, RefreshCw, Trash2, UserCheck, Archive } from 'lucide-react'
import { deleteBook, listAuthors, listBooks, updateBook, type Author as DbAuthor, type Book } from '../lib/tauriApi'
import bookCover from '../assets/login.avif'
import { EditBookPage } from './EditBookPage'
import { BookDetailPage } from './BookDetailPage'

type Props = {
  isDarkMode: boolean
  onBack: () => void
  authorId?: number
}

export function AuthorDetailPage({ isDarkMode, onBack, authorId }: Props) {
  const [author, setAuthor] = useState<DbAuthor | null>(null)
  const [works, setWorks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showToast, setShowToast] = useState<string | null>(null)
  const [bookToEdit, setBookToEdit] = useState<BookRow | null>(null)
  const [bookToView, setBookToView] = useState<BookRow | null>(null)
  const [bookToDelete, setBookToDelete] = useState<BookRow | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const [rows, books] = await Promise.all([listAuthors(1000), listBooks(500)])
        const found = typeof authorId === 'number' ? rows.find((row) => row.id === authorId) ?? null : null
        if (mounted) {
          setAuthor(found)
          if (found) {
            const normalized = found.name.trim().toLowerCase()
            setWorks(books.filter((book) => book.author.trim().toLowerCase() === normalized))
          } else {
            setWorks([])
          }
        }
      } catch {
        if (mounted) {
          setAuthor(null)
          setWorks([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [authorId])

  const detail = useMemo(() => {
    if (!author) {
      return {
        name: 'Unknown Author',
        email: 'n/a',
        nationality: 'Unknown',
        dob: 'N/A',
        status: 'Active',
        biography: 'No biography available.',
        createdAt: 'N/A',
        avatar: 'A',
        profilePhotoData: null as string | null,
      }
    }
    return {
      name: author.name,
      email: author.email || 'n/a',
      nationality: author.nationality || 'Unknown',
      dob: author.dob
        ? new Date(author.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'N/A',
      status: author.status || 'Active',
      biography: author.biography || 'No biography available.',
      createdAt: author.createdAt
        ? new Date(author.createdAt).toLocaleString('en-US')
        : 'N/A',
      avatar: author.name.charAt(0).toUpperCase() || 'A',
      profilePhotoData: author.profilePhotoData || null,
    }
  }, [author])

  const copyAuthorName = async () => {
    await navigator.clipboard.writeText(detail.name)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const handleDeleteWork = async (book: Book) => {
    try {
      await deleteBook(book.id)
      setWorks((prev) => prev.filter((item) => item.id !== book.id))
      setShowToast(`Successfully deleted "${book.title}"`)
      setTimeout(() => setShowToast(null), 2200)
    } catch {
      setShowToast('Failed to delete book. Please try again.')
      setTimeout(() => setShowToast(null), 2200)
    }
  }

  const toBookRow = (book: Book): BookRow => ({
    id: book.id,
    cover: book.coverData || bookCover,
    title: book.title,
    isbn: book.isbn || '-',
    author: book.author,
    category: 'Uncategorized',
    callNumber: '-',
    year: new Date(book.createdAt).getFullYear() || new Date().getFullYear(),
    status: book.isArchived ? 'Archived' : (book.available > 0 ? 'Available' : 'Borrowed'),
    available: `${book.available} / ${book.totalCopies}`,
    isArchived: book.isArchived,
  })

  const refreshWorks = async () => {
    try {
      const [rows, books] = await Promise.all([listAuthors(1000), listBooks(500)])
      const found = typeof authorId === 'number' ? rows.find((row) => row.id === authorId) ?? null : null
      setAuthor(found)
      if (found) {
        const normalized = found.name.trim().toLowerCase()
        setWorks(books.filter((book) => book.author.trim().toLowerCase() === normalized))
      } else {
        setWorks([])
      }
    } catch {
      setWorks([])
    }
  }

  if (bookToView) {
    return (
      <BookDetailPage
        isDarkMode={isDarkMode}
        onBack={() => setBookToView(null)}
        book={bookToView}
      />
    )
  }

  if (bookToEdit) {
    return (
      <EditBookPage
        book={bookToEdit}
        isDarkMode={isDarkMode}
        onBack={() => setBookToEdit(null)}
        onSave={(updatedBook) => {
          const persist = async () => {
            try {
              await updateBook({
                id: updatedBook.id,
                title: updatedBook.title,
                author: updatedBook.author,
                category: updatedBook.category === 'Uncategorized' ? null : updatedBook.category,
                isbn: updatedBook.isbn === '-' ? null : updatedBook.isbn,
                coverData: updatedBook.cover.startsWith('data:') ? updatedBook.cover : null,
                available: Number(updatedBook.available.split(' / ')[0] || '0'),
                totalCopies: Number(updatedBook.available.split(' / ')[1] || '1'),
              })
              await refreshWorks()
              setShowToast(`Successfully updated "${updatedBook.title}"`)
            } catch {
              setShowToast('Failed to update book.')
            } finally {
              setBookToEdit(null)
            }
          }
          void persist()
        }}
      />
    )
  }

  const cardClass = isDarkMode
    ? 'rounded-2xl border border-slate-800 bg-[#0f172a]/80'
    : 'rounded-2xl border border-slate-200 bg-white'

  return (
    <div className={`flex-1 overflow-y-auto min-h-0 w-full ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      {showToast ? (
        <div className="fixed top-4 right-4 z-[120] rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {showToast}
        </div>
      ) : null}
      {bookToDelete ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
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
                onClick={() => {
                  const current = works.find((item) => item.id === bookToDelete.id)
                  if (!current) {
                    setBookToDelete(null)
                    return
                  }
                  void handleDeleteWork(current)
                  setBookToDelete(null)
                }}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Yes, Delete Book
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="max-w-[1600px] mx-auto p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <button onClick={onBack} className={`inline-flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
            <ArrowLeft size={16} />
            Back to Authors
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold">
            <Pencil size={15} />
            Edit Author
          </button>
        </div>

        <section className={cardClass}>
          <div className="p-6 xl:p-8 grid grid-cols-1 xl:grid-cols-[1.33fr_1fr_1fr] gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-8 min-w-0">
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className={`h-32 w-32 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  {detail.profilePhotoData ? (
                    <img src={detail.profilePhotoData} alt={detail.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-4xl font-bold">{detail.avatar}</div>
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className={`text-[35px] font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{detail.name}</h2>
                {loading ? <p className={`mt-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Loading author details...</p> : null}
                <div className="mt-1 flex items-center gap-2">
                  <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Author Profile</p>
                  <button onClick={copyAuthorName} className={isDarkMode ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-500 hover:text-emerald-600'}>
                    <Copy size={13} />
                  </button>
                  {copied ? <span className="text-xs text-emerald-500">Copied</span> : null}
                </div>
                <div className={`mt-5 space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <p className="flex items-center gap-2.5"><Mail size={15} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />{detail.email}</p>
                  <p className="flex items-center gap-2.5"><Globe size={15} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />{detail.nationality}</p>
                </div>
              </div>
            </div>

            <div className={`space-y-4 xl:px-8 ${isDarkMode ? 'xl:border-x xl:border-slate-800' : 'xl:border-x xl:border-slate-200'}`}>
              <Meta icon={<BookOpen size={15} className="text-emerald-500" />} label="Books Published" value="0" isDarkMode={isDarkMode} />
              <Meta icon={<Calendar size={15} className="text-emerald-500" />} label="Date of Birth" value={detail.dob} isDarkMode={isDarkMode} />
              <Meta icon={<UserCheck size={15} className="text-emerald-500" />} label="Status" value={detail.status} isDarkMode={isDarkMode} asBadge />
            </div>

            <div className="space-y-4">
              <Meta icon={<Clock size={15} className="text-emerald-500" />} label="Record Created" value={detail.createdAt} isDarkMode={isDarkMode} />
              <Meta icon={<RefreshCw size={15} className="text-emerald-500" />} label="Last Updated" value="Synced from database" isDarkMode={isDarkMode} />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4">
          <div className={cardClass}>
            <div className={`px-5 py-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`text-[28px] font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Biography</h3>
              <div className="mt-2 h-1 w-10 rounded-full bg-emerald-500" />
            </div>
            <div className="p-5">
              <div className={`rounded-xl p-4 min-h-[190px] ${isDarkMode ? 'bg-slate-900/40' : 'bg-slate-50'}`}>
                <Quote size={20} className="text-emerald-500" />
                <p className={`mt-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{detail.biography}</p>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className={`px-5 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <h3 className={`text-[30px] font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Works by This Author</h3>
                <div className="mt-2 h-1 w-10 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                {works.length} Book(s)
              </span>
            </div>
            <div className={`${isDarkMode ? 'bg-[#0b1738]' : 'bg-white'}`}>
              {works.length > 0 ? (
                <table className="w-full text-left text-sm border-collapse">
                  <thead className={isDarkMode ? 'bg-[#0b1738] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                    <tr>
                      <th className="px-4 py-4 font-semibold text-[11px] uppercase tracking-wider">Book</th>
                      <th className="px-4 py-4 font-semibold text-[11px] uppercase tracking-wider">Category</th>
                      <th className="px-4 py-4 font-semibold text-[11px] uppercase tracking-wider">Year</th>
                      <th className="px-4 py-4 font-semibold text-[11px] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-4 font-semibold text-[11px] uppercase tracking-wider">Available Copies</th>
                      <th className="px-4 py-4 font-semibold text-[11px] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {works.map((book) => (
                      <tr key={book.id} className={`border-t ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={book.coverData || bookCover} alt={book.title} className="h-11 w-9 rounded object-cover" />
                            <div>
                              <p className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{book.title}</p>
                              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ISBN: {book.isbn || '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>Uncategorized</span>
                        </td>
                        <td className={`px-4 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{new Date(book.createdAt).getFullYear()}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${book.available > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {book.available > 0 ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className={`px-4 py-3 font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{book.available} / {book.totalCopies}</td>
                        <td className="px-4 py-3 text-right">
                          <BookActionsMenu
                            isDarkMode={isDarkMode}
                            onViewDetails={() => {
                              setBookToView(toBookRow(book))
                            }}
                            onEdit={() => {
                              setBookToEdit(toBookRow(book))
                            }}
                            onDelete={() => {
                              setBookToDelete(toBookRow(book))
                            }}
                            onArchive={async () => {
                              try {
                                await updateBook({
                                  id: book.id,
                                  title: book.title,
                                  author: book.author,
                                  category: book.category === 'Uncategorized' ? null : book.category,
                                  isbn: book.isbn === '-' ? null : book.isbn,
                                  coverData: book.coverData,
                                  available: book.available,
                                  totalCopies: book.totalCopies,
                                  isArchived: true,
                                })
                                await refreshWorks()
                                setShowToast(`Successfully archived "${book.title}"`)
                              } catch (error) {
                                console.error('Failed to archive book:', error)
                              }
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={`m-4 rounded-xl border p-5 ${isDarkMode ? 'border-slate-800 bg-slate-900/35' : 'border-slate-200 bg-slate-50/60'}`}>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>No works found yet</p>
                  <p className={`mt-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Add books with this exact author name to see them listed here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={`rounded-2xl border px-6 py-5 flex items-center justify-between ${isDarkMode ? 'border-emerald-900/40 bg-emerald-950/20' : 'border-emerald-100 bg-emerald-50/60'}`}>
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl grid place-items-center ${isDarkMode ? 'bg-emerald-500/15' : 'bg-emerald-100'}`}>
              <BookOpen size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className={`text-base font-bold ${isDarkMode ? 'text-emerald-200' : 'text-slate-800'}`}>Author Management</p>
              <p className={`text-sm ${isDarkMode ? 'text-emerald-100/80' : 'text-slate-600'}`}>
                Keep author information up to date to maintain an accurate and organized library database.
              </p>
            </div>
          </div>
          <Feather size={56} className={`${isDarkMode ? 'text-emerald-400/40' : 'text-emerald-300'}`} />
        </section>
      </div>
    </div>
  )
}

type BookStatus = 'Available' | 'Borrowed' | 'Overdue'
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
  isArchived?: boolean
}

type BookActionsMenuProps = {
  isDarkMode: boolean
  onViewDetails: () => void
  onEdit: () => void
  onDelete: () => void
  onArchive: () => void
}

function BookActionsMenu({ isDarkMode, onViewDetails, onEdit, onDelete, onArchive }: BookActionsMenuProps) {
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
    setOpen((v) => !v)
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
          className={`absolute right-0 z-50 w-52 rounded-xl border p-1.5 ${surface} ${
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
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes bookMenuInUp {
              from { opacity: 0; transform: scale(0.95) translateY(6px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>

          <button type="button" className={`${itemBase} ${itemNormal}`} role="menuitem" onClick={() => { setOpen(false); onViewDetails() }}>
            <Eye size={15} className="shrink-0 text-sky-500" />
            View Details
          </button>
          <button type="button" className={`${itemBase} ${itemNormal}`} role="menuitem" onClick={() => { setOpen(false); onEdit() }}>
            <Pencil size={15} className="shrink-0 text-violet-500" />
            Edit Book
          </button>
          <button type="button" className={`${itemBase} ${itemNormal}`} role="menuitem" onClick={() => setOpen(false)}>
            <BookMarked size={15} className="shrink-0 text-emerald-500" />
            Borrow Book
          </button>

          <div className={`my-1.5 border-t ${divider}`} />

          <button type="button" className={`${itemBase} ${itemNormal}`} role="menuitem" onClick={() => { setOpen(false); onArchive() }}>
            <Archive size={15} className="shrink-0 text-amber-500" />
            Archive Book
          </button>
          <button type="button" className={`${itemBase} ${itemDanger}`} role="menuitem" onClick={() => { setOpen(false); onDelete() }}>
            <Trash2 size={15} className="shrink-0" />
            Delete Book
          </button>
        </div>
      )}
    </div>
  )
}

function Meta({
  icon,
  label,
  value,
  isDarkMode,
  asBadge,
}: {
  icon: React.ReactNode
  label: string
  value: string
  isDarkMode: boolean
  asBadge?: boolean
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="h-7 w-7 rounded-lg bg-emerald-500/10 grid place-items-center mt-0.5">{icon}</div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
        {asBadge ? (
          <span className="inline-flex mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700">
            {value}
          </span>
        ) : (
          <p className={`text-sm font-bold mt-0.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{value}</p>
        )}
      </div>
    </div>
  )
}
