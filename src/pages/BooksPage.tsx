import { useState } from 'react'
import { BookOpen, Bookmark, ChevronDown, Clock3, Download, Filter, Grid2x2, List, MoreHorizontal, RotateCcw, Search, Upload } from 'lucide-react'

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

type BooksPageProps = {
  isDarkMode: boolean
  onOpenBookDetail: () => void
}

const stats = [
  { label: 'All Books', value: '6,619', icon: BookOpen, active: true },
  { label: 'Available', value: '5,547', icon: Bookmark, active: false },
  { label: 'Borrowed', value: '320', icon: RotateCcw, active: false },
  { label: 'Overdue', value: '45', icon: Clock3, active: false },
  { label: 'Archived', value: '52', icon: Filter, active: false },
]

const books: BookRow[] = [
  { id: 1, cover: '📙', title: 'Sosyolohiya sa Filipino', isbn: '978-621-455-010-2', author: 'Kahayon, Alicia H.', category: 'Social Sciences', callNumber: '300.72 KAH', year: 2021, status: 'Available', available: '5 / 7' },
  { id: 2, cover: '📕', title: 'Understanding Philippine Social Realities through the Filipino Family', isbn: '978-971-009-123-4', author: 'Ramirez, Mina M.', category: 'Social Sciences', callNumber: '305.23 RAM', year: 2020, status: 'Borrowed', available: '1 / 3' },
  { id: 3, cover: '📘', title: 'The Conjugal Dictatorship of Ferdinand and Imelda Marcos I', isbn: '978-971-555-001-1', author: 'Mijares, Primitivo', category: 'History', callNumber: '959.904 MIJ', year: 2018, status: 'Available', available: '2 / 4' },
  { id: 4, cover: '📗', title: 'Filipino Values Today', isbn: '978-971-100-456-7', author: 'Timberza, Florentino T.', category: 'Education', callNumber: '370.115 TIM', year: 2019, status: 'Available', available: '3 / 5' },
  { id: 5, cover: '📔', title: 'The Fateful Years', isbn: '978-621-455-789-6', author: 'Agoncillo, Teodoro A.', category: 'History', callNumber: '959.902 AGO', year: 2017, status: 'Overdue', available: '0 / 2' },
  { id: 6, cover: '📓', title: 'Philippine Constitution Explained', isbn: '978-971-888-777-1', author: 'De Vera, Hector S.', category: 'Law', callNumber: '342.59903 DEV', year: 2022, status: 'Available', available: '4 / 6' },
  { id: 7, cover: '📙', title: 'The Life and Works of Jose Rizal', isbn: '978-971-245-678-3', author: 'Tellos, Ricardo', category: 'Biography', callNumber: '920 RIZ', year: 2016, status: 'Borrowed', available: '1 / 2' },
  { id: 8, cover: '📒', title: 'Introduction to Library Science', isbn: '978-971-333-222-8', author: 'Villanueva, Ma. Teresa', category: 'Library Science', callNumber: '025.1 VIL', year: 2021, status: 'Available', available: '6 / 8' },
]

function getStatusClass(status: BookStatus) {
  if (status === 'Available') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  if (status === 'Borrowed') return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
}

function getCategoryClass(category: string) {
  switch (category) {
    case 'Social Sciences':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
    case 'History':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
    case 'Education':
      return 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
    case 'Law':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
    case 'Biography':
      return 'bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300'
    default:
      return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300'
  }
}

