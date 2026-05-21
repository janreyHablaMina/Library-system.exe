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

const activityData = [
  { name: 'Apr 6', borrowed: 20, returned: 12 },
  { name: 'Apr 11', borrowed: 45, returned: 28 },
  { name: 'Apr 16', borrowed: 32, returned: 20 },
  { name: 'Apr 21', borrowed: 42, returned: 35 },
  { name: 'Apr 26', borrowed: 30, returned: 25 },
  { name: 'May 1', borrowed: 48, returned: 32 },
  { name: 'May 6', borrowed: 35, returned: 28 },
]

const bookData = [
  { name: 'Atomic Habits', value: 25, color: '#4f46e5' },
  { name: 'The Psychology of Money', value: 20, color: '#3b82f6' },
  { name: 'Rich Dad Poor Dad', value: 18, color: '#f59e0b' },
  { name: 'The Power of Habit', value: 15, color: '#10b981' },
  { name: 'Deep Work', value: 12, color: '#ef4444' },
  { name: 'Others', value: 66, color: '#e2e8f0' },
]

const categoryData = [
  { name: 'Self-Help', value: 45, color: '#4f46e5' },
  { name: 'Business', value: 32, color: '#ec4899' },
  { name: 'Fiction', value: 28, color: '#f59e0b' },
  { name: 'Technology', value: 18, color: '#8b5cf6' },
  { name: 'Education', value: 12, color: '#ef4444' },
  { name: 'Others', value: 13, color: '#e2e8f0' },
]

type ReportsPageProps = {
  isDarkMode: boolean
  onViewOverdueActivity?: () => void
  onViewTopMembers?: () => void
}

