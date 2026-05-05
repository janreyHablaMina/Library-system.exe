import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookCopy,
  BookMarked,
  Calendar,
  Eye,
  Hash,
  Languages,
  Library,
  MapPin,
  Plus,
  Printer,
  ScanBarcode,
  Share2,
  SquarePen,
  Tag,
  Trash2,
  UserRound,
} from 'lucide-react'
import bookCoverPlaceholder from '../assets/login.avif'

type BookDetailPageProps = {
  isDarkMode: boolean
  onBack: () => void
}

type DetailItem = {
  label: string
  value: string
  icon: ReactNode
}

type HistoryItem = {
  name: string
  borrowedOn: string
  status: 'Returned' | 'Overdue'
  avatar: string
}

type OverviewItem = {
  label: string
  value: string
  icon: ReactNode
  tone?: 'default' | 'good'
}

type DetailTab = 'overview' | 'copies' | 'history' | 'reviews'

type CopyItem = {
  copyId: string
  barcode: string
  location: string
  status: 'Available' | 'On Loan'
}

type BorrowLogItem = {
  borrower: string
  borrowedOn: string
  returnedOn: string
  status: 'Returned' | 'Overdue'
}

type ReviewItem = {
  reviewer: string
  rating: number
  comment: string
  date: string
}

const detailItems: DetailItem[] = [
  { label: 'Author', value: 'James Clear', icon: <UserRound size={14} /> },
  { label: 'Publisher', value: 'Avery', icon: <Library size={14} /> },
  { label: 'Published Year', value: '2018', icon: <Calendar size={14} /> },
  { label: 'Category', value: 'Self-Help', icon: <Tag size={14} /> },
  { label: 'ISBN', value: '978-0735211292', icon: <Hash size={14} /> },
  { label: 'Language', value: 'English', icon: <Languages size={14} /> },
  { label: 'Pages', value: '320', icon: <BookMarked size={14} /> },
  { label: 'Added On', value: 'May 12, 2024', icon: <Calendar size={14} /> },
  { label: 'Shelf Location', value: 'A-12-04', icon: <MapPin size={14} /> },
]

const recentHistory: HistoryItem[] = [
  { name: 'Michael Johnson', borrowedOn: 'Borrowed on May 10, 2024', status: 'Returned', avatar: '👨🏻' },
  { name: 'Sarah Williams', borrowedOn: 'Borrowed on Apr 28, 2024', status: 'Returned', avatar: '👩🏻' },
  { name: 'David Brown', borrowedOn: 'Borrowed on Apr 15, 2024', status: 'Returned', avatar: '👨🏽' },
  { name: 'Emily Davis', borrowedOn: 'Borrowed on Apr 02, 2024', status: 'Returned', avatar: '👩🏽' },
  { name: 'James Wilson', borrowedOn: 'Borrowed on Mar 20, 2024', status: 'Overdue', avatar: '👨🏾' },
]

const overviewItems: OverviewItem[] = [
  { label: 'Format', value: 'Paperback', icon: <BookCopy size={14} /> },
  { label: 'Condition', value: 'Good', icon: <Tag size={14} />, tone: 'good' },
  { label: 'Dimensions', value: '5.5 x 0.8 x 8.3 inches', icon: <Hash size={14} /> },
  { label: 'Barcode', value: 'BK000123456', icon: <ScanBarcode size={14} /> },
  { label: 'Weight', value: '0.45 kg', icon: <BookMarked size={14} /> },
  { label: 'Edition', value: '1st Edition', icon: <Library size={14} /> },
]

const copyItems: CopyItem[] = [
  { copyId: 'BK-000123-01', barcode: 'BK000123456', location: 'A-12-04', status: 'Available' },
  { copyId: 'BK-000123-02', barcode: 'BK000123457', location: 'A-12-04', status: 'On Loan' },
  { copyId: 'BK-000123-03', barcode: 'BK000123458', location: 'A-12-04', status: 'Available' },
  { copyId: 'BK-000123-04', barcode: 'BK000123459', location: 'A-12-04', status: 'On Loan' },
  { copyId: 'BK-000123-05', barcode: 'BK000123460', location: 'A-12-04', status: 'Available' },
]

