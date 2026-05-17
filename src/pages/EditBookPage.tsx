import React, { useState } from 'react'
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  CloudUpload,
  Files,
  ImagePlus,
  NotebookPen,
  Package,
  Save,
  StickyNote,
  X,
  Trash2
} from 'lucide-react'

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
}

type EditBookPageProps = {
  book: BookRow
  isDarkMode: boolean
  onBack: () => void
  onSave: (updatedBook: BookRow) => void
}

const categories = [
  'Social Sciences',
  'History',
  'Education',
  'Law',
  'Biography',
  'Library Science',
  'Technology',
  'Fiction',
]

// ─── Realtime Simulated High-Fidelity Book Cover Component ───────────────────
function HighFidelityBookCover({ title, author }: { title: string; author: string }) {
  return (
    <div className="w-[145px] h-[195px] rounded-lg shadow-md relative overflow-hidden flex flex-col justify-between p-3 text-slate-800 bg-[#fdecdb] border border-orange-200/60 shrink-0 select-none">
      {/* 3D Spine shading */}
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-r from-black/10 to-transparent rounded-l" />
      <div className="absolute top-0 left-2 w-[1px] h-full bg-white/30" />
      
      {/* Top logo */}
      <div className="flex flex-col gap-0.5 z-10 pl-2">
        <span className="text-[7px] uppercase font-black tracking-widest text-amber-900/60">Rex Bookstore</span>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-1 z-10 py-2 text-center px-1">
        <h4 className="text-[12px] font-black leading-tight text-amber-950 font-serif tracking-tight drop-shadow-sm line-clamp-3">
          {title || 'Sosyolohiya sa Filipino'}
        </h4>
        
        {/* Crown/Diamond abstract graphic */}
        <div className="mt-2.5 relative w-8 h-8 flex items-center justify-center">
          <div className="absolute w-6 h-6 rotate-45 border-2 border-emerald-700 bg-emerald-600/10 rounded" />
          <div className="absolute w-4 h-4 rotate-45 bg-amber-600 rounded-sm" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      </div>
      
      {/* Footer author */}
      <div className="z-10 pl-2 flex flex-col items-center text-center">
        <div className="h-[1.5px] w-6 bg-amber-900/30 rounded mb-1" />
        <span className="text-[7.5px] font-bold text-amber-900/80 uppercase tracking-wider truncate max-w-full">
          {author || 'ALICIA H. KAHAYON'}
        </span>
      </div>
    </div>
  )
}

