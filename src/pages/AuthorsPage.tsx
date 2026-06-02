import { Toast } from '../components/ui/Toast'
import { useState, useRef, useEffect, useMemo } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { ChevronDown, Download, Eye, Pencil, Plus, Search, Trash2, Users, X, BookOpen, Star, Calendar, Filter, ChevronLeft, ChevronRight, MoreHorizontal, AlertTriangle, Mail, Globe } from 'lucide-react'
import { createAuthor, deleteAuthor, listAuthors, listBooks, type Author as DbAuthor, type Book } from '../lib/tauriApi'

type AuthorRow = {
  id: number
  name: string
  email: string
  nationality: string
  books: number
  dob: string
  status: 'Active' | 'Inactive'
  addedOn: string
  addedTime: string
  avatar: string
  profilePhotoData?: string | null
  biography?: string
}

type AuthorsPageProps = {
  isDarkMode: boolean
  onOpenAuthorDetail: (id: number) => void
}

type AuthorFormState = {
  name: string
  email: string
  nationality: string
  dob: string
  status: string
  biography: string
}

const initialFormState: AuthorFormState = {
  name: '',
  email: '',
  nationality: '',
  dob: '',
  status: 'Active',
  biography: '',
}

type AuthorActionsMenuProps = {
  isDarkMode: boolean
  onViewDetails: () => void
  onEdit: () => void
  onDelete: () => void
}

export function AuthorActionsMenu({ isDarkMode, onViewDetails, onEdit, onDelete }: AuthorActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpward(spaceBelow < 185)
    }
    setOpen(v => !v)
  }

  const baseButton = `flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors duration-150`
  const normalButton = isDarkMode
    ? `text-slate-300 hover:bg-slate-800 hover:text-white`
    : `text-slate-600 hover:bg-slate-50 hover:text-slate-900`
  const dangerButton = isDarkMode
    ? `text-rose-400 hover:bg-rose-500/10 hover:text-rose-300`
    : `text-rose-600 hover:bg-rose-50 hover:text-rose-700`

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={handleToggle}
        className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${
          open 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30' 
            : isDarkMode 
              ? 'border-slate-700 text-slate-400 hover:bg-slate-800' 
              : 'border-slate-200 text-slate-500 hover:bg-white hover:text-emerald-600'
        }`}
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-44 rounded-xl border p-1.5 shadow-xl animate-[fadeIn_0.12s_ease] ${
            isDarkMode 
              ? 'border-slate-700 bg-[#0f1f49]' 
              : 'border-slate-200 bg-white'
          } ${
            openUpward 
              ? 'bottom-full mb-1.5 origin-bottom-right' 
              : 'top-full mt-1.5 origin-top-right'
          }`}
          role="menu"
        >
          <button
            type="button"
            className={`${baseButton} ${normalButton}`}
            onClick={() => { setOpen(false); onViewDetails(); }}
          >
            <Eye size={14} className="shrink-0 text-sky-500" />
            View Details
          </button>
          <button
            type="button"
            className={`${baseButton} ${normalButton}`}
            onClick={() => { setOpen(false); onEdit(); }}
          >
            <Pencil size={14} className="shrink-0 text-blue-500" />
            Edit Profile
          </button>
          
          <div className={`my-1 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`} />

          <button
            type="button"
            className={`${baseButton} ${dangerButton}`}
            onClick={() => { setOpen(false); onDelete(); }}
          >
            <Trash2 size={14} className="shrink-0" />
            Delete Author
          </button>
        </div>
      )}
    </div>
  )
}