const borrowLogs: BorrowLogItem[] = [
  { borrower: 'Michael Johnson', borrowedOn: 'May 10, 2024', returnedOn: 'May 20, 2024', status: 'Returned' },
  { borrower: 'Sarah Williams', borrowedOn: 'Apr 28, 2024', returnedOn: 'May 08, 2024', status: 'Returned' },
  { borrower: 'James Wilson', borrowedOn: 'Mar 20, 2024', returnedOn: '-', status: 'Overdue' },
]

const reviewItems: ReviewItem[] = [
  { reviewer: 'Anna Cruz', rating: 5, comment: 'Very practical and easy to apply.', date: 'Apr 24, 2024' },
  { reviewer: 'Mark Lee', rating: 4, comment: 'Great framework for habit tracking.', date: 'Apr 12, 2024' },
  { reviewer: 'John Rivera', rating: 5, comment: 'Highly recommended for students.', date: 'Mar 30, 2024' },
]

function getHistoryStatusClass(status: HistoryItem['status']) {
  if (status === 'Returned') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
}

export function BookDetailPage({ isDarkMode, onBack }: BookDetailPageProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const cardClass = isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-[#e9ecf5] bg-white'
  const softCardClass = isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-[#e9ecf5] bg-[#fafbff]'

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 md:p-5 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f6f7fb] text-[#161a2d]'}`}>
      <section className="w-full p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <button
              type="button"
              onClick={onBack}
              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${isDarkMode ? 'text-slate-300 hover:text-slate-100' : 'text-[#606a8a] hover:text-[#3f4ba0]'}`}
            >
              <ArrowLeft size={14} />
              Back to Books
            </button>
            <h2 className={`mt-1 text-[42px] font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-[#15182a]'}`}>Atomic Habits</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${isDarkMode ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
            >
              <SquarePen size={14} />
              Edit Book
            </button>
            <button
              type="button"
              className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${isDarkMode ? 'border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20' : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
            >
              <Trash2 size={14} />
              Delete Book
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <main className="space-y-4">
            <article className={`rounded-2xl border p-5 shadow-[0_16px_35px_-30px_rgba(99,102,241,0.35)] ${cardClass}`}>
              <div className="grid gap-5 lg:grid-cols-[282px_1fr]">
                <img
                  src={bookCoverPlaceholder}
                  alt="Book cover placeholder"
                  className={`mx-auto h-[340px] w-full max-w-[260px] rounded-xl object-cover ${isDarkMode ? 'border border-slate-700' : 'border border-[#d8dce9]'}`}
                />

                <div>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/15 text-emerald-200' : 'bg-emerald-50 text-emerald-700'}`}>ID: BK-000123</span>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">In Catalog</span>
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">English</span>
                    </div>
                  </div>

                  <p className={`text-xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-[#2f3960]'}`}>Tiny Changes, Remarkable Results</p>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-[#6b769c]'}`}>Practical guide to building good habits and eliminating bad ones through small daily improvements.</p>

                  <div className="mt-4 grid gap-3 xl:grid-cols-2">
                    <div className={`rounded-xl border p-3 ${softCardClass}`}>
                      <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.1em] ${isDarkMode ? 'text-slate-400' : 'text-[#6b769c]'}`}>Book Information</p>
                      <div className="space-y-2.5">
                        {detailItems.slice(0, 5).map((item) => (
                          <div key={item.label} className="flex items-center gap-2 text-sm">
                            <span className={isDarkMode ? 'text-slate-400' : 'text-[#616c92]'}>{item.icon}</span>
                            <span className={`min-w-[100px] ${isDarkMode ? 'text-slate-400' : 'text-[#616c92]'}`}>{item.label}</span>
                            <span className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-[#27304d]'}`}>
                              {item.label === 'Category' ? (
                                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/15 text-emerald-200' : 'bg-emerald-50 text-emerald-700'}`}>{item.value}</span>
                              ) : (
                                item.value
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`rounded-xl border p-3 ${softCardClass}`}>
                      <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.1em] ${isDarkMode ? 'text-slate-400' : 'text-[#6b769c]'}`}>Catalog Information</p>
                      <div className="space-y-2.5">
                        {detailItems.slice(5).map((item) => (
                          <div key={item.label} className="flex items-center gap-2 text-sm">
                            <span className={isDarkMode ? 'text-slate-400' : 'text-[#616c92]'}>{item.icon}</span>
                            <span className={`min-w-[100px] ${isDarkMode ? 'text-slate-400' : 'text-[#616c92]'}`}>{item.label}</span>
                            <span className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-[#27304d]'}`}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 rounded-xl border p-3 ${softCardClass}`}>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-[#3b4365]'}`}>Tags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['Habits', 'Productivity', 'Self-Improvement'].map((tag) => (
                        <span key={tag} className={`rounded-md px-2.5 py-1 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/15 text-emerald-200' : 'bg-emerald-50 text-emerald-700'}`}>{tag}</span>
                      ))}
                      <button
                        type="button"
                        className={`grid h-6 w-6 place-items-center rounded-md text-xs font-bold ${isDarkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className={`rounded-2xl border p-4 ${cardClass}`}>
              <div className={`-mx-4 -mt-4 mb-4 rounded-t-2xl border-b px-4 py-3 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-[#e9ecf5] bg-[#f8faff]'}`}>
                <div className="flex flex-wrap gap-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'copies', label: 'Copies (5)' },
                  { id: 'history', label: 'Borrow History' },
                  { id: 'reviews', label: 'Reviews (12)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as DetailTab)}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? isDarkMode
                          ? 'bg-emerald-500 text-white shadow-[0_8px_18px_-12px_rgba(16,185,129,0.8)]'
                          : 'bg-emerald-600 text-white shadow-[0_8px_18px_-12px_rgba(5,150,105,0.75)]'
                        : isDarkMode
                          ? 'border border-slate-700 bg-[#0b1738] text-slate-300 hover:bg-slate-800'
                          : 'border border-slate-200 bg-white text-[#49567e] hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                </div>
              </div>

              {activeTab === 'overview' ? (
                <div className="pt-4">
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-[#1d2240]'}`}>Description</h4>
                  <p className={`mt-2 max-w-[820px] text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-[#566084]'}`}>
                    An easy and proven way to build good habits and break bad ones. Atomic Habits reveals
                    practical strategies that will teach you exactly how to form good habits, break bad
                    ones, and master the tiny behaviors that lead to remarkable results.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {overviewItems.map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-sm">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-[#647099]'}>{item.icon}</span>
                        <span className={isDarkMode ? 'text-slate-400' : 'text-[#647099]'}>{item.label}</span>
                        <span className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-[#242d4b]'}`}>
                          {item.tone === 'good' ? (
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                              {item.value}
                            </span>
                          ) : (
                            item.value
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'copies' ? (
                <div className="pt-4">
                  <div className="grid gap-2">
                    {copyItems.map((copy) => (
                      <div key={copy.copyId} className={`rounded-xl border p-3 ${softCardClass}`}>
                        <div className="flex items-center justify-between">
                          <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-[#1d2240]'}`}>{copy.copyId}</p>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${copy.status === 'Available' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'}`}>{copy.status}</span>
                        </div>
                        <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-300' : 'text-[#4c5678]'}`}>Barcode: {copy.barcode}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-[#697398]'}`}>Location: {copy.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'history' ? (
                <div className="pt-4">
                  <div className="grid gap-2">
                    {borrowLogs.map((log) => (
                      <div key={`${log.borrower}-${log.borrowedOn}`} className={`rounded-xl border p-3 ${softCardClass}`}>
                        <div className="flex items-center justify-between">
                          <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-[#1d2240]'}`}>{log.borrower}</p>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getHistoryStatusClass(log.status)}`}>{log.status}</span>
                        </div>
                        <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-300' : 'text-[#4c5678]'}`}>Borrowed: {log.borrowedOn}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-[#697398]'}`}>Returned: {log.returnedOn}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'reviews' ? (
                <div className="pt-4">
                  <div className="grid gap-2">
                    {reviewItems.map((review) => (
                      <div key={`${review.reviewer}-${review.date}`} className={`rounded-xl border p-3 ${softCardClass}`}>
                        <div className="flex items-center justify-between">
                          <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-[#1d2240]'}`}>{review.reviewer}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#6b769c]'}`}>{'★'.repeat(review.rating)}</p>
                        </div>
                        <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-300' : 'text-[#4c5678]'}`}>{review.comment}</p>
                        <p className={`mt-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#6b769c]'}`}>{review.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          </main>

          <aside className="space-y-4">
            <article className={`rounded-2xl border p-4 ${cardClass}`}>
              <div className="mb-3 flex items-center justify-between">
                <h4 className={`text-[22px] font-medium leading-none ${isDarkMode ? 'text-slate-100' : 'text-[#1d2240]'}`}>Availability Status</h4>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Available</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-3">
                {[
                  ['Total Copies', '5', 'text-[#1d2240]'],
                  ['Available Copies', '3', 'text-emerald-600'],
                  ['On Loan', '2', 'text-amber-600'],
                ].map(([label, value, tone]) => (
                  <div key={label as string} className={`rounded-xl border px-3 py-3 text-center ${softCardClass}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#69739a]'}`}>{label as string}</p>
                    <p className={`mt-1 text-[24px] font-black ${isDarkMode ? 'text-slate-100' : tone}`}>{value as string}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className={`rounded-2xl border p-4 ${cardClass}`}>
              <h4 className={`mb-3 text-[22px] font-medium leading-none ${isDarkMode ? 'text-slate-100' : 'text-[#1d2240]'}`}>Quick Actions</h4>

              <button
                type="button"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(5,150,105,0.8)] hover:brightness-105"
              >
                <ArrowRight size={15} />
                Borrow Book
              </button>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button type="button" className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold ${softCardClass}`}>
                  <Plus size={15} />
                  Add Copy
                </button>
                <button type="button" className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold ${softCardClass}`}>
                  <SquarePen size={15} />
                  Edit Book
                </button>
                <button type="button" className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold ${softCardClass}`}>
                  <Printer size={15} />
                  Print Details
                </button>
                <button type="button" className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold ${softCardClass}`}>
                  <Eye size={15} />
                  View in Catalog
                </button>
                <button type="button" className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold sm:col-span-2 ${softCardClass}`}>
                  <Share2 size={15} />
                  Share Book
                </button>
              </div>
            </article>

            <article className={`rounded-2xl border p-4 ${cardClass}`}>
              <div className="mb-3 flex items-center justify-between">
                <h4 className={`text-[22px] font-medium leading-none ${isDarkMode ? 'text-slate-100' : 'text-[#1d2240]'}`}>Recent Borrow History</h4>
                <button type="button" className="text-sm font-semibold text-emerald-600 hover:underline">View All</button>
              </div>

              <div className="space-y-2">
                {recentHistory.map((item) => (
                  <div key={`${item.name}-${item.borrowedOn}`} className={`flex items-center justify-between gap-2 rounded-xl border p-2.5 ${softCardClass}`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`grid h-9 w-9 place-items-center rounded-full text-base ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        {item.avatar}
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-[#1f2643]'}`}>{item.name}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#6a7498]'}`}>{item.borrowedOn}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getHistoryStatusClass(item.status)}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>
    </div>
  )
}
