import {
  Download,
  Printer,
  Calendar,
  ChevronRight,
  BookOpen,
  Users,
  Clock,
  RotateCcw,
  BadgeDollarSign,
  ArrowUpRight,
  ArrowDownRight,
  TriangleAlert
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useEffect, useMemo, useState } from 'react'
import { listBooks, listBorrowTransactions, listMembers, type Book, type BorrowTransaction, type Member } from '../lib/tauriApi'
const pieColors = ['#4f46e5', '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#e2e8f0']

type ReportsPageProps = {
  isDarkMode: boolean
  onViewOverdueActivity?: () => void
  onViewTopMembers?: () => void
}

export function ReportsPage({ isDarkMode, onViewOverdueActivity, onViewTopMembers }: ReportsPageProps) {
  const cardClass = isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const labelClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
  const [books, setBooks] = useState<Book[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [transactions, setTransactions] = useState<BorrowTransaction[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [bookRows, memberRows, txRows] = await Promise.all([
          listBooks(2000),
          listMembers(2000),
          listBorrowTransactions(undefined, 5000),
        ])
        setBooks(bookRows)
        setMembers(memberRows)
        setTransactions(txRows)
      } catch (error) {
        console.error('Failed to load reports data:', error)
      }
    }
    void load()
  }, [])

  const computed = useMemo(() => {
    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000
    const borrowedTotal = transactions.length
    const returnedTotal = transactions.filter((tx) => tx.returnDate || tx.status.toLowerCase() === 'returned').length
    const overdueTx = transactions.filter((tx) => {
      if (tx.returnDate || tx.status.toLowerCase() === 'returned') return false
      const due = new Date(tx.dueDate).getTime()
      return !Number.isNaN(due) && due < now
    })
    const overdueTotal = overdueTx.length
    const fines = transactions.reduce((sum, tx) => sum + (Number.isFinite(tx.fine) ? tx.fine : 0), 0)
    const activeMembers = members.filter((m) => (m.status || '').toLowerCase() === 'active').length

    const dayBuckets = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now - (6 - i) * oneDayMs)
      const key = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return { key, name: label, borrowed: 0, returned: 0 }
    })
    const bucketByDay = new Map(dayBuckets.map((d) => [d.key, d]))
    transactions.forEach((tx) => {
      const borrowKey = toDateKey(tx.borrowDate)
      if (!borrowKey) return
      const borrowBucket = bucketByDay.get(borrowKey)
      if (borrowBucket) borrowBucket.borrowed += 1
      if (tx.returnDate) {
        const returnKey = toDateKey(tx.returnDate)
        if (!returnKey) return
        const returnBucket = bucketByDay.get(returnKey)
        if (returnBucket) returnBucket.returned += 1
      }
    })

    const byBook = new Map<string, number>()
    transactions.forEach((tx) => byBook.set(tx.bookTitle, (byBook.get(tx.bookTitle) || 0) + 1))
    const topBookEntries = [...byBook.entries()].sort((a, b) => b[1] - a[1])
    const topBooksRaw = topBookEntries.slice(0, 5)
    const otherBooks = topBookEntries.slice(5).reduce((sum, [, v]) => sum + v, 0)
    const bookData = topBooksRaw.map(([name, value], i) => ({ name, value, color: pieColors[i % pieColors.length] }))
    if (otherBooks > 0) bookData.push({ name: 'Others', value: otherBooks, color: pieColors[5] })

    const byCategory = new Map<string, number>()
    const categoryByBookId = new Map(books.map((b) => [b.id, b.category || 'Uncategorized']))
    transactions.forEach((tx) => {
      const cat = categoryByBookId.get(tx.bookId) || 'Uncategorized'
      byCategory.set(cat, (byCategory.get(cat) || 0) + 1)
    })
    const topCategoryEntries = [...byCategory.entries()].sort((a, b) => b[1] - a[1])
    const topCatRaw = topCategoryEntries.slice(0, 5)
    const otherCats = topCategoryEntries.slice(5).reduce((sum, [, v]) => sum + v, 0)
    const categoryData = topCatRaw.map(([name, value], i) => ({ name, value, color: pieColors[i % pieColors.length] }))
    if (otherCats > 0) categoryData.push({ name: 'Others', value: otherCats, color: pieColors[5] })

    const memberPhotoByCode = new Map(
      members.map((m) => [m.memberId, m.profilePhotoData || null] as const),
    )
    const memberStats = new Map<string, { name: string; id: string; borrowed: number; returned: number; overdue: number; profilePhotoData: string | null }>()
    transactions.forEach((tx) => {
      const current = memberStats.get(tx.memberCode) || {
        name: tx.memberName,
        id: tx.memberCode,
        borrowed: 0,
        returned: 0,
        overdue: 0,
        profilePhotoData: memberPhotoByCode.get(tx.memberCode) || null,
      }
      current.borrowed += 1
      if (tx.returnDate || tx.status.toLowerCase() === 'returned') current.returned += 1
      const due = new Date(tx.dueDate).getTime()
      if (!tx.returnDate && !Number.isNaN(due) && due < now) current.overdue += 1
      memberStats.set(tx.memberCode, current)
    })
    const topMembers = [...memberStats.values()].sort((a, b) => b.borrowed - a.borrowed).slice(0, 5)

    const overdueRows = overdueTx
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map((tx) => {
        const dueTs = new Date(tx.dueDate).getTime()
        const daysOverdue = Math.max(1, Math.floor((now - dueTs) / oneDayMs))
        return {
          id: tx.id,
          name: tx.memberName,
          memberCode: tx.memberCode,
          book: tx.bookTitle,
          due: new Date(tx.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          days: `${daysOverdue} day${daysOverdue > 1 ? 's' : ''}`,
          fine: tx.fine,
          profilePhotoData: memberPhotoByCode.get(tx.memberCode) || null,
        }
      })

    return { borrowedTotal, returnedTotal, overdueTotal, fines, activeMembers, activityData: dayBuckets, bookData, categoryData, topMembers, overdueRows }
  }, [books, members, transactions])

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-6 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <div className="space-y-8 pb-10">
        
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider ${labelClass}`}>
               <span>Home</span>
               <ChevronRight size={12} />
               <span>Reports</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
            <p className={`text-sm ${labelClass}`}>Overview of library activities and insights</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${cardClass}`}>
              <Calendar size={18} className="opacity-40" />
              <span>Last 7 Days</span>
            </div>
            <button className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 ${cardClass}`}>
              <Download size={15} />
              Export
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 dark:shadow-none">
              <Printer size={15} />
              Print Report
            </button>
          </div>
        </div>

        {/* 1st ROW: STATS (Direct Render) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
           {/* Card 1 */}
           <div className={`flex items-center gap-5 rounded-xl border p-7 ${cardClass}`}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <BookOpen size={20} />
              </div>
              <div className="space-y-0.5">
                <p className={`text-[11px] font-bold tracking-tight uppercase ${labelClass}`}>Total Borrowed</p>
                <h4 className="text-xl font-bold leading-tight tracking-tight">{computed.borrowedTotal}</h4>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <ArrowUpRight size={12} />
                  <span>12.5%</span>
                </div>
              </div>
           </div>
           {/* Card 2 */}
           <div className={`flex items-center gap-5 rounded-xl border p-7 ${cardClass}`}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Users size={20} />
              </div>
              <div className="space-y-0.5">
                <p className={`text-[11px] font-bold tracking-tight uppercase ${labelClass}`}>Active Members</p>
                <h4 className="text-xl font-bold leading-tight tracking-tight">{computed.activeMembers}</h4>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <ArrowUpRight size={12} />
                  <span>8.3%</span>
                </div>
              </div>
           </div>
           {/* Card 3 */}
           <div className={`flex items-center gap-5 rounded-xl border p-7 ${cardClass}`}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <Clock size={20} />
              </div>
              <div className="space-y-0.5">
                <p className={`text-[11px] font-bold tracking-tight uppercase ${labelClass}`}>Overdue Books</p>
                <h4 className="text-xl font-bold leading-tight tracking-tight">{computed.overdueTotal}</h4>
                <div className="flex items-center gap-1 text-[10px] font-bold text-rose-500">
                  <ArrowDownRight size={12} />
                  <span>5.6%</span>
                </div>
              </div>
           </div>
           {/* Card 4 */}
           <div className={`flex items-center gap-5 rounded-xl border p-7 ${cardClass}`}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <RotateCcw size={20} />
              </div>
              <div className="space-y-0.5">
                <p className={`text-[11px] font-bold tracking-tight uppercase ${labelClass}`}>Returned Books</p>
                <h4 className="text-xl font-bold leading-tight tracking-tight">{computed.returnedTotal}</h4>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <ArrowUpRight size={12} />
                  <span>15.2%</span>
                </div>
              </div>
           </div>
           {/* Card 5 */}
           <div className={`flex items-center gap-5 rounded-xl border p-7 ${cardClass}`}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                <BadgeDollarSign size={20} />
              </div>
              <div className="space-y-0.5">
                <p className={`text-[11px] font-bold tracking-tight uppercase ${labelClass}`}>Fines Collected</p>
                <h4 className="text-xl font-bold leading-tight tracking-tight">PHP {computed.fines.toFixed(2)}</h4>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <ArrowUpRight size={12} />
                  <span>10.8%</span>
                </div>
              </div>
           </div>
        </div>

        {/* 2nd ROW: CHARTS */}
        <div className="grid gap-6 lg:grid-cols-[3fr_1fr_1fr]">
          <div className={`rounded-xl border p-6 flex flex-col ${cardClass}`}>
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold">Borrowing Activity</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold">
                   <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-indigo-600" />
                     <span className={labelClass}>Borrowed</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-emerald-500" />
                     <span className={labelClass}>Returned</span>
                   </div>
                </div>
              </div>
              <select className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold ${isDarkMode ? 'bg-[#27272A] border-zinc-700' : 'bg-white border-zinc-200'}`}>
                <option>Daily</option>
              </select>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={computed.activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272A' : '#f1f5f9'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: isDarkMode ? '#64748b' : '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: isDarkMode ? '#64748b' : '#94a3b8' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="borrowed" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={0.1} fill="#4f46e5" />
                  <Area type="monotone" dataKey="returned" stroke="#10b981" strokeWidth={2.5} fillOpacity={0.1} fill="#10b981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`rounded-xl border p-6 flex flex-col items-center ${cardClass}`}>
            <h3 className="mb-6 text-sm font-bold w-full text-left">Most Borrowed</h3>
            <div className="h-[150px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={computed.bookData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                    {computed.bookData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 w-full">
              {computed.bookData.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-[10px]">
                   <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                   <span className={`font-bold truncate flex-1 ${labelClass}`}>{item.name}</span>
                   <span className="font-bold">{computed.borrowedTotal ? ((item.value / computed.borrowedTotal) * 100).toFixed(0) : '0'}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border p-6 flex flex-col items-center ${cardClass}`}>
            <h3 className="mb-6 text-sm font-bold w-full text-left">By Category</h3>
            <div className="h-[150px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={computed.categoryData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                    {computed.categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 w-full">
              {computed.categoryData.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-[10px]">
                   <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                   <span className={`font-bold truncate flex-1 ${labelClass}`}>{item.name}</span>
                   <span className="font-bold">{computed.borrowedTotal ? ((item.value / computed.borrowedTotal) * 100).toFixed(0) : '0'}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3rd ROW: TABLES */}
        <div className="grid gap-6 lg:grid-cols-5">
           {/* Overdue Table */}
           <div className={`lg:col-span-3 rounded-xl border overflow-hidden flex flex-col ${cardClass}`}>
              <div className="flex items-center justify-between p-5">
                 <div className="flex items-center gap-2">
                    <TriangleAlert size={18} className="text-rose-500" />
                    <h3 className="text-sm font-bold">Overdue Books</h3>
                 </div>
                 <button
                    type="button"
                    onClick={onViewOverdueActivity}
                    className="text-emerald-600 hover:underline text-xs font-bold"
                 >
                    View Activity &rarr;
                 </button>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`border-b ${isDarkMode ? 'text-zinc-300 border-zinc-700' : 'text-zinc-800 border-zinc-200'}`}>
                    <tr className="text-xs font-bold">
                      <th className="px-6 py-4">Member</th>
                      <th className="px-6 py-4">Book</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4 text-center">Days Overdue</th>
                      <th className="px-6 py-4 text-right">Fine</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {computed.overdueRows.map((row) => (
                      <tr key={row.id} className={`border-t transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-[#3F3F46]' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <span className={`grid h-11 w-11 place-items-center overflow-hidden rounded-full text-sm font-bold ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                {row.profilePhotoData ? (
                                  <img src={row.profilePhotoData} alt={`${row.name} profile`} className="h-full w-full object-cover" />
                                ) : (
                                  row.name.slice(0, 1).toUpperCase()
                                )}
                              </span>
                              <div>
                                <p className="text-sm font-medium">{row.name}</p>
                                <p className={`text-xs ${labelClass}`}>{row.memberCode}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-medium">{row.book}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-semibold">{row.due}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`rounded-full px-3 py-1 text-xs font-bold ${isDarkMode ? 'bg-rose-500/15 text-rose-300' : 'bg-rose-50 text-rose-500'}`}>
                             {row.days}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-rose-500 text-sm">PHP {row.fine.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`p-4 flex justify-between items-center text-[11px] font-bold border-t ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'} ${labelClass}`}>
                 <span>Showing 1 to {computed.overdueRows.length} of {computed.overdueTotal}</span>
              </div>
           </div>

           {/* Top Members Table */}
           <div className={`lg:col-span-2 rounded-xl border overflow-hidden flex flex-col ${cardClass}`}>
              <div className="flex items-center justify-between p-5">
                 <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">Top Members (Most Borrowed)</h3>
                 </div>
                 <button
                    type="button"
                    onClick={onViewTopMembers}
                    className="text-indigo-600 hover:underline text-xs font-bold"
                 >
                    View All &rarr;
                 </button>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`border-b ${isDarkMode ? 'text-zinc-300 border-zinc-700' : 'text-zinc-800 border-zinc-200'}`}>
                    <tr className="text-xs font-bold">
                      <th className="px-6 py-4">Member</th>
                      <th className="px-6 py-4 text-center">Books Borrowed</th>
                      <th className="px-6 py-4 text-center">Returned</th>
                      <th className="px-6 py-4 text-center">Overdue</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {computed.topMembers.map((row) => (
                      <tr key={row.id} className={`border-t transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-[#3F3F46]' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <span className={`grid h-11 w-11 place-items-center overflow-hidden rounded-full text-sm font-bold ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                {row.profilePhotoData ? (
                                  <img src={row.profilePhotoData} alt={`${row.name} profile`} className="h-full w-full object-cover" />
                                ) : (
                                  row.name.slice(0, 1).toUpperCase()
                                )}
                              </span>
                              <div>
                                <p className="text-sm font-medium">{row.name}</p>
                                <p className={`text-[10px] ${labelClass}`}>{row.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-indigo-600 text-sm">{row.borrowed}</td>
                        <td className="px-6 py-4 text-center font-bold text-emerald-600 text-sm">{row.returned}</td>
                        <td className="px-6 py-4 text-center font-bold text-rose-600 text-sm">{row.overdue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`p-4 flex justify-between items-center text-[11px] font-bold border-t ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'} ${labelClass}`}>
                 <span>Showing 1 to {computed.topMembers.length} of {computed.activeMembers}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
    const toDateKey = (value: string) => {
      const parsed = new Date(value)
      if (Number.isNaN(parsed.getTime())) return null
      return parsed.toISOString().slice(0, 10)
    }
