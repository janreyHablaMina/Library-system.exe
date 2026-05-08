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
  UserCheck
} from 'lucide-react'
import { useState } from 'react'
import bookCover from '../assets/login.avif' // Reusing existing asset for placeholder

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
    <div className={`min-h-0 flex-1 overflow-auto p-4 md:p-6 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="mx-auto max-w-7xl space-y-6">
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
                ID: TRX-2026-0042
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

        {/* Info Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_0.8fr]">
          {/* Borrower Info */}
          <div className={`rounded-2xl border p-5 shadow-sm ${cardClass}`}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-70">Borrower Information</h3>
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-3xl grid place-items-center">
                  👩🏻‍💼
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white bg-emerald-500 dark:border-slate-900" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold">Sarah Williams</p>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>MEM-00045</span>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                   Active Member
                </span>
                <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-1">
                   <div className="flex items-center gap-3 text-sm">
                      <Mail size={14} className="opacity-50" />
                      <span className={labelClass}>Email</span>
                      <span className={`ml-auto font-medium ${valueClass}`}>sarah.williams@example.com</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm">
                      <Phone size={14} className="opacity-50" />
                      <span className={labelClass}>Phone</span>
                      <span className={`ml-auto font-medium ${valueClass}`}>+1 (555) 123-4567</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm">
                      <User size={14} className="opacity-50" />
                      <span className={labelClass}>Member Type</span>
                      <span className={`ml-auto font-medium ${valueClass}`}>Regular Member</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm">
                      <Calendar size={14} className="opacity-50" />
                      <span className={labelClass}>Member Since</span>
                      <span className={`ml-auto font-medium ${valueClass}`}>Jan 15, 2024</span>
                   </div>
                </div>
              </div>
            </div>
            <div className={`mt-5 flex items-start gap-3 rounded-xl p-3 text-sm ${subCardClass}`}>
               <Info size={16} className="mt-0.5 opacity-40" />
               <div>
                  <p className={labelClass}>Address</p>
                  <p className={`font-medium ${valueClass}`}>123 Library St, Cityville, CA 90210</p>
               </div>
            </div>
          </div>

          {/* Book Info */}
          <div className={`rounded-2xl border p-5 shadow-sm ${cardClass}`}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-70">Book Information</h3>
            <div className="flex gap-5">
              <div className="w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <img src={bookCover} alt="Atomic Habits" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-xl font-bold">Atomic Habits</h4>
                  <p className={`text-sm ${labelClass}`}>Tiny Changes, Remarkable Results</p>
                  <span className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>BK-000123</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={labelClass}>Author</p>
                    <p className={`font-semibold ${valueClass}`}>James Clear</p>
                  </div>
                  <div>
                    <p className={labelClass}>Category</p>
                    <p className={`font-semibold ${valueClass}`}>Self-Help</p>
                  </div>
                  <div>
                    <p className={labelClass}>ISBN</p>
                    <p className={`font-semibold ${valueClass}`}>978-0735211292</p>
                  </div>
                  <div>
                    <p className={labelClass}>Publisher</p>
                    <p className={`font-semibold ${valueClass}`}>Avery</p>
                  </div>
                  <div>
                    <p className={labelClass}>Pages</p>
                    <p className={`font-semibold ${valueClass}`}>320</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Status */}
          <div className={`rounded-2xl border p-5 shadow-sm ${cardClass}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider opacity-70">Transaction Status</h3>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Borrowed</span>
            </div>
            <div className="space-y-4">
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
                   <p className="text-[10px] font-bold text-amber-500">2 days remaining</p>
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
              <div className="mt-4 flex items-center justify-between rounded-xl bg-indigo-50/50 p-3 dark:bg-indigo-500/5">
                <div className="flex items-center gap-3 text-sm">
                  <Info size={16} className="text-indigo-500" />
                  <span className={`font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Status</span>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm'}`}>Not Returned</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          {/* Left Column: Timeline & Notes */}
          <div className="space-y-6">
             {/* Timeline */}
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
                      { icon: <RotateCcw size={14} />, title: 'Book Returned', desc: 'Not yet returned', date: '-', user: 'Pending', color: 'slate', isPending: true },
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
                          </div>
                          <div className="min-w-[100px] text-right">
                             <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>{step.user}</span>
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

            {/* Fine Calculation */}
            <div className={`rounded-2xl border p-5 shadow-sm ${cardClass}`}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-70">Fine Calculation</h3>
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-12 text-sm">
                    <span className={`w-28 ${labelClass}`}>Fine per day</span>
                    <span className={`font-semibold ${valueClass}`}>$0.50</span>
                  </div>
                  <div className="flex items-center gap-12 text-sm">
                    <span className={`w-28 ${labelClass}`}>Days overdue</span>
                    <span className="font-bold text-emerald-600">0 days</span>
                  </div>
                  <div className="flex items-center gap-12 text-sm">
                    <span className={`w-28 ${labelClass}`}>Fine amount</span>
                    <span className="font-bold text-emerald-600">$0.00</span>
                  </div>
                </div>
                <div className={`flex flex-col items-center justify-center rounded-2xl p-6 text-center ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                   <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Total Fine</p>
                   <p className={`text-3xl font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>$0.00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Details */}
          <div className="space-y-6">
            {/* Quick Actions */}
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

            {/* Previous Transactions */}
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
