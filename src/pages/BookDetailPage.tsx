import { useMemo, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  BookCopy,
  BookOpen,
  Bookmark,
  CircleAlert,
  CircleCheck,
  ClipboardList,
  CopyPlus,
  Dot,
  Ellipsis,
  FileText,
  History,
  Printer,
  Star,
  UserRound,
} from 'lucide-react'
import loginCover from '../assets/login.avif'

type BookDetailPageProps = {
  isDarkMode: boolean
  onBack: () => void
}

type TabKey = 'Copies' | 'Borrow History' | 'Reviews (12)' | 'Details'
type CopyStatus = 'Available' | 'Borrowed'
type CopyCondition = 'Good' | 'Fair' | 'Excellent'

type CopyRow = {
  copyId: string
  barcode: string
  location: string
  status: CopyStatus
  condition: CopyCondition
  addedDate: string
}

const copies: CopyRow[] = [
  { copyId: 'BK-2026-0001', barcode: '10000001', location: 'Main Library - Shelf A3', status: 'Available', condition: 'Good', addedDate: 'Apr 12, 2026' },
  { copyId: 'BK-2026-0002', barcode: '10000002', location: 'Main Library - Shelf A3', status: 'Borrowed', condition: 'Good', addedDate: 'Apr 12, 2026' },
  { copyId: 'BK-2026-0003', barcode: '10000003', location: 'Main Library - Shelf A3', status: 'Borrowed', condition: 'Fair', addedDate: 'Apr 12, 2026' },
  { copyId: 'BK-2026-0004', barcode: '10000004', location: 'Main Library - Shelf A3', status: 'Available', condition: 'Good', addedDate: 'Apr 12, 2026' },
  { copyId: 'BK-2026-0005', barcode: '10000005', location: 'Main Library - Shelf A3', status: 'Available', condition: 'Excellent', addedDate: 'Apr 12, 2026' },
]

function card(isDarkMode: boolean) {
  return isDarkMode ? 'rounded-xl border border-slate-700 bg-[#0b1738]' : 'rounded-xl border border-slate-200 bg-white'
}

function soft(isDarkMode: boolean) {
  return isDarkMode ? 'rounded-lg border border-slate-700 bg-[#0f1f49]' : 'rounded-lg border border-slate-200 bg-slate-50/50'
}

function statusPill(status: CopyStatus) {
  return status === 'Available'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
    : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
}

function conditionPill(condition: CopyCondition) {
  if (condition === 'Excellent') return 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
  if (condition === 'Fair') return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
  return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
}

