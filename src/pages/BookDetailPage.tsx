import type { ReactNode } from 'react'
import { ArrowLeft, BookCopy, BookMarked, Calendar, ClipboardPlus, Ellipsis, FileText, FlagTriangleRight, Library, Printer, ScanBarcode, SquarePen, Star, TriangleAlert, UserRound } from 'lucide-react'

type BookDetailPageProps = {
  isDarkMode: boolean
  onBack: () => void
}

type CopyRow = {
  copyId: string
  barcode: string
  location: string
  status: 'Available' | 'Borrowed'
  condition: 'Good' | 'Fair' | 'Excellent'
  addedDate: string
}

const copyRows: CopyRow[] = [
  { copyId: 'BK-2026-0001', barcode: '10000001', location: 'Main Library - Shelf A3', status: 'Available', condition: 'Good', addedDate: 'Apr 12, 2026' },
  { copyId: 'BK-2026-0002', barcode: '10000002', location: 'Main Library - Shelf A3', status: 'Borrowed', condition: 'Good', addedDate: 'Apr 12, 2026' },
  { copyId: 'BK-2026-0003', barcode: '10000003', location: 'Main Library - Shelf A3', status: 'Borrowed', condition: 'Fair', addedDate: 'Apr 12, 2026' },
  { copyId: 'BK-2026-0004', barcode: '10000004', location: 'Main Library - Shelf A3', status: 'Available', condition: 'Good', addedDate: 'Apr 12, 2026' },
  { copyId: 'BK-2026-0005', barcode: '10000005', location: 'Main Library - Shelf A3', status: 'Available', condition: 'Excellent', addedDate: 'Apr 12, 2026' },
]

