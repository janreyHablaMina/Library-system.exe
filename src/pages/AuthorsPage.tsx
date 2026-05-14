import { useState } from 'react'
import type { FormEvent } from 'react'
import { ChevronDown, Download, Eye, MoreHorizontal, Pencil, Plus, RotateCcw, Search, Trash2, Users, X, BookOpen, Star, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

type AuthorRow = {
  id: number
  name: string
  email: string
  nationality: string
  flag: string
  books: number
  dob: string
  status: 'Active' | 'Inactive'
  addedOn: string
  addedTime: string
  avatar: string
}

type AuthorsPageProps = {
  isDarkMode: boolean
}

type AuthorFormState = {
  name: string
  email: string
  nationality: string
  dob: string
  status: string
}

const initialFormState: AuthorFormState = {
  name: '',
  email: '',
  nationality: '',
  dob: '',
  status: 'Active',
}

const stats = [
  { label: 'Total Authors', value: '156', subValue: '↑ 12 this month', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Active Authors', value: '142', subValue: '90.9% of total', icon: Pencil, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Books by Authors', value: '1,245', subValue: 'Total books written', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Top Nationality', value: 'American', subValue: '42 authors', icon: Star, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'New This Month', value: '6', subValue: 'New authors added', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50' },
]

const authors: AuthorRow[] = [
  { id: 1, name: 'J.K. Rowling', email: 'jk.rowling@example.com', nationality: 'British', flag: '🇬🇧', books: 12, dob: 'July 31, 1965', status: 'Active', addedOn: 'May 6, 2026', addedTime: '10:15 AM', avatar: '👩🏼' },
  { id: 2, name: 'George R. R. Martin', email: 'grrmartin@example.com', nationality: 'American', flag: '🇺🇸', books: 8, dob: 'September 20, 1948', status: 'Active', addedOn: 'May 5, 2026', addedTime: '02:30 PM', avatar: '👨🏼' },
  { id: 3, name: 'Agatha Christie', email: 'agatha.christie@example.com', nationality: 'British', flag: '🇬🇧', books: 66, dob: 'September 15, 1890', status: 'Active', addedOn: 'May 4, 2026', addedTime: '11:20 AM', avatar: '👩🏻' },
  { id: 4, name: 'Stephen King', email: 'stephen.king@example.com', nationality: 'American', flag: '🇺🇸', books: 61, dob: 'September 21, 1947', status: 'Active', addedOn: 'May 3, 2026', addedTime: '09:45 AM', avatar: '👨🏻' },
  { id: 5, name: 'Haruki Murakami', email: 'murakami@example.com', nationality: 'Japanese', flag: '🇯🇵', books: 14, dob: 'January 12, 1949', status: 'Active', addedOn: 'May 2, 2026', addedTime: '03:10 PM', avatar: '👨🏻' },
  { id: 6, name: 'Dan Brown', email: 'dan.brown@example.com', nationality: 'American', flag: '🇺🇸', books: 6, dob: 'June 22, 1964', status: 'Inactive', addedOn: 'May 1, 2026', addedTime: '01:05 PM', avatar: '👨🏻' },
  { id: 7, name: 'Jane Austen', email: 'jane.austen@example.com', nationality: 'British', flag: '🇬🇧', books: 6, dob: 'December 16, 1775', status: 'Active', addedOn: 'Apr 30, 2026', addedTime: '04:25 PM', avatar: '👩🏼' },
  { id: 8, name: 'Paulo Coelho', email: 'paulo.coelho@example.com', nationality: 'Brazilian', flag: '🇧🇷', books: 11, dob: 'August 24, 1947', status: 'Active', addedOn: 'Apr 29, 2026', addedTime: '10:50 AM', avatar: '👨🏻' },
]

export function AuthorsPage({ isDarkMode }: AuthorsPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [authorForm, setAuthorForm] = useState<AuthorFormState>(initialFormState)

  const handleFormChange = (field: keyof AuthorFormState, value: string) => {
    setAuthorForm((prev) => ({ ...prev, [field]: value }))
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setAuthorForm(initialFormState)
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    closeAddModal()
  }

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

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <article key={stat.label} className={`rounded-xl border p-5 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'}`}>
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

        <div className={`mt-8 overflow-hidden rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white shadow-sm'}`}>
          <div className={`flex flex-wrap items-center gap-4 p-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <label className={`group flex h-12 min-w-[320px] flex-1 items-center rounded-xl border px-3 transition-all ${isDarkMode ? 'border-slate-700 focus-within:border-emerald-500 bg-[#0f1f49]' : 'border-slate-200 focus-within:border-emerald-500 bg-slate-50'}`}>
              <Search size={18} className={`mr-2 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
              <input className={`w-full bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} placeholder="Search authors by name..." />
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Nationality</span>
                <div className="relative">
                  <select className={`h-11 min-w-[140px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <option>All</option>
                    <option>British</option>
                    <option>American</option>
                    <option>Japanese</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status</span>
                <div className="relative">
                  <select className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <option>All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Sort By</span>
                <div className="relative">
                  <select className={`h-11 min-w-[160px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <option>Name (A-Z)</option>
                    <option>Name (Z-A)</option>
                    <option>Books (High-Low)</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <button className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-white'}`}>
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className={isDarkMode ? 'bg-[#0f1f49]/50 text-slate-400' : 'bg-slate-50/50 text-slate-500'}>
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nationality</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Books</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Date of Birth</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Added On</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author) => (
                  <tr key={author.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-full text-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-100'}`}>{author.avatar}</span>
                        <div>
                          <p className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{author.name}</p>
                          <p className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{author.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                         <span className="text-base leading-none">{author.flag}</span>
                         <span className="text-xs">{author.nationality}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{author.books}</span>
                    </td>
                    <td className={`px-6 py-4 text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{author.dob}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-md px-3 py-1 text-[11px] font-semibold tracking-wide ${
                        author.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                      }`}>
                        {author.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{author.addedOn}</p>
                      <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{author.addedTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button title="View Details" type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-white hover:text-emerald-600'}`}>
                          <Eye size={14} />
                        </button>
                        <button title="Edit Author" type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-white hover:text-blue-600'}`}>
                          <Pencil size={14} />
                        </button>
                        <button title="Delete Author" type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-rose-900/30 text-rose-500 hover:bg-rose-500/20' : 'border-rose-100 text-rose-500 hover:bg-rose-50'}`}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-4 border-t p-4 text-xs font-bold ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
            <p>Showing 1 to 10 of 156 authors</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm">1</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>2</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>3</button>
                <span className="px-1 text-slate-300">...</span>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>16</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="relative">
                <select className={`h-8 min-w-[100px] appearance-none rounded-lg border pl-3 pr-8 text-[11px] font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                  <option>10 / page</option>
                  <option>20 / page</option>
                  <option>50 / page</option>
                </select>
                <ChevronDown size={12} className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-2xl rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-8 py-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Add New Author</h3>
                <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Create a new author profile in the library system.</p>
              </div>
              <button type="button" onClick={closeAddModal} className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 px-8 py-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Author Name <span className="text-rose-500">*</span></label>
                  <input value={authorForm.name} onChange={(e) => handleFormChange('name', e.target.value)} placeholder="Full Name" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`} required />
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Email Address</label>
                  <input value={authorForm.email} onChange={(e) => handleFormChange('email', e.target.value)} placeholder="email@example.com" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Nationality</label>
                  <input value={authorForm.nationality} onChange={(e) => handleFormChange('nationality', e.target.value)} placeholder="Nationality" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`} />
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Date of Birth</label>
                  <input type="date" value={authorForm.dob} onChange={(e) => handleFormChange('dob', e.target.value)} className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`} />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Status</label>
                <div className="relative">
                  <select value={authorForm.status} onChange={(e) => handleFormChange('status', e.target.value)} className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeAddModal} className={`h-12 flex-1 rounded-xl border font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Cancel</button>
                <button type="submit" className="h-12 flex-1 rounded-xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all">Save Author</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
