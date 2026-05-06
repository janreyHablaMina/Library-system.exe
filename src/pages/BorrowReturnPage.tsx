import { useState } from 'react'
import { ChevronDown, Ellipsis, IdCard, Mail, Phone, Search } from 'lucide-react'

type BorrowReturnPageProps = {
  isDarkMode: boolean
  onOpenTransactions: () => void
}

type BorrowedRow = {
  id: number
  member: string
  memberId: string
  book: string
  copyId: string
  borrowDate: string
  dueDate: string
  status: 'Active' | 'Overdue'
  avatar: string
}

type ReturnedRow = {
  id: number
  member: string
  memberId: string
  book: string
  copyId: string
  returnedDate: string
  fine: string
  fineType: 'paid' | 'due'
  avatar: string
}

const borrowedRows: BorrowedRow[] = [
  { id: 1, member: 'Juan Dela Cruz', memberId: 'STU-2026-001', book: 'Atomic Habits', copyId: 'BK-2026-0001', borrowDate: 'May 1, 2026', dueDate: 'May 15, 2026', status: 'Active', avatar: '👨🏻' },
  { id: 2, member: 'Maria Santos', memberId: 'STU-2026-002', book: 'The Psychology of Money', copyId: 'BK-2026-0003', borrowDate: 'May 2, 2026', dueDate: 'May 16, 2026', status: 'Active', avatar: '👩🏻' },
  { id: 3, member: 'Ana Lim', memberId: 'STU-2026-004', book: 'Thinking, Fast and Slow', copyId: 'BK-2026-0005', borrowDate: 'May 3, 2026', dueDate: 'May 17, 2026', status: 'Overdue', avatar: '👩🏽' },
  { id: 4, member: 'Mark Anthony', memberId: 'TCH-2026-001', book: 'Deep Work', copyId: 'BK-2026-0002', borrowDate: 'May 4, 2026', dueDate: 'May 18, 2026', status: 'Active', avatar: '👨🏾' },
]

const returnedRows: ReturnedRow[] = [
  { id: 1, member: 'Liza Montero', memberId: 'STA-2026-002', book: 'Rich Dad Poor Dad', copyId: 'BK-2026-0008', returnedDate: 'May 6, 2026 10:30 AM', fine: '₱0.00', fineType: 'paid', avatar: '👩‍💼' },
  { id: 2, member: 'Visitor - Alex Tan', memberId: 'VIS-2026-001', book: 'The Power of Habit', copyId: 'BK-2026-0009', returnedDate: 'May 6, 2026 09:15 AM', fine: '₱0.00', fineType: 'paid', avatar: '🧑🏻' },
  { id: 3, member: 'Visitor - Joy Reyes', memberId: 'VIS-2026-002', book: 'How to Win Friends and Influence People', copyId: 'BK-2026-0010', returnedDate: 'May 5, 2026 04:45 PM', fine: '₱25.00', fineType: 'due', avatar: '🧑🏽' },
  { id: 4, member: 'Rogelio Cruz', memberId: 'STA-2026-001', book: 'Start With Why', copyId: 'BK-2026-0011', returnedDate: 'May 5, 2026 02:20 PM', fine: '₱0.00', fineType: 'paid', avatar: '👨‍💼' },
]

function getStatusClass(status: BorrowedRow['status']) {
  if (status === 'Active') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
}

function getFineClass(type: ReturnedRow['fineType']) {
  return type === 'paid'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
    : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
}

