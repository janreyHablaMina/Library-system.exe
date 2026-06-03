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
 Printer,
 MoreVertical,
 RotateCcw
} from 'lucide-react'
import type { BorrowTransaction, Book, Member } from '../lib/tauriApi'
import {
 listBorrowTransactions,
 listBooks,
 listMembers,
 returnBorrowTransaction,
 extendBorrowDueDate
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

 useEffect(() => {
 async function loadData() {
 if (!transactionId) return
 setLoading(true)
 try {
 const [txs, books, members] = await Promise.all([
 listBorrowTransactions(undefined, 1000),
 listBooks(1000),
 listMembers(1000)
 ])
 
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
 returnDate: new Date().toISOString(),
 fine: transaction.fine || 0
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

 const handleExtendDueDate = async () => {
 if (!transaction || transaction.status === 'Returned') return
 try {
 // Extend due date by 7 days
 const currentDue = new Date(transaction.dueDate)
 currentDue.setDate(currentDue.getDate() + 7)
 
 await extendBorrowDueDate({
 transactionId: transaction.id,
 newDueDate: currentDue.toISOString()
 })
 // Reload to reflect changes
 setLoading(true)
 const txs = await listBorrowTransactions(undefined, 1000)
 const updatedTx = txs.find(t => t.id === transaction.id)
 if (updatedTx) setTransaction(updatedTx)
 setLoading(false)
 } catch (e) {
 console.error(e)
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

 const status = transaction.status === 'Active' ? 'Borrowed' : transaction.status
 const isReturned = status === 'Returned'
 const isOverdue = status === 'Overdue'

 const due = new Date(transaction.dueDate)
 const today = new Date()
 const daysRemaining = Math.max(0, Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24)))

 const cardClass = isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
 const labelClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
 const valueClass = isDarkMode ? 'text-zinc-100' : 'text-zinc-800'

 return (
 <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
 <section className="p-5 space-y-6 max-w-7xl mx-auto">
 {/* Header Actions */}
 <div className="flex flex-wrap items-center justify-between gap-4">
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
 <div className="flex items-center gap-2">
 <button className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${isDarkMode ? 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800' : 'border-zinc-200 bg-white hover:bg-zinc-50'}`}>
 <Printer size={16} />
 Print Receipt
 </button>
 <button className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${isDarkMode ? 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800' : 'border-zinc-200 bg-white hover:bg-zinc-50'}`}>
 <MoreVertical size={16} />
 More Actions
 </button>
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
 <div className="flex items-center justify-between pt-2">
 <div className="flex items-center gap-3 text-sm">
 <CreditCard size={16} className="opacity-40" />
 <span className={labelClass}>Fine / Penalty</span>
 </div>
 <p className={`text-sm font-bold ${(transaction.fine || 0) > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
 ₱{(transaction.fine || 0).toFixed(2)}
 </p>
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
 <div className="grid gap-4 md:grid-cols-2">
 
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
 onClick={handleExtendDueDate}
 disabled={isReturned}
 className={`group flex flex-col items-start gap-2 rounded-xl p-5 transition-all ${
 isReturned 
 ? (isDarkMode ? 'bg-blue-500/5 opacity-50 cursor-not-allowed' : 'bg-[#eff6ff]/50 opacity-50 cursor-not-allowed')
 : (isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20' : 'bg-[#eff6ff] hover:bg-blue-50')
 }`}
 >
 <div className={`grid h-10 w-10 place-items-center rounded-full ${isReturned ? (isDarkMode ? 'bg-blue-500/20 text-blue-500' : 'bg-blue-100 text-blue-600') : (isDarkMode ? 'bg-blue-500/30 text-blue-400' : 'bg-blue-100 text-blue-600')}`}>
 <Calendar size={20} />
 </div>
 <div className="text-left mt-1">
 <p className={`text-base font-bold ${isDarkMode ? 'text-blue-300' : 'text-[#1e3a8a]'}`}>
 Extend Due Date
 </p>
 <p className={`text-xs mt-1 ${isDarkMode ? 'text-blue-400/70' : 'text-blue-700/70'}`}>
 Extend the due date for this borrowed book by 7 days.
 </p>
 </div>
 </button>

 </div>
 </div>

 </section>
 </div>
 )
}