export function ReportsPage({ isDarkMode, onViewOverdueActivity, onViewTopMembers }: ReportsPageProps) {
  const cardClass = isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'
  const labelClass = isDarkMode ? 'text-slate-400' : 'text-slate-500'

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-6 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
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
              <span>Apr 6, 2026 - May 6, 2026</span>
            </div>
            <button className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800 ${cardClass}`}>
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
                <h4 className="text-xl font-bold leading-tight tracking-tight">156</h4>
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
                <h4 className="text-xl font-bold leading-tight tracking-tight">124</h4>
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
                <h4 className="text-xl font-bold leading-tight tracking-tight">18</h4>
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
                <h4 className="text-xl font-bold leading-tight tracking-tight">98</h4>
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
                <h4 className="text-xl font-bold leading-tight tracking-tight">PHP 325.00</h4>
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
              <select className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold ${isDarkMode ? 'bg-[#0f1f49] border-slate-700' : 'bg-white border-slate-200'}`}>
                <option>Daily</option>
              </select>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
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
                  <Pie data={bookData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                    {bookData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 w-full">
              {bookData.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-[10px]">
                   <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                   <span className={`font-bold truncate flex-1 ${labelClass}`}>{item.name}</span>
                   <span className="font-bold">{(item.value / 156 * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border p-6 flex flex-col items-center ${cardClass}`}>
            <h3 className="mb-6 text-sm font-bold w-full text-left">By Category</h3>
            <div className="h-[150px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 w-full">
              {categoryData.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-[10px]">
                   <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                   <span className={`font-bold truncate flex-1 ${labelClass}`}>{item.name}</span>
                   <span className="font-bold">{(item.value / 148 * 100).toFixed(0)}%</span>
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
                  <thead className={`border-b ${isDarkMode ? 'text-slate-300 border-slate-700' : 'text-slate-800 border-slate-200'}`}>
                    <tr className="text-xs font-bold">
                      <th className="px-6 py-4">Member</th>
                      <th className="px-6 py-4">Book</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4 text-center">Days Overdue</th>
                      <th className="px-6 py-4 text-right">Fine</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {[
                      { name: 'Ana Lim', id: 'STU-2026-004', book: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', due: 'May 17, 2026', days: '3 days', fine: 'PHP 15.00', avatar: '\u{1F469}\u{1F3FD}' },
                      { name: 'Michael Johnson', id: 'MEM-2026-015', book: 'The Intelligent Investor', author: 'Benjamin Graham', due: 'May 15, 2026', days: '5 days', fine: 'PHP 25.00', avatar: '\u{1F468}\u{1F3FB}' },
                      { name: 'Peter Parker', id: 'MEM-2026-011', book: 'Start With Why', author: 'Simon Sinek', due: 'May 12, 2026', days: '8 days', fine: 'PHP 40.00', avatar: '\u{1F468}\u{1F3FD}' },
                      { name: 'Sophia Reyes', id: 'STU-2026-007', book: 'Atomic Habits', author: 'James Clear', due: 'May 10, 2026', days: '10 days', fine: 'PHP 50.00', avatar: '\u{1F469}\u{1F3FB}' },
                      { name: 'Mark Anthony', id: 'TCH-2026-001', book: 'Deep Work', author: 'Cal Newport', due: 'May 8, 2026', days: '12 days', fine: 'PHP 60.00', avatar: '\u{1F468}\u{1F3FE}' },
                    ].map((row) => (
                      <tr key={row.id} className={`border-t transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <span className={`grid h-11 w-11 place-items-center rounded-full text-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{row.avatar}</span>
                              <div>
                                <p className="text-sm font-medium">{row.name}</p>
                                <p className={`text-xs ${labelClass}`}>{row.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-medium">{row.book}</p>
                           <p className={`text-xs ${labelClass}`}>{row.author}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-semibold">{row.due}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`rounded-full px-3 py-1 text-xs font-bold ${isDarkMode ? 'bg-rose-500/15 text-rose-300' : 'bg-rose-50 text-rose-500'}`}>
                             {row.days}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-rose-500 text-sm">{row.fine}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`p-4 flex justify-between items-center text-[11px] font-bold border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} ${labelClass}`}>
                 <span>Showing 1 to 5 of 18</span>
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
                  <thead className={`border-b ${isDarkMode ? 'text-slate-300 border-slate-700' : 'text-slate-800 border-slate-200'}`}>
                    <tr className="text-xs font-bold">
                      <th className="px-6 py-4">Member</th>
                      <th className="px-6 py-4 text-center">Books Borrowed</th>
                      <th className="px-6 py-4 text-center">Returned</th>
                      <th className="px-6 py-4 text-center">Overdue</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {[
                      { name: 'Juan Dela Cruz', id: 'STU-2026-001', b: 12, r: 11, o: 1, avatar: '\u{1F468}\u{1F3FB}' },
                      { name: 'Maria Santos', id: 'STU-2026-002', b: 9, r: 9, o: 0, avatar: '\u{1F469}\u{1F3FB}' },
                      { name: 'Liza Montero', id: 'STA-2026-002', b: 8, r: 7, o: 1, avatar: '\u{1F469}\u{200D}\u{1F4BC}' },
                      { name: 'Alex Tan', id: 'VIS-2026-001', b: 7, r: 7, o: 0, avatar: '\u{1F9D1}\u{1F3FB}' },
                      { name: 'Ana Lim', id: 'STU-2026-004', b: 6, r: 5, o: 1, avatar: '\u{1F469}\u{1F3FD}' },
                    ].map((row) => (
                      <tr key={row.id} className={`border-t transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <span className={`grid h-11 w-11 place-items-center rounded-full text-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{row.avatar}</span>
                              <div>
                                <p className="text-sm font-medium">{row.name}</p>
                                <p className={`text-[10px] ${labelClass}`}>{row.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-indigo-600 text-sm">{row.b}</td>
                        <td className="px-6 py-4 text-center font-bold text-emerald-600 text-sm">{row.r}</td>
                        <td className="px-6 py-4 text-center font-bold text-rose-600 text-sm">{row.o}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`p-4 flex justify-between items-center text-[11px] font-bold border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} ${labelClass}`}>
                 <span>Showing 1 to 5 of 124</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