export function AuthorsPage({ isDarkMode, onOpenAuthorDetail }: AuthorsPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [authorForm, setAuthorForm] = useState<AuthorFormState>(initialFormState)
  const [authorToEdit, setAuthorToEdit] = useState<AuthorRow | null>(null)
  const [authorToDelete, setAuthorToDelete] = useState<AuthorRow | null>(null)
  const [authorsList, setAuthorsList] = useState<AuthorRow[]>([])
  const [allBooksCount, setAllBooksCount] = useState(0)
  const [showToast, setShowToast] = useState<string | null>(null)
  const [authorPhotoPreview, setAuthorPhotoPreview] = useState<string | null>(null)
  const [authorPhotoName, setAuthorPhotoName] = useState<string>('')
  const authorPhotoInputRef = useRef<HTMLInputElement>(null)

  const getBookCountsByAuthorId = (authors: DbAuthor[], books: Book[]) => {
    const countsByAuthorId = new Map<number, number>()
    const authorsByName = new Map<string, DbAuthor[]>()

    for (const author of authors) {
      const key = author.name.trim().toLowerCase()
      if (!key) continue
      const bucket = authorsByName.get(key) ?? []
      bucket.push(author)
      authorsByName.set(key, bucket)
    }

    // Pick one canonical author per duplicate name (lowest id) so counts are not duplicated.
    for (const bucket of authorsByName.values()) {
      bucket.sort((a, b) => a.id - b.id)
    }

    for (const book of books) {
      const key = book.author.trim().toLowerCase()
      if (!key) continue
      const matchingAuthors = authorsByName.get(key)
      if (!matchingAuthors || matchingAuthors.length === 0) continue
      const canonicalAuthor = matchingAuthors[0]
      countsByAuthorId.set(canonicalAuthor.id, (countsByAuthorId.get(canonicalAuthor.id) ?? 0) + 1)
    }

    return countsByAuthorId
  }

  const toAuthorRow = (author: DbAuthor, booksCountByAuthorId?: Map<number, number>): AuthorRow => {
    const created = author.createdAt ? new Date(author.createdAt) : new Date()
    const books = booksCountByAuthorId?.get(author.id) ?? 0
    const cleanNationality = author.nationality?.trim() || 'Unknown'
    return {
      id: author.id,
      name: author.name,
      email: author.email || 'n/a',
      nationality: cleanNationality,
      books,
      dob: author.dob
        ? new Date(author.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : '',
      status: (author.status === 'Inactive' ? 'Inactive' : 'Active') as 'Active' | 'Inactive',
      addedOn: created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      addedTime: created.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      avatar: author.name.charAt(0).toUpperCase() || 'A',
      profilePhotoData: author.profilePhotoData || null,
      biography: author.biography || '',
    }
  }

  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNationality, setSelectedNationality] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortBy, setSortBy] = useState('Name (A-Z)')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, sortBy, itemsPerPage])


  // Auto-expiring toast effect
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const [rows, books] = await Promise.all([listAuthors(500), listBooks(2000)])
        const booksCountByAuthorId = getBookCountsByAuthorId(rows, books)
        setAllBooksCount(books.length)
        setAuthorsList(rows.map((row) => toAuthorRow(row, booksCountByAuthorId)))
      } catch {
        setAuthorsList([])
        setAllBooksCount(0)
      }
    }
    void loadAuthors()
  }, [])

  const handleFormChange = (field: keyof AuthorFormState, value: string) => {
    setAuthorForm((prev) => ({ ...prev, [field]: value }))
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setAuthorToEdit(null)
    setAuthorForm(initialFormState)
    setAuthorPhotoPreview(null)
    setAuthorPhotoName('')
    if (authorPhotoInputRef.current) authorPhotoInputRef.current.value = ''
  }

  const handleOpenEditModal = (author: AuthorRow) => {
    setAuthorToEdit(author)
    setAuthorForm({
      name: author.name,
      email: author.email,
      nationality: author.nationality,
      dob: author.dob ? new Date(author.dob).toISOString().split('T')[0] : '',
      status: author.status,
      biography: author.biography || '',
    })
    setAuthorPhotoPreview(author.profilePhotoData || null)
    setAuthorPhotoName(author.profilePhotoData ? 'Current photo' : '')
    if (authorPhotoInputRef.current) authorPhotoInputRef.current.value = ''
    setIsAddModalOpen(true)
  }

  
  const handleAuthorPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const acceptedTypes = ['image/jpeg', 'image/png']
    if (!acceptedTypes.includes(file.type)) {
      setShowToast('Only JPG and PNG files are allowed.')
      event.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setShowToast('Photo must be 2MB or smaller.')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null
      setAuthorPhotoPreview(dataUrl)
      setAuthorPhotoName(file.name)
    }
    reader.onerror = () => {
      setShowToast('Failed to read photo file.')
      event.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (authorToEdit) {
      setAuthorsList(prev => prev.map(a => a.id === authorToEdit.id ? {
        ...a,
        name: authorForm.name,
        email: authorForm.email,
        nationality: authorForm.nationality,
        dob: authorForm.dob ? new Date(authorForm.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
        status: authorForm.status as any,
        biography: authorForm.biography,
        profilePhotoData: authorPhotoPreview || a.profilePhotoData || null,
      } : a))
      setShowToast(`Successfully updated ${authorForm.name}'s profile!`)
    } else {
      try {
        await createAuthor({
          name: authorForm.name.trim(),
          email: authorForm.email.trim() || null,
          nationality: authorForm.nationality.trim() || null,
          dob: authorForm.dob || null,
          profilePhotoData: authorPhotoPreview || null,
          status: authorForm.status || 'Active',
          biography: authorForm.biography.trim() || null,
        })
        const [rows, books] = await Promise.all([listAuthors(500), listBooks(2000)])
        const booksCountByAuthorId = getBookCountsByAuthorId(rows, books)
        setAllBooksCount(books.length)
        setAuthorsList(rows.map((row) => toAuthorRow(row, booksCountByAuthorId)))
        setShowToast(`Successfully added ${authorForm.name} as a new author!`)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to add author.'
        setShowToast(message)
        return
      }
    }
    closeAddModal()
  }
  const handleDeleteConfirm = async () => {
    if (!authorToDelete) return

    try {
      await deleteAuthor(authorToDelete.id)
      const [rows, books] = await Promise.all([listAuthors(500), listBooks(2000)])
      const booksCountByAuthorId = getBookCountsByAuthorId(rows, books)
      setAllBooksCount(books.length)
      setAuthorsList(rows.map((row) => toAuthorRow(row, booksCountByAuthorId)))
      setShowToast(`Successfully deleted ${authorToDelete.name}!`)
      setAuthorToDelete(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete author.'
      setShowToast(message)
    }
  }

  // Filtered and Sorted Authors
  const filteredAuthors = useMemo(() => {
    let result = [...authorsList]

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(a => a.name.toLowerCase().includes(term) || a.email.toLowerCase().includes(term))
    }

    if (selectedNationality !== 'All') {
      result = result.filter(a => a.nationality === selectedNationality)
    }

    if (selectedStatus !== 'All') {
      result = result.filter(a => a.status === selectedStatus)
    }

    if (sortBy === 'Name (A-Z)') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'Name (Z-A)') {
      result.sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortBy === 'Books (High-Low)') {
      result.sort((a, b) => b.books - a.books)
    }

    return result
  }, [authorsList, searchTerm, selectedNationality, selectedStatus, sortBy])

  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage)
  const paginatedAuthors = filteredAuthors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const stats = useMemo(() => {
    const totalAuthors = authorsList.length
    const activeAuthors = authorsList.filter((a) => a.status === 'Active').length
    const activePct = totalAuthors > 0 ? ((activeAuthors / totalAuthors) * 100).toFixed(1) : '0.0'
    const nationalityCounts = authorsList.reduce<Record<string, number>>((acc, author) => {
      const key = author.nationality?.trim() || 'Unknown'
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})
    let topNationality = 'Unknown'
    let topNationalityCount = 0
    for (const [name, count] of Object.entries(nationalityCounts)) {
      if (count > topNationalityCount) {
        topNationality = name
        topNationalityCount = count
      }
    }

    return [
      { label: 'Total Authors', value: totalAuthors.toLocaleString('en-US'), subValue: 'From database records', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Active Authors', value: activeAuthors.toLocaleString('en-US'), subValue: `${activePct}% of total`, icon: Pencil, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Books by Authors', value: allBooksCount.toLocaleString('en-US'), subValue: 'Total books written', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
      
      
    ]
  }, [authorsList, allBooksCount])

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Authors</h2>
            <p className={`mt-1 text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage and organize all authors in your library.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <Download size={16} />
              Export
            </button>
            <button type="button" onClick={() => setIsAddModalOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-sm">
              <Plus size={18} />
              Add Author
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <article key={stat.label} className={`rounded-xl border p-5 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center gap-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.bg} ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex flex-col">
                    <p className={`text-xs font-bold text-slate-500 dark:text-slate-400`}>{stat.label}</p>
                    <p className={`text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{stat.value}</p>
                  </div>
                </div>
                <p className={`mt-3 text-[11px] font-bold ${stat.color === 'text-rose-600' || stat.color === 'text-violet-600' ? 'text-slate-500 dark:text-slate-400' : stat.color}`}>
                  {stat.subValue}
                </p>
              </article>
            )
          })}
        </section>

        <div className={`mt-8 rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
          <div className={`flex flex-wrap items-center gap-4 p-4 border-b rounded-t-xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-100 bg-white'}`}>
            <label className={`group flex h-12 min-w-[320px] flex-1 items-center rounded-xl border px-3 transition-all ${isDarkMode ? 'border-slate-700 focus-within:border-emerald-500 bg-[#0f1f49]' : 'border-slate-200 focus-within:border-emerald-500 bg-slate-50'}`}>
              <Search size={18} className={`mr-2 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} placeholder="Search authors by name..." />
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status</span>
                <div className="relative">
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Sort By</span>
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`h-11 min-w-[160px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <option value="Name (A-Z)">Name (A-Z)</option>
                    <option value="Name (Z-A)">Name (Z-A)</option>
                    <option value="Books (High-Low)">Books (High-Low)</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              
            </div>
          </div>

          <div className={`relative z-10 overflow-x-auto lg:overflow-visible ${isDarkMode ? 'bg-[#0b1738]' : 'bg-white'}`}>
            <table className="w-full text-left text-sm border-collapse">
              <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nationality</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Books</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAuthors.map((author) => (
                  <tr key={author.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full text-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-100'}`}>
                          {author.profilePhotoData ? (
                            <img src={author.profilePhotoData} alt={`${author.name} photo`} className="h-full w-full object-cover" />
                          ) : (
                            author.avatar
                          )}
                        </span>
                        <div>
                          <p className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{author.name}</p>
                          <p className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{author.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                         <Globe size={14} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                         <span className="text-xs">{author.nationality}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{author.books}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-md px-3 py-1 text-[11px] font-semibold tracking-wide ${
                        author.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                      }`}>
                        {author.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <AuthorActionsMenu
                        isDarkMode={isDarkMode}
                        onViewDetails={() => onOpenAuthorDetail(author.id)}
                        onEdit={() => handleOpenEditModal(author)}
                        onDelete={() => setAuthorToDelete(author)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-4 border-t p-4 text-xs font-bold rounded-b-xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
            <p>Showing {filteredAuthors.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredAuthors.length)} of {filteredAuthors.length} authors</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800 disabled:opacity-50' : 'border-slate-200 text-slate-400 hover:bg-white disabled:opacity-50'}`}>
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} type="button" onClick={() => setCurrentPage(page)} className={page === currentPage ? "grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm" : `grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>
                      {page}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800 disabled:opacity-50' : 'border-slate-200 text-slate-400 hover:bg-white disabled:opacity-50'}`}>
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="relative">
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className={`h-8 min-w-[100px] appearance-none rounded-lg border pl-3 pr-8 text-[11px] font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
                <ChevronDown size={12} className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px]">
          <section className={`w-full max-w-4xl rounded-2xl border shadow-2xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-6 py-5 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{authorToEdit ? 'Edit Author Profile' : 'Add New Author'}</h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{authorToEdit ? 'Update author details below.' : 'Create a new library author profile.'}</p>
              </div>
              <button type="button" onClick={closeAddModal} className={`grid h-10 w-10 place-items-center rounded-xl border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Author Name <span className="text-rose-500">*</span></label>
                  <input value={authorForm.name} onChange={(e) => handleFormChange('name', e.target.value)} placeholder="Enter full name" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'}`} required />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Email Address</label>
                  <div className={`flex h-11 items-center rounded-xl border px-3 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] focus-within:border-emerald-500' : 'border-slate-200 bg-white focus-within:border-emerald-500'}`}>
                    <Mail size={15} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                    <input value={authorForm.email} onChange={(e) => handleFormChange('email', e.target.value)} placeholder="Enter email address" className={`ml-2 w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} />
                  </div>
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Nationality</label>
                  <div className={`flex h-11 items-center rounded-xl border px-3 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] focus-within:border-emerald-500' : 'border-slate-200 bg-white focus-within:border-emerald-500'}`}>
                    <Globe size={15} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                    <input value={authorForm.nationality} onChange={(e) => handleFormChange('nationality', e.target.value)} placeholder="Enter nationality" className={`ml-2 w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} />
                  </div>
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Date of Birth</label>
                  <div className={`flex h-11 items-center rounded-xl border px-3 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] focus-within:border-emerald-500' : 'border-slate-200 bg-white focus-within:border-emerald-500'}`}>
                    <Calendar size={15} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                    <input type="date" value={authorForm.dob} onChange={(e) => handleFormChange('dob', e.target.value)} className={`ml-2 w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-slate-100' : 'text-slate-700'}`} />
                  </div>
                </div>
              </div>

              <div>
                <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Biography / Description</label>
                <textarea value={authorForm.biography} onChange={(e) => handleFormChange('biography', e.target.value)} maxLength={200} placeholder="Enter author's short biography or description" className={`min-h-24 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'}`} />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{authorForm.biography.length} / 200</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Author Photo</label>
                  <input
                    ref={authorPhotoInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleAuthorPhotoChange}
                  />
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      {authorPhotoPreview ? (
                        <img src={authorPhotoPreview} alt="Author preview" className="h-full w-full object-cover" />
                      ) : (
                        <Users size={16} />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => authorPhotoInputRef.current?.click()}
                      className={`h-10 rounded-lg border px-4 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                      Upload Photo
                    </button>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{authorPhotoName || 'JPG, PNG (Max 2MB)'}</span>
                  </div>
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Status <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select value={authorForm.status} onChange={(e) => handleFormChange('status', e.target.value)} className={`h-11 w-full appearance-none rounded-xl border pl-3 pr-10 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'}`}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                <button type="button" onClick={closeAddModal} className={`h-11 rounded-xl border text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Cancel</button>
                <button type="submit" className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">{authorToEdit ? 'Save Changes' : 'Save Author'}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Styled Confirmation Modal (Delete) */}
      {authorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-6">Delete Author</h3>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Are you sure you want to delete <span className="font-semibold text-rose-500">"{authorToDelete.name}"</span>? This action cannot be undone and will remove their profile records.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAuthorToDelete(null)}
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
                Yes, Delete Author
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled Toast Notifications */}
      <Toast message={showToast} onClose={() => setShowToast(null)} isDarkMode={isDarkMode} />
    </div>
  )
}







