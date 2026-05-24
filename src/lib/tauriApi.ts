import { invoke } from '@tauri-apps/api/core'

export type Book = {
  id: number
  title: string
  author: string
  category: string | null
  isbn: string | null
  coverData: string | null
  available: boolean
  createdAt: string
}

export type CreateBookPayload = {
  title: string
  author: string
  category?: string | null
  isbn?: string | null
  coverData?: string | null
}

export type UpdateBookPayload = {
  id: number
  title: string
  author: string
  category?: string | null
  isbn?: string | null
  coverData?: string | null
  available: boolean
}

export type LoginPayload = {
  username: string
  password: string
}

export type SessionUser = {
  username: string
  role: string
  loginAt: string
}

export type NotificationItem = {
  id: number
  notificationType: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export type Member = {
  id: number
  fullName: string
  memberType: string
  memberId: string
  department: string | null
  contactNumber: string | null
  email: string | null
  address: string | null
  profilePhotoData: string | null
  status: string
  borrowed: number
  createdAt: string
}

export type CreateMemberPayload = {
  fullName: string
  memberType: string
  memberId: string
  department?: string | null
  contactNumber?: string | null
  email?: string | null
  address?: string | null
  profilePhotoData?: string | null
  status?: string | null
}

export type UpdateMemberPayload = {
  id: number
  fullName: string
  memberType: string
  department?: string | null
  contactNumber?: string | null
  email?: string | null
  address?: string | null
  profilePhotoData?: string | null
  status: string
}

export type Author = {
  id: number
  name: string
  email: string | null
  nationality: string | null
  dob: string | null
  profilePhotoData: string | null
  status: string
  biography: string | null
  createdAt: string
}

export type CreateAuthorPayload = {
  name: string
  email?: string | null
  nationality?: string | null
  dob?: string | null
  profilePhotoData?: string | null
  status?: string | null
  biography?: string | null
}

export type Category = {
  id: number
  name: string
  description: string | null
  status: string
  createdAt: string
}

export type CreateCategoryPayload = {
  name: string
  description?: string | null
  status?: string | null
}

export type UpdateCategoryPayload = {
  id: number
  name: string
  description?: string | null
  status: string
}

export type BorrowTransaction = {
  id: number
  memberId: number
  memberName: string
  memberCode: string
  bookId: number
  bookTitle: string
  borrowDate: string
  dueDate: string
  returnDate: string | null
  notes: string | null
  status: string
  fine: number
  createdAt: string
}

export type CreateBorrowPayload = {
  memberId: number
  bookId: number
  borrowDate: string
  dueDate: string
  notes?: string | null
}

export type ReturnBorrowPayload = {
  transactionId: number
  returnDate: string
  fine?: number | null
}

export type Reservation = {
  id: number
  memberId: number
  memberName: string
  memberCode: string
  bookId: number
  bookTitle: string
  bookAuthor: string
  reservationDate: string
  expiresOn: string
  status: string
  branch: string
  priority: string
  notes: string | null
  notifyEmail: boolean
  notifySms: boolean
  createdAt: string
}

export type CreateReservationPayload = {
  memberId: number
  bookId: number
  reservationDate: string
  expiresOn: string
  branch?: string | null
  priority?: string | null
  notes?: string | null
  notifyEmail?: boolean
  notifySms?: boolean
}

export type UpdateReservationStatusPayload = {
  id: number
  status: string
}

export type UpdateReservationPayload = {
  id: number
  memberId: number
  bookId: number
  reservationDate: string
  expiresOn: string
  status: string
  branch: string
  priority: string
  notes?: string | null
  notifyEmail: boolean
  notifySms: boolean
}

export type Staff = {
  id: number
  staffCode: string
  fullName: string
  email: string
  role: string
  branch: string
  status: string
  phone: string | null
  emergencyContact: string | null
  employeeType: string | null
  startDate: string | null
  username: string | null
  tempPassword: string | null
  requirePasswordReset: boolean
  profilePhotoData: string | null
  createdAt: string
}

export type CreateStaffPayload = {
  staffCode?: string | null
  fullName: string
  email: string
  role: string
  branch: string
  status: string
  phone?: string | null
  emergencyContact?: string | null
  employeeType?: string | null
  startDate?: string | null
  username?: string | null
  tempPassword?: string | null
  requirePasswordReset?: boolean
  profilePhotoData?: string | null
}

export type UpdateStaffPayload = {
  id: number
  staffCode?: string | null
  fullName: string
  email: string
  role: string
  branch: string
  status: string
  phone?: string | null
  emergencyContact?: string | null
  employeeType?: string | null
  startDate?: string | null
  username?: string | null
  tempPassword?: string | null
  requirePasswordReset: boolean
  profilePhotoData?: string | null
}

export async function initDb(): Promise<string> {
  return invoke<string>('init_db')
}

export async function setSetting(key: string, value: string): Promise<void> {
  return invoke<void>('set_setting', { key, value })
}

export async function getSetting(key: string): Promise<string | null> {
  return invoke<string | null>('get_setting', { key })
}

export async function createBook(payload: CreateBookPayload): Promise<number> {
  return invoke<number>('create_book', { payload })
}

export async function listBooks(limit?: number): Promise<Book[]> {
  return invoke<Book[]>('list_books', { limit })
}

export async function updateBook(payload: UpdateBookPayload): Promise<void> {
  return invoke<void>('update_book', { payload })
}

export async function deleteBook(id: number): Promise<void> {
  return invoke<void>('delete_book', { id })
}

export async function createMember(payload: CreateMemberPayload): Promise<number> {
  return invoke<number>('create_member', { payload })
}

export async function listMembers(limit?: number): Promise<Member[]> {
  return invoke<Member[]>('list_members', { limit })
}

export async function updateMember(payload: UpdateMemberPayload): Promise<void> {
  return invoke<void>('update_member', { payload })
}

export async function createAuthor(payload: CreateAuthorPayload): Promise<number> {
  return invoke<number>('create_author', { payload })
}

export async function listAuthors(limit?: number): Promise<Author[]> {
  return invoke<Author[]>('list_authors', { limit })
}

export async function deleteAuthor(id: number): Promise<void> {
  return invoke<void>('delete_author', { id })
}

export async function createCategory(payload: CreateCategoryPayload): Promise<number> {
  return invoke<number>('create_category', { payload })
}

export async function listCategories(limit?: number): Promise<Category[]> {
  return invoke<Category[]>('list_categories', { limit })
}

export async function updateCategory(payload: UpdateCategoryPayload): Promise<void> {
  return invoke<void>('update_category', { payload })
}

export async function deleteCategory(id: number): Promise<void> {
  return invoke<void>('delete_category', { id })
}

export async function createBorrowTransaction(payload: CreateBorrowPayload): Promise<number> {
  return invoke<number>('create_borrow_transaction', { payload })
}

export async function returnBorrowTransaction(payload: ReturnBorrowPayload): Promise<void> {
  return invoke<void>('return_borrow_transaction', { payload })
}

export async function listBorrowTransactions(status?: string, limit?: number): Promise<BorrowTransaction[]> {
  return invoke<BorrowTransaction[]>('list_borrow_transactions', { status, limit })
}

export async function createReservation(payload: CreateReservationPayload): Promise<number> {
  return invoke<number>('create_reservation', { payload })
}

export async function listReservations(status?: string, limit?: number): Promise<Reservation[]> {
  return invoke<Reservation[]>('list_reservations', { status, limit })
}

export async function updateReservationStatus(payload: UpdateReservationStatusPayload): Promise<void> {
  return invoke<void>('update_reservation_status', { payload })
}

export async function updateReservation(payload: UpdateReservationPayload): Promise<void> {
  return invoke<void>('update_reservation', { payload })
}

export async function deleteReservation(id: number): Promise<void> {
  return invoke<void>('delete_reservation', { id })
}

export async function createStaff(payload: CreateStaffPayload): Promise<number> {
  return invoke<number>('create_staff', { payload })
}

export async function listStaff(limit?: number): Promise<Staff[]> {
  return invoke<Staff[]>('list_staff', { limit })
}

export async function updateStaff(payload: UpdateStaffPayload): Promise<void> {
  return invoke<void>('update_staff', { payload })
}

export async function deleteStaff(id: number): Promise<void> {
  return invoke<void>('delete_staff', { id })
}

export async function sendEmailSmtp(to: string, subject: string, body: string): Promise<string> {
  return invoke<string>('send_email_smtp', { to, subject, body })
}

export async function sendSmsGateway(phone: string, message: string): Promise<string> {
  return invoke<string>('send_sms_gateway', { phone, message })
}

export async function exportReport(format: 'pdf' | 'excel', name: string): Promise<string> {
  return invoke<string>('export_report', { format, name })
}

export async function login(payload: LoginPayload): Promise<boolean> {
  return invoke<boolean>('login', { payload })
}

export async function logout(): Promise<void> {
  return invoke<void>('logout')
}

export async function getActiveSession(): Promise<SessionUser | null> {
  return invoke<SessionUser | null>('get_active_session')
}

export async function expandMainWindow(): Promise<void> {
  return invoke<void>('expand_main_window')
}

export async function restoreLoginWindow(): Promise<void> {
  return invoke<void>('restore_login_window')
}

export async function syncNotifications(): Promise<void> {
  return invoke<void>('sync_notifications')
}

export async function listNotifications(limit?: number): Promise<NotificationItem[]> {
  return invoke<NotificationItem[]>('list_notifications', { limit })
}

export async function markNotificationAsRead(id: number): Promise<void> {
  return invoke<void>('mark_notification_as_read', { id })
}

export async function markAllNotificationsRead(): Promise<void> {
  return invoke<void>('mark_all_notifications_read')
}
