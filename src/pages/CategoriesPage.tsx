import { useState } from 'react'
import type { FormEvent } from 'react'
import { ChevronDown, Search, Plus, X, BookOpen, Layers, Monitor, GraduationCap, Globe, Palette, Briefcase, Atom, Library, Filter, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type CategoryRow = {
  id: number
  name: string
  icon: LucideIcon
  description: string
  books: number
  status: 'Active' | 'Inactive'
  createdOn: string
  createdTime: string
  color: string
}

type CategoriesPageProps = {
  isDarkMode: boolean
}

type CategoryFormState = {
  name: string
  description: string
  status: string
}

const initialFormState: CategoryFormState = {
  name: '',
  description: '',
  status: 'Active',
}

const stats = [
  { label: 'Total Categories', value: '24', subValue: '↑ 3 this month', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Active Categories', value: '22', subValue: '91.7% of total', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Books in Categories', value: '6,619', subValue: 'Total books', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Most Popular', value: 'Fiction', subValue: '2,317 books', icon: Palette, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'New This Month', value: '2', subValue: 'New categories added', icon: Plus, color: 'text-rose-600', bg: 'bg-rose-50' },
]

const categoriesData: CategoryRow[] = [
  { id: 1, name: 'Fiction', icon: BookOpen, description: 'Novels and fictional works', books: 2317, status: 'Active', createdOn: 'May 10, 2026', createdTime: '10:15 AM', color: 'text-emerald-600' },
  { id: 2, name: 'Science', icon: Atom, description: 'Books related to natural and applied sciences', books: 1850, status: 'Active', createdOn: 'May 8, 2026', createdTime: '02:30 PM', color: 'text-blue-600' },
  { id: 3, name: 'Technology', icon: Monitor, description: 'Technology, IT and computer related books', books: 1245, status: 'Active', createdOn: 'May 7, 2026', createdTime: '11:20 AM', color: 'text-orange-500' },
  { id: 4, name: 'History', icon: Library, description: 'Historical events and civilizations', books: 794, status: 'Active', createdOn: 'May 6, 2026', createdTime: '09:45 AM', color: 'text-violet-600' },
  { id: 5, name: 'Education', icon: GraduationCap, description: 'Teaching, learning and educational resources', books: 1125, status: 'Active', createdOn: 'May 5, 2026', createdTime: '03:10 PM', color: 'text-emerald-500' },
  { id: 6, name: 'Language', icon: Globe, description: 'Languages, dictionaries and reference', books: 533, status: 'Active', createdOn: 'May 2, 2026', createdTime: '10:50 AM', color: 'text-amber-500' },
  { id: 7, name: 'Arts & Recreation', icon: Palette, description: 'Art, music, sports and hobbies', books: 410, status: 'Inactive', createdOn: 'Apr 30, 2026', createdTime: '01:25 PM', color: 'text-slate-600' },
  { id: 8, name: 'Business', icon: Briefcase, description: 'Business, management and finance', books: 345, status: 'Active', createdOn: 'Apr 28, 2026', createdTime: '09:05 AM', color: 'text-rose-500' },
]

export function CategoriesPage({ isDarkMode }: CategoriesPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(initialFormState)

  const handleFormChange = (field: keyof CategoryFormState, value: string) => {
    setCategoryForm((prev) => ({ ...prev, [field]: value }))
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setCategoryForm(initialFormState)
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
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Categories</h2>
            <p className={`mt-1 text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage and organize all book categories in your library.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setIsAddModalOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-sm">
              <Plus size={18} />
              Add Category
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
              <input className={`w-full bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} placeholder="Search categories by name..." />
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
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
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Category Name</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Books</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Created On</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoriesData.map((cat) => {
                   const CatIcon = cat.icon
                   return (
                    <tr key={cat.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`grid h-9 w-9 place-items-center rounded-lg ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-100/50'} ${cat.color}`}>
                             <CatIcon size={18} />
                          </div>
                          <p className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{cat.name}</p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{cat.description}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{cat.books.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-md px-3 py-1 text-[11px] font-semibold tracking-wide ${
                          cat.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                        }`}>
                          {cat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{cat.createdOn}</p>
                        <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{cat.createdTime}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button title="Edit Category" type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-white hover:text-blue-600'}`}>
                            <Pencil size={14} />
                          </button>
                          <button title="Delete Category" type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-rose-900/30 text-rose-500 hover:bg-rose-500/20' : 'border-rose-100 text-rose-500 hover:bg-rose-50'}`}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-4 border-t p-4 text-xs font-bold ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
            <p>Showing 1 to 8 of 24 categories</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm">1</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>2</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>3</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="relative">
                <select className={`h-8 min-w-[110px] appearance-none rounded-lg border pl-3 pr-8 text-[11px] font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                  <option>10 / page</option>
                  <option>20 / page</option>
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
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Add Category</h3>
                <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Define a new book category for the library system.</p>
              </div>
              <button type="button" onClick={closeAddModal} className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 px-8 py-8">
              <div className="space-y-2">
                <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Category Name <span className="text-rose-500">*</span></label>
                <input value={categoryForm.name} onChange={(e) => handleFormChange('name', e.target.value)} placeholder="e.g. Science Fiction" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`} required />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Description</label>
                <textarea value={categoryForm.description} onChange={(e) => handleFormChange('description', e.target.value)} placeholder="Briefly describe the category..." className={`h-32 w-full resize-none rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`} />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Status</label>
                <div className="relative">
                  <select value={categoryForm.status} onChange={(e) => handleFormChange('status', e.target.value)} className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeAddModal} className={`h-12 flex-1 rounded-xl border font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Cancel</button>
                <button type="submit" className="h-12 flex-1 rounded-xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all">Save Category</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
