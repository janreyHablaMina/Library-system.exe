import { useEffect, useState } from 'react'
import {
 ArrowLeft,
 Calendar,
 CheckCircle2,
 CalendarClock,
 UserCheck,
 MapPin,
 Mail,
 Phone,
 User,
 Info,
 CreditCard,
 RotateCcw,
 MessageSquare
} from 'lucide-react'
import { SendEmailModal } from '../components/modals/SendEmailModal'
import { SendSmsModal } from '../components/modals/SendSmsModal'
import type { BorrowTransaction, Book, Member } from '../lib/tauriApi'
import {
 listBorrowTransactions,
 listBooks,
 listMembers,
 returnBorrowTransaction,
 renewBorrowTransaction,
 getSetting
} from '../lib/tauriApi'

type TransactionDetailPageProps = {
 isDarkMode: boolean
 onBack: () => void
 transactionId?: string
}

export function TransactionDetailPage({ isDarkMode, onBack, transactionId }: TransactionDetailPageProps) {
 const [transaction, setTransaction] = useState<BorrowTransaction | null>(null)
 const [book, setBook] = useState<Book | null>(null)
 const [member, setMember] = useState<Member | null>(null)
 const [loading, setLoading] = useState(true)
 const [maximumRenewals, setMaximumRenewals] = useState(2)
 const [finePerDay, setFinePerDay] = useState(5)
 const [gracePeriod, setGracePeriod] = useState(0)
 const [showEmailModal, setShowEmailModal] = useState(false)
 const [showSmsModal, setShowSmsModal] = useState(false)

 useEffect(() => {
 async function loadData() {
 if (!transactionId) return
 setLoading(true)
 try {
 const [txs, books, members, maximumRenewalsSetting, finePerDaySetting, gracePeriodSetting] = await Promise.all([
 listBorrowTransactions(undefined, 1000),
 listBooks(1000),
 listMembers(1000),
 getSetting('general.maximum_renewals'),
 getSetting('general.fine_per_day'),
 getSetting('general.grace_period')
 ])
 const parsedMaximumRenewals = Number.parseInt(maximumRenewalsSetting || '2', 10)
 setMaximumRenewals(Number.isNaN(parsedMaximumRenewals) ? 2 : Math.max(0, parsedMaximumRenewals))
 const parsedFinePerDay = Number.parseFloat(finePerDaySetting || '5')
 setFinePerDay(Number.isNaN(parsedFinePerDay) ? 5 : Math.max(0, parsedFinePerDay))
 const parsedGracePeriod = Number.parseInt(gracePeriodSetting || '0', 10)
 setGracePeriod(Number.isNaN(parsedGracePeriod) ? 0 : Math.max(0, parsedGracePeriod))
 
 const parsedId = Number(transactionId.split('-').pop())
 const foundTx = txs.find(t => t.id === parsedId)
 if (foundTx) {
 setTransaction(foundTx)
 setBook(books.find(b => b.id === foundTx.bookId) || null)
 setMember(members.find(m => m.id === foundTx.memberId) || null)
 }
 } catch (error) {
 console.error('Failed to load transaction details:', error)
 } finally {
 setLoading(false)
 }
 }
 loadData()
 }, [transactionId])

 const handleReturn = async () => {
 if (!transaction || transaction.status === 'Returned') return
 try {
 await returnBorrowTransaction({
 transactionId: transaction.id,
 returnDate: new Date().toISOString()
 })
 // Reload page to reflect changes
 setLoading(true)
 const txs = await listBorrowTransactions(undefined, 1000)
 const updatedTx = txs.find(t => t.id === transaction.id)
 if (updatedTx) setTransaction(updatedTx)
 setLoading(false)
 } catch (e) {
 console.error(e)
 }
 }

 const handleRenew = async () => {
 if (!transaction || transaction.status === 'Returned') return
 try {
 await renewBorrowTransaction(transaction.id)
 // Reload to reflect changes
 setLoading(true)
 const txs = await listBorrowTransactions(undefined, 1000)
 const updatedTx = txs.find(t => t.id === transaction.id)
 if (updatedTx) setTransaction(updatedTx)
 setLoading(false)
 } catch (e) {
 console.error(e)
 alert(typeof e === 'string' ? e : 'Failed to renew this book.')
 }
 }

 const formatDate = (val: string) => {
 if (!val) return '-'
 const d = new Date(val)
 if (isNaN(d.getTime())) return '-'
 return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
 }
 
 const formatDateOnly = (val: string) => {
 if (!val) return '-'
 const d = new Date(val)
 if (isNaN(d.getTime())) return '-'
 return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
 }

 if (loading) {
 return (
 <div className={`flex flex-1 items-center justify-center ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
 <p className="animate-pulse font-semibold">Loading transaction details...</p>
 </div>
 )
 }

 if (!transaction) {
 return (
 <div className={`flex flex-1 flex-col items-center justify-center ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
 <p className="font-semibold text-rose-500 mb-4">Transaction not found.</p>
 <button onClick={onBack} className={`rounded-lg border px-4 py-2 font-semibold ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>
 Go Back
 </button>
 </div>
 )
 }

 const due = new Date(transaction.dueDate)
 const today = new Date()
 const dueDateParts = transaction.dueDate.slice(0, 10).split('-').map(Number)
 const dueDateLocal = dueDateParts.length === 3
 ? new Date(dueDateParts[0], dueDateParts[1] - 1, dueDateParts[2])
 : due
 const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate())
 const daysLate = Math.max(0, Math.floor((todayLocal.getTime() - dueDateLocal.getTime()) / (1000 * 3600 * 24)))
 const fineStartDate = new Date(dueDateLocal)
 fineStartDate.setDate(fineStartDate.getDate() + gracePeriod + 1)
 const isReturned = transaction.status === 'Returned' || !!transaction.returnDate
 const isOverdue = !isReturned && !isNaN(due.getTime()) && due.getTime() < today.getTime()
 const status = isReturned
 ? 'Returned'
 : isOverdue
 ? 'Overdue'
 : transaction.renewalCount > 0
 ? 'Renewed'
 : 'Borrowed'
 const daysRemaining = Math.max(0, Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24)))
 const isInFineGracePeriod = isOverdue && finePerDay > 0 && daysLate <= gracePeriod && transaction.fine <= 0
 const reminderSubject = `Library Reminder: ${transaction.bookTitle}`
 const reminderBody = `Hello ${transaction.memberName},\n\nThis is a reminder about "${transaction.bookTitle}", currently due on ${formatDateOnly(transaction.dueDate)}.${isOverdue ? ' This book is overdue.' : ''}\n\nPlease contact the library if you need assistance.\n\nThank you,\nLibrary Management System`
 const smsBody = `Library reminder: "${transaction.bookTitle}" is ${isOverdue ? 'overdue' : `due on ${formatDateOnly(transaction.dueDate)}`}. Please contact the library if you need assistance.`

 const cardClass = isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
 const labelClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
 const valueClass = isDarkMode ? 'text-zinc-100' : 'text-zinc-800'

 return (
 <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
 <section className="p-5 space-y-6 max-w-7xl mx-auto">
 {/* Header Actions */}
 <div>
 <div className="space-y-1">
 <button
 onClick={onBack}
 className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800'}`}
 >
 <ArrowLeft size={16} />
 Back to Transactions
 </button>
 <div className="flex items-center gap-3">
 <h2 className="text-2xl font-bold tracking-tight">Borrow Transaction Details</h2>
 <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
 ID: {transactionId}
 </span>
 </div>
 </div>
 </div>

 {/* Top Row: 3 Cards */}
 <div className="grid gap-6 lg:grid-cols-3">
 
 {/* 1. Borrower Information */}
 <div className={`rounded-2xl border p-6 ${cardClass}`}>
 <h3 className="mb-6 text-sm font-bold uppercase tracking-wider opacity-70">Borrower Information</h3>
 <div className="flex items-center gap-6 mb-8">
 <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-white dark:border-zinc-800 shrink-0">
 {transaction.memberProfilePhotoData ? (
 <img src={transaction.memberProfilePhotoData} alt={transaction.memberName} className="h-full w-full object-cover" />
 ) : (
 <div className="grid h-full w-full place-items-center bg-indigo-500 text-2xl font-bold text-white">
 {transaction.memberName.charAt(0)}
 </div>
 )}
 </div>
 <div className="space-y-1.5">
 <p className="text-lg font-bold leading-tight">{transaction.memberName}</p>
 <div className="flex flex-col items-start gap-1">
 <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-[#e0e7ff] text-[#4338ca]'}`}>
 {transaction.memberCode || 'MEM-XXXXX'}
 </span>
 <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${member?.status === 'Inactive' ? 'bg-rose-500/20 text-rose-600' : isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#f0fdf4] text-[#166534]'}`}>
 {member?.status === 'Inactive' ? 'Inactive Member' : 'Active Member'}
 </span>
 </div>
 </div>
 </div>
 <div className="space-y-4">
 <div className="flex items-center text-sm">
 <span className={`flex items-center gap-3 w-32 font-medium ${labelClass}`}><User size={15} className="opacity-60" /> Member Type</span>
 <span className={`font-semibold truncate ${valueClass}`}>{member?.memberType || 'Regular'}</span>
 </div>
 <div className="flex items-center text-sm">
 <span className={`flex items-center gap-3 w-32 font-medium ${labelClass}`}><Calendar size={15} className="opacity-60" /> Member Since</span>
 <span className={`font-semibold truncate ${valueClass}`}>{member?.createdAt ? formatDateOnly(member.createdAt) : '-'}</span>
 </div>
 <div className="flex items-center text-sm">
 <span className={`flex items-center gap-3 w-32 font-medium ${labelClass}`}><Mail size={15} className="opacity-60" /> Email</span>
 <span className={`font-semibold truncate ${valueClass}`}>{member?.email || '-'}</span>
 </div>
 <div className="flex items-center text-sm">
 <span className={`flex items-center gap-3 w-32 font-medium ${labelClass}`}><Phone size={15} className="opacity-60" /> Phone</span>
 <span className={`font-semibold truncate ${valueClass}`}>{member?.contactNumber || '-'}</span>
 </div>
 <div className="flex items-center text-sm">
 <span className={`flex items-center gap-3 w-32 font-medium ${labelClass}`}><MapPin size={15} className="opacity-60" /> Address</span>
 <span className={`font-semibold truncate ${valueClass}`} title={member?.address || '-'}>{member?.address || '-'}</span>
 </div>
 </div>
 </div>

 {/* 2. Book Information */}
 <div className={`rounded-2xl border p-6 ${cardClass}`}>
 <h3 className="mb-6 text-sm font-bold uppercase tracking-wider opacity-70">Book Information</h3>
 <div className="flex gap-6 mb-6">
 <div className="w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 aspect-[2/3]">
 {transaction.bookCoverData ? (
 <img src={transaction.bookCoverData} alt={transaction.bookTitle} className="h-full w-full object-cover" />
 ) : (
 <div className="grid h-full w-full place-items-center bg-zinc-200 dark:bg-zinc-800">
 <span className="text-xs font-bold text-zinc-400">NO COVER</span>
 </div>
 )}
 </div>
 <div className="flex-1 space-y-1.5 flex flex-col justify-center">
 <h4 className="text-lg font-bold leading-tight line-clamp-2">{transaction.bookTitle}</h4>
 <p className={`text-xs line-clamp-1 ${labelClass}`}>{book?.category || 'General'}</p>
 <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold w-fit ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-[#e0e7ff] text-[#4338ca]'}`}>
 BK-{String(transaction.bookId).padStart(6, '0')}
 </span>
 </div>
 </div>
 <div className="space-y-4">
 <div className="flex items-center text-sm">
 <span className={`flex items-center gap-3 w-32 font-medium ${labelClass}`}><UserCheck size={15} className="opacity-60" /> Author</span>
 <span className={`font-semibold truncate ${valueClass}`}>{book?.author || '-'}</span>
 </div>
 <div className="flex items-center text-sm">
 <span className={`flex items-center gap-3 w-32 font-medium ${labelClass}`}><Info size={15} className="opacity-60" /> ISBN</span>
 <span className={`font-semibold truncate ${valueClass}`}>{book?.isbn || '-'}</span>
 </div>

 </div>
 </div>

 {/* 3. Transaction Status */}
 <div className={`rounded-2xl border p-6 flex flex-col ${cardClass}`}>
 <div className="mb-8 flex items-center justify-between">
 <h3 className="text-sm font-bold uppercase tracking-wider opacity-70">Transaction Status</h3>
 <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
 isReturned ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
 isOverdue ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' :
 status === 'Renewed' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
 }`}>
 {status}
 </span>
 </div>
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3 text-sm">
 <CalendarClock size={16} className="opacity-40" />
 <span className={labelClass}>Borrow Date</span>
 </div>
 <p className={`text-sm font-semibold ${valueClass}`}>{formatDate(transaction.borrowDate)}</p>
 </div>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3 text-sm">
 <RotateCcw size={16} className="opacity-40" />
 <span className={labelClass}>Renewals Used</span>
 </div>
 <p className={`text-sm font-semibold ${valueClass}`}>{transaction.renewalCount} / {maximumRenewals}</p>
 </div>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3 text-sm">
 <Calendar size={16} className="opacity-40" />
 <span className={labelClass}>Due Date</span>
 </div>
 <div className="text-right flex flex-col items-end">
 <p className={`text-sm font-semibold ${valueClass}`}>{formatDateOnly(transaction.dueDate)}</p>
 {!isReturned && (
 <p className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${isOverdue ? 'bg-rose-500/20 text-rose-500' : isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
 {isOverdue ? 'Overdue!' : `${daysRemaining} days remaining`}
 </p>
 )}
 </div>
 </div>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3 text-sm">
 <RotateCcw size={16} className="opacity-40" />
 <span className={labelClass}>Return Date</span>
 </div>
 <p className={`text-sm font-semibold ${isReturned ? valueClass : isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
 {isReturned ? formatDate(transaction.returnDate!) : '-'}
 </p>
 </div>
 <div className="pt-2">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3 text-sm">
 <CreditCard size={16} className="opacity-40" />
 <span className={labelClass}>Fine / Penalty</span>
 </div>
 <p className={`text-base font-bold ${(transaction.fine || 0) > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
 ₱{(transaction.fine || 0).toFixed(2)}
 </p>
 </div>
 {isInFineGracePeriod && (
 <div className={`mt-3 rounded-xl border px-3 py-2.5 ${
 isDarkMode
 ? 'border-amber-500/20 bg-amber-500/10'
 : 'border-amber-200 bg-amber-50/80'
 }`}>
 <div className="flex items-start gap-2.5">
 <Info size={15} className={`mt-0.5 shrink-0 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
 <div>
 <p className={`text-xs font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
 Grace period active
 </p>
 <p className={`mt-0.5 text-[11px] leading-relaxed ${isDarkMode ? 'text-amber-400/80' : 'text-amber-700'}`}>
 No fine is due today. Charges begin on {formatDateOnly(fineStartDate.toISOString())} at ₱{finePerDay.toFixed(2)} per day.
 </p>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 
 <div className="mt-auto pt-8">
 <div className={`flex items-center justify-between rounded-xl border p-3 ${
 isReturned ? 'border-emerald-50 bg-emerald-50/30 dark:border-emerald-500/10 dark:bg-emerald-500/5' :
 'border-indigo-50 bg-indigo-50/30 dark:border-indigo-500/10 dark:bg-indigo-500/5'
 }`}>
 <div className="flex items-center gap-3 text-sm">
 <Info size={16} className={isReturned ? 'text-emerald-500' : 'text-indigo-500'} />
 <span className={`font-semibold ${
 isReturned ? (isDarkMode ? 'text-emerald-300' : 'text-emerald-700') : (isDarkMode ? 'text-indigo-300' : 'text-indigo-700')
 }`}>Status</span>
 </div>
 <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
 isReturned 
 ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white text-emerald-600')
 : (isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white text-indigo-600')
 }`}>
 {isReturned ? 'Returned' : 'Not Returned'}
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* Bottom Row: Quick Actions */}
 <div className={`rounded-2xl border p-6 ${cardClass}`}>
 <h3 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-70">Quick Actions</h3>
 <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

 <button
 type="button"
 onClick={() => {
 if (!member?.email) {
 alert('This member does not have an email address.')
 return
 }
 setShowEmailModal(true)
 }}
 className={`group flex h-full w-full flex-col items-start gap-2 rounded-xl p-5 transition-all ${
 isDarkMode ? 'bg-violet-500/10 hover:bg-violet-500/20' : 'bg-violet-50 hover:bg-violet-100'
 }`}
 >
 <div className={`grid h-10 w-10 place-items-center rounded-full ${isDarkMode ? 'bg-violet-500/30 text-violet-300' : 'bg-violet-100 text-violet-600'}`}>
 <Mail size={20} />
 </div>
 <div className="mt-1 text-left">
 <p className={`text-base font-bold ${isDarkMode ? 'text-violet-300' : 'text-violet-900'}`}>Send Email</p>
 <p className={`mt-1 text-xs ${isDarkMode ? 'text-violet-400/70' : 'text-violet-700/70'}`}>
 Send a reminder to the borrower's email.
 </p>
 </div>
 </button>

 <button
 type="button"
 onClick={() => {
 if (!member?.contactNumber) {
 alert('This member does not have a phone number.')
 return
 }
 setShowSmsModal(true)
 }}
 className={`group flex h-full w-full flex-col items-start gap-2 rounded-xl p-5 transition-all ${
 isDarkMode ? 'bg-sky-500/10 hover:bg-sky-500/20' : 'bg-sky-50 hover:bg-sky-100'
 }`}
 >
 <div className={`grid h-10 w-10 place-items-center rounded-full ${isDarkMode ? 'bg-sky-500/30 text-sky-300' : 'bg-sky-100 text-sky-600'}`}>
 <MessageSquare size={20} />
 </div>
 <div className="mt-1 text-left">
 <p className={`text-base font-bold ${isDarkMode ? 'text-sky-300' : 'text-sky-900'}`}>Send SMS</p>
 <p className={`mt-1 text-xs ${isDarkMode ? 'text-sky-400/70' : 'text-sky-700/70'}`}>
 Send a reminder to the borrower's phone.
 </p>
 </div>
 </button>
 
 <button 
 onClick={handleReturn}
 disabled={isReturned}
 className={`group flex flex-col items-start gap-2 rounded-xl p-5 transition-all ${
 isReturned
 ? (isDarkMode ? 'bg-emerald-500/5 opacity-50 cursor-not-allowed' : 'bg-[#f0fdf4]/50 opacity-50 cursor-not-allowed')
 : (isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20' : 'bg-[#f0fdf4] hover:bg-emerald-50')
 }`}
 >
 <div className={`grid h-10 w-10 place-items-center rounded-full ${isReturned ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-500' : 'bg-emerald-100 text-emerald-600') : (isDarkMode ? 'bg-emerald-500/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600')}`}>
 <CheckCircle2 size={20} />
 </div>
 <div className="text-left mt-1">
 <p className={`text-base font-bold ${isDarkMode ? 'text-emerald-300' : 'text-[#166534]'}`}>
 {isReturned ? 'Already Returned' : 'Mark as Returned'}
 </p>
 <p className={`text-xs mt-1 ${isDarkMode ? 'text-emerald-400/70' : 'text-emerald-700/70'}`}>
 {isReturned ? 'This transaction is closed.' : 'Mark this book as returned and close the transaction.'}
 </p>
 </div>
 </button>

 <button 
 onClick={handleRenew}
 disabled={isReturned || transaction.renewalCount >= maximumRenewals}
 className={`group flex flex-col items-start gap-2 rounded-xl p-5 transition-all ${
 isReturned || transaction.renewalCount >= maximumRenewals
 ? (isDarkMode ? 'bg-blue-500/5 opacity-50 cursor-not-allowed' : 'bg-[#eff6ff]/50 opacity-50 cursor-not-allowed')
 : (isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20' : 'bg-[#eff6ff] hover:bg-blue-50')
 }`}
 >
 <div className={`grid h-10 w-10 place-items-center rounded-full ${isReturned ? (isDarkMode ? 'bg-blue-500/20 text-blue-500' : 'bg-blue-100 text-blue-600') : (isDarkMode ? 'bg-blue-500/30 text-blue-400' : 'bg-blue-100 text-blue-600')}`}>
 <Calendar size={20} />
 </div>
 <div className="text-left mt-1">
 <p className={`text-base font-bold ${isDarkMode ? 'text-blue-300' : 'text-[#1e3a8a]'}`}>
 {transaction.renewalCount >= maximumRenewals ? 'Renewal Limit Reached' : 'Renew Book'}
 </p>
 <p className={`text-xs mt-1 ${isDarkMode ? 'text-blue-400/70' : 'text-blue-700/70'}`}>
 {transaction.renewalCount >= maximumRenewals
 ? `This book has already been renewed ${maximumRenewals} time(s).`
 : 'Extend the due date using the configured loan period.'}
 </p>
 </div>
 </button>

 </div>
 </div>

 </section>

 {member && (
 <SendEmailModal
 isOpen={showEmailModal}
 onClose={() => setShowEmailModal(false)}
 member={{ id: member.id, fullName: member.fullName, email: member.email }}
 isDarkMode={isDarkMode}
 initialSubject={reminderSubject}
 initialBody={reminderBody}
 onSuccess={() => alert(`Email sent to ${member.fullName}.`)}
 />
 )}

 {member && (
 <SendSmsModal
 isOpen={showSmsModal}
 onClose={() => setShowSmsModal(false)}
 member={{ id: member.id, fullName: member.fullName, phone: member.contactNumber }}
 isDarkMode={isDarkMode}
 initialBody={smsBody}
 onSuccess={() => alert(`SMS sent to ${member.fullName}.`)}
 />
 )}
 </div>
 )
}
