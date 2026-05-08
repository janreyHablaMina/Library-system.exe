import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  History,
  Info,
  Mail,
  MoreVertical,
  Phone,
  Printer,
  RotateCcw,
  Send,
  User,
  XCircle,
  CalendarClock,
  StickyNote,
  UserCheck,
  MapPin
} from 'lucide-react'
import { useState } from 'react'
import sarahAvatar from '../assets/sarah_avatar.png'
import bookCover from '../assets/login.avif'

type TransactionDetailPageProps = {
  isDarkMode: boolean
  onBack: () => void
  transactionId?: string
}

export function TransactionDetailPage({ isDarkMode, onBack }: TransactionDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'notes'>('timeline')

  const cardClass = isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-100 bg-white'
  const subCardClass = isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-50 bg-[#f9fafb]'
  const labelClass = isDarkMode ? 'text-slate-400' : 'text-slate-500'
  const valueClass = isDarkMode ? 'text-slate-100' : 'text-slate-800'

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="p-5 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <ArrowLeft size={16} />
              Back to Transactions
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">Borrow Transaction Details</h2>
              <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                ID: TRX-000123
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${isDarkMode ? 'border-slate-700 bg-slate-900 hover:bg-slate-800' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <Printer size={16} />
              Print Receipt
            </button>
            <button className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${isDarkMode ? 'border-slate-700 bg-slate-900 hover:bg-slate-800' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <MoreVertical size={16} />
              More Actions
            </button>
          </div>
        </div>

        {/* Top Row: Info and Status Cards */}
        <div className="grid gap-6 lg:grid-cols-[2.4fr_1fr]">
          {/* Main Information Card (Borrower & Book combined) */}
          <div className={`rounded-2xl border shadow-sm overflow-hidden grid lg:grid-cols-[45%_55%] divide-x ${isDarkMode ? 'border-slate-800 bg-[#0a1633] divide-slate-800' : 'border-slate-100 bg-white divide-slate-100'}`}>
            {/* Borrower Info Section */}
            <div className="p-6">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-wider opacity-70">Borrower Information</h3>
              <div className="flex items-center gap-6 mb-8">
                <img src={sarahAvatar} alt="Sarah Williams" className="h-24 w-24 rounded-full object-cover border-2 border-white shadow-md dark:border-slate-800" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-bold">Sarah Williams</p>
                    <span className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-[#e0e7ff] text-[#4338ca]'}`}>MEM-00045</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-[11px] font-bold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#f0fdf4] text-[#166534]'}`}>
                     Active Member
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                 {[
                   { icon: <Mail size={16} />, label: 'Email', value: 'sarah.williams@example.com' },
                   { icon: <Phone size={16} />, label: 'Phone', value: '+1 (555) 123-4567' },
                   { icon: <User size={16} />, label: 'Member Type', value: 'Regular Member' },
                   { icon: <Calendar size={16} />, label: 'Member Since', value: 'Jan 15, 2024' },
                   { icon: <MapPin size={16} />, label: 'Address', value: '123 Library St, Cityville, CA 90210' },
                 ].map((item) => (
                   <div key={item.label} className="flex items-center text-sm">
                     <span className={`flex items-center gap-3 w-40 font-medium ${labelClass}`}>
                       <span className="opacity-60">{item.icon}</span>
                       {item.label}
                     </span>
                     <span className={`font-semibold ${valueClass}`}>{item.value}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Book Info Section */}
            <div className="p-6">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-wider opacity-70">Book Information</h3>
              <div className="flex gap-8">
                <div className="w-40 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <img src={bookCover} alt="Atomic Habits" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 space-y-5">
                  <div>
                    <h4 className="text-xl font-bold">Atomic Habits</h4>
                    <p className={`text-sm ${labelClass}`}>Tiny Changes, Remarkable Results</p>
                    <span className={`mt-2 inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-[#e0e7ff] text-[#4338ca]'}`}>BK-000123</span>
                  </div>
                  <div className="space-y-4">
                     {[
                       { icon: <UserCheck size={16} />, label: 'Author', value: 'James Clear' },
                       { icon: <FileText size={16} />, label: 'Category', value: 'Self-Help' },
                       { icon: <Info size={16} />, label: 'ISBN', value: '978-0735211292' },
                       { icon: <StickyNote size={16} />, label: 'Publisher', value: 'Avery' },
                       { icon: <Calendar size={16} />, label: 'Pages', value: '320' },
                     ].map((item) => (
                       <div key={item.label} className="flex items-center text-sm">
                         <span className={`flex items-center gap-3 w-36 font-medium ${labelClass}`}>
                           <span className="opacity-60">{item.icon}</span>
                           {item.label}
                         </span>
                         <span className={`font-semibold ${valueClass}`}>{item.value}</span>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Status Card */}
          <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider opacity-70">Transaction Status</h3>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Borrowed</span>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <CalendarClock size={16} className="opacity-40" />
                  <span className={labelClass}>Borrow Date</span>
                </div>
                <p className={`text-sm font-semibold ${valueClass}`}>May 10, 2024 10:30 AM</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="opacity-40" />
                  <span className={labelClass}>Due Date</span>
                </div>
                <div className="text-right">
                   <p className={`text-sm font-semibold ${valueClass}`}>May 24, 2024</p>
                   <p className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>2 days remaining</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw size={16} className="opacity-40" />
                  <span className={labelClass}>Return Date</span>
                </div>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>-</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard size={16} className="opacity-40" />
                  <span className={labelClass}>Fine / Penalty</span>
                </div>
                <p className="text-sm font-bold text-emerald-600">$0.00</p>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-xl border border-indigo-50 bg-indigo-50/30 p-3 dark:border-indigo-500/10 dark:bg-indigo-500/5">
                <div className="flex items-center gap-3 text-sm">
                  <Info size={16} className="text-indigo-500" />
                  <span className={`font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Status</span>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm'}`}>Not Returned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          {/* Left Column: Timeline & Notes */}
          <div className="space-y-6">
            <div className={`rounded-2xl border shadow-sm ${cardClass}`}>
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`relative py-1 text-sm font-bold transition-colors ${activeTab === 'timeline' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Transaction Timeline
                    {activeTab === 'timeline' && <span className="absolute -bottom-[17px] left-0 h-1 w-full rounded-full bg-indigo-600" />}
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`relative py-1 text-sm font-bold transition-colors ${activeTab === 'notes' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Notes
                    {activeTab === 'notes' && <span className="absolute -bottom-[17px] left-0 h-1 w-full rounded-full bg-indigo-600" />}
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'timeline' ? (
                  <div className="space-y-8">
                    {[
                      { icon: <UserCheck size={14} />, title: 'Book Borrowed', desc: 'borrowed "Atomic Habits"', date: 'May 10, 2024 10:30 AM', user: 'by Admin User', color: 'indigo' },
                      { icon: <Calendar size={14} />, title: 'Due Date Set', desc: 'Due date set to May 24, 2024', date: 'May 10, 2024 10:30 AM', user: 'by Admin User', color: 'amber' },
                      { icon: <Send size={14} />, title: 'Reminder Sent', desc: 'Due date reminder sent to member email', date: 'May 20, 2024 09:00 AM', user: 'by System', color: 'blue' },
                      { icon: <RotateCcw size={14} />, title: 'Book Returned', desc: 'Not yet returned', date: '-', user: 'Pending', color: 'slate' },
                    ].map((step, idx, arr) => (
                      <div key={step.title} className="relative flex gap-4">
                        {idx !== arr.length - 1 && (
                          <div className="absolute left-[15px] top-8 h-8 w-0.5 bg-slate-100 dark:bg-slate-800" />
                        )}
                        <div className={`grid h-8 w-8 place-items-center rounded-full border-4 border-white shadow-sm dark:border-slate-900 ${
                          step.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                          step.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                          step.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                          {step.icon}
                        </div>
                        <div className="flex flex-1 flex-wrap items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold">{step.title}</p>
                            <p className={`text-xs ${labelClass}`}>{step.desc}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-semibold">{step.date}</p>
                             <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-medium ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>{step.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                     <div className={`rounded-xl border p-4 ${subCardClass}`}>
                        <div className="mb-2 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <StickyNote size={14} className="text-amber-500" />
                              <p className="text-sm font-bold">Admin Note</p>
                           </div>
                           <p className={`text-[10px] ${labelClass}`}>May 10, 2024 10:35 AM</p>
                        </div>
                        <p className="text-sm leading-relaxed opacity-80">Member requested this book for personal development. No damage observed on borrow.</p>
                     </div>
                     <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-3 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50">
                        + Add a note
                     </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Previous Transactions */}
          <div className="space-y-6">
            <div className={`rounded-2xl border p-5 shadow-sm ${cardClass}`}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-70">Quick Actions</h3>
              <div className="grid gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 dark:shadow-none">
                  <CheckCircle2 size={18} />
                  Mark as Returned
                </button>
                <button className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-bold transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <Calendar size={18} className="opacity-50" />
                  Extend Due Date
                </button>
                <button className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-bold transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <Send size={18} className="opacity-50" />
                  Send Reminder
                </button>
                <button className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-bold transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <StickyNote size={18} className="opacity-50" />
                  Add Note
                </button>
                <button className={`mt-2 flex items-center justify-center gap-2 rounded-xl border border-rose-100 py-2.5 text-sm font-bold text-rose-500 transition-colors ${isDarkMode ? 'border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10' : 'bg-rose-50/50 hover:bg-rose-50'}`}>
                  <XCircle size={18} />
                  Cancel Transaction
                </button>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 shadow-sm ${cardClass}`}>
              <div className="mb-4 flex items-center justify-between">
                 <h3 className="text-sm font-bold uppercase tracking-wider opacity-70">Previous Transactions</h3>
                 <button className="text-[10px] font-bold text-indigo-600 hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'The Psychology of Money', date: 'Apr 10, 2024', status: 'Returned', statusColor: 'emerald' },
                  { title: 'Deep Work', date: 'Mar 05, 2024', status: 'Returned', statusColor: 'emerald' },
                ].map((tx) => (
                  <div key={tx.title} className={`flex items-center justify-between rounded-xl border p-3 ${subCardClass}`}>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold truncate max-w-[150px]">{tx.title}</p>
                      <p className={`text-[10px] ${labelClass}`}>{tx.date}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      tx.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