export function EditBookPage({ book, isDarkMode, onBack, onSave }: EditBookPageProps) {
  // Tab states
  const [activeTab, setActiveTab] = useState<'basic' | 'catalog' | 'notes'>('basic')

  // Cover Upload States & Ref
  const coverInputRef = React.useRef<HTMLInputElement | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const isRealImage = book.cover.startsWith('http') || book.cover.startsWith('data:') || book.cover.startsWith('blob:')
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(isRealImage ? book.cover : null)

  // Form Fields
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [isbn, setIsbn] = useState(book.isbn)
  const [category, setCategory] = useState(book.category)
  const [status, setStatus] = useState<BookStatus>(book.status)
  const [publisher, setPublisher] = useState('Rex Book Store, Inc.')
  const [publicationDate, setPublicationDate] = useState('2021')
  const [edition, setEdition] = useState('2nd Edition')
  const [description, setDescription] = useState(
    'This book explores the foundational concepts of sociology using the Filipino context. It discusses key theories, social structures, culture, and social change in the Philippines.'
  )
  
  // Library Cataloging
  const [catalogCallNumber, setCatalogCallNumber] = useState(book.callNumber)
  const [publicationPlace, setPublicationPlace] = useState('Manila, Philippines')
  const [subject1, setSubject1] = useState('Sociology')
  const [subject2, setSubject2] = useState('Filipino Culture')
  const [subject3, setSubject3] = useState('Social Issues')
  const [seriesTitle, setSeriesTitle] = useState('')
  const [addedEntryT, setAddedEntryT] = useState('')
  const [addedEntryA, setAddedEntryA] = useState('')
  const [physicalDescription, setPhysicalDescription] = useState('xiv, 312 pages : illustrations ; 23 cm')

  // Inventory
  const [numberOfCopies, setNumberOfCopies] = useState(book.available.split(' / ')[0] || '5')
  const [shelfCallNumber, setShelfCallNumber] = useState(book.callNumber)
  const [year, setYear] = useState(book.year)

  // Additional Notes
  const [notes, setNotes] = useState('Recommended reading for introductory college sociology courses. Updated text includes recent census data.')

  // Uploader Actions
  const handleChooseFile = () => {
    coverInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveCover = () => {
    setCoverFile(null)
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
      cover: coverPreviewUrl || '📙', // Revert to emoji or custom color spine if no cover is set
      callNumber: catalogCallNumber,
      year: Number(year) || book.year,
      available: `${numberOfCopies} / ${book.available.split(' / ')[1] || '7'}`
    })
  }

  const cardClass = isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'
  const labelClass = isDarkMode ? 'text-slate-300' : 'text-slate-700'
  const inputClass = isDarkMode
    ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
    : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'

  const tabItemClass = (tab: 'basic' | 'catalog' | 'notes') => {
    const isActive = activeTab === tab
    return `flex items-center gap-2 px-1 py-3 text-sm font-semibold border-b-2 transition-all duration-150 ${
      isActive
        ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
    }`
  }

  return (
    <div className={`p-4 ${isDarkMode ? 'bg-[#020617]' : 'bg-[#f8fafc]'} h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] min-h-0 flex-1 flex flex-col`}>
      <form onSubmit={handleSubmit} className={`mx-auto w-full max-w-[1650px] h-full max-h-full rounded-2xl border flex flex-col shadow-sm overflow-hidden ${cardClass}`}>
        
        {/* Header Block (Unified exactly like screenshot) */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/10">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
              <NotebookPen size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight">Edit Book Details</h2>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Update catalog information and inventory details.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className={`grid h-9 w-9 place-items-center rounded-lg transition ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Bar (Directly below header divider) */}
        <div className="px-6 border-b border-slate-200/10 flex gap-8">
          <button type="button" onClick={() => setActiveTab('basic')} className={tabItemClass('basic')}>
            <BookOpen size={16} />
            Basic Information
          </button>
          <button type="button" onClick={() => setActiveTab('catalog')} className={tabItemClass('catalog')}>
            <Files size={16} />
            Library Cataloging
          </button>
          <button type="button" onClick={() => setActiveTab('notes')} className={tabItemClass('notes')}>
            <StickyNote size={16} />
            Additional Notes
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 pb-16 grid gap-6 xl:grid-cols-[1fr_450px] items-start flex-1 overflow-y-auto min-h-0">
          
          {/* Left Column - Switches dynamically based on Active Tab */}
          <div className="space-y-6">
            
            {activeTab === 'basic' && (
              <article className={`rounded-2xl border p-6 ${cardClass}`}>
                <div className="mb-5 flex items-start gap-3 border-b border-slate-200/10 pb-4">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                    <BookOpen size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Basic Information</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Provide the essential details about the book.</p>
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
                          className={`h-11 w-full appearance-none rounded-xl border px-4 pr-10 outline-none ${inputClass}`}
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      </div>
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
                        </select>
                        <span className={`pointer-events-none absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
                          status === 'Available' ? 'bg-emerald-500'
                          : status === 'Borrowed' ? 'bg-amber-500'
                          : 'bg-rose-500'
                        }`} />
                        <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Publisher</label>
                      <input
                        type="text"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                        className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Publication Date</label>
                      <div className={`mt-1.5 flex h-11 items-center gap-2 rounded-xl border px-4 focus-within:border-emerald-500 ${inputClass}`}>
                        <input
                          type="text"
                          value={publicationDate}
                          onChange={(e) => setPublicationDate(e.target.value)}
                          className="w-full bg-transparent outline-none"
                        />
                        <CalendarDays size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Edition</label>
                    <input
                      type="text"
                      value={edition}
                      onChange={(e) => setEdition(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                      className={`mt-1.5 min-h-[116px] w-full rounded-xl border px-4 py-3 outline-none ${inputClass}`}
                    />
                    <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{description.length} / 1000</p>
                  </div>
                </div>
              </article>
            )}

            {activeTab === 'catalog' && (
              <article className={`rounded-2xl border p-6 ${cardClass}`}>
                <div className="mb-5 flex items-start gap-3 border-b border-slate-200/10 pb-4">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                    <Files size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Library Cataloging</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Detailed library cataloging information.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Call Number</label>
                    <input
                      type="text"
                      value={catalogCallNumber}
                      onChange={(e) => setCatalogCallNumber(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Publication Place</label>
                    <input
                      type="text"
                      value={publicationPlace}
                      onChange={(e) => setPublicationPlace(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Subject 1</label>
                    <input
                      type="text"
                      value={subject1}
                      onChange={(e) => setSubject1(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Subject 2</label>
                    <input
                      type="text"
                      value={subject2}
                      onChange={(e) => setSubject2(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Subject 3</label>
                    <input
                      type="text"
                      value={subject3}
                      onChange={(e) => setSubject3(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Series Title</label>
                    <input
                      type="text"
                      value={seriesTitle}
                      onChange={(e) => setSeriesTitle(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Added Entry (T)</label>
                    <input
                      type="text"
                      value={addedEntryT}
                      onChange={(e) => setAddedEntryT(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Added Entry (A)</label>
                    <input
                      type="text"
                      value={addedEntryA}
                      onChange={(e) => setAddedEntryA(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Physical Description</label>
                  <input
                    type="text"
                    value={physicalDescription}
                    onChange={(e) => setPhysicalDescription(e.target.value)}
                    className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                  />
                </div>
              </article>
            )}

            {activeTab === 'inventory' && (
              <article className={`rounded-2xl border p-6 ${cardClass}`}>
                <div className="mb-5 flex items-start gap-3 border-b border-slate-200/10 pb-4">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                    <Package size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Inventory Information</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Inventory and location parameters.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                      <label className={labelClass}>Number of Copies *</label>
                      <span className="text-slate-400 dark:text-slate-500 font-semibold normal-case">Available / Total</span>
                    </div>
                    <input
                      type="number"
                      required
                      value={numberOfCopies}
                      onChange={(e) => setNumberOfCopies(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
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
                      <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Year</label>
                      <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                      />
                    </div>
                  </div>
                </div>
              </article>
            )}

            {activeTab === 'notes' && (
              <article className={`rounded-2xl border p-6 ${cardClass}`}>
                <div className="mb-5 flex items-start gap-3 border-b border-slate-200/10 pb-4">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                    <StickyNote size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Additional Notes</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Add any other notes or annotations.</p>
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Notes / Annotations</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value.slice(0, 2000))}
                    className={`mt-1.5 min-h-[120px] w-full rounded-xl border px-4 py-3 outline-none ${inputClass}`}
                  />
                  <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{notes.length} / 2000</p>
                </div>
              </article>
            )}

          </div>

          {/* Right Column - Book Cover & Inventory Cards (Always visible exactly like screenshot) */}
          <aside className="space-y-6">
            
            {/* Book Cover Card */}
            <article className={`rounded-2xl border p-5 ${cardClass}`}>
              <div className="mb-4 flex items-start gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
                  <ImagePlus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Book Cover</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Upload or update the book cover image.</p>
                </div>
              </div>

              <div className="flex gap-4">
                {/* Visual Cover Preview (High Fidelity rendering or uploaded image) */}
                {coverPreviewUrl ? (
                  <div className="relative w-[145px] h-[195px] rounded-lg shadow-md overflow-hidden shrink-0 border border-slate-200/10">
                    <img src={coverPreviewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <HighFidelityBookCover title={title} author={author} />
                )}
                
                {/* Upload zone */}
                <div
                  onClick={handleChooseFile}
                  className={`flex-1 rounded-xl border-2 border-dashed p-4 text-center flex flex-col justify-center items-center cursor-pointer transition ${
                    isDarkMode ? 'border-slate-700 hover:border-slate-500 bg-[#0f1f49]/50 hover:bg-[#0f1f49]/70' : 'border-slate-200 hover:border-emerald-500 bg-slate-50/40 hover:bg-emerald-50/20'
                  }`}
                >
                  <CloudUpload size={28} className={`mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Drag and drop image here</p>
                  <p className={`text-[10px] my-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>or</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleChooseFile(); }}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${isDarkMode ? 'border-slate-600 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
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
                  <p className={`text-[9px] mt-2 leading-tight ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
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

            {/* Inventory Information Card */}
            <article className={`rounded-2xl border p-5 ${cardClass}`}>
              <div className="mb-4 flex items-start gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
                  <Package size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Inventory Information</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Provide inventory and availability details.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <label className={labelClass}>Number of Copies *</label>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold normal-case">Available / Total</span>
                  </div>
                  <input
                    type="number"
                    required
                    value={numberOfCopies}
                    onChange={(e) => setNumberOfCopies(e.target.value)}
                    className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                  />
                </div>

                <div className="grid gap-4 grid-cols-2">
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
                    <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Year</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
                  </div>
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
                    </select>
                    {/* Status dot indicator */}
                    <span className={`pointer-events-none absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
                      status === 'Available' ? 'bg-emerald-500'
                      : status === 'Borrowed' ? 'bg-amber-500'
                      : 'bg-rose-500'
                    }`} />
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>
              </div>
            </article>

          </aside>
        </div>

        {/* Footer Actions (Unified sticky inside card) */}
        <div className={`px-6 py-4 flex justify-between items-center border-t ${
          isDarkMode ? 'border-slate-800 bg-[#0b1738]/40' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <button
            type="button"
            onClick={onBack}
            className={`h-11 rounded-xl border px-6 text-sm font-semibold transition ${
              isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-emerald-700 hover:bg-emerald-800 h-11 px-8 text-sm font-semibold text-white inline-flex items-center gap-2 transition"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>

      </form>
    </div>
  )
}
