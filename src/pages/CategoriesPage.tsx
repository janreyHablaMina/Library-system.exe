import { Toast } from '../components/ui/Toast'
import { useState, useRef, useEffect, useMemo } from 'react'
import type { FormEvent } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Search, Plus, X, BookOpen, Layers, Monitor, GraduationCap, Globe, Palette, Briefcase, Atom, Library, Filter, Pencil, Trash2, MoreHorizontal, AlertTriangle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { createCategory, deleteCategory, listBooks, listCategories, updateCategory, type Category as DbCategory } from '../lib/tauriApi'

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
  
  
]

const categoriesData: CategoryRow[] = [
  { id: 1, name: 'Fiction', icon: BookOpen, description: 'Novels and fictional works', books: 2317, status: 'Active', createdOn: 'May 10, 2026', createdTime: '10:15 AM', color: 'text-emerald-600' },
  { id: 2, name: 'Science', icon: Atom, description: 'Books related to natural and applied sciences', books: 1850, status: 'Active', createdOn: 'May 8, 2026', createdTime: '02:30 PM', color: 'text-blue-600' },
  { id: 3, name: 'Technology', icon: Monitor, description: 'Technology, IT and computer related books', books: 1245, status: 'Active', createdOn: 'May 7, 2026', createdTime: '11:20 AM', color: 'text-orange-500' },
  { id: 4, name: 'History', icon: Library, description: 'Historical events and civilizations', books: 794, status: 'Active', createdOn: 'May 6, 2026', createdTime: '09:45 AM', color: 'text-violet-600' },
  { id: 5, name: 'Education', icon: GraduationCap, description: 'Teaching, learning and educational resources', books: 1125, status: 'Active', createdOn: 'May 5, 2026', createdTime: '03:10 PM', color: 'text-emerald-500' },
  { id: 6, name: 'Language', icon: Globe, description: 'Languages, dictionaries and reference', books: 533, status: 'Active', createdOn: 'May 2, 2026', createdTime: '10:50 AM', color: 'text-amber-500' },
  { id: 7, name: 'Arts & Recreation', icon: Palette, description: 'Art, music, sports and hobbies', books: 410, status: 'Inactive', createdOn: 'Apr 30, 2026', createdTime: '01:25 PM', color: 'text-zinc-600' },
  { id: 8, name: 'Business', icon: Briefcase, description: 'Business, management and finance', books: 345, status: 'Active', createdOn: 'Apr 28, 2026', createdTime: '09:05 AM', color: 'text-rose-500' },
]

type CategoryActionsMenuProps = {
  category: CategoryRow
  onViewDetails: (category: CategoryRow) => void
  onEdit: (category: CategoryRow) => void
  onDelete: (category: CategoryRow) => void
  isDarkMode: boolean
}