export function BookDetailPage({ isDarkMode, onBack }: BookDetailPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('Copies')

  const stats = useMemo(() => {
    const available = copies.filter((copy) => copy.status === 'Available').length
    const borrowed = copies.filter((copy) => copy.status === 'Borrowed').length
    return { total: copies.length, available, borrowed, reserved: 0, lost: 0 }
  }, [])

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="space-y-4 p-5">
        <div className="flex items-center gap-2 text-sm">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1 font-semibold text-violet-600 hover:underline">
            <ArrowLeft size={14} /> Back
          </button>
          <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>&gt;</span>
          <button type="button" onClick={onBack} className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Books</button>
          <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>&gt;</span>
          <span className="font-semibold">Book Details</span>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <main className="space-y-4">
            <section className={`${card(isDarkMode)} p-4`}>
              <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
                <aside>
                  <img src={loginCover} alt="Book cover" className="h-[470px] w-[260px] rounded-lg border border-slate-200 object-cover dark:border-slate-700" />
                  <div className="mt-4 flex gap-2">
                    <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700"><BookOpen size={14} />Edit Book</button>
                    <button type="button" className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}><Printer size={14} />Print Label</button>
                  </div>
                </aside>

                <div className="min-w-0 space-y-4">
                  <div className="max-w-[820px] space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h1 className={`text-2xl font-bold leading-tight tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>The Power of Habit</h1>
                      <div className={`rounded-lg border px-3 py-1.5 text-right ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50'}`}>
                        <p className={`text-[11px] uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Author</p>
                        <p className="text-sm font-semibold">Charles Duhigg</p>
                      </div>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Why We Do What We Do in Life and Business</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['Self-Help', 'Psychology', 'Personal Development'].map((tag) => (
                        <span key={tag} className={`rounded-full px-3 py-1 text-xs font-semibold ${isDarkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className={`grid gap-3 border-t pt-4 md:grid-cols-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="space-y-3 text-sm">
                      <p><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>ISBN</span><br /><span className="font-semibold">978-0812981605</span></p>
                      <p><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Publisher</span><br /><span className="font-semibold">Random House</span></p>
                      <p><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Language</span><br /><span className="font-semibold">English</span></p>
                    </div>
                    <div className={`space-y-3 border-x px-3 text-sm ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                      <p><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Publication Year</span><br /><span className="font-semibold">2012</span></p>
                      <p><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Pages</span><br /><span className="font-semibold">408</span></p>
                      <p><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Format</span><br /><span className="font-semibold">Hardcover</span></p>
                    </div>
                    <div className="space-y-3 text-sm">
                      <p><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Call Number</span><br /><span className="font-semibold">158.1 DUH</span></p>
                      <p><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Added Date</span><br /><span className="font-semibold">Apr 12, 2026</span></p>
                      <p><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Added By</span><br /><span className="font-semibold">Admin User</span></p>
                    </div>
                  </div>

                  <div className={`${soft(isDarkMode)} p-4`}>
                    <h3 className="mb-2 text-2xl font-bold">About the Book</h3>
                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Drawing on cutting-edge neuroscience, psychology, and sociology, Charles Duhigg explores the science of habit and how it can be transformed.
                      The book reveals how habits work, why they exist, and how to change them.
                    </p>
                    <button type="button" className="mt-3 text-sm font-semibold text-violet-600 hover:underline">Read more</button>
                  </div>
                </div>
              </div>
            </section>

            <section className={`${card(isDarkMode)} overflow-hidden`}>
              <div className={`flex flex-wrap gap-6 border-b px-4 pt-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                {[['Copies', <BookCopy key="c" size={14} />], ['Borrow History', <History key="h" size={14} />], ['Reviews (12)', <Star key="s" size={14} />], ['Details', <FileText key="f" size={14} />]].map(([name, icon]) => {
                  const tab = name as TabKey
                  const active = activeTab === tab
                  return (
                    <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`inline-flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold ${active ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500'}`}>
                      {icon}
                      {tab}
                    </button>
                  )
                })}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[920px] w-full text-left text-sm">
                  <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                    <tr>
                      <th className="px-4 py-3 font-semibold">Copy ID</th>
                      <th className="px-3 py-3 font-semibold">Barcode</th>
                      <th className="px-3 py-3 font-semibold">Location</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                      <th className="px-3 py-3 font-semibold">Condition</th>
                      <th className="px-3 py-3 font-semibold">Date Added</th>
                      <th className="px-3 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {copies.map((row) => (
                      <tr key={row.copyId} className={`border-t ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <td className="px-4 py-3 font-semibold">{row.copyId}</td>
                        <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.barcode}</td>
                        <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.location}</td>
                        <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusPill(row.status)}`}>{row.status}</span></td>
                        <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${conditionPill(row.condition)}`}>{row.condition}</span></td>
                        <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.addedDate}</td>
                        <td className="px-3 py-3 text-right"><button type="button" className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}><Ellipsis size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`border-t px-4 py-3 text-sm ${isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}>Showing 1 to 5 of 5 copies</div>
            </section>
          </main>

          <aside className="space-y-4">
            <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-gradient-to-br from-[#0b1738] to-[#182d62]' : 'border-slate-200 bg-gradient-to-br from-[#0f1e44] to-[#132f71] text-white'}`}>
              <h3 className="text-2xl font-bold text-white">Availability</h3>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="grid h-40 w-40 place-items-center rounded-full border-[10px] border-emerald-500/90">
                  <div className="text-center">
                    <p className="text-5xl font-black text-white">{stats.total}</p>
                    <p className="text-sm text-white/80">Total Copies</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 text-sm text-white">
                  <p className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-2"><Dot size={20} className="text-emerald-400" />Available</span><span className="font-semibold">{stats.available}</span></p>
                  <p className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-2"><Dot size={20} className="text-amber-400" />Borrowed</span><span className="font-semibold">{stats.borrowed}</span></p>
                  <p className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-2"><Dot size={20} className="text-blue-400" />Reserved</span><span className="font-semibold">{stats.reserved}</span></p>
                  <p className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-2"><Dot size={20} className="text-rose-400" />Lost / Damaged</span><span className="font-semibold">{stats.lost}</span></p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-emerald-500/20 p-3 text-sm font-semibold text-emerald-200">
                <span className="inline-flex items-center gap-2"><CircleCheck size={15} />The book is available</span>
              </div>
            </section>

            <section className={`${card(isDarkMode)} p-4`}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-2xl font-bold">Current Borrower</h3>
                <button type="button" className="text-sm font-semibold text-violet-600 hover:underline">View All</button>
              </div>

              <div className="space-y-3">
                {[['Juan Dela Cruz', 'STU-2026-001', 'May 1, 2026', 'May 15, 2026', 'Due in 9 days'], ['Maria Santos', 'STU-2026-002', 'May 2, 2026', 'May 16, 2026', 'Due in 10 days']].map(([name, id, borrowedOn, dueDate, due]) => (
                  <article key={id as string} className={`${soft(isDarkMode)} p-3`}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`grid h-9 w-9 place-items-center rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}><UserRound size={16} /></span>
                      <div>
                        <p className="font-semibold">{name as string}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{id as string}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div><p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Borrowed on</p><p className="font-semibold">{borrowedOn as string}</p></div>
                      <div><p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Due date</p><p className="font-semibold">{dueDate as string}</p></div>
                      <div className="flex items-center justify-end"><span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">{due as string}</span></div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={`${card(isDarkMode)} p-4`}>
              <h3 className="mb-3 text-2xl font-bold">Actions</h3>
              <div className="space-y-2">
                {[
                  ['Borrow This Book', <BookOpen key="a1" size={15} className="text-emerald-600" />],
                  ['Reserve This Book', <Bookmark key="a2" size={15} className="text-violet-600" />],
                  ['Add New Copy', <CopyPlus key="a3" size={15} className="text-blue-600" />],
                  ['Edit Book Details', <FileText key="a4" size={15} className="text-amber-600" />],
                  ['Print Book Details', <ClipboardList key="a5" size={15} className="text-fuchsia-600" />],
                ].map(([label, icon]) => (
                  <button key={label as string} type="button" className={`inline-flex h-10 w-full items-center justify-between rounded-lg border px-3 text-sm font-semibold ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <span className="inline-flex items-center gap-2">{icon as ReactNode}{label as string}</span>
                    <span>{'>'}</span>
                  </button>
                ))}
                <button type="button" className={`inline-flex h-10 w-full items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${isDarkMode ? 'border-rose-700/40 text-rose-300 hover:bg-rose-900/20' : 'border-rose-200 text-rose-600 hover:bg-rose-50'}`}>
                  <CircleAlert size={15} /> Mark as Lost / Damaged
                </button>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </div>
  )
}
