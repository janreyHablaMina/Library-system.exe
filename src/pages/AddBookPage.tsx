import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronDown,
  CloudUpload,
  Globe,
  ImagePlus,
  Mail,
  Package,
  Save,
  Tag,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { createAuthor, createCategory, listAuthors, listBooks, listCategories } from '../lib/tauriApi'
import { Toast } from '../components/ui/Toast'
import { DynamicBookCover } from '../components/ui/DynamicBookCover'

type AddBookPageProps = {
  isDarkMode: boolean
  onBack: () => void
  onSave?: (data: AddBookFormData) => Promise<void> | void
}

type BookAvailability = 'Available' | 'Unavailable' | 'Archived'

export type AddBookFormData = {
  title: string
  author: string
  isbn: string
  category: string
  publisher: string
  // Kept in the data shape so an optional Advanced Cataloging section can return later.
  publicationDate: string
  edition: string
  description: string
  numberOfCopies: number
  shelfLocation: string
  status: BookAvailability
  catalogCallNumber: string
  publicationPlace: string
  subject1: string
  subject2: string
  subject3: string
  seriesTitle: string
  addedEntryT: string
  addedEntryA: string
  physicalDescription: string
  notes: string
  coverFile: File | null
}

type FormErrors = Partial<Record<'title' | 'author' | 'category' | 'numberOfCopies', string>>
type AuthorOption = {
  id: number
  name: string
  booksPublished: number
  profilePhotoData: string | null
}
type CategoryOption = {
  id: number
  name: string
  status: string
}

const DESCRIPTION_MAX = 1000
const MAX_COVER_SIZE_BYTES = 2 * 1024 * 1024

const initialForm: AddBookFormData = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  publisher: '',
  publicationDate: '',
  edition: '',
  description: '',
  numberOfCopies: 1,
  shelfLocation: '',
  status: 'Available',
  catalogCallNumber: '',
  publicationPlace: '',
  subject1: '',
  subject2: '',
  subject3: '',
  seriesTitle: '',
  addedEntryT: '',
  addedEntryA: '',
  physicalDescription: '',
  notes: '',
  coverFile: null,
}

function validateForm(form: AddBookFormData): FormErrors {
  const errors: FormErrors = {}
  if (!form.title.trim()) errors.title = 'Title is required.'
  if (!form.author.trim()) errors.author = 'Author is required.'
  if (!form.category.trim()) errors.category = 'Category is required.'
  if (!Number.isFinite(form.numberOfCopies) || form.numberOfCopies < 1) {
    errors.numberOfCopies = 'Copies must be at least 1.'
  }
  return errors
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null
  return <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>
}