export function BorrowReturnPage({ isDarkMode, onOpenTransactions }: BorrowReturnPageProps) {
  const [activeTab, setActiveTab] = useState<'borrow' | 'return'>('borrow')
  const [borrowDate, setBorrowDate] = useState('2026-05-06')
  const [dueDate, setDueDate] = useState('2026-05-20')

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="p-5">
        <div>
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Borrow / Return</h2>
          <p className={`mt-1 text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage book borrowing and returns.</p>
        </div>

        <div className={`mt-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex gap-2">
            <button type="button" onClick={() => setActiveTab('borrow')} className={`h-10 border-b-2 px-4 text-sm font-semibold ${activeTab === 'borrow' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500'}`}>Borrow Book</button>
            <button type="button" onClick={() => setActiveTab('return')} className={`h-10 border-b-2 px-4 text-sm font-semibold ${activeTab === 'return' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500'}`}>Return Book</button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1.3fr]">
          <article className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{activeTab === 'borrow' ? 'Borrow Book' : 'Return Book'}</h3>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{activeTab === 'borrow' ? 'Select member and book details to borrow.' : 'Select returned book details and complete return process.'}</p>

            <div className="mt-4 space-y-4">
              <div>
                <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>1. Select Member</p>
                <label className={`group flex h-11 items-center rounded-xl border px-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <Search size={16} className={`mr-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input placeholder="Search by name, member ID or scan card..." className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} />
                  <ChevronDown size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                </label>
              </div>

              <div className={`rounded-xl border p-3 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50/40'}`}>
                <div className="grid gap-3 md:grid-cols-[1.25fr_1fr_auto_auto] md:items-center">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>👩🏻</span>
                    <div className="min-w-0">
                      <p className={`truncate font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Maria Santos</p>
                      <p className={`truncate text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>STU-2026-002 • Student</p>
                    </div>
                  </div>
                  <div className="grid min-w-0 gap-1 text-xs">
                    <p className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}><Phone size={13} />0921 456 7890</p>
                    <p className={`flex min-w-0 items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}><Mail size={13} /><span className="truncate">maria.santos@email.com</span></p>
                  </div>
                  <div className="text-xs md:min-w-[84px] md:text-center">
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Borrowed Books</p>
                    <p className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>1</p>
                  </div>
                  <div className="text-xs md:min-w-[96px] md:text-center">
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Available Limit</p>
                    <p className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>4 / 5</p>
                  </div>
                </div>
              </div>

              <div>
                <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>2. Select Book</p>
                <label className={`group flex h-11 items-center rounded-xl border px-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <Search size={16} className={`mr-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input placeholder="Search by title, ISBN or scan barcode..." className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} />
                  <ChevronDown size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                </label>
              </div>

              <div className={`rounded-xl border p-3 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50/40'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-16 w-11 place-items-center rounded ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>📘</div>
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>The Mindful Leader</p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Author: Michael Bungay Stanier</p>
                      <p className={`mt-1 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>ISBN: 978-1524761540 • Copy ID: BK-2026-0007</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Available Copies</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>3</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>3. Borrow Date</p>
                  <label className={`flex h-11 items-center rounded-xl border px-3 text-sm ${isDarkMode ? 'border-slate-700 text-slate-200' : 'border-slate-200 text-slate-700'}`}>
                    <input
                      type="date"
                      value={borrowDate}
                      onChange={(event) => setBorrowDate(event.target.value)}
                      className={`date-input w-full bg-transparent outline-none ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}
                    />
                  </label>
                </div>
                <div>
                  <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>4. Due Date</p>
                  <label className={`flex h-11 items-center rounded-xl border px-3 text-sm ${isDarkMode ? 'border-slate-700 text-slate-200' : 'border-slate-200 text-slate-700'}`}>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(event) => setDueDate(event.target.value)}
                      className={`date-input w-full bg-transparent outline-none ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}
                    />
                  </label>
                  <p className="mt-1 text-xs font-semibold text-emerald-600">Borrowing period: 14 days</p>
                </div>
              </div>

              <div>
                <p className={`mb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>5. Notes (Optional)</p>
                <textarea maxLength={200} placeholder="Add any notes here..." className={`min-h-20 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'}`} />
                <p className={`mt-1 text-right text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>0 / 200</p>
              </div>

              <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700">
                <IdCard size={15} />
                {activeTab === 'borrow' ? 'Confirm Borrow' : 'Confirm Return'}
              </button>
            </div>
          </article>

          <div className="space-y-4">
            <article className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Current Borrowed Books (4)</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Books currently borrowed by members.</p>
                </div>
                <button type="button" onClick={onOpenTransactions} className="text-sm font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-left text-sm">
                  <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                    <tr>
                      <th className="px-4 py-3 font-semibold">Member</th>
                      <th className="px-3 py-3 font-semibold">Book</th>
                      <th className="px-3 py-3 font-semibold">Borrow Date</th>
                      <th className="px-3 py-3 font-semibold">Due Date</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                      <th className="px-3 py-3 font-semibold text-right"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowedRows.map((row) => (
                      <tr key={row.id} className={`border-t ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`grid h-9 w-9 place-items-center rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{row.avatar}</span>
                            <div><p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.member}</p><p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{row.memberId}</p></div>
                          </div>
                        </td>
                        <td className="px-3 py-3"><p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.book}</p><p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Copy ID: {row.copyId}</p></td>
                        <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.borrowDate}</td>
                        <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.dueDate}</td>
                        <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(row.status)}`}>{row.status}</span></td>
                        <td className="px-3 py-3 text-right"><button type="button" className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Ellipsis size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Recent Returned (4)</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Recently returned books.</p>
                </div>
                <button type="button" onClick={onOpenTransactions} className="text-sm font-semibold text-emerald-700 transition-all duration-150 hover:text-emerald-800 hover:underline">View all →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-left text-sm">
                  <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                    <tr>
                      <th className="px-4 py-3 font-semibold">Member</th>
                      <th className="px-3 py-3 font-semibold">Book</th>
                      <th className="px-3 py-3 font-semibold">Returned Date</th>
                      <th className="px-3 py-3 font-semibold">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnedRows.map((row) => (
                      <tr key={row.id} className={`border-t ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`grid h-9 w-9 place-items-center rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{row.avatar}</span>
                            <div><p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.member}</p><p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{row.memberId}</p></div>
                          </div>
                        </td>
                        <td className="px-3 py-3"><p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.book}</p><p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Copy ID: {row.copyId}</p></td>
                        <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.returnedDate}</td>
                        <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${getFineClass(row.fineType)}`}>{row.fine}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