function CategoryActionsMenu({ category, onEdit, onDelete, isDarkMode }: CategoryActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
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
            ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700'
        }`}
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-full z-50 mt-1.5 w-44 animate-fadeIn rounded-xl border p-1.5 shadow-xl transition-all duration-150 ${
            isDarkMode
              ? 'border-zinc-700 bg-[#27272A] text-zinc-200'
              : 'border-zinc-200 bg-white text-zinc-700'
          }`}
        >
          <button
            onClick={() => { setIsOpen(false); onEdit(category) }}
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'
            }`}
          >
            <Pencil size={13} className="text-emerald-500" />
            Edit Info
          </button>

          <div className={`my-1 border-t ${isDarkMode ? 'border-zinc-700' : 'border-zinc-100'}`} />

          <button
            onClick={() => { setIsOpen(false); onDelete(category) }}
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              isDarkMode ? 'hover:bg-zinc-800/80 text-rose-400' : 'hover:bg-rose-50 text-rose-600'
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
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(() => new Set())
  const [categoriesList, setCategoriesList] = useState<CategoryRow[]>(categoriesData)
  const [showToast, setShowToast] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const selectAllRef = useRef<HTMLInputElement>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, itemsPerPage])

  const [booksCount, setBooksCount] = useState(0)

  const toCategoryRow = (category: DbCategory): CategoryRow => {
    const created = category.createdAt ? new Date(category.createdAt) : new Date()
    return {
      id: category.id,
      name: category.name,
      icon: BookOpen,
      description: category.description || '',
      books: 0,
      status: (category.status === 'Inactive' ? 'Inactive' : 'Active') as 'Active' | 'Inactive',
      createdOn: created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdTime: created.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      color: 'text-emerald-600',
    }
  }

  const loadCategoriesFromDb = async () => {
    try {
      const [rows, books] = await Promise.all([listCategories(500), listBooks(2000)])
      setCategoriesList(rows.map(toCategoryRow))
      setBooksCount(books.length)
    } catch {
      // Keep local seeded list as fallback.
    }
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  useEffect(() => {
    void loadCategoriesFromDb()
  }, [])

  const filteredCategories = useMemo(() => {
    return categoriesList.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'All' || cat.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [categoriesList, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const paginatedCategoryIds = paginatedCategories.map((category) => category.id)
  const selectedCount = selectedCategoryIds.size
  const allPageCategoriesSelected = paginatedCategoryIds.length > 0 && paginatedCategoryIds.every((id) => selectedCategoryIds.has(id))
  const somePageCategoriesSelected = paginatedCategoryIds.some((id) => selectedCategoryIds.has(id))

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = somePageCategoriesSelected && !allPageCategoriesSelected
    }
  }, [allPageCategoriesSelected, somePageCategoriesSelected])

  useEffect(() => {
    setSelectedCategoryIds((prev) => {
      const existingIds = new Set(categoriesList.map((category) => category.id))
      const next = new Set([...prev].filter((id) => existingIds.has(id)))
      return next.size === prev.size ? prev : next
    })
  }, [categoriesList])

  const handleTogglePageSelection = () => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev)
      if (allPageCategoriesSelected) {
        paginatedCategoryIds.forEach((id) => next.delete(id))
      } else {
        paginatedCategoryIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  const handleToggleCategorySelection = (categoryId: number) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

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

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (categoryToEdit) {
        await updateCategory({
          id: categoryToEdit.id,
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim() || null,
          status: categoryForm.status,
        })
        setShowToast(`Successfully updated ${categoryForm.name}!`)
      } else {
        await createCategory({
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim() || null,
          status: categoryForm.status,
        })
        setShowToast(`Successfully added ${categoryForm.name}!`)
      }
      await loadCategoriesFromDb()
      closeAddModal()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save category.'
      setShowToast(message)
    }
  }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return
    try {
      await deleteCategory(categoryToDelete.id)
      await loadCategoriesFromDb()
      setShowToast(`Successfully deleted ${categoryToDelete.name}!`)
      setCategoryToDelete(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete category.'
      setShowToast(message)
    }
  }

  const handleBulkDeleteConfirm = async () => {
    const selectedCategories = categoriesList.filter((category) => selectedCategoryIds.has(category.id))
    if (selectedCategories.length === 0) return

    try {
      await Promise.all(selectedCategories.map((category) => deleteCategory(category.id)))
      await loadCategoriesFromDb()
      setShowToast(`Successfully deleted ${selectedCategories.length} selected categor${selectedCategories.length === 1 ? 'y' : 'ies'}!`)
      setSelectedCategoryIds(new Set())
      setShowBulkDeleteConfirm(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete selected categories.'
      setShowToast(message)
    }
  }

  const stats = useMemo(() => {
    const totalCategories = categoriesList.length
    const activeCategories = categoriesList.filter((c) => c.status === 'Active').length
    const activePct = totalCategories > 0 ? ((activeCategories / totalCategories) * 100).toFixed(1) : '0.0'
    const topCategory = categoriesList[0]?.name || 'N/A'
    return [
      { label: 'Total Categories', value: totalCategories.toLocaleString('en-US'), subValue: 'From database records', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Active Categories', value: activeCategories.toLocaleString('en-US'), subValue: `${activePct}% of total`, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Books in Categories', value: booksCount.toLocaleString('en-US'), subValue: 'Total books', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
      
      
    ]
  }, [categoriesList, booksCount])

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <section className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Categories</h2>
            <p className={`mt-1 text-base font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Manage and organize all book categories in your library.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setIsAddModalOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-sm">
              <Plus size={18} />
              Add Category
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <article key={stat.label} className={`rounded-xl border p-5 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
                <div className="flex items-center gap-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.bg} ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex flex-col">
                    <p className={`text-xs font-bold text-zinc-500 dark:text-zinc-400`}>{stat.label}</p>
                    <p className={`text-2xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{stat.value}</p>
                  </div>
                </div>
                <p className={`mt-3 text-[11px] font-bold ${stat.color === 'text-rose-600' || stat.color === 'text-violet-600' ? 'text-zinc-500 dark:text-zinc-400' : stat.color}`}>
                  {stat.subValue}
                </p>
              </article>
            )
          })}
        </section>

        <div className={`mt-8 rounded-xl border ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
          <div className={`flex flex-wrap items-center gap-4 p-4 rounded-t-xl border-b ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-100 bg-white'}`}>
            <label className={`group flex h-12 min-w-[320px] flex-1 items-center rounded-xl border px-3 transition-all ${isDarkMode ? 'border-zinc-700 focus-within:border-emerald-500 bg-[#27272A]' : 'border-zinc-200 focus-within:border-emerald-500 bg-zinc-50'}`}>
              <Search size={18} className={`mr-2 transition-colors ${isDarkMode ? 'text-zinc-500 group-focus-within:text-emerald-400' : 'text-zinc-400 group-focus-within:text-emerald-600'}`} />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400'}`} placeholder="Search categories by name..." />
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-500">Status</span>
                <div className="relative">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                </div>
              </div>

              
            </div>
          </div>

          {selectedCount > 0 && (
            <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 ${
              isDarkMode ? 'border-zinc-700 bg-emerald-500/10 text-zinc-200' : 'border-zinc-200 bg-emerald-50 text-zinc-700'
            }`}>
              <p className="text-sm font-semibold">{selectedCount} selected</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkDeleteConfirm(true)}
                  className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${
                    isDarkMode ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20' : 'border-rose-200 bg-white text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <Trash2 size={15} />
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryIds(new Set())}
                  className={`grid h-9 w-9 place-items-center rounded-lg border ${
                    isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
                  aria-label="Clear selection"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          )}

          <div className="relative z-10 overflow-x-auto lg:overflow-visible">
            <table className="w-full text-left text-sm border-collapse">
              <thead className={isDarkMode ? 'bg-[#27272A]/50 text-zinc-400' : 'bg-zinc-50/50 text-zinc-500'}>
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      className="app-choice-input"
                      checked={allPageCategoriesSelected}
                      onChange={handleTogglePageSelection}
                      aria-label="Select all categories on this page"
                    />
                  </th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Category Name</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Books</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((cat) => {
                   const CatIcon = cat.icon
                   return (
                    <tr key={cat.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800/30' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                      <td className="px-6 py-4 align-top">
                        <input
                          type="checkbox"
                          className="app-choice-input"
                          checked={selectedCategoryIds.has(cat.id)}
                          onChange={() => handleToggleCategorySelection(cat.id)}
                          aria-label={`Select ${cat.name}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`grid h-9 w-9 place-items-center rounded-lg ${isDarkMode ? 'bg-zinc-800/40' : 'bg-zinc-100/50'} ${cat.color}`}>
                             <CatIcon size={18} />
                          </div>
                          <p className={`font-semibold text-sm ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{cat.name}</p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{cat.description}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{cat.books.toLocaleString()}</span>
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
                        <CategoryActionsMenu
                          category={cat}
                          onViewDetails={handleOpenEditModal}
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

          <div className={`relative z-0 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-600'}`}>
            <p>Showing {filteredCategories.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredCategories.length)} of {filteredCategories.length} categories</p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className={`h-10 min-w-[150px] appearance-none rounded-lg border py-2 pl-4 pr-10 text-sm font-medium outline-none transition-colors ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200 hover:bg-zinc-800 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus:border-emerald-500'}`}>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:border-zinc-800 disabled:text-zinc-600 disabled:hover:bg-transparent'
                    : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:border-zinc-100 disabled:text-zinc-300 disabled:hover:bg-white'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} type="button" onClick={() => setCurrentPage(page)} className={page === currentPage ? "grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : `grid h-10 w-10 place-items-center rounded-lg border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:border-zinc-800 disabled:text-zinc-600 disabled:hover:bg-transparent'
                    : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:border-zinc-100 disabled:text-zinc-300 disabled:hover:bg-white'
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-900/45 p-4 backdrop-blur-[1px]">
          <section className={`w-full max-w-4xl rounded-2xl border shadow-2xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-6 py-5 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{categoryToEdit ? 'Edit Category' : 'Add Category'}</h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{categoryToEdit ? 'Update book category details below.' : 'Define a new book category for the library system.'}</p>
              </div>
              <button type="button" onClick={closeAddModal} className={`grid h-10 w-10 place-items-center rounded-xl border ${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Category Name <span className="text-rose-500">*</span></label>
                  <input
                    value={categoryForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="e.g. Science Fiction"
                    className={`h-11 w-full rounded-xl border px-3 text-sm outline-none ${
                      isDarkMode
                        ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500'
                        : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400 focus:border-emerald-500'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Status <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select
                      value={categoryForm.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className={`h-11 w-full appearance-none rounded-xl border pl-3 pr-10 text-sm outline-none ${
                        isDarkMode
                          ? 'border-zinc-700 bg-[#27272A] text-zinc-100 focus:border-emerald-500'
                          : 'border-zinc-200 bg-white text-zinc-700 focus:border-emerald-500'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </div>
              </div>

              <div>
                <label className={`mb-1 block text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value.slice(0, 400))}
                  placeholder="Briefly describe the category..."
                  className={`min-h-24 w-full rounded-xl border px-3 py-2 text-sm outline-none ${
                    isDarkMode
                      ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500'
                      : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400 focus:border-emerald-500'
                  }`}
                />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{categoryForm.description.length} / 400</p>
              </div>

              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className={`h-11 rounded-xl border text-sm font-semibold ${
                    isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
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
      <Toast message={showToast} onClose={() => setShowToast(null)} isDarkMode={isDarkMode} />

      {/* Delete Confirmation Warning Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className="flex flex-col items-center text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                <AlertTriangle size={24} />
              </div>
              <h3 className={`mt-4 text-lg font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Delete Category</h3>
              <p className={`mt-2 text-xs font-medium leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Are you sure you want to delete <strong className="font-bold">{categoryToDelete.name}</strong>? This action cannot be undone and all categorized books will be affected.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setCategoryToDelete(null)} className={`h-10 flex-1 rounded-xl border text-xs font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>Cancel</button>
              <button type="button" onClick={handleDeleteCategory} className="h-10 flex-1 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20">Delete Category</button>
            </div>
          </section>
        </div>
      )}

      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className="flex flex-col items-center text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                <AlertTriangle size={24} />
              </div>
              <h3 className={`mt-4 text-lg font-black ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Delete Selected Categories</h3>
              <p className={`mt-2 text-xs font-medium leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Delete {selectedCount} selected categor{selectedCount === 1 ? 'y' : 'ies'}? This action cannot be undone and categorized books may be affected.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowBulkDeleteConfirm(false)} className={`h-10 flex-1 rounded-xl border text-xs font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>Cancel</button>
              <button type="button" onClick={handleBulkDeleteConfirm} className="h-10 flex-1 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20">Delete Selected</button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}


