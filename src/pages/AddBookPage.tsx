import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  CloudUpload,
  ImagePlus,
  Package,
  Save,
  Tag,
  UserPlus,
  X,
} from 'lucide-react'
import { createAuthor, createCategory, listAuthors, listBooks, listCategories } from '../lib/tauriApi'

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
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [isCreatingAuthor, setIsCreatingAuthor] = useState(false)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [authorCreateError, setAuthorCreateError] = useState('')
  const [categoryCreateError, setCategoryCreateError] = useState('')
  const coverInputRef = useRef<HTMLInputElement | null>(null)
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

  const cardClass = isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'
  const iconBoxClass = isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
  const labelClass = isDarkMode ? 'text-slate-200' : 'text-slate-800'
  const inputClass = isDarkMode
    ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500'
    : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'
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
        status: 'Active',
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
    } catch (error) {
      setAuthorCreateError(error instanceof Error ? error.message : 'Failed to create author.')
    } finally {
      setIsCreatingAuthor(false)
    }
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
    <form
      onSubmit={handleSubmit}
      className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}
    >
      <section className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={onBack}
              className={`inline-flex items-center gap-1.5 font-semibold ${isDarkMode ? 'text-slate-300 hover:text-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ArrowLeft size={15} />
              Books
            </button>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>{'>'}</span>
            <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Add New Book</span>
          </div>

        </div>

        <h2 className={`text-[38px] font-black leading-tight tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}`}>Add New Book</h2>
        <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Add only the essentials needed to make this book available.</p>

        <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_480px]">
          <div className="space-y-4">
            <article className={`rounded-2xl border p-6 ${subtleCardShadow} ${cardClass}`}>
              <div className="mb-6 flex items-start gap-4">
                <div className={`grid h-11 w-11 place-items-center rounded-full ${iconBoxClass}`}>
                  <BookOpen size={19} />
                </div>
                <div>
                  <h3 className={`text-lg font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}`}>Basic Information</h3>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className={`text-xs font-black ${labelClass}`}>Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                    placeholder="Enter book title"
                  />
                  <FieldError error={errors.title} />
                </div>
                <div>
                  <label className={`text-xs font-black ${labelClass}`}>Author *</label>
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
                          className={`h-12 w-full rounded-xl border px-4 pr-10 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                          placeholder={authorsLoading ? 'Loading authors...' : 'Search author by name...'}
                        />
                        <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      </div>
                    </div>

                    {authorDropdownOpen ? (
                      <div className={`absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border p-2 shadow-xl ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <div className="mb-2 flex items-center justify-between px-1">
                          <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Authors ({Math.min(filteredAuthors.length, 5)} shown)</p>
                          <button
                            type="button"
                            onClick={() => setAuthorDropdownOpen(false)}
                            className={`grid h-6 w-6 place-items-center rounded-md ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
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
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                              <span className={`grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                {author.profilePhotoData ? (
                                  <img src={author.profilePhotoData} alt={`${author.name} avatar`} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-xs font-bold">{author.name.charAt(0).toUpperCase()}</span>
                                )}
                              </span>
                              <span className="min-w-0">
                                <p className={`truncate text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{author.name}</p>
                                <p className={`truncate text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {author.booksPublished} book{author.booksPublished === 1 ? '' : 's'} published
                                </p>
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className={`px-3 py-2 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No authors found</p>
                        )}
                        {filteredAuthors.length > 5 ? (
                          <p className={`px-3 pt-1 text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            Showing first 5 results. Type to refine search.
                          </p>
                        ) : null}
                        <div className={`mt-2 border-t pt-2 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
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
                  <label className={`text-xs font-black ${labelClass}`}>Category *</label>
                  <div className="relative mt-2" ref={categoryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                      className={`h-12 w-full rounded-xl border px-4 pr-10 text-left text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <BookOpen size={15} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                        <span className={form.category ? '' : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}>
                          {form.category || (categoriesLoading ? 'Loading categories...' : 'Select category')}
                        </span>
                      </span>
                    </button>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />

                    {categoryDropdownOpen ? (
                      <div className={`absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border p-2 shadow-xl ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <div className="mb-2 flex items-center justify-between px-1">
                          <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Categories ({Math.min(categories.length, 5)} shown)
                          </p>
                          <button
                            type="button"
                            onClick={() => setCategoryDropdownOpen(false)}
                            className={`grid h-6 w-6 place-items-center rounded-md ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
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
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                              <span className="inline-flex items-center gap-2 min-w-0">
                                <BookOpen size={14} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                                <span className="truncate">{category.name}</span>
                              </span>
                              <span className={`ml-2 rounded-md px-2 py-0.5 text-[10px] font-semibold ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                {category.status}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className={`px-3 py-2 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No categories found</p>
                        )}
                        {categories.length > 5 ? (
                          <p className={`px-3 pt-1 text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            Showing first 5 categories.
                          </p>
                        ) : null}
                        <div className={`mt-2 border-t pt-2 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
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
              </div>

            </article>

            <article className={`rounded-2xl border p-6 ${subtleCardShadow} ${cardClass}`}>
              <div className="mb-6 flex items-start gap-4">
                <div className={`grid h-11 w-11 place-items-center rounded-full ${iconBoxClass}`}>
                  <BookOpen size={19} />
                </div>
                <div>
                  <h3 className={`text-lg font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}`}>Optional Details</h3>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`text-xs font-black ${labelClass}`}>ISBN</label>
                  <input
                    value={form.isbn}
                    onChange={(e) => setField('isbn', e.target.value)}
                    className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                    placeholder="Enter ISBN (optional)"
                  />
                </div>
                <div>
                  <label className={`text-xs font-black ${labelClass}`}>Publisher</label>
                  <input
                    value={form.publisher}
                    onChange={(e) => setField('publisher', e.target.value)}
                    className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                    placeholder="Enter publisher (optional)"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className={`text-xs font-black ${labelClass}`}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value.slice(0, DESCRIPTION_MAX))}
                  className={`mt-2 min-h-[126px] w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                  placeholder="Enter a brief description about the book (optional)"
                />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{form.description.length} / {DESCRIPTION_MAX}</p>
              </div>
            </article>
          </div>

          <aside className="space-y-4">
            <article className={`rounded-2xl border p-6 ${subtleCardShadow} ${cardClass}`}>
              <div className="mb-6 flex items-start gap-4">
                <div className={`grid h-11 w-11 place-items-center rounded-full ${iconBoxClass}`}>
                  <ImagePlus size={19} />
                </div>
                <div>
                  <h3 className={`text-lg font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}`}>Book Cover</h3>
                  <p className={`mt-1 text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Upload a cover image for this book.</p>
                </div>
              </div>

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
                className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/60'
                    : isDarkMode
                      ? 'border-slate-700 bg-[#0f1f49]'
                      : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                {coverPreviewUrl ? (
                  <div className="space-y-3">
                    <img src={coverPreviewUrl} alt="Book cover preview" className="mx-auto h-44 w-32 rounded-lg object-cover shadow-sm" />
                    <p className={`truncate text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{form.coverFile?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <CloudUpload size={42} className={`mx-auto ${isDarkMode ? 'text-slate-400' : 'text-[#64748b]'}`} />
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Drag and drop image here</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>or</p>
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className={`rounded-lg border px-5 py-2.5 text-xs font-black ${isDarkMode ? 'border-slate-600 text-slate-200 hover:bg-slate-800' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'}`}
                    >
                      Choose File
                    </button>
                    <p className={`mx-auto max-w-[220px] text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Recommended size: 600 x 800px (JPG, PNG)<br />Max file size: 2MB</p>
                  </div>
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => handleCoverSelection(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </div>
              {coverError ? <p className="mt-2 text-xs font-semibold text-rose-600">{coverError}</p> : null}
            </article>

            <article className={`rounded-2xl border p-6 ${subtleCardShadow} ${cardClass}`}>
              <div className="mb-6 flex items-start gap-4">
                <div className={`grid h-11 w-11 place-items-center rounded-full ${iconBoxClass}`}>
                  <Package size={19} />
                </div>
                <div>
                  <h3 className={`text-lg font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}`}>Inventory Information</h3>
                  <p className={`mt-1 text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Provide inventory and availability details.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-xs font-black ${labelClass}`}>Number of Copies *</label>
                  <input
                    type="number"
                    min={1}
                    value={form.numberOfCopies}
                    onChange={(e) => {
                      const parsed = Number(e.target.value)
                      setField('numberOfCopies', Number.isFinite(parsed) ? parsed : 0)
                    }}
                    className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                    placeholder="Enter number of copies"
                  />
                  <FieldError error={errors.numberOfCopies} />
                </div>
                <div>
                  <label className={`text-xs font-black ${labelClass}`}>Shelf Location (Optional)</label>
                  <input
                    value={form.shelfLocation}
                    onChange={(e) => setField('shelfLocation', e.target.value)}
                    className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                    placeholder="e.g. 300.72 KAH or A-12"
                  />
                </div>
                <div>
                  <label className={`text-xs font-black ${labelClass}`}>Status *</label>
                  <div className="relative mt-2">
                    <select
                      value={form.status}
                      onChange={(e) => setField('status', e.target.value as BookAvailability)}
                      className={`h-12 w-full appearance-none rounded-xl border px-10 pr-10 text-sm outline-none focus:border-emerald-500 ${inputClass}`}
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                      <option value="Archived">Archived</option>
                    </select>
                    <span className="pointer-events-none absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-emerald-500" />
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>
              </div>
            </article>
          </aside>
        </div>

        <div className={`-mx-9 sticky bottom-0 mt-4 border-t px-9 py-3 ${isDarkMode ? 'border-slate-800 bg-[#020617]' : 'border-slate-200 bg-white'}`}>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className={`h-11 rounded-lg border px-8 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-700 px-8 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={15} />
              {isSaving ? 'Saving...' : 'Save Book'}
            </button>
          </div>
        </div>
      </section>

      {isAddAuthorOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-md rounded-2xl border shadow-2xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-5 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Add New Author</h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Create an author and use it for this book.</p>
              </div>
              <button type="button" onClick={() => setIsAddAuthorOpen(false)} className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateAuthor} className="space-y-4 px-5 py-4">
              <div>
                <label className={`text-sm font-semibold ${labelClass}`}>Author Name *</label>
                <input
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  className={`mt-1 h-11 w-full rounded-xl border px-4 outline-none focus:border-emerald-500 ${inputClass}`}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className={`text-sm font-semibold ${labelClass}`}>Email (Optional)</label>
                <input
                  value={newAuthorEmail}
                  onChange={(e) => setNewAuthorEmail(e.target.value)}
                  className={`mt-1 h-11 w-full rounded-xl border px-4 outline-none focus:border-emerald-500 ${inputClass}`}
                  placeholder="Enter email address"
                />
              </div>
              {authorCreateError ? <p className="text-xs font-semibold text-rose-600">{authorCreateError}</p> : null}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button type="button" onClick={() => setIsAddAuthorOpen(false)} className={`h-10 rounded-xl border text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}>
                  Cancel
                </button>
                <button type="submit" disabled={isCreatingAuthor} className="h-10 rounded-xl bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70">
                  {isCreatingAuthor ? 'Saving...' : 'Save Author'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {isAddCategoryOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl ${cardClass}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h4 className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Add New Category</h4>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Create a new category and select it for this book.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddCategoryOpen(false)
                  setCategoryCreateError('')
                }}
                className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
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
                  className={`h-10 rounded-lg border text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'}`}
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
    </form>
  )
}