function MetaItem({ icon, label, value, isDarkMode }: { icon: ReactNode; label: string; value: string; isDarkMode: boolean }) {
  return (
    <div>
      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{icon} {label}</p>
      <p className={`mt-1 text-2xl font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{value}</p>
    </div>
  )
}

function getStatusClass(status: CopyRow['status']) {
  if (status === 'Available') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
}

function getConditionClass(condition: CopyRow['condition']) {
  if (condition === 'Excellent') return 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
  if (condition === 'Fair') return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
  return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
}

export function BookDetailPage({ isDarkMode, onBack }: BookDetailPageProps) {
  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="p-1">
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className={`grid h-8 w-8 place-items-center rounded-full ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
            aria-label="Back to books"
          >
            <ArrowLeft size={15} />
          </button>
          <button type="button" onClick={onBack} className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900'}`}>Books</button>
          <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>&gt;</span>
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Book Details</span>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.65fr_0.75fr]">
          <main className={`rounded-xl border p-3 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className="grid gap-4 xl:grid-cols-[190px_1fr]">
              <aside>
                <div className={`grid h-[280px] w-full place-items-center rounded-lg text-center ${isDarkMode ? 'bg-[#0f1f49] text-slate-100' : 'bg-[#0b5f89] text-white'}`}>
                  <div>
                    <p className="text-3xl font-black leading-tight tracking-wider">THE</p>
                    <p className="mt-2 text-3xl font-black leading-tight tracking-wider">MINDFUL</p>
                    <p className="mt-2 text-3xl font-black leading-tight tracking-wider">LEADER</p>
                  </div>
                </div>
                <div className={`mt-3 rounded-lg border p-3 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50/70'}`}>
                  <div className="mb-2 flex items-center justify-between"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Status</span><span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Available</span></div>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Call Number</span><span className="font-semibold">658.4092 STA</span></div>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Barcode</span><span className="font-semibold">10000001</span></div>
                  <div className="flex items-center justify-between text-sm"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Location</span><span className="font-semibold">Main Library - Shelf A3</span></div>
                </div>
              </aside>

              <div className="p-2">
                <h2 className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>The Mindful Leader</h2>
                <p className={`mt-1 text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>7 Practices for Transforming Your Leadership</p>
                <p className="mt-2 text-xl font-semibold text-emerald-600">by Michael Bungay Stanier</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {['Leadership', 'Personal Development', 'English'].map((tag) => (
                    <span key={tag} className={`rounded-full px-3 py-1 text-xs font-semibold ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>{tag}</span>
                  ))}
                </div>

                <div className="mt-5 grid gap-5 border-b pb-5 md:grid-cols-4">
                  <MetaItem icon={<BookCopy size={14} className="mr-1 inline" />} label="ISBN" value="978-1524761540" isDarkMode={isDarkMode} />
                  <MetaItem icon={<Library size={14} className="mr-1 inline" />} label="Publisher" value="HarperBusiness" isDarkMode={isDarkMode} />
                  <MetaItem icon={<Calendar size={14} className="mr-1 inline" />} label="Published Year" value="2016" isDarkMode={isDarkMode} />
                  <MetaItem icon={<BookMarked size={14} className="mr-1 inline" />} label="Pages" value="240" isDarkMode={isDarkMode} />
                </div>

                <h3 className={`mt-4 text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Description</h3>
                <p className={`mt-2 text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  The Mindful Leader outlines seven essential practices that fall into three categories: being aware,
                  creating space, and choosing your response. Stanier provides practical strategies to help leaders improve
                  their focus, clarity, and effectiveness.
                </p>
                <button type="button" className="mt-3 text-sm font-semibold text-emerald-600 hover:underline">Read more</button>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"><SquarePen size={15} />Edit Book</button>
                  <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}><Printer size={15} />Print Label</button>
                  <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}><ScanBarcode size={15} />View Barcode</button>
                  <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}><Ellipsis size={15} />More</button>
                </div>
              </div>
            </div>
          </main>

          <aside className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className={`mb-3 rounded-lg px-3 py-2 ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <h3 className="flex items-center gap-2 text-base font-bold text-emerald-700"><FlagTriangleRight size={15} />At a Glance</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Total Copies</span><span className="font-semibold">5</span></div>
              <div className="flex justify-between"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Available Copies</span><span className="font-semibold text-emerald-600">3</span></div>
              <div className="flex justify-between"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Borrowed Copies</span><span className="font-semibold text-amber-600">2</span></div>
              <div className="flex justify-between"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Reserved Copies</span><span className="font-semibold">0</span></div>
              <div className="flex justify-between"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Lost / Damaged</span><span className="font-semibold">0</span></div>
            </div>
            <div className={`my-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Added Date</span><span className="font-semibold">Apr 12, 2026</span></div>
              <div className="flex justify-between"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Last Updated</span><span className="font-semibold">May 2, 2026</span></div>
              <div className="flex justify-between"><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Added By</span><span className="font-semibold">Admin User</span></div>
            </div>
            <div className={`my-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} />
            <h3 className={`mb-3 text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Quick Actions</h3>
            <div className="space-y-2">
              <button type="button" className={`inline-flex h-11 w-full items-center gap-2 rounded-xl border px-3 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}><BookMarked size={15} />Borrow This Book</button>
              <button type="button" className={`inline-flex h-11 w-full items-center gap-2 rounded-xl border px-3 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}><BookCopy size={15} />Reserve This Book</button>
              <button type="button" className={`inline-flex h-11 w-full items-center gap-2 rounded-xl border px-3 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}><ClipboardPlus size={15} />Add New Copy</button>
              <button type="button" className={`inline-flex h-11 w-full items-center gap-2 rounded-xl border px-3 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}><Printer size={15} />Print Book Details</button>
              <button type="button" className={`inline-flex h-11 w-full items-center gap-2 rounded-xl border px-3 text-sm font-semibold ${isDarkMode ? 'border-rose-700/50 text-rose-300 hover:bg-rose-900/20' : 'border-rose-200 text-rose-600 hover:bg-rose-50'}`}><TriangleAlert size={15} />Mark as Lost/Damaged</button>
            </div>
          </aside>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className={`flex flex-wrap gap-3 border-b px-4 pt-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              {[
                ['Copies (5)', true, <BookCopy key="copy" size={14} />],
                ['Borrow History', false, <FileText key="hist" size={14} />],
                ['Current Borrowers (2)', false, <UserRound key="usr" size={14} />],
                ['Reviews (0)', false, <Star key="star" size={14} />],
              ].map(([tab, active, icon]) => (
                <button key={tab as string} type="button" className={`inline-flex items-center gap-1 border-b-2 pb-3 text-sm font-semibold ${active ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500'}`}>
                  {icon as ReactNode}
                  {tab as string}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full text-left text-sm">
                <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                  <tr>
                    <th className="px-4 py-3 font-semibold">Copy ID</th>
                    <th className="px-3 py-3 font-semibold">Barcode</th>
                    <th className="px-3 py-3 font-semibold">Location</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Condition</th>
                    <th className="px-3 py-3 font-semibold">Added Date</th>
                    <th className="px-3 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {copyRows.map((copy) => (
                    <tr key={copy.copyId} className={`border-t ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <td className="px-4 py-3 font-semibold">{copy.copyId}</td>
                      <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{copy.barcode}</td>
                      <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{copy.location}</td>
                      <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(copy.status)}`}>{copy.status}</span></td>
                      <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${getConditionClass(copy.condition)}`}>{copy.condition}</span></td>
                      <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{copy.addedDate}</td>
                      <td className="px-3 py-3 text-right"><button type="button" className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>...</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`border-t px-4 py-3 text-sm ${isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}>Showing 1 to 5 of 5 copies</div>
          </div>

          <div className="space-y-4">
            <article className={`rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Current Borrowers (2)</h3>
                <button className="text-sm font-semibold text-emerald-700 hover:underline">View All</button>
              </div>
              <div className="p-4">
                {[
                  ['Juan Dela Cruz', 'STU-2026-001', 'May 1, 2026', 'May 15, 2026', 'Due in 9 days', '\u{1F468}\u{1F3FB}'],
                  ['Maria Santos', 'STU-2026-002', 'May 2, 2026', 'May 16, 2026', 'Due in 10 days', '\u{1F469}\u{1F3FB}'],
                ].map(([name, id, borrowDate, dueDate, due, avatar]) => (
                  <div key={id as string} className={`mb-3 rounded-lg border p-3 last:mb-0 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50/50'}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`grid h-9 w-9 place-items-center rounded-full text-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{avatar as string}</span>
                      <div>
                        <p className="font-semibold">{name as string}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{id as string}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Borrow Date</p><p className="font-semibold">{borrowDate as string}</p></div>
                      <div><p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Due Date</p><p className="font-semibold">{dueDate as string}</p></div>
                      <div className="flex items-end justify-end"><span className="rounded-md bg-amber-50 px-2 py-1 font-semibold text-amber-700">{due as string}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className={`rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Borrow History</h3>
                <button className="text-sm font-semibold text-emerald-700 hover:underline">View All</button>
              </div>
              <div className="p-4 text-sm">
                {[
                  ['Visitor - Alex Tan', 'VIS-2026-001', 'Apr 27, 2026', 'May 11, 2026'],
                  ['Liza Montero', 'STA-2026-002', 'Apr 20, 2026', 'May 5, 2026'],
                  ['Visitor - Joy Reyes', 'VIS-2026-002', 'Apr 15, 2026', 'Apr 24, 2026'],
                ].map(([name, id, borrowed, returned]) => (
                  <div key={id as string} className={`mb-2 flex items-center justify-between rounded-lg border p-3 last:mb-0 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50/50'}`}>
                    <div>
                      <p className="font-semibold">{name as string}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{id as string}</p>
                    </div>
                    <div className="text-xs">
                      <p><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Borrowed</span> {borrowed as string}</p>
                      <p><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Returned</span> {returned as string}</p>
                    </div>
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">Returned</span>
                  </div>
                ))}
                <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Showing 1 to 3 of 12 records</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