export function AddBookPage({ isDarkMode, onBack, onSave }: AddBookPageProps) {
  const [form, setForm] = useState<AddBookFormData>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isDragging, setIsDragging] = useState(false)
  const [coverError, setCoverError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [authors, setAuthors] = useState<AuthorOption[]>([])
  const [authorsLoading, setAuthorsLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [authorSearch, setAuthorSearch] = useState('')
  const [authorDropdownOpen, setAuthorDropdownOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [isAddAuthorOpen, setIsAddAuthorOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [newAuthorName, setNewAuthorName] = useState('')
  const [newAuthorEmail, setNewAuthorEmail] = useState('')
  const [newAuthorNationality, setNewAuthorNationality] = useState('')
  const [newAuthorDob, setNewAuthorDob] = useState('')
  const [newAuthorBiography, setNewAuthorBiography] = useState('')
  const [newAuthorStatus, setNewAuthorStatus] = useState('Active')
  const [newAuthorPhoto, setNewAuthorPhoto] = useState<string | null>(null)
  const [newAuthorPhotoName, setNewAuthorPhotoName] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [isCreatingAuthor, setIsCreatingAuthor] = useState(false)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [authorCreateError, setAuthorCreateError] = useState('')
  const [categoryCreateError, setCategoryCreateError] = useState('')
  const [showToast, setShowToast] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)
  const authorPhotoInputRef = useRef<HTMLInputElement | null>(null)
  const authorDropdownRef = useRef<HTMLDivElement | null>(null)
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null)

  const coverPreviewUrl = useMemo(() => {
    if (!form.coverFile) return null
    return URL.createObjectURL(form.coverFile)
  }, [form.coverFile])

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) {
        URL.revokeObjectURL(coverPreviewUrl)
      }
    }
  }, [coverPreviewUrl])

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (authorDropdownRef.current && !authorDropdownRef.current.contains(event.target as Node)) {
        setAuthorDropdownOpen(false)
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    if (!showToast) return
    const timer = window.setTimeout(() => setShowToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [showToast])

  useEffect(() => {
    const loadAuthors = async () => {
      setAuthorsLoading(true)
      try {
        const [rows, books] = await Promise.all([listAuthors(1000), listBooks(2000)])
        const bookCountByAuthor = new Map<string, number>()
        for (const book of books) {
          const key = book.author.trim().toLowerCase()
          if (!key) continue
          bookCountByAuthor.set(key, (bookCountByAuthor.get(key) || 0) + 1)
        }
        setAuthors(
          rows.map((row) => ({
            id: row.id,
            name: row.name,
            booksPublished: bookCountByAuthor.get(row.name.trim().toLowerCase()) || 0,
            profilePhotoData: row.profilePhotoData || null,
          })),
        )
      } catch {
        setAuthors([])
      } finally {
        setAuthorsLoading(false)
      }
    }
    void loadAuthors()
  }, [])

  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true)
      try {
        const rows = await listCategories(1000)
        setCategories(rows.filter((row) => row.status !== 'Inactive').map((row) => ({
          id: row.id,
          name: row.name,
          status: row.status,
        })))
      } catch {
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }
    void loadCategories()
  }, [])

  const cardClass = isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const iconBoxClass = isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
  const labelClass = isDarkMode ? 'text-zinc-200' : 'text-zinc-800'
  const inputClass = isDarkMode
    ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500'
    : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'
  const subtleCardShadow = isDarkMode ? '' : 'shadow-[0_12px_32px_-28px_rgba(15,23,42,0.45)]'

  const setField = <K extends keyof AddBookFormData>(field: K, value: AddBookFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCoverSelection = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setCoverError('Please upload an image file.')
      return
    }
    if (file.size > MAX_COVER_SIZE_BYTES) {
      setCoverError('Image is too large. Max size is 2MB.')
      return
    }
    setCoverError('')
    setField('coverFile', file)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateForm(form)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setIsSaving(true)
    try {
      await onSave?.(form)
      onBack()
    } finally {
      setIsSaving(false)
    }
  }

  const filteredAuthors = useMemo(() => {
    const q = authorSearch.trim().toLowerCase()
    if (!q) return authors
    return authors.filter((a) => a.name.toLowerCase().includes(q))
  }, [authors, authorSearch])
  const displayedAuthors = useMemo(() => filteredAuthors.slice(0, 5), [filteredAuthors])
  const displayedCategories = useMemo(() => categories.slice(0, 5), [categories])

  const handleCreateAuthor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = newAuthorName.trim()
    if (!name) {
      setAuthorCreateError('Author name is required.')
      return
    }
    setIsCreatingAuthor(true)
    setAuthorCreateError('')
    try {
      await createAuthor({
        name,
        email: newAuthorEmail.trim() || null,
        nationality: newAuthorNationality.trim() || null,
        dob: newAuthorDob || null,
        profilePhotoData: newAuthorPhoto,
        status: newAuthorStatus,
        biography: newAuthorBiography.trim() || null,
      })
      const rows = await listAuthors(1000)
      const options = rows.map((row) => ({
        id: row.id,
        name: row.name,
        booksPublished: 0,
        profilePhotoData: row.profilePhotoData || null,
      }))
      setAuthors(options)
      setField('author', name)
      setIsAddAuthorOpen(false)
      setNewAuthorName('')
      setNewAuthorEmail('')
      setNewAuthorNationality('')
      setNewAuthorDob('')
      setNewAuthorBiography('')
      setNewAuthorStatus('Active')
      setNewAuthorPhoto(null)
      setNewAuthorPhotoName('')
      setAuthorDropdownOpen(false)
      setShowToast(`Successfully added ${name} as a new author.`)
    } catch (error) {
      setAuthorCreateError(error instanceof Error ? error.message : 'Failed to create author.')
    } finally {
      setIsCreatingAuthor(false)
    }
  }

  const closeAddAuthorModal = () => {
    setIsAddAuthorOpen(false)
    setAuthorCreateError('')
    setNewAuthorName('')
    setNewAuthorEmail('')
    setNewAuthorNationality('')
    setNewAuthorDob('')
    setNewAuthorBiography('')
    setNewAuthorStatus('Active')
    setNewAuthorPhoto(null)
    setNewAuthorPhotoName('')
    if (authorPhotoInputRef.current) authorPhotoInputRef.current.value = ''
  }

  const handleAuthorPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setAuthorCreateError('Only JPG and PNG files are allowed.')
      event.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setAuthorCreateError('Photo must be 2MB or smaller.')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setNewAuthorPhoto(typeof reader.result === 'string' ? reader.result : null)
      setNewAuthorPhotoName(file.name)
      setAuthorCreateError('')
    }
    reader.onerror = () => setAuthorCreateError('Failed to read photo file.')
    reader.readAsDataURL(file)
  }

  const handleCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = newCategoryName.trim()
    if (!name) {
      setCategoryCreateError('Category name is required.')
      return
    }
    setIsCreatingCategory(true)
    setCategoryCreateError('')
    try {
      await createCategory({
        name,
        description: newCategoryDescription.trim() || null,
        status: 'Active',
      })
      const rows = await listCategories(1000)
      const nextCategories = rows
        .filter((row) => row.status !== 'Inactive')
        .map((row) => ({ id: row.id, name: row.name, status: row.status }))
      setCategories(nextCategories)
      setField('category', name)
      setIsAddCategoryOpen(false)
      setCategoryDropdownOpen(false)
      setNewCategoryName('')
      setNewCategoryDescription('')
    } catch (error) {
      setCategoryCreateError(error instanceof Error ? error.message : 'Failed to create category.')
    } finally {
      setIsCreatingCategory(false)
    }
  }

  return (
    <div
      className={`min-h-0 flex-1 overflow-auto px-4 pt-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}
    >
      <form onSubmit={handleSubmit} className="px-5 pt-5 pb-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={onBack}
              className={`inline-flex items-center gap-1.5 font-semibold ${isDarkMode ? 'text-zinc-300 hover:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <ArrowLeft size={15} />
              Books
            </button>
            <span className={isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}>{'>'}</span>
            <span className={isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}>Add New Book</span>
          </div>

        </div>

        <h2 className={`text-[38px] font-black leading-tight tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}`}>Add New Book</h2>
        <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Add only the essentials needed to make this book available.</p>

        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_450px]">
          <div className="space-y-4">
            <article className={`rounded-2xl border p-6 ${cardClass}`}>
              <div className="mb-5 flex items-start gap-3 border-b border-zinc-200/10 pb-4">
                <div className={`grid h-11 w-11 place-items-center rounded-full ${iconBoxClass}`}>
                  <BookOpen size={19} />
                </div>
                <div>
                  <h3 className={`text-lg font-black leading-tight ${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}`}>Basic Information</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    placeholder="Enter book title"
                  />
                  <FieldError error={errors.title} />
                </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Author *</label>
                  <div className="relative mt-2" ref={authorDropdownRef}>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          value={authorSearch}
                          onChange={(e) => {
                            setAuthorSearch(e.target.value)
                            setField('author', e.target.value)
                            setAuthorDropdownOpen(true)
                          }}
                          onFocus={() => setAuthorDropdownOpen(true)}
                          className={`h-11 w-full rounded-xl border px-4 pr-10 outline-none ${inputClass}`}
                          placeholder={authorsLoading ? 'Loading authors...' : 'Search author by name...'}
                        />
                        <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                      </div>
                    </div>

                    {authorDropdownOpen ? (
                      <div className={`absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border p-2 shadow-xl ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-white'}`}>
                        <div className="mb-2 flex items-center justify-between px-1">
                          <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Authors ({Math.min(filteredAuthors.length, 5)} shown)</p>
                          <button
                            type="button"
                            onClick={() => setAuthorDropdownOpen(false)}
                            className={`grid h-6 w-6 place-items-center rounded-md ${isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-100'}`}
                            aria-label="Close author list"
                          >
                            <X size={13} />
                          </button>
                        </div>
                        {displayedAuthors.length > 0 ? (
                          displayedAuthors.map((author) => (
                            <button
                              key={author.id}
                              type="button"
                              onClick={() => {
                                setField('author', author.name)
                                setAuthorSearch(author.name)
                                setAuthorDropdownOpen(false)
                              }}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${isDarkMode ? 'text-zinc-200 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-50'}`}
                            >
                              <span className={`grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                                {author.profilePhotoData ? (
                                  <img src={author.profilePhotoData} alt={`${author.name} avatar`} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-xs font-bold">{author.name.charAt(0).toUpperCase()}</span>
                                )}
                              </span>
                              <span className="min-w-0">
                                <p className={`truncate text-sm font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>{author.name}</p>
                                <p className={`truncate text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                  {author.booksPublished} book{author.booksPublished === 1 ? '' : 's'} published
                                </p>
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className={`px-3 py-2 text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>No authors found</p>
                        )}
                        {filteredAuthors.length > 5 ? (
                          <p className={`px-3 pt-1 text-[11px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
                            Showing first 5 results. Type to refine search.
                          </p>
                        ) : null}
                        <div className={`mt-2 border-t pt-2 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
                          <button
                            type="button"
                            onClick={() => setIsAddAuthorOpen(true)}
                            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            <UserPlus size={14} />
                            Add New Author
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <FieldError error={errors.author} />
                </div>
                    <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>ISBN</label>
                  <input
                    value={form.isbn}
                    onChange={(e) => setField('isbn', e.target.value)}
                    className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    placeholder="Enter ISBN (optional)"
                  />
                </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Category *</label>
                  <div className="relative mt-2" ref={categoryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                      className={`h-11 w-full rounded-xl border px-4 pr-10 text-left outline-none ${inputClass}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <BookOpen size={15} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                        <span className={form.category ? '' : (isDarkMode ? 'text-zinc-500' : 'text-zinc-400')}>
                          {form.category || (categoriesLoading ? 'Loading categories...' : 'Select category')}
                        </span>
                      </span>
                    </button>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />

                    {categoryDropdownOpen ? (
                      <div className={`absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border p-2 shadow-xl ${isDarkMode ? 'border-zinc-700 bg-[#27272A]' : 'border-zinc-200 bg-white'}`}>
                        <div className="mb-2 flex items-center justify-between px-1">
                          <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            Categories ({Math.min(categories.length, 5)} shown)
                          </p>
                          <button
                            type="button"
                            onClick={() => setCategoryDropdownOpen(false)}
                            className={`grid h-6 w-6 place-items-center rounded-md ${isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-100'}`}
                            aria-label="Close category list"
                          >
                            <X size={13} />
                          </button>
                        </div>
                        {displayedCategories.length > 0 ? (
                          displayedCategories.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => {
                                setField('category', category.name)
                                setCategoryDropdownOpen(false)
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isDarkMode ? 'text-zinc-200 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-50'}`}
                            >
                              <span className="inline-flex items-center gap-2 min-w-0">
                                <BookOpen size={14} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                                <span className="truncate">{category.name}</span>
                              </span>
                              <span className={`ml-2 rounded-md px-2 py-0.5 text-[10px] font-semibold ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                                {category.status}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className={`px-3 py-2 text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>No categories found</p>
                        )}
                        {categories.length > 5 ? (
                          <p className={`px-3 pt-1 text-[11px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
                            Showing first 5 categories.
                          </p>
                        ) : null}
                        <div className={`mt-2 border-t pt-2 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
                          <button
                            type="button"
                            onClick={() => setIsAddCategoryOpen(true)}
                            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            <Tag size={14} />
                            Add New Category
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <FieldError error={errors.category} />
                </div>
                    <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Publisher</label>
                  <input
                    value={form.publisher}
                    onChange={(e) => setField('publisher', e.target.value)}
                    className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    placeholder="Enter publisher (optional)"
                  />
                </div>
                  </div>
                  <div>
                <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value.slice(0, DESCRIPTION_MAX))}
                  className={`mt-1.5 min-h-[116px] w-full rounded-xl border px-4 py-3 outline-none ${inputClass}`}
                  placeholder="Enter a brief description about the book (optional)"
                />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{form.description.length} / {DESCRIPTION_MAX}</p>
              </div>

                
                
              </div>

            </article>

            
          </div>

          <aside className="space-y-4">
            <article className={`rounded-2xl border p-6 ${cardClass}`}>
              <div className="mb-4 flex items-start gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-full ${iconBoxClass}`}>
                  <ImagePlus size={19} />
                </div>
                <div>
                  <h3 className={`text-lg font-black leading-tight ${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}`}>Book Cover</h3>
                  <p className={`mt-1 text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Upload a cover image for this book.</p>
                </div>
              </div>

              
              <div className="flex gap-4">
                {/* Visual Cover Preview */}
                {coverPreviewUrl ? (
                  <div className="relative w-[145px] h-[195px] rounded-lg shadow-md overflow-hidden shrink-0 border border-zinc-200/10">
                    <img src={coverPreviewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-[195px] w-[145px] shrink-0 rounded-lg shadow-md overflow-hidden">
                    <DynamicBookCover title={form.title || 'Unknown Title'} author={form.author || 'Unknown Author'} seed="preview-seed" />
                  </div>
                )}
                
                {/* Upload zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    handleCoverSelection(e.dataTransfer.files?.[0] ?? null)
                  }}
                  onClick={() => coverInputRef.current?.click()}
                  className={`flex-1 rounded-xl border-2 border-dashed p-4 text-center flex flex-col justify-center items-center cursor-pointer transition ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/60'
                      : isDarkMode
                        ? 'border-zinc-700 hover:border-zinc-500 bg-[#27272A]/50 hover:bg-[#27272A]/70'
                        : 'border-zinc-200 hover:border-emerald-500 bg-zinc-50/40 hover:bg-emerald-50/20'
                  }`}
                >
                  <CloudUpload size={28} className={`mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>Drag and drop image here</p>
                  <p className={`text-[10px] my-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>or</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); coverInputRef.current?.click(); }}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${isDarkMode ? 'border-zinc-600 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'}`}
                  >
                    Choose File
                  </button>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleCoverSelection(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  <p className={`text-[9px] mt-2 leading-tight ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Recommended: 600 x 800px (JPG, PNG)<br />Max file size: 2MB
                  </p>
                </div>
              </div>

              {coverPreviewUrl ? (
                <button
                  type="button"
                  onClick={() => handleCoverSelection(null)}
                  className="mt-4 w-full border border-rose-500/25 hover:bg-rose-500/5 text-rose-500 font-semibold text-xs h-10 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <X size={14} />
                  Remove Cover
                </button>
              ) : null}
              {coverError ? <p className="mt-2 text-xs font-semibold text-rose-600">{coverError}</p> : null}
            </article>

            <article className={`rounded-2xl border p-6 ${cardClass}`}>
              <div className="mb-4 flex items-start gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-full ${iconBoxClass}`}>
                  <Package size={19} />
                </div>
                <div>
                  <h3 className={`text-lg font-black leading-tight ${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}`}>Inventory Information</h3>
                  <p className={`mt-1 text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Provide inventory and availability details.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Number of Copies *</label>
                  <input
                    type="number"
                    min={1}
                    value={form.numberOfCopies}
                    onChange={(e) => {
                      const parsed = Number(e.target.value)
                      setField('numberOfCopies', Number.isFinite(parsed) ? parsed : 0)
                    }}
                    className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    placeholder="Enter number of copies"
                  />
                  <FieldError error={errors.numberOfCopies} />
                </div>
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Shelf Location (Optional)</label>
                  <input
                    value={form.shelfLocation}
                    onChange={(e) => setField('shelfLocation', e.target.value)}
                    className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    placeholder="e.g. 300.72 KAH or A-12"
                  />
                </div>
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Status *</label>
                  <div className="relative mt-2">
                    <select
                      value={form.status}
                      onChange={(e) => setField('status', e.target.value as BookAvailability)}
                      className={`h-11 w-full appearance-none rounded-xl border pl-10 pr-10 outline-none ${inputClass}`}
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                      <option value="Archived">Archived</option>
                    </select>
                    <span className="pointer-events-none absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-emerald-500" />
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </div>
              </div>
            </article>
          </aside>
        </div>

        <div className={`-mx-9 sticky bottom-0 mt-5 border-t px-9 py-4 ${
          isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
        }`}>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className={`h-11 rounded-lg border px-8 text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-700 px-8 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              <Save size={16} />
              Save Book
            </button>
          </div>
        </div>
      </form>

      {isAddAuthorOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/45 p-4 backdrop-blur-[1px]">
          <section className={`w-full max-w-4xl rounded-2xl border shadow-2xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-6 py-5 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Add New Author</h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Create a new library author profile.</p>
              </div>
              <button type="button" onClick={closeAddAuthorModal} className={`grid h-10 w-10 place-items-center rounded-xl border ${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateAuthor} className="space-y-5 px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${labelClass}`}>Author Name <span className="text-rose-500">*</span></label>
                  <input value={newAuthorName} onChange={(e) => setNewAuthorName(e.target.value)} placeholder="Enter full name" className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-emerald-500 ${inputClass}`} required />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${labelClass}`}>Email Address</label>
                  <div className={`flex h-11 items-center rounded-xl border px-3 ${inputClass}`}>
                    <Mail size={15} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                    <input value={newAuthorEmail} onChange={(e) => setNewAuthorEmail(e.target.value)} placeholder="Enter email address" className="ml-2 w-full bg-transparent text-sm outline-none" />
                  </div>
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${labelClass}`}>Nationality</label>
                  <div className={`flex h-11 items-center rounded-xl border px-3 ${inputClass}`}>
                    <Globe size={15} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                    <input value={newAuthorNationality} onChange={(e) => setNewAuthorNationality(e.target.value)} placeholder="Enter nationality" className="ml-2 w-full bg-transparent text-sm outline-none" />
                  </div>
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${labelClass}`}>Date of Birth</label>
                  <div className={`flex h-11 items-center rounded-xl border px-3 ${inputClass}`}>
                    <Calendar size={15} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                    <input type="date" value={newAuthorDob} onChange={(e) => setNewAuthorDob(e.target.value)} className="ml-2 w-full bg-transparent text-sm outline-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className={`mb-1 block text-sm font-semibold ${labelClass}`}>Biography / Description</label>
                <textarea value={newAuthorBiography} onChange={(e) => setNewAuthorBiography(e.target.value)} maxLength={200} placeholder="Enter author's short biography or description" className={`min-h-24 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-emerald-500 ${inputClass}`} />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{newAuthorBiography.length} / 200</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${labelClass}`}>Author Photo</label>
                  <input ref={authorPhotoInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleAuthorPhotoChange} />
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                      {newAuthorPhoto ? <img src={newAuthorPhoto} alt="Author preview" className="h-full w-full object-cover" /> : <Users size={16} />}
                    </div>
                    <button type="button" onClick={() => authorPhotoInputRef.current?.click()} className={`h-10 rounded-lg border px-4 text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>Upload Photo</button>
                    <span className={`truncate text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>{newAuthorPhotoName || 'JPG, PNG (Max 2MB)'}</span>
                  </div>
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${labelClass}`}>Status <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select value={newAuthorStatus} onChange={(e) => setNewAuthorStatus(e.target.value)} className={`h-11 w-full appearance-none rounded-xl border pl-3 pr-10 text-sm outline-none focus:border-emerald-500 ${inputClass}`}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </div>
              </div>
              {authorCreateError ? <p className="text-xs font-semibold text-rose-600">{authorCreateError}</p> : null}
              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                <button type="button" onClick={closeAddAuthorModal} className={`h-11 rounded-xl border text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
                  Cancel
                </button>
                <button type="submit" disabled={isCreatingAuthor} className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                  {isCreatingAuthor ? 'Saving...' : 'Save Author'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {isAddCategoryOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl ${cardClass}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h4 className={`text-lg font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Add New Category</h4>
                <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Create a new category and select it for this book.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddCategoryOpen(false)
                  setCategoryCreateError('')
                }}
                className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100'}`}
              >
                <X size={14} />
              </button>
            </div>
            <form className="space-y-3" onSubmit={handleCreateCategory}>
              <div>
                <label className={`text-sm font-semibold ${labelClass}`}>Category Name *</label>
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className={`mt-1 h-10 w-full rounded-lg border px-3 outline-none focus:border-emerald-500 ${inputClass}`}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className={`text-sm font-semibold ${labelClass}`}>Description</label>
                <textarea
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className={`mt-1 min-h-[90px] w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-500 ${inputClass}`}
                  placeholder="Short description (optional)"
                />
              </div>
              {categoryCreateError ? <p className="text-xs font-semibold text-rose-600">{categoryCreateError}</p> : null}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCategoryOpen(false)
                    setCategoryCreateError('')
                  }}
                  className={`h-10 rounded-lg border text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCategory}
                  className="h-10 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingCategory ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
      <Toast message={showToast} onClose={() => setShowToast(null)} isDarkMode={isDarkMode} />
    </div>
  )
}
