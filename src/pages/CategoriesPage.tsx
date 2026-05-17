import { useState, useRef, useEffect, useMemo } from 'react'
import type { FormEvent } from 'react'
import { ChevronDown, Search, Plus, X, BookOpen, Layers, Monitor, GraduationCap, Globe, Palette, Briefcase, Atom, Library, Filter, Pencil, Trash2, MoreHorizontal, AlertTriangle } from 'lucide-react'
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

type CategoryActionsMenuProps = {
  category: CategoryRow
  onEdit: (category: CategoryRow) => void
  onDelete: (category: CategoryRow) => void
  isDarkMode: boolean
}

function CategoryActionsMenu({ category, onEdit, onDelete, isDarkMode }: CategoryActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [openUpward, setOpenUpward] = useState(false)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpward(spaceBelow < 180)
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative flex justify-center" ref={menuRef}>
      <button
        onClick={handleToggle}
        type="button"
        className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${
          isDarkMode
            ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }`}
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute right-0 z-50 w-36 animate-fadeIn rounded-xl border p-1.5 shadow-xl transition-all duration-150 ${
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
          } ${
            isDarkMode
              ? 'border-slate-700 bg-[#0f1f49] text-slate-200'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          <button
            onClick={() => onEdit(category)}
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
            }`}
          >
            <Pencil size={13} className="text-emerald-500" />
            Edit Info
          </button>
          <button
            onClick={() => onDelete(category)}
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              isDarkMode ? 'hover:bg-slate-800/80 text-rose-400' : 'hover:bg-rose-50 text-rose-600'
            }`}
          >
            <Trash2 size={13} className="text-rose-500" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export function CategoriesPage({ isDarkMode }: CategoriesPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(initialFormState)
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryRow | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryRow | null>(null)
  const [categoriesList, setCategoriesList] = useState<CategoryRow[]>(categoriesData)
  const [showToast, setShowToast] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const filteredCategories = useMemo(() => {
    return categoriesList.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'All' || cat.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [categoriesList, searchTerm, statusFilter])

  const handleFormChange = (field: keyof CategoryFormState, value: string) => {
    setCategoryForm((prev) => ({ ...prev, [field]: value }))
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setCategoryForm(initialFormState)
    setCategoryToEdit(null)
  }

  const handleOpenEditModal = (category: CategoryRow) => {
    setCategoryToEdit(category)
    setCategoryForm({
      name: category.name,
      description: category.description,
      status: category.status,
    })
    setIsAddModalOpen(true)
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    if (categoryToEdit) {
      setCategoriesList(prev => prev.map(c => c.id === categoryToEdit.id ? {
        ...c,
        name: categoryForm.name,
        description: categoryForm.description,
        status: categoryForm.status as any,
      } : c))
      setShowToast(`Successfully updated ${categoryForm.name}!`)
    } else {
      const newCategory: CategoryRow = {
        id: Math.max(...categoriesList.map(c => c.id), 0) + 1,
        name: categoryForm.name,
        icon: BookOpen,
        description: categoryForm.description,
        books: 0,
        status: categoryForm.status as any,
        createdOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        createdTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        color: 'text-emerald-600',
      }
      setCategoriesList(prev => [newCategory, ...prev])
      setShowToast(`Successfully added ${categoryForm.name}!`)
    }
    closeAddModal()
  }

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setCategoriesList(prev => prev.filter(c => c.id !== categoryToDelete.id))
      setShowToast(`Successfully deleted ${categoryToDelete.name}!`)
      setCategoryToDelete(null)
    }
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
          <div className={`flex flex-wrap items-center gap-4 p-4 rounded-t-xl border-b ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-100 bg-white'}`}>
            <label className={`group flex h-12 min-w-[320px] flex-1 items-center rounded-xl border px-3 transition-all ${isDarkMode ? 'border-slate-700 focus-within:border-emerald-500 bg-[#0f1f49]' : 'border-slate-200 focus-within:border-emerald-500 bg-slate-50'}`}>
              <Search size={18} className={`mr-2 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} placeholder="Search categories by name..." />
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status</span>
                <div className="relative">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
                {filteredCategories.map((cat) => {
                   const CatIcon = cat.icon
                   return (
                    <tr key={cat.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-700 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
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
                        <CategoryActionsMenu
                          category={cat}
                          onEdit={handleOpenEditModal}
                          onDelete={setCategoryToDelete}
                          isDarkMode={isDarkMode}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className={`relative z-0 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
            <p>Showing 1 to 8 of 24 categories</p>
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px]">
          <section className={`w-full max-w-4xl rounded-2xl border shadow-2xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-6 py-5 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{categoryToEdit ? 'Edit Category' : 'Add Category'}</h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{categoryToEdit ? 'Update book category details below.' : 'Define a new book category for the library system.'}</p>
              </div>
              <button type="button" onClick={closeAddModal} className={`grid h-10 w-10 place-items-center rounded-xl border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Category Name <span className="text-rose-500">*</span></label>
                  <input
                    value={categoryForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="e.g. Science Fiction"
                    className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${
                      isDarkMode
                        ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Status <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select
                      value={categoryForm.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className={`h-11 w-full appearance-none rounded-xl border pl-3 pr-10 text-sm outline-none ${
                        isDarkMode
                          ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500'
                          : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>
              </div>

              <div>
                <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value.slice(0, 400))}
                  placeholder="Briefly describe the category..."
                  className={`min-h-24 w-full rounded-xl border px-3 py-2 text-sm outline-none ${
                    isDarkMode
                      ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
                      : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
                  }`}
                />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{categoryForm.description.length} / 400</p>
              </div>

              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className={`h-11 rounded-xl border text-sm font-semibold ${
                    isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Save Category
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Success Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 animate-in slide-in-from-bottom-5">
          <BookOpen size={16} />
          {showToast}
        </div>
      )}

      {/* Delete Confirmation Warning Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className="flex flex-col items-center text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                <AlertTriangle size={24} />
              </div>
              <h3 className={`mt-4 text-lg font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Delete Category</h3>
              <p className={`mt-2 text-xs font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Are you sure you want to delete <strong className="font-bold">{categoryToDelete.name}</strong>? This action cannot be undone and all categorized books will be affected.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setCategoryToDelete(null)} className={`h-10 flex-1 rounded-xl border text-xs font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Cancel</button>
              <button type="button" onClick={handleDeleteCategory} className="h-10 flex-1 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20">Delete Category</button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
