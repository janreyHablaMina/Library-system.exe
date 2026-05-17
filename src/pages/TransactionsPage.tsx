import { 
  ArrowLeft, CalendarDays, ChevronDown, Download, RotateCcw, Search, 
  ClipboardList, ArrowDownToLine, ArrowUpFromLine, AlertTriangle,
  MoreHorizontal, Eye, CheckCircle, Receipt, Printer, Send
} from 'lucide-react'
import { useMemo, useState, useEffect, useRef } from 'react'

type TransactionType = 'Borrow' | 'Return'
type TransactionStatus = 'Active' | 'Returned' | 'Overdue'
type TransactionTab = 'all' | 'borrowed' | 'returned' | 'overdue'

type TransactionsPageProps = {
  isDarkMode: boolean
  onBack: () => void
  onOpenTransactionDetail: (id: string) => void
  initialTab?: TransactionTab
}

type TransactionRow = {
  id: string
  type: TransactionType
  member: string
  memberId: string
  memberAvatar: string
  book: string
  author: string
  copyId: string
  borrowDate: string
  dueDate: string
  returnDate: string
  status: TransactionStatus
  fine: string
}

const transactions: TransactionRow[] = [
  { id: 'TRX-2026-0042', type: 'Borrow', member: 'Juan Dela Cruz', memberId: 'STU-2026-001', memberAvatar: '\u{1F468}\u{1F3FB}', book: 'Atomic Habits', author: 'James Clear', copyId: 'BK-2026-0001', borrowDate: 'May 6, 2026 10:30 AM', dueDate: 'May 20, 2026', returnDate: '-', status: 'Active', fine: 'PHP 0.00' },
  { id: 'TRX-2026-0041', type: 'Borrow', member: 'Maria Santos', memberId: 'STU-2026-002', memberAvatar: '\u{1F469}\u{1F3FB}', book: 'The Psychology of Money', author: 'Morgan Housel', copyId: 'BK-2026-0003', borrowDate: 'May 5, 2026 03:15 PM', dueDate: 'May 19, 2026', returnDate: '-', status: 'Active', fine: 'PHP 0.00' },
  { id: 'TRX-2026-0040', type: 'Return', member: 'Liza Montero', memberId: 'STA-2026-002', memberAvatar: '\u{1F469}\u{200D}\u{1F4BC}', book: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', copyId: 'BK-2026-0008', borrowDate: 'Apr 28, 2026 09:10 AM', dueDate: 'May 12, 2026', returnDate: 'May 5, 2026 11:20 AM', status: 'Returned', fine: 'PHP 0.00' },
  { id: 'TRX-2026-0039', type: 'Return', member: 'Visitor - Alex Tan', memberId: 'VIS-2026-001', memberAvatar: '\u{1F9D1}\u{1F3FB}', book: 'The Power of Habit', author: 'Charles Duhigg', copyId: 'BK-2026-0009', borrowDate: 'Apr 27, 2026 02:45 PM', dueDate: 'May 11, 2026', returnDate: 'May 5, 2026 09:15 AM', status: 'Returned', fine: 'PHP 0.00' },
  { id: 'TRX-2026-0038', type: 'Borrow', member: 'Ana Lim', memberId: 'STU-2026-004', memberAvatar: '\u{1F469}\u{1F3FD}', book: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', copyId: 'BK-2026-0005', borrowDate: 'May 3, 2026 01:00 PM', dueDate: 'May 17, 2026', returnDate: '-', status: 'Overdue', fine: 'PHP 25.00' },
  { id: 'TRX-2026-0037', type: 'Borrow', member: 'Mark Anthony Villanueva', memberId: 'TCH-2026-001', memberAvatar: '\u{1F468}\u{1F3FE}', book: 'Deep Work', author: 'Cal Newport', copyId: 'BK-2026-0002', borrowDate: 'May 2, 2026 11:25 AM', dueDate: 'May 16, 2026', returnDate: '-', status: 'Active', fine: 'PHP 0.00' },
]

function getTypeClass(type: TransactionType) {
  return type === 'Borrow'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
    : 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
}

function getStatusClass(status: TransactionStatus) {
  if (status === 'Active') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  if (status === 'Returned') return 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
}

// ─── Transaction Actions Dropdown Menu ───────────────────────────────────────────
type TransactionActionsMenuProps = {
  isDarkMode: boolean
  status: TransactionStatus
  hasFine: boolean
  onViewDetails: () => void
  onMarkReturned: () => void
  onSendReminder: () => void
  onRecordPayment: () => void
  onPrintReceipt: () => void
}

function TransactionActionsMenu({
  isDarkMode,
  status,
  hasFine,
  onViewDetails,
  onMarkReturned,
  onSendReminder,
  onRecordPayment,
  onPrintReceipt
}: TransactionActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpward(spaceBelow < 225)
    }
    setOpen(v => !v)
  }

  const surface = isDarkMode
    ? 'bg-[#0f172a] border-slate-700 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-slate-200'
    : 'bg-white border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-slate-700'

  const itemBase =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-100 text-left'
  const itemNormal = isDarkMode
    ? 'text-slate-200 hover:bg-slate-800'
    : 'text-slate-700 hover:bg-slate-50'
  const divider = isDarkMode ? 'border-slate-700/60' : 'border-slate-100'

  return (
    <div ref={ref} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-150 ${
          open
            ? isDarkMode
              ? 'border-slate-500 bg-slate-700 text-slate-100'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/5'
            : isDarkMode
              ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
        aria-label="Transaction actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-56 rounded-xl border p-1.5 ${surface} animate-[fadeIn_0.12s_ease] ${
            openUpward 
              ? 'bottom-full mb-1.5 origin-bottom-right' 
              : 'top-full mt-1.5 origin-top-right'
          }`}
          role="menu"
          style={{ animation: openUpward ? 'trxMenuInUp 0.13s cubic-bezier(0.16,1,0.3,1)' : 'trxMenuInDown 0.13s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <style>{`
            @keyframes trxMenuInDown {
              from { opacity: 0; transform: scale(0.95) translateY(-6px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
            @keyframes trxMenuInUp {
              from { opacity: 0; transform: scale(0.95) translateY(6px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
          `}</style>

          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={() => { setOpen(false); onViewDetails(); }}
          >
            <Eye size={15} className="shrink-0 text-sky-500" />
            View Details
          </button>

          {(status === 'Active' || status === 'Overdue') && (
            <button
              type="button"
              className={`${itemBase} ${itemNormal}`}
              role="menuitem"
              onClick={() => { setOpen(false); onMarkReturned(); }}
            >
              <CheckCircle size={15} className="shrink-0 text-emerald-500" />
              Mark as Returned
            </button>
          )}

          {status === 'Overdue' && (
            <button
              type="button"
              className={`${itemBase} ${itemNormal}`}
              role="menuitem"
              onClick={() => { setOpen(false); onSendReminder(); }}
            >
              <Send size={15} className="shrink-0 text-amber-500" />
              Send Reminder
            </button>
          )}

          {hasFine && status !== 'Returned' && (
            <button
              type="button"
              className={`${itemBase} ${itemNormal}`}
              role="menuitem"
              onClick={() => { setOpen(false); onRecordPayment(); }}
            >
              <Receipt size={15} className="shrink-0 text-rose-500" />
              Settle Fine
            </button>
          )}

          <div className={`my-1 border-t ${divider}`} />

          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            role="menuitem"
            onClick={() => { setOpen(false); onPrintReceipt(); }}
          >
            <Printer size={15} className="shrink-0 text-slate-400" />
            Print Receipt
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export function TransactionsPage({ isDarkMode, onBack, onOpenTransactionDetail, initialTab = 'all' }: TransactionsPageProps) {
  const [activeTab, setActiveTab] = useState<TransactionTab>(initialTab)
  const [transactionList, setTransactionList] = useState<TransactionRow[]>(transactions)
  const [showToast, setShowToast] = useState<string | null>(null)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const triggerToast = (msg: string) => {
    setShowToast(msg)
    const timer = setTimeout(() => setShowToast(null), 3000)
    return () => clearTimeout(timer)
  }

  // Action Handler Callback functions
  const handleMarkReturned = (id: string, bookTitle: string) => {
    setTransactionList(prev => prev.map(row => {
      if (row.id === id) {
        return {
          ...row,
          status: 'Returned',
          returnDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
      }
      return row
    }))
    triggerToast(`Successfully marked "${bookTitle}" as returned!`)
  }

  const handleSendReminder = (memberName: string) => {
    triggerToast(`Overdue reminder successfully sent to ${memberName}!`)
  }

  const handleSettleFine = (id: string, fineAmount: string) => {
    setTransactionList(prev => prev.map(row => {
      if (row.id === id) {
        return {
          ...row,
          fine: 'PHP 0.00'
        }
      }
      return row
    }))
    triggerToast(`Outstanding fine of ${fineAmount} settled successfully!`)
  }

  const handlePrintReceipt = (id: string) => {
    triggerToast(`Receipt PDF for transaction ${id} printed successfully!`)
  }

  const counts = useMemo(() => {
    const borrowed = transactionList.filter((row) => row.type === 'Borrow').length
    const returned = transactionList.filter((row) => row.status === 'Returned').length
    const overdue = transactionList.filter((row) => row.status === 'Overdue').length

    return {
      all: transactionList.length,
      borrowed,
      returned,
      overdue,
    }
  }, [transactionList])

  const filteredTransactions = useMemo(() => {
    if (activeTab === 'borrowed') return transactionList.filter((row) => row.type === 'Borrow')
    if (activeTab === 'returned') return transactionList.filter((row) => row.status === 'Returned')
    if (activeTab === 'overdue') return transactionList.filter((row) => row.status === 'Overdue')
    return transactionList
  }, [activeTab, transactionList])

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onBack} className={`grid h-8 w-8 place-items-center rounded-md ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
              <ArrowLeft size={16} />
            </button>
            <nav aria-label="Breadcrumb" className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <button
                type="button"
                onClick={onBack}
                className={`transition-colors hover:underline ${isDarkMode ? 'hover:text-slate-200' : 'hover:text-slate-700'}`}
              >
                Borrow / Return
              </button>
              <span className="mx-1">/</span>
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>All Transactions</span>
            </nav>
          </div>
          <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
            <Download size={15} />
            Export
          </button>
        </div>

        <div className={`mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4`}>
          <article className={`rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode ? 'border-slate-700 bg-[#0b1738] hover:border-emerald-500/60 hover:shadow-[0_12px_24px_-16px_rgba(16,185,129,0.45)]' : 'border-slate-200 bg-white hover:border-emerald-200 hover:shadow-[0_12px_24px_-16px_rgba(15,23,42,0.35)]'}`}>
            <div className="flex items-center gap-4">
              <span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-600'}`}><ClipboardList size={18} /></span>
              <div>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Total Transactions</p>
                <p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{counts.all}</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Apr 6 - May 6, 2026</p>
              </div>
            </div>
          </article>
          <article className={`rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode ? 'border-slate-700 bg-[#0b1738] hover:border-emerald-500/60 hover:shadow-[0_12px_24px_-16px_rgba(16,185,129,0.45)]' : 'border-slate-200 bg-white hover:border-emerald-200 hover:shadow-[0_12px_24px_-16px_rgba(15,23,42,0.35)]'}`}>
            <div className="flex items-center gap-4">
              <span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-600'}`}><ArrowDownToLine size={18} /></span>
              <div>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Borrowed</p>
                <p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{counts.borrowed}</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{counts.all ? ((counts.borrowed / counts.all) * 100).toFixed(2) : '0.00'}%</p>
              </div>
            </div>
          </article>
          <article className={`rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode ? 'border-slate-700 bg-[#0b1738] hover:border-emerald-500/60 hover:shadow-[0_12px_24px_-16px_rgba(16,185,129,0.45)]' : 'border-slate-200 bg-white hover:border-emerald-200 hover:shadow-[0_12px_24px_-16px_rgba(15,23,42,0.35)]'}`}>
            <div className="flex items-center gap-4">
              <span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-600'}`}><ArrowUpFromLine size={18} /></span>
              <div>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Returned</p>
                <p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{counts.returned}</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{counts.all ? ((counts.returned / counts.all) * 100).toFixed(2) : '0.00'}%</p>
              </div>
            </div>
          </article>
          <article className={`rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode ? 'border-slate-700 bg-[#0b1738] hover:border-rose-500/60 hover:shadow-[0_12px_24px_-16px_rgba(244,63,94,0.45)]' : 'border-slate-200 bg-white hover:border-rose-200 hover:shadow-[0_12px_24px_-16px_rgba(15,23,42,0.35)]'}`}>
            <div className="flex items-center gap-4">
              <span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-rose-500/15 text-rose-300' : 'bg-rose-50 text-rose-600'}`}><AlertTriangle size={18} /></span>
              <div>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Overdue</p>
                <p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{counts.overdue}</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{counts.all ? ((counts.overdue / counts.all) * 100).toFixed(2) : '0.00'}%</p>
              </div>
            </div>
          </article>
        </div>

        <div className={`mt-4 overflow-x-auto rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
          <div className={`flex min-w-[760px] items-center gap-2 px-3 py-3 ${isDarkMode ? 'bg-[#0b1738]' : 'bg-white'}`}>
            {[
              { key: 'all', label: 'All Transactions', value: counts.all },
              { key: 'borrowed', label: 'Borrowed', value: counts.borrowed },
              { key: 'returned', label: 'Returned', value: counts.returned },
              { key: 'overdue', label: 'Overdue', value: counts.overdue },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setActiveTab(chip.key as TransactionTab)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                  activeTab === chip.key
                    ? 'border border-emerald-600 bg-emerald-600 text-white'
                    : isDarkMode
                      ? 'border border-slate-700 bg-[#0f1f49] text-slate-300 hover:bg-slate-800'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {chip.label}
                <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === chip.key ? 'bg-emerald-500 text-white' : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {chip.value}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-4 overflow-hidden lg:overflow-visible rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
          <div className={`flex flex-wrap items-center gap-3 border-b p-3 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <label className={`group flex h-11 min-w-[280px] flex-1 items-center rounded-xl border px-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <Search size={16} className={`mr-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input placeholder="Search by member name, book title or copy ID..." className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} />
            </label>
            {['Type: All', 'Status: All'].map((item) => (
              <div key={item} className="relative">
                <select className={`h-11 min-w-[145px] appearance-none rounded-xl border pl-3 pr-10 text-sm outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100' : 'border-slate-200 bg-white text-slate-700'}`}>
                  <option>{item}</option>
                </select>
                <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              </div>
            ))}
            <div className={`flex h-11 min-w-[250px] items-center gap-2 rounded-xl border px-3 text-sm ${isDarkMode ? 'border-slate-700 text-slate-200' : 'border-slate-200 text-slate-700'}`}>
              <CalendarDays size={15} />
              Apr 6, 2026 - May 6, 2026
            </div>
            <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          <div className="overflow-x-auto lg:overflow-visible min-h-[340px] relative z-10">
            <table className="min-w-[1250px] w-full text-left text-sm">
              <thead className={isDarkMode ? 'bg-[#0f1f49] text-slate-300' : 'bg-slate-50 text-slate-600'}>
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-3 py-3 font-semibold">Type</th>
                  <th className="px-3 py-3 font-semibold">Member</th>
                  <th className="px-3 py-3 font-semibold">Book</th>
                  <th className="px-3 py-3 font-semibold">Copy ID</th>
                  <th className="px-3 py-3 font-semibold">Borrow Date</th>
                  <th className="px-3 py-3 font-semibold">Due Date</th>
                  <th className="px-3 py-3 font-semibold">Return Date</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Fine</th>
                  <th className="px-3 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onOpenTransactionDetail(row.id)}
                    className={`border-t cursor-pointer transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}
                  >
                    <td className={`px-4 py-3 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.id}</td>
                    <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${getTypeClass(row.type)}`}>{row.type}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`grid h-9 w-9 place-items-center rounded-full text-base ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{row.memberAvatar}</span>
                        <div><p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.member}</p><p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{row.memberId}</p></div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.book}</p><p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{row.author}</p></td>
                    <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.copyId}</td>
                    <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.borrowDate}</td>
                    <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.dueDate}</td>
                    <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.returnDate}</td>
                    <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(row.status)}`}>{row.status}</span></td>
                    <td className={`px-3 py-3 font-semibold ${row.fine !== 'PHP 0.00' ? 'text-rose-600' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.fine}</td>
                    <td className="px-3 py-3 text-right">
                      <TransactionActionsMenu
                        isDarkMode={isDarkMode}
                        status={row.status}
                        hasFine={row.fine !== 'PHP 0.00'}
                        onViewDetails={() => onOpenTransactionDetail(row.id)}
                        onMarkReturned={() => handleMarkReturned(row.id, row.book)}
                        onSendReminder={() => handleSendReminder(row.member)}
                        onRecordPayment={() => handleSettleFine(row.id, row.fine)}
                        onPrintReceipt={() => handlePrintReceipt(row.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm ${isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
            <p>Showing 1 to {filteredTransactions.length} of {filteredTransactions.length} transactions</p>
            <div className="flex items-center gap-2">
              <select className={`h-9 rounded-lg border px-3 text-sm ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                <option>10 per page</option>
              </select>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>{'<'}</button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">1</button>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>2</button>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>3</button>
              <button type="button" className={`grid h-9 w-9 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>Next</button>
            </div>
          </div>
        </div>
      </section>

      {showToast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-xl transition-all duration-300 animate-[fadeIn_0.2s_ease-out] ${
          isDarkMode 
            ? 'border-slate-700 bg-slate-900 text-slate-100' 
            : 'border-slate-200 bg-white text-slate-800'
        }`}>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <span className="text-sm font-bold">✓</span>
          </div>
          <p className="text-sm font-semibold">{showToast}</p>
        </div>
      )}
    </div>
  )
}
