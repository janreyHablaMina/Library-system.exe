import { BookOpen, Bookmark, Clock3, Download, Filter, Grid2x2, List, MoreHorizontal, RotateCcw, Search, Upload } from 'lucide-react'

type BookStatus = 'Available' | 'Borrowed' | 'Overdue'

type BookRow = {
  id: number
  cover: string
  title: string
  isbn: string
  author: string
  category: string
  categoryClass: string
  callNumber: string
  year: number
  status: BookStatus
  statusClass: string
  available: string
}

const stats = [
  { label: 'All Books', value: '6,619', icon: BookOpen, active: true },
  { label: 'Available', value: '5,547', icon: Bookmark, active: false },
  { label: 'Borrowed', value: '320', icon: RotateCcw, active: false },
  { label: 'Overdue', value: '45', icon: Clock3, active: false },
  { label: 'Archived', value: '52', icon: Filter, active: false },
]

const books: BookRow[] = [
  { id: 1, cover: '📙', title: 'Sosyolohiya sa Filipino', isbn: '978-621-455-010-2', author: 'Kahayon, Alicia H.', category: 'Social Sciences', categoryClass: 'bg-blue-50 text-blue-700', callNumber: '300.72 KAH', year: 2021, status: 'Available', statusClass: 'bg-emerald-50 text-emerald-700', available: '5 / 7' },
  { id: 2, cover: '📕', title: 'Understanding Philippine Social Realities through the Filipino Family', isbn: '978-971-009-123-4', author: 'Ramirez, Mina M.', category: 'Social Sciences', categoryClass: 'bg-blue-50 text-blue-700', callNumber: '305.23 RAM', year: 2020, status: 'Borrowed', statusClass: 'bg-amber-50 text-amber-700', available: '1 / 3' },
  { id: 3, cover: '📘', title: 'The Conjugal Dictatorship of Ferdinand and Imelda Marcos I', isbn: '978-971-555-001-1', author: 'Mijares, Primitivo', category: 'History', categoryClass: 'bg-emerald-50 text-emerald-700', callNumber: '959.904 MIJ', year: 2018, status: 'Available', statusClass: 'bg-emerald-50 text-emerald-700', available: '2 / 4' },
  { id: 4, cover: '📗', title: 'Filipino Values Today', isbn: '978-971-100-456-7', author: 'Timberza, Florentino T.', category: 'Education', categoryClass: 'bg-violet-50 text-violet-700', callNumber: '370.115 TIM', year: 2019, status: 'Available', statusClass: 'bg-emerald-50 text-emerald-700', available: '3 / 5' },
  { id: 5, cover: '📔', title: 'The Fateful Years', isbn: '978-621-455-789-6', author: 'Agoncillo, Teodoro A.', category: 'History', categoryClass: 'bg-emerald-50 text-emerald-700', callNumber: '959.902 AGO', year: 2017, status: 'Overdue', statusClass: 'bg-rose-50 text-rose-700', available: '0 / 2' },
  { id: 6, cover: '📓', title: 'Philippine Constitution Explained', isbn: '978-971-888-777-1', author: 'De Vera, Hector S.', category: 'Law', categoryClass: 'bg-amber-50 text-amber-700', callNumber: '342.59903 DEV', year: 2022, status: 'Available', statusClass: 'bg-emerald-50 text-emerald-700', available: '4 / 6' },
  { id: 7, cover: '📙', title: 'The Life and Works of Jose Rizal', isbn: '978-971-245-678-3', author: 'Tellos, Ricardo', category: 'Biography', categoryClass: 'bg-pink-50 text-pink-700', callNumber: '920 RIZ', year: 2016, status: 'Borrowed', statusClass: 'bg-amber-50 text-amber-700', available: '1 / 2' },
  { id: 8, cover: '📒', title: 'Introduction to Library Science', isbn: '978-971-333-222-8', author: 'Villanueva, Ma. Teresa', category: 'Library Science', categoryClass: 'bg-cyan-50 text-cyan-700', callNumber: '025.1 VIL', year: 2021, status: 'Available', statusClass: 'bg-emerald-50 text-emerald-700', available: '6 / 8' },
]

export function BooksPage() {
  return (
    <div className="min-h-0 flex-1 overflow-auto bg-[#f8fafc] p-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-4xl font-black text-slate-900">Books</h2>
            <p className="mt-1 text-base text-slate-500">Manage all library books and materials</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700">
              <span className="text-lg leading-none">+</span>
              Add Book
            </button>
            <button type="button" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Upload size={15} />
              Import
            </button>
            <button type="button" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Download size={15} />
              Export
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
          <div className="flex min-w-[880px] items-center gap-2 px-3 py-3">
            {stats.map((item) => {
              const ItemIcon = item.icon
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                    item.active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ItemIcon size={15} />
                  {item.label}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{item.value}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-3">
            <label className="group flex h-11 min-w-[280px] flex-1 items-center rounded-xl border border-slate-200 px-3 focus-within:border-emerald-500">
              <Search size={16} className="mr-2 text-slate-400 group-focus-within:text-emerald-600" />
              <input className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search by title, author, ISBN, or call number..." />
            </label>
            <select className="h-11 min-w-[150px] rounded-xl border border-slate-200 px-3 text-sm text-slate-700 outline-none">
              <option>Category: All</option>
            </select>
            <select className="h-11 min-w-[140px] rounded-xl border border-slate-200 px-3 text-sm text-slate-700 outline-none">
              <option>Status: All</option>
            </select>
            <select className="h-11 min-w-[160px] rounded-xl border border-slate-200 px-3 text-sm text-slate-700 outline-none">
              <option>Availability: All</option>
            </select>
            <select className="h-11 min-w-[120px] rounded-xl border border-slate-200 px-3 text-sm text-slate-700 outline-none">
              <option>Year: All</option>
            </select>
            <button type="button" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <RotateCcw size={15} />
              Reset
            </button>
            <div className="ml-auto flex gap-1">
              <button type="button" className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><List size={16} /></button>
              <button type="button" className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-600"><Grid2x2 size={16} /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
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
                  <tr key={book.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 align-top"><input type="checkbox" /></td>
                    <td className="px-3 py-3">
                      <div className="flex items-start gap-3">
                        <span className="grid h-12 w-9 place-items-center rounded bg-slate-100 text-xl">{book.cover}</span>
                        <div>
                          <p className="font-semibold text-slate-900">{book.title}</p>
                          <p className="text-xs text-slate-500">ISBN: {book.isbn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{book.author}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${book.categoryClass}`}>{book.category}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{book.callNumber}</td>
                    <td className="px-3 py-3 text-slate-600">{book.year}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${book.statusClass}`}>{book.status}</span>
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-700">{book.available}</td>
                    <td className="px-3 py-3 text-right">
                      <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
            <p>Showing 1 to 10 of 6,619 books</p>
            <div className="flex items-center gap-2">
              <select className="h-9 rounded-lg border border-slate-200 px-3 text-sm">
                <option>10 per page</option>
              </select>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200">{'<'}</button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700">1</button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200">2</button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200">3</button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200">{'>'}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