export function BooksPage({ isDarkMode, onOpenBookDetail }: BooksPageProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Books</h2>
            <p className={`mt-1 text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage all library books and materials</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700">
              <span className="text-lg leading-none">+</span>
              Add Book
            </button>
            <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <Upload size={15} />
              Import
            </button>
            <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <Download size={15} />
              Export
            </button>
          </div>
        </div>

        <div className={`mt-5 overflow-x-auto rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
          <div className={`flex min-w-[880px] items-center gap-2 px-3 py-3 ${isDarkMode ? 'bg-[#0b1738]' : 'bg-white'}`}>
            {stats.map((item) => {
              const ItemIcon = item.icon
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                    item.active
                      ? 'border border-emerald-600 bg-emerald-600 text-white'
                      : isDarkMode
                        ? 'border border-slate-700 bg-[#0f1f49] text-slate-300 hover:bg-slate-800'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ItemIcon size={15} />
                  {item.label}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${item.active ? 'bg-emerald-500 text-white' : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                    {item.value}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={`mt-4 overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
          <div className={`flex flex-wrap items-center gap-3 border-b p-3 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <label className={`group flex h-11 min-w-[280px] flex-1 items-center rounded-xl border px-3 ${isDarkMode ? 'border-slate-700 focus-within:border-emerald-500' : 'border-slate-200 focus-within:border-emerald-500'}`}>
              <Search size={16} className={`mr-2 ${isDarkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
              <input className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} placeholder="Search by title, author, ISBN, or call number..." />
            </label>
            {['Category: All', 'Status: All', 'Availability: All', 'Year: All'].map((label, idx) => (
              <div key={label} className="relative">
                <select className={`h-11 appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm outline-none ${
                  idx === 0 ? 'min-w-[150px]' : idx === 1 ? 'min-w-[140px]' : idx === 2 ? 'min-w-[160px]' : 'min-w-[120px]'
                } ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                  <option>{label}</option>
                </select>
                <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              </div>
            ))}
            <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <RotateCcw size={15} />
              Reset
            </button>
            <div className="ml-auto flex gap-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`grid h-11 w-11 place-items-center rounded-xl ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : isDarkMode ? 'border border-slate-700 text-slate-300' : 'border border-slate-200 text-slate-600'}`}
              >
                <List size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`grid h-11 w-11 place-items-center rounded-xl ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : isDarkMode ? 'border border-slate-700 text-slate-300' : 'border border-slate-200 text-slate-600'}`}
              >
                <Grid2x2 size={16} />
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className={isDarkMode ? 'overflow-x-auto bg-[#0b1738]' : 'overflow-x-auto bg-white'}>
              <table className="min-w-[980px] w-full text-left text-sm">
                <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                  <tr>
                    <th className="px-4 py-3 font-semibold"><input type="checkbox" /></th>
                    <th className="px-3 py-3 font-semibold">Book</th>
                    <th className="px-3 py-3 font-semibold">Author</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Call Number</th>
                    <th className="px-3 py-3 font-semibold">Year</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Available Copies</th>
                    <th className="px-3 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <td className="px-4 py-3 align-top"><input type="checkbox" /></td>
                      <td className="px-3 py-3">
                        <div className="flex items-start gap-3">
                          <span className={`grid h-12 w-9 place-items-center rounded text-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{book.cover}</span>
                          <div>
                            <button type="button" onClick={onOpenBookDetail} className={`text-left font-semibold hover:underline ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{book.title}</button>
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ISBN: {book.isbn}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{book.author}</td>
                      <td className="px-3 py-3">
                        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${getCategoryClass(book.category)}`}>{book.category}</span>
                      </td>
                      <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{book.callNumber}</td>
                      <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{book.year}</td>
                      <td className="px-3 py-3">
                        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(book.status)}`}>{book.status}</span>
                      </td>
                      <td className={`px-3 py-3 font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{book.available}</td>
                      <td className="px-3 py-3 text-right">
                        <button type="button" className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 ${isDarkMode ? 'bg-[#0b1738]' : 'bg-white'}`}>
              {books.map((book) => (
                <article key={book.id} className={`flex h-full flex-col rounded-xl border p-3 transition-all duration-200 hover:-translate-y-0.5 ${
                  isDarkMode
                    ? 'border-slate-700 bg-[#0f1f49] hover:border-emerald-500/60 hover:shadow-[0_12px_24px_-16px_rgba(16,185,129,0.45)]'
                    : 'border-slate-200 bg-white hover:border-emerald-200 hover:shadow-[0_12px_24px_-16px_rgba(15,23,42,0.35)]'
                }`}>
                  <div className="flex items-start justify-between">
                    <span className={`grid h-24 w-16 place-items-center rounded-lg text-4xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{book.cover}</span>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getStatusClass(book.status)}`}>{book.status}</span>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{book.available} copies</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button type="button" onClick={onOpenBookDetail} className={`line-clamp-2 text-left text-sm font-semibold leading-5 hover:underline ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{book.title}</button>
                    <p className={`mt-1.5 text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{book.author}</p>
                    <p className={`mt-1 text-xs font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>ISBN: {book.isbn}</p>
                  </div>

                  <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${getCategoryClass(book.category)}`}>{book.category}</span>
                      <button type="button" className={`inline-flex h-9 w-9 items-center justify-center ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm ${isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
            <p>Showing 1 to 10 of 6,619 books</p>
            <div className="flex items-center gap-2">
              <select className={`h-9 rounded-lg border px-3 text-sm ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                <option>10 per page</option>
              </select>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>{'<'}</button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">1</button>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>2</button>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>3</button>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>{'>'}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
