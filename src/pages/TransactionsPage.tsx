import { Toast } from '../components/ui/Toast'
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
  MessageSquare,
  MoreHorizontal,
  Printer,
  Receipt,
  RotateCcw,
  Search,
  Send,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getSetting, listBorrowTransactions, listMembers, renewBorrowTransaction, returnBorrowTransaction, type BorrowTransaction, type Member } from '../lib/tauriApi'
import { SendEmailModal } from '../components/modals/SendEmailModal'
import { SendSmsModal } from '../components/modals/SendSmsModal'

type TransactionType = 'Borrow' | 'Return'
type TransactionStatus = 'Borrowed' | 'Renewed' | 'Returned' | 'Overdue'
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
  renewalCount: number
  memberEmail: string | null
  memberPhone: string | null
}

function getTypeClass(type: TransactionType) {
  return type === 'Borrow'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
    : 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
}

function getStatusClass(status: TransactionStatus) {
  if (status === 'Borrowed') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  if (status === 'Renewed') return 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
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
  if (tx.renewalCount > 0) return 'Renewed'
  return 'Borrowed'
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
    renewalCount: tx.renewalCount,
    memberEmail: memberRecord?.email || null,
    memberPhone: memberRecord?.contactNumber || null,
  }
}

type TransactionActionsMenuProps = {
  isDarkMode: boolean
  status: TransactionStatus
  hasFine: boolean
  renewalCount: number
  maximumRenewals: number
  onViewDetails: () => void
  onMarkReturned: () => void
  onRenew: () => void
  onSendReminder: () => void
  onSendSmsReminder: () => void
  onRecordPayment: () => void
  onPrintReceipt: () => void
}

