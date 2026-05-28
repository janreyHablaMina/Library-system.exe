import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpFromLine,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  Download,
  Eye,
  MoreHorizontal,
  Printer,
  Receipt,
  RotateCcw,
  Search,
  Send,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { listBorrowTransactions, listMembers, returnBorrowTransaction, type BorrowTransaction, type Member } from '../lib/tauriApi'

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
  transactionId: number
  type: TransactionType
  member: string
  memberId: string
  memberAvatar: string
  memberPhotoData: string | null
  book: string
  author: string
  copyId: string
  borrowDate: string
  dueDate: string
  returnDate: string
  status: TransactionStatus
  fine: string
  fineValue: number
}

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

function formatDate(value: string | null) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateOnly(value: string | null) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function inferStatus(tx: BorrowTransaction): TransactionStatus {
  if (tx.status.toLowerCase() === 'returned' || !!tx.returnDate) return 'Returned'
  const due = new Date(tx.dueDate)
  if (!Number.isNaN(due.getTime()) && due.getTime() < Date.now()) return 'Overdue'
  return 'Active'
}

function toTransactionRow(tx: BorrowTransaction, memberMap: Map<string, Member>): TransactionRow {
  const status = inferStatus(tx)
  const type: TransactionType = status === 'Returned' ? 'Return' : 'Borrow'
  const fineValue = Number(tx.fine || 0)
  const memberRecord = memberMap.get(tx.memberCode)

  return {
    id: `TRX-${String(new Date(tx.createdAt || Date.now()).getFullYear())}-${String(tx.id).padStart(4, '0')}`,
    transactionId: tx.id,
    type,
    member: tx.memberName,
    memberId: tx.memberCode,
    memberAvatar: tx.memberName?.trim()?.charAt(0)?.toUpperCase() || 'M',
    memberPhotoData: memberRecord?.profilePhotoData || null,
    book: tx.bookTitle,
    author: '-',
    copyId: `BK-${String(tx.bookId).padStart(6, '0')}`,
    borrowDate: formatDate(tx.borrowDate),
    dueDate: formatDateOnly(tx.dueDate),
    returnDate: tx.returnDate ? formatDate(tx.returnDate) : '-',
    status,
    fine: `PHP ${fineValue.toFixed(2)}`,
    fineValue,
  }
}

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
  onPrintReceipt,
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
    setOpen((v) => !v)
  }

  const surface = isDarkMode
    ? 'bg-[#0f172a] border-slate-700 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-slate-200'
    : 'bg-white border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-slate-700'

  const itemBase =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-100 text-left'
  const itemNormal = isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
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
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-56 rounded-xl border p-1.5 ${surface} ${
            openUpward ? 'bottom-full mb-1.5 origin-bottom-right' : 'top-full mt-1.5 origin-top-right'
          }`}
        >
          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            onClick={() => {
              setOpen(false)
              onViewDetails()
            }}
          >
            <Eye size={15} className="shrink-0 text-sky-500" />
            View Details
          </button>

          {(status === 'Active' || status === 'Overdue') && (
            <button
              type="button"
              className={`${itemBase} ${itemNormal}`}
              onClick={() => {
                setOpen(false)
                onMarkReturned()
              }}
            >
              <CheckCircle size={15} className="shrink-0 text-emerald-500" />
              Mark as Returned
            </button>
          )}

          {status === 'Overdue' && (
            <button
              type="button"
              className={`${itemBase} ${itemNormal}`}
              onClick={() => {
                setOpen(false)
                onSendReminder()
              }}
            >
              <Send size={15} className="shrink-0 text-amber-500" />
              Send Reminder
            </button>
          )}

          {hasFine && status !== 'Returned' && (
            <button
              type="button"
              className={`${itemBase} ${itemNormal}`}
              onClick={() => {
                setOpen(false)
                onRecordPayment()
              }}
            >
              <Receipt size={15} className="shrink-0 text-rose-500" />
              Settle Fine
            </button>
          )}

          <div className={`my-1 border-t ${divider}`} />

          <button
            type="button"
            className={`${itemBase} ${itemNormal}`}
            onClick={() => {
              setOpen(false)
              onPrintReceipt()
            }}
          >
            <Printer size={15} className="shrink-0 text-slate-400" />
            Print Receipt
          </button>
        </div>
      )}
    </div>
  )
}

export function TransactionsPage({ isDarkMode, onBack, onOpenTransactionDetail, initialTab = 'all' }: TransactionsPageProps) {
  const [activeTab, setActiveTab] = useState<TransactionTab>(initialTab)
  const [transactionList, setTransactionList] = useState<TransactionRow[]>([])
  const [showToast, setShowToast] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const [rows, members] = await Promise.all([
        listBorrowTransactions('All', 1000),
        listMembers(2000),
      ])
      const memberMap = new Map<string, Member>(members.map((m) => [m.memberId, m]))
      setTransactionList(rows.map((row) => toTransactionRow(row, memberMap)))
    } catch (error) {
      console.error(error)
      setShowToast('Failed to load transactions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    void loadTransactions()
  }, [])

  const triggerToast = (msg: string) => {
    setShowToast(msg)
    setTimeout(() => setShowToast(null), 3000)
  }

  const handleMarkReturned = async (row: TransactionRow) => {
    try {
      await returnBorrowTransaction({
        transactionId: row.transactionId,
        returnDate: new Date().toISOString(),
        fine: row.fineValue,
      })
      await loadTransactions()
      triggerToast(`Successfully marked "${row.book}" as returned!`)
    } catch (error) {
      console.error(error)
      triggerToast('Failed to mark transaction as returned.')
    }
  }

  const handleSendReminder = (memberName: string) => {
    triggerToast(`Overdue reminder successfully sent to ${memberName}!`)
  }

  const handleSettleFine = (id: string, fineAmount: string) => {
    triggerToast(`Outstanding fine of ${fineAmount} noted for ${id}.`)
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
              <button type="button" onClick={onBack} className={`transition-colors hover:underline ${isDarkMode ? 'hover:text-slate-200' : 'hover:text-slate-700'}`}>
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

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-center gap-4">
              <span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-600'}`}><ClipboardList size={18} /></span>
              <div>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Total Transactions</p>
                <p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{counts.all}</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Live from database</p>
              </div>
            </div>
          </article>
          <article className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}><div className="flex items-center gap-4"><span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-600'}`}><ArrowDownToLine size={18} /></span><div><p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Borrowed</p><p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{counts.borrowed}</p><p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{counts.all ? ((counts.borrowed / counts.all) * 100).toFixed(2) : '0.00'}%</p></div></div></article>
          <article className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}><div className="flex items-center gap-4"><span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-600'}`}><ArrowUpFromLine size={18} /></span><div><p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Returned</p><p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{counts.returned}</p><p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{counts.all ? ((counts.returned / counts.all) * 100).toFixed(2) : '0.00'}%</p></div></div></article>
          <article className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}><div className="flex items-center gap-4"><span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-rose-500/15 text-rose-300' : 'bg-rose-50 text-rose-600'}`}><AlertTriangle size={18} /></span><div><p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Overdue</p><p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{counts.overdue}</p><p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{counts.all ? ((counts.overdue / counts.all) * 100).toFixed(2) : '0.00'}%</p></div></div></article>
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

        <div className={`mt-4 overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
          <div className={`flex flex-wrap items-center gap-3 border-b p-3 rounded-t-xl ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
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
              Dynamic date range
            </div>
            <button type="button" onClick={() => void loadTransactions()} className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          <div className="overflow-x-auto relative z-10">
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
                  <tr key={row.id} onClick={() => onOpenTransactionDetail(row.id)} className={`border-t cursor-pointer transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-[#12244f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className={`px-4 py-3 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.id}</td>
                    <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${getTypeClass(row.type)}`}>{row.type}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`grid h-9 w-9 place-items-center overflow-hidden rounded-full text-base ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          {row.memberPhotoData ? (
                            <img src={row.memberPhotoData} alt={`${row.member} avatar`} className="h-full w-full object-cover" />
                          ) : (
                            row.memberAvatar
                          )}
                        </span>
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.member}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{row.memberId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row.book}</p><p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{row.author}</p></td>
                    <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.copyId}</td>
                    <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.borrowDate}</td>
                    <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.dueDate}</td>
                    <td className={`px-3 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.returnDate}</td>
                    <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(row.status)}`}>{row.status}</span></td>
                    <td className={`px-3 py-3 font-semibold ${row.fineValue > 0 ? 'text-rose-600' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.fine}</td>
                    <td className="px-3 py-3 text-right">
                      <TransactionActionsMenu
                        isDarkMode={isDarkMode}
                        status={row.status}
                        hasFine={row.fineValue > 0}
                        onViewDetails={() => onOpenTransactionDetail(row.id)}
                        onMarkReturned={() => void handleMarkReturned(row)}
                        onSendReminder={() => handleSendReminder(row.member)}
                        onRecordPayment={() => handleSettleFine(row.id, row.fine)}
                        onPrintReceipt={() => handlePrintReceipt(row.id)}
                      />
                    </td>
                  </tr>
                ))}
                {!loading && filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={11} className={`px-4 py-8 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
            <p>Showing 1 to {filteredTransactions.length} of {filteredTransactions.length} transactions</p>
            <div className="flex items-center gap-2"><select className={`h-9 rounded-lg border px-3 text-sm ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}><option>10 per page</option></select></div>
          </div>
        </div>
      </section>

      {showToast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-xl ${isDarkMode ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-800'}`}>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <span className="text-sm font-bold">OK</span>
          </div>
          <p className="text-sm font-semibold">{showToast}</p>
        </div>
      )}
    </div>
  )
}
