import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
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
  Trash2,
  Check
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

// ─── Realtime Premium CSS Book Cover Component ──────────────────────────────
function BookCoverPreview({ cover, title, author }: { cover: string; title: string; author: string }) {
  const bg = cover === '📙' ? 'bg-gradient-to-br from-amber-500 to-orange-600'
           : cover === '📕' ? 'bg-gradient-to-br from-rose-500 to-red-600'
           : cover === '📘' ? 'bg-gradient-to-br from-sky-500 to-blue-600'
           : cover === '📗' ? 'bg-gradient-to-br from-emerald-500 to-green-600'
           : 'bg-gradient-to-br from-violet-500 to-purple-600';

  return (
    <div className={`w-32 h-44 rounded-lg shadow-lg relative overflow-hidden flex flex-col justify-between p-3 text-white ${bg} border border-white/10 shrink-0 select-none`}>
      {/* 3D Spine effect */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-black/10 backdrop-blur-[0.5px] rounded-l" />
      <div className="absolute top-0 left-1.5 w-[1px] h-full bg-white/20" />
      
      <div className="flex flex-col gap-1 z-10 pl-2">
        <span className="text-[8px] uppercase font-bold tracking-widest opacity-60">infoLib</span>
        <h4 className="text-[11px] font-black leading-tight line-clamp-3 tracking-wide">{title || 'Untitled Book'}</h4>
      </div>
      
      <div className="z-10 pl-2 flex flex-col gap-1">
        <div className="h-[1.5px] w-6 bg-white/40 rounded" />
        <span className="text-[8px] font-medium opacity-80 truncate">{author || 'Unknown Author'}</span>
      </div>
      
      {/* Decorative patterns */}
      <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-white/5" />
    </div>
  )
}

export function EditBookPage({ book, isDarkMode, onBack, onSave }: EditBookPageProps) {
  // Tab states
  const [activeTab, setActiveTab] = useState<'basic' | 'catalog' | 'inventory' | 'notes'>('basic')

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
  const [availableCopies, setAvailableCopies] = useState(book.available.split(' / ')[0] || '5')
  const [totalCopies, setTotalCopies] = useState(book.available.split(' / ')[1] || '7')
  const [shelfCallNumber, setShelfCallNumber] = useState(book.callNumber)
  const [year, setYear] = useState(book.year)

  // Additional Notes
  const [notes, setNotes] = useState('Recommended reading for introductory college sociology courses. Updated text includes recent census data.')

  // Refs for scrolling
  const basicInfoRef = useRef<HTMLDivElement>(null)
  const catalogingRef = useRef<HTMLDivElement>(null)
  const inventoryRef = useRef<HTMLDivElement>(null)
  const notesRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (tab: 'basic' | 'catalog' | 'inventory' | 'notes', ref: React.RefObject<HTMLDivElement>) => {
    setActiveTab(tab)
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
      callNumber: catalogCallNumber,
      year: Number(year) || book.year,
      available: `${availableCopies} / ${totalCopies}`
    })
  }

  const cardClass = isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'
  const labelClass = isDarkMode ? 'text-slate-200' : 'text-slate-800'
  const inputClass = isDarkMode
    ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
    : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'

  const tabItemClass = (tab: string) => {
    const isActive = activeTab === tab
    return `flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-all duration-150 ${
      isActive
        ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
    }`
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`min-h-0 flex-1 overflow-auto px-6 py-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}
    >
      <div className="mx-auto w-full max-w-[1650px] space-y-5">
        {/* Header navigation breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={onBack}
              className={`inline-flex items-center gap-1.5 font-semibold ${isDarkMode ? 'text-slate-300 hover:text-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ArrowLeft size={15} />
              Books
            </button>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>{'>'}</span>
            <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Edit Book Details</span>
          </div>

          <button
            type="button"
            onClick={onBack}
            className={`inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold ${
              isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft size={15} className="mr-1.5" />
            Back to Books
          </button>
        </div>

        {/* Title Block */}
        <div className={`flex items-center justify-between rounded-2xl border p-5 ${cardClass}`}>
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
              <NotebookPen size={22} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Edit Book Details</h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Update catalog information and inventory details.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className={`grid h-10 w-10 place-items-center rounded-xl transition ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Bar Navigation */}
        <div className="border-b border-slate-200/10 flex flex-wrap gap-2">
          <button type="button" onClick={() => scrollToSection('basic', basicInfoRef)} className={tabItemClass('basic')}>
            <BookOpen size={16} />
            Basic Information
          </button>
          <button type="button" onClick={() => scrollToSection('catalog', catalogingRef)} className={tabItemClass('catalog')}>
            <Files size={16} />
            Library Cataloging
          </button>
          <button type="button" onClick={() => scrollToSection('inventory', inventoryRef)} className={tabItemClass('inventory')}>
            <Package size={16} />
            Inventory Information
          </button>
          <button type="button" onClick={() => scrollToSection('notes', notesRef)} className={tabItemClass('notes')}>
            <StickyNote size={16} />
            Additional Notes
          </button>
        </div>

        {/* Main Grid Content */}
        <div className="grid gap-6 xl:grid-cols-[1fr_450px]">
          {/* Scrollable Form Cards Column */}
          <div className="space-y-6">
            
            {/* Section 1: Basic Info */}
            <article ref={basicInfoRef} className={`rounded-2xl border p-6 transition-all duration-300 ${cardClass} scroll-mt-24`}>
              <div className="mb-5 flex items-start gap-3 border-b border-slate-200/10 pb-4">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 shrink-0">
                  <BookOpen size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Basic Information</h3>
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
                      {/* Status indicator dot */}
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
                    <input
                      type="text"
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-4 outline-none ${inputClass}`}
                    />
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
                    className={`mt-1.5 min-h-[120px] w-full rounded-xl border px-4 py-3 outline-none ${inputClass}`}
                  />
                  <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{description.length} / 1000</p>
                </div>
              </div>
            </article>

            {/* Section 2: Library Cataloging */}
            <article ref={catalogingRef} className={`rounded-2xl border p-6 transition-all duration-300 ${cardClass} scroll-mt-24`}>
              <div className="mb-5 flex items-start gap-3 border-b border-slate-200/10 pb-4">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 shrink-0">
                  <Files size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Library Cataloging</h3>
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

            {/* Section 4: Additional Notes */}
            <article ref={notesRef} className={`rounded-2xl border p-6 transition-all duration-300 ${cardClass} scroll-mt-24`}>
              <div className="mb-5 flex items-start gap-3 border-b border-slate-200/10 pb-4">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 shrink-0">
                  <StickyNote size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Additional Notes</h3>
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

          </div>

          {/* Right Column (Cover & Inventory) */}
          <aside className="space-y-6">
            
            {/* Book Cover Card */}
            <article className={`rounded-2xl border p-5 ${cardClass}`}>
              <div className="mb-4 flex items-start gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 shrink-0">
                  <ImagePlus size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Book Cover</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Upload or update the book cover image.</p>
                </div>
              </div>

              <div className="flex gap-4">
                {/* Visual Cover Preview */}
                <BookCoverPreview cover={book.cover} title={title} author={author} />
                
                {/* Upload zone */}
                <div className={`flex-1 rounded-xl border-2 border-dashed p-4 text-center flex flex-col justify-center items-center transition ${
                  isDarkMode ? 'border-slate-700 bg-[#0f1f49]/50' : 'border-slate-200 bg-slate-50/40'
                }`}>
                  <CloudUpload size={28} className={`mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Drag and drop image here</p>
                  <p className={`text-[10px] my-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>or</p>
                  <button
                    type="button"
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${isDarkMode ? 'border-slate-600 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                  >
                    Choose File
                  </button>
                  <p className={`text-[9px] mt-2 leading-tight ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Recommended: 600 x 800px (JPG, PNG)<br />Max file size: 2MB
                  </p>
                </div>
              </div>

              {/* Remove cover button */}
              <button
                type="button"
                className="mt-4 w-full border border-rose-500/35 hover:bg-rose-500/10 text-rose-500 font-semibold text-xs h-10 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} />
                Remove Cover
              </button>
            </article>

            {/* Section 3: Inventory Information */}
            <article ref={inventoryRef} className={`rounded-2xl border p-5 transition-all duration-300 ${cardClass} scroll-mt-24`}>
              <div className="mb-4 flex items-start gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 shrink-0">
                  <Package size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Inventory Information</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Provide inventory and availability details.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <label className={labelClass}>Number of Copies *</label>
                    <span className="text-slate-400 dark:text-slate-500">Available / Total</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        required
                        value={availableCopies}
                        onChange={(e) => setAvailableCopies(e.target.value)}
                        className={`h-11 w-full rounded-xl border px-3 outline-none text-center ${inputClass}`}
                        placeholder="Available"
                      />
                      <span className="absolute -top-1.5 left-2 bg-[#0b1738] dark:bg-[#0b1738] px-1 text-[8px] font-bold text-slate-400">AVAILABLE</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        required
                        value={totalCopies}
                        onChange={(e) => setTotalCopies(e.target.value)}
                        className={`h-11 w-full rounded-xl border px-3 outline-none text-center ${inputClass}`}
                        placeholder="Total"
                      />
                      <span className="absolute -top-1.5 left-2 bg-[#0b1738] dark:bg-[#0b1738] px-1 text-[8px] font-bold text-slate-400">TOTAL</span>
                    </div>
                  </div>
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
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className={`sticky bottom-0 -mx-6 mt-6 border-t px-6 py-4 flex justify-between items-center ${
        isDarkMode ? 'border-slate-800 bg-[#020617]/95 backdrop-blur' : 'border-slate-200 bg-white/95 backdrop-blur'
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
  )
}