function TransactionActionsMenu({
  isDarkMode,
  status,
  hasFine,
  renewalCount,
  maximumRenewals,
  onViewDetails,
  onMarkReturned,
  onRenew,
  onSendReminder,
  onSendSmsReminder,
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
    ? 'bg-[#18181B] border-zinc-700 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-zinc-200'
    : 'bg-white border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-zinc-700'

  const itemBase =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-100 text-left'
  const itemNormal = isDarkMode ? 'text-zinc-200 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-50'
  const divider = isDarkMode ? 'border-zinc-700/60' : 'border-zinc-100'
  const renewalLimitReached = renewalCount >= maximumRenewals

  return (
    <div ref={ref} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-150 ${
          open
            ? isDarkMode
              ? 'border-zinc-500 bg-zinc-700 text-zinc-100'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/5'
            : isDarkMode
              ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
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

          {status !== 'Returned' && (
            <button
              type="button"
              disabled={renewalLimitReached}
              className={`${itemBase} ${renewalLimitReached ? 'cursor-not-allowed opacity-50' : itemNormal}`}
              onClick={() => {
                setOpen(false)
                onRenew()
              }}
            >
              <RotateCcw size={15} className="shrink-0 text-blue-500" />
              {renewalLimitReached ? 'Renewal Limit Reached' : `Renew Book (${renewalCount}/${maximumRenewals})`}
            </button>
          )}

          {status !== 'Returned' && (
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

          {status !== 'Returned' && (
            <button
              type="button"
              className={`${itemBase} ${itemNormal}`}
              onClick={() => {
                setOpen(false)
                onSendReminder()
              }}
            >
              <Send size={15} className="shrink-0 text-amber-500" />
              Send Email Reminder
            </button>
          )}

          {status !== 'Returned' && (
            <button
              type="button"
              className={`${itemBase} ${itemNormal}`}
              onClick={() => {
                setOpen(false)
                onSendSmsReminder()
              }}
            >
              <MessageSquare size={15} className="shrink-0 text-sky-500" />
              Send SMS Reminder
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
            <Printer size={15} className="shrink-0 text-zinc-400" />
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
  const [maximumRenewals, setMaximumRenewals] = useState(2)
  const [emailModalData, setEmailModalData] = useState<{
    member: { id: number; fullName: string; email: string | null }
    initialSubject: string
    initialBody: string
  } | null>(null)
  const [smsModalData, setSmsModalData] = useState<{
    member: { id: number; fullName: string; phone: string | null }
    initialBody: string
  } | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, itemsPerPage])


  const memberMapRef = useRef<Map<string, Member>>(new Map())

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const [rows, members, maximumRenewalsSetting] = await Promise.all([
        listBorrowTransactions('All', 1000),
        listMembers(2000),
        getSetting('general.maximum_renewals'),
      ])
      const parsedMaximumRenewals = Number.parseInt(maximumRenewalsSetting || '2', 10)
      setMaximumRenewals(Number.isNaN(parsedMaximumRenewals) ? 2 : Math.max(0, parsedMaximumRenewals))
      const memberMap = new Map<string, Member>(members.map((m) => [m.memberId, m]))
      memberMapRef.current = memberMap
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

  const handleRenew = async (row: TransactionRow) => {
    try {
      const result = await renewBorrowTransaction(row.transactionId)
      await loadTransactions()
      triggerToast(
        `Renewed "${row.book}" (${result.renewalCount}/${result.maximumRenewals}). New due date: ${formatDateOnly(result.newDueDate)}.`
      )
    } catch (error) {
      console.error(error)
      triggerToast(typeof error === 'string' ? error : 'Failed to renew this book.')
    }
  }

  const handleSendReminder = (row: TransactionRow) => {
    if (!row.memberEmail) {
      triggerToast('Cannot send email: This member does not have an email address on file.')
      return
    }
    const defaultSubject = `Library Reminder: ${row.book}`
    const defaultBody = `Hello ${row.member},\n\nThis is a friendly reminder regarding the book "${row.book}" you borrowed on ${row.borrowDate}. ${row.status === 'Overdue' ? 'This book is currently OVERDUE.' : `It is due on ${row.dueDate}.`}\n\nPlease ensure it is returned to the library promptly.\n\nThank you,\nLibrary Management System`

    setEmailModalData({
      member: { id: 0, fullName: row.member, email: row.memberEmail },
      initialSubject: defaultSubject,
      initialBody: defaultBody,
    })
  }

  const handleSendSmsReminder = (row: TransactionRow) => {
    if (!row.memberPhone) {
      triggerToast('Cannot send SMS: This member does not have a phone number on file.')
      return
    }
    const defaultBody = `Lib Msg: Hello ${row.member.split(' ')[0]}, ${row.book} is ${row.status === 'Overdue' ? 'OVERDUE' : `due on ${row.dueDate}`}. Please return it to avoid penalties.`

    setSmsModalData({
      member: { id: memberMapRef.current?.get(row.memberId)?.id || 0, fullName: row.member, phone: row.memberPhone },
      initialBody: defaultBody,
    })
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

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage))
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <section className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onBack} className={`grid h-8 w-8 place-items-center rounded-md ${isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-100'}`}>
              <ArrowLeft size={16} />
            </button>
            <nav aria-label="Breadcrumb" className={`text-sm font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              <button type="button" onClick={onBack} className={`transition-colors hover:underline ${isDarkMode ? 'hover:text-zinc-200' : 'hover:text-zinc-700'}`}>
                Borrow / Return
              </button>
              <span className="mx-1">/</span>
              <span className={isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}>All Transactions</span>
            </nav>
          </div>
          <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
            <Download size={15} />
            Export
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className={`rounded-xl border p-4 ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <div className="flex items-center gap-4">
              <span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-600'}`}><ClipboardList size={18} /></span>
              <div>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Total Transactions</p>
                <p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{counts.all}</p>
                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Live from database</p>
              </div>
            </div>
          </article>
          <article className={`rounded-xl border p-4 ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}><div className="flex items-center gap-4"><span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-600'}`}><ArrowDownToLine size={18} /></span><div><p className={`text-sm font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Borrowed</p><p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{counts.borrowed}</p><p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{counts.all ? ((counts.borrowed / counts.all) * 100).toFixed(2) : '0.00'}%</p></div></div></article>
          <article className={`rounded-xl border p-4 ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}><div className="flex items-center gap-4"><span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-600'}`}><ArrowUpFromLine size={18} /></span><div><p className={`text-sm font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Returned</p><p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{counts.returned}</p><p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{counts.all ? ((counts.returned / counts.all) * 100).toFixed(2) : '0.00'}%</p></div></div></article>
          <article className={`rounded-xl border p-4 ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}><div className="flex items-center gap-4"><span className={`grid h-11 w-11 place-items-center rounded-full ${isDarkMode ? 'bg-rose-500/15 text-rose-300' : 'bg-rose-50 text-rose-600'}`}><AlertTriangle size={18} /></span><div><p className={`text-sm font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Overdue</p><p className={`text-4xl font-black leading-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{counts.overdue}</p><p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{counts.all ? ((counts.overdue / counts.all) * 100).toFixed(2) : '0.00'}%</p></div></div></article>
        </div>

        <div className={`mt-4 overflow-x-auto rounded-xl border ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
          <div className={`flex min-w-[760px] items-center gap-2 px-3 py-3 ${isDarkMode ? 'bg-[#18181B]' : 'bg-white'}`}>
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
                      ? 'border border-zinc-700 bg-[#27272A] text-zinc-300 hover:bg-zinc-800'
                      : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {chip.label}
                <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === chip.key ? 'bg-emerald-500 text-white' : isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                  {chip.value}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-4 lg:overflow-visible overflow-hidden rounded-xl border ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
          <div className={`flex flex-wrap items-center gap-3 border-b p-3 rounded-t-xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
            <label className={`group flex h-11 min-w-[280px] flex-1 items-center rounded-xl border px-3 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
              <Search size={16} className={`mr-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
              <input placeholder="Search by member name, book title or copy ID..." className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-700 placeholder:text-zinc-400'}`} />
            </label>
            
            
            <button type="button" onClick={() => void loadTransactions()} className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          <div className={`relative z-10 ${isDarkMode ? 'overflow-x-auto lg:overflow-visible bg-[#18181B]' : 'overflow-x-auto lg:overflow-visible bg-white'}`}>
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className={isDarkMode ? 'bg-[#27272A] text-zinc-300' : 'bg-zinc-50 text-zinc-600'}>
                <tr>
                  <th className="px-3 py-3 font-semibold">Member</th>
                  <th className="px-3 py-3 font-semibold">Book</th>
                  <th className="px-3 py-3 font-semibold">Borrow Date</th>
                  <th className="px-3 py-3 font-semibold">Due Date</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((row) => (
                  <tr key={row.id} onClick={() => onOpenTransactionDetail(row.id)} className={`border-t cursor-pointer transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-[#3F3F46]' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`grid h-9 w-9 place-items-center overflow-hidden rounded-full text-base ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                          {row.memberPhotoData ? (
                            <img src={row.memberPhotoData} alt={`${row.member} avatar`} className="h-full w-full object-cover" />
                          ) : (
                            row.memberAvatar
                          )}
                        </span>
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{row.member}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{row.memberId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><p className={`font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{row.book}</p><p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{row.author}</p></td>
                    <td className={`px-3 py-3 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{row.borrowDate}</td>
                    <td className={`px-3 py-3 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{row.dueDate}</td>
                    <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(row.status)}`}>{row.status}</span></td>
                    <td className="px-3 py-3 text-right">
                      <TransactionActionsMenu
                        isDarkMode={isDarkMode}
                        status={row.status}
                        hasFine={row.fineValue > 0}
                        renewalCount={row.renewalCount}
                        maximumRenewals={maximumRenewals}
                        onViewDetails={() => onOpenTransactionDetail(row.id)}
                        onMarkReturned={() => void handleMarkReturned(row)}
                        onRenew={() => void handleRenew(row)}
                        onSendReminder={() => handleSendReminder(row)}
                        onSendSmsReminder={() => handleSendSmsReminder(row)}
                        onRecordPayment={() => handleSettleFine(row.id, row.fine)}
                        onPrintReceipt={() => handlePrintReceipt(row.id)}
                      />
                    </td>
                  </tr>
                ))}
                {!loading && filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className={`px-4 py-8 text-center text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm rounded-b-xl ${isDarkMode ? 'border-zinc-700 text-zinc-300' : 'border-zinc-200 text-zinc-600'}`}>
            <p>Showing {filteredTransactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions</p>
            <div className="flex items-center gap-2">
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className={`h-9 rounded-lg border px-3 text-sm outline-none ${isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200' : 'border-zinc-200 bg-white text-zinc-700'}`}>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <button type="button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={`grid h-9 w-9 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800 disabled:opacity-50' : 'border-zinc-200 hover:bg-zinc-50 disabled:opacity-50'}`}>{'<'}</button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} type="button" onClick={() => setCurrentPage(page)} className={page === currentPage ? "grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : `grid h-9 w-9 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                    {page}
                  </button>
                ))}
              </div>

              <button type="button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className={`grid h-9 w-9 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800 disabled:opacity-50' : 'border-zinc-200 hover:bg-zinc-50 disabled:opacity-50'}`}>{'>'}</button>
            </div>
          </div>
        </div>
      </section>

      <Toast message={showToast} onClose={() => setShowToast(null)} isDarkMode={isDarkMode} />
      
      {emailModalData && (
        <SendEmailModal
          isOpen={!!emailModalData}
          onClose={() => setEmailModalData(null)}
          member={emailModalData.member}
          isDarkMode={isDarkMode}
          onSuccess={() => triggerToast(`Successfully sent email to ${emailModalData.member.fullName}`)}
          initialSubject={emailModalData.initialSubject}
          initialBody={emailModalData.initialBody}
        />
      )}

      {smsModalData && (
        <SendSmsModal
          isOpen={!!smsModalData}
          onClose={() => setSmsModalData(null)}
          member={smsModalData.member}
          isDarkMode={isDarkMode}
          onSuccess={() => triggerToast(`Successfully sent SMS to ${smsModalData.member.fullName}`)}
          initialBody={smsModalData.initialBody}
        />
      )}
    </div>
  )
}
