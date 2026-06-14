import React, { useEffect, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronDown,
  CloudUpload,
  ImagePlus,
  Package,
  Save,
  Trash2
} from 'lucide-react'
import { DynamicBookCover } from '../components/ui/DynamicBookCover'
import { listCategories } from '../lib/tauriApi'

type BookStatus = 'Available' | 'Borrowed' | 'Overdue' | 'Archived'

type BookRow = {
  id: number
  cover: string
  title: string
  isbn: string
  author: string
  category: string
  callNumber: string
  publisher: string
  status: BookStatus
  available: string
  categoryColor?: string
}

type EditBookPageProps = {
  book: BookRow
  isDarkMode: boolean
  onBack: () => void
  onSave: (updatedBook: BookRow) => void
}

// ─── Realtime Simulated High-Fidelity Book Cover Component ───────────────────
export function EditBookPage({ book, isDarkMode, onBack, onSave }: EditBookPageProps) {
  // Cover Upload States & Ref
  const coverInputRef = React.useRef<HTMLInputElement | null>(null)
  const isRealImage = book.cover.startsWith('http') || book.cover.startsWith('data:') || book.cover.startsWith('blob:')
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(isRealImage ? book.cover : null)

  // Form Fields
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [isbn, setIsbn] = useState(book.isbn)
  const [category, setCategory] = useState(book.category)
  const [categories, setCategories] = useState<string[]>(() => book.category ? [book.category] : [])
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({})
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [status, setStatus] = useState<BookStatus>(book.status)
  const [publisher, setPublisher] = useState(book.publisher)
  const [description, setDescription] = useState(
    'This book explores the foundational concepts of sociology using the Filipino context. It discusses key theories, social structures, culture, and social change in the Philippines.'
  )

  // Inventory
  const parts = book.available.split(' / ')
  const [availableCopies, setAvailableCopies] = useState(parts[0] || '1')
  const [numberOfCopies, setNumberOfCopies] = useState(parts[1] || '1')
  const [shelfCallNumber, setShelfCallNumber] = useState(book.callNumber)


  useEffect(() => {
    let cancelled = false

    const loadCategoryOptions = async () => {
      setCategoriesLoading(true)
      try {
        const rows = await listCategories(1000)
        if (cancelled) return

        const categoryNames = [
          book.category,
          ...rows.filter((row) => row.status !== 'Inactive').map((row) => row.name),
        ].filter((name): name is string => Boolean(name?.trim()))
        const uniqueNames = Array.from(
          new Map(categoryNames.map((name) => [name.trim().toLocaleLowerCase(), name.trim()])).values(),
        )

        const map: Record<string, string> = {}
        for (const row of rows) {
          if (row.name && row.color) {
            map[row.name] = row.color
          }
        }
        setCategoriesMap(map)

        setCategories(uniqueNames)
      } catch {
        if (!cancelled) {
          setCategories(book.category ? [book.category] : [])
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false)
        }
      }
    }

    void loadCategoryOptions()
    return () => {
      cancelled = true
    }
  }, [book.category])

  const handleCopiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTotal = e.target.value
    const previousTotalValue = Number.parseInt(numberOfCopies, 10) || 0
    const nextTotalValue = Number.parseInt(nextTotal, 10) || 0
    const currentAvailable = Number.parseInt(availableCopies, 10) || 0

    setNumberOfCopies(nextTotal)
    setAvailableCopies(String(Math.max(0, currentAvailable + nextTotalValue - previousTotalValue)))
  }

  // Uploader Actions
  const handleChooseFile = () => {
    coverInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveCover = () => {
    setCoverPreviewUrl(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...book,
      title,
      author,
      isbn,
      category,
      status,
      cover: coverPreviewUrl || '',
      callNumber: shelfCallNumber,
      publisher,
      available: `${availableCopies} / ${numberOfCopies}`
    })
  }

  const cardClass = isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const labelClass = isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
  const inputClass = isDarkMode
    ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500'
    : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400 focus:border-emerald-500'

  return (
    <div className={`min-h-0 flex-1 overflow-auto px-4 pt-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <form onSubmit={handleSubmit} className="px-5 pt-5 pb-0">
        <div className="mb-4">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
          >
            <ArrowLeft size={16} />
            Back to Books
          </button>
        </div>

        <h2 className={`text-[38px] font-black leading-tight tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}`}>Edit Book</h2>
        <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Update catalog information, inventory, and cover details.
        </p>

        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_450px]">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            <article className={`rounded-2xl border p-6 ${cardClass}`}>
                <div className="mb-5 flex items-start gap-3 border-b border-zinc-200/10 pb-4">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                    <BookOpen size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Basic Information</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Provide the essential details about the book.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Book Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Author *</label>
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>ISBN *</label>
                      <input
                        type="text"
                        required
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Category *</label>
                      <div className="relative mt-1.5">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          disabled={categoriesLoading}
                          className={`h-11 w-full appearance-none rounded-xl border px-4 pr-10 outline-none ${inputClass}`}
                        >
                          {categoriesLoading && categories.length === 0 ? (
                            <option value="">Loading categories...</option>
                          ) : null}
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                      </div>
                    </div>
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Publisher</label>
                      <div className={`mt-1.5 flex h-11 items-center gap-2 rounded-xl border px-4 focus-within:border-emerald-500 ${inputClass}`}>
                        <input
                          type="text"
                          value={publisher}
                          onChange={(e) => setPublisher(e.target.value)}
                          className="w-full bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                      className={`mt-1.5 min-h-[116px] w-full rounded-xl border px-4 py-3 outline-none ${inputClass}`}
                    />
                    <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{description.length} / 1000</p>
                  </div>
                </div>
            </article>

          </div>

          {/* Right Column - Book Cover and Inventory */}
          <aside className="space-y-6">
            
            {/* Book Cover Card */}
            <article className={`rounded-2xl border p-5 ${cardClass}`}>
              <div className="mb-4 flex items-start gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
                  <ImagePlus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Book Cover</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Upload or update the book cover image.</p>
                </div>
              </div>

              <div className="flex gap-4">
                {/* Visual Cover Preview (High Fidelity rendering or uploaded image) */}
                {coverPreviewUrl ? (
                  <div className="relative w-[145px] h-[195px] rounded-lg shadow-md overflow-hidden shrink-0 border border-zinc-200/10">
                    <img src={coverPreviewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-[195px] w-[145px] shrink-0 rounded-lg shadow-md">
                    <DynamicBookCover title={title} author={author} seed={book.id} baseColor={categoriesMap[category] || book.categoryColor} />
                  </div>
                )}
                
                {/* Upload zone */}
                <div
                  onClick={handleChooseFile}
                  className={`flex-1 rounded-xl border-2 border-dashed p-4 text-center flex flex-col justify-center items-center cursor-pointer transition ${
                    isDarkMode ? 'border-zinc-700 hover:border-zinc-500 bg-[#27272A]/50 hover:bg-[#27272A]/70' : 'border-zinc-200 hover:border-emerald-500 bg-zinc-50/40 hover:bg-emerald-50/20'
                  }`}
                >
                  <CloudUpload size={28} className={`mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>Drag and drop image here</p>
                  <p className={`text-[10px] my-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>or</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleChooseFile(); }}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${isDarkMode ? 'border-zinc-600 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'}`}
                  >
                    Choose File
                  </button>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className={`text-[9px] mt-2 leading-tight ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Recommended: 600 x 800px (JPG, PNG)<br />Max file size: 2MB
                  </p>
                </div>
              </div>

              {/* Remove cover button */}
              <button
                type="button"
                onClick={handleRemoveCover}
                className="mt-4 w-full border border-rose-500/25 hover:bg-rose-500/5 text-rose-500 font-semibold text-xs h-10 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} />
                Remove Cover
              </button>
            </article>

            <article className={`rounded-2xl border p-5 ${cardClass}`}>
              <div className="mb-4 flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Package size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Inventory Information</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Provide inventory and availability details.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <label className={labelClass}>Number of Copies *</label>
                    <span className="font-semibold normal-case text-zinc-400 dark:text-zinc-500">
                      {availableCopies} available
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    required
                    value={numberOfCopies}
                    onChange={handleCopiesChange}
                    className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Shelf / Call Number</label>
                  <input
                    type="text"
                    value={shelfCallNumber}
                    onChange={(e) => setShelfCallNumber(e.target.value)}
                    className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Status *</label>
                  <div className="relative mt-1.5">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as BookStatus)}
                      className={`h-11 w-full appearance-none rounded-xl border pl-10 pr-10 outline-none ${inputClass}`}
                    >
                      <option value="Available">Available</option>
                      <option value="Borrowed">Borrowed</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Archived">Archived</option>
                    </select>
                    <span
                      className={`pointer-events-none absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
                        status === 'Available'
                          ? 'bg-emerald-500'
                          : status === 'Borrowed'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                      }`}
                    />
                    <ChevronDown
                      size={16}
                      className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    />
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
              Save Changes
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}
