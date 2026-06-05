import { invoke } from '@tauri-apps/api/core'

export type Book = {
  id: number
  title: string
  author: string
  category: string | null
  isbn: string | null
  coverData: string | null
  shelfLocation: string | null
  available: number
  totalCopies: number
  isArchived: boolean
  createdAt: string
}

export type CreateBookPayload = {
  title: string
  author: string
  category?: string | null
  isbn?: string | null
  coverData?: string | null
  shelfLocation?: string | null
  totalCopies?: number
}

export type UpdateBookPayload = {
  id: number
  title: string
  author: string
  category?: string | null
  isbn?: string | null
  coverData?: string | null
  shelfLocation?: string | null
  available: number
  totalCopies: number
  isArchived: boolean
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

export type LoginTrailRow = {
  username: string
  role: string
  loginAt: string
  logoutAt: string | null
  isActive: boolean
}

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
}

export type SystemUser = {
  id: number
  username: string
  fullName: string
  email: string
  profilePhotoData: string | null
  role: string
  isActive: boolean
  createdAt: string
  lastLoginAt: string | null
}

export type CreateSystemUserPayload = {
  username: string
  fullName: string
  email: string
  profilePhotoData?: string | null
  password: string
  role: string
  isActive: boolean
}

export type UpdateSystemUserPayload = {
  id: number
  fullName: string
  email: string
  profilePhotoData?: string | null
  role: string
  isActive: boolean
}

export type NotificationItem = {
  id: number
  notificationType: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export type EmailLog = {
  id: number
  borrowerName: string
  emailAddress: string
  bookTitle: string
  emailType: string
  status: string
  sentAt: string
  errorMessage: string | null
}

export type SmsLog = {
  id: number
  borrowerName: string
  phoneNumber: string
  bookTitle: string | null
  smsType: string
  status: string
  sentAt: string
  errorMessage: string | null
  messageBody: string | null
}

export type EmailLogStats = {
  sentToday: number
  failed: number
  pending: number
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
  memberProfilePhotoData: string | null
  bookId: number
  bookTitle: string
  bookCoverData: string | null
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


export type ExtendDueDatePayload = {
  transactionId: number
  newDueDate: string
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

export type SettingActivityRow = {
  key: string
  value: string
  updatedAt: string
}

export async function listSettingsActivity(limit?: number): Promise<SettingActivityRow[]> {
  return invoke<SettingActivityRow[]>('list_settings_activity', { limit })
}

export async function createBook(payload: CreateBookPayload): Promise<number> {
  return invoke<number>('create_book', { payload })
}

export async function listBooks(limit?: number): Promise<Book[]> {
  return invoke<Book[]>('list_books', { limit })
}

export async function searchBooks(query: string, limit?: number): Promise<Book[]> {
  return invoke<Book[]>('search_books', { query, limit })
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

export async function searchMembers(query: string, limit?: number): Promise<Member[]> {
  return invoke<Member[]>('search_members', { query, limit })
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

export async function searchAuthors(query: string, limit?: number): Promise<Author[]> {
  return invoke<Author[]>('search_authors', { query, limit })
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


export async function extendBorrowDueDate(payload: ExtendDueDatePayload): Promise<void> {
  return invoke<void>('extend_borrow_due_date', { payload })
}

export async function returnBorrowTransaction(payload: ReturnBorrowPayload): Promise<void> {
  return invoke<void>('return_borrow_transaction', { payload })
}

export async function listBorrowTransactions(status?: string, limit?: number): Promise<BorrowTransaction[]> {
  return invoke<BorrowTransaction[]>('list_borrow_transactions', { status, limit })
}

export async function listBookBorrowTransactions(bookId: number): Promise<BorrowTransaction[]> {
  return invoke<BorrowTransaction[]>('list_book_borrow_transactions', { bookId })
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

export async function sendManualEmailReminder(transactionId: number): Promise<string> {
  return invoke<string>('send_manual_email_reminder', { transactionId })
}

export async function runAutomaticEmailReminders(): Promise<number> {
  return invoke<number>('run_automatic_email_reminders')
}

export async function listEmailLogs(search?: string, status?: string, limit?: number): Promise<EmailLog[]> {
  return invoke<EmailLog[]>('list_email_logs', { search, status, limit })
}

export async function listSmsLogs(search?: string, status?: string, limit?: number): Promise<SmsLog[]> {
  return invoke<SmsLog[]>('list_sms_logs', { search, status, limit })
}

export async function getEmailLogStats(): Promise<EmailLogStats> {
  return invoke<EmailLogStats>('get_email_log_stats')
}

export async function testEmailConfiguration(to: string): Promise<string> {
  return invoke<string>('test_email_configuration', { to })
}

export async function sendSmsGateway(phone: string, message: string, borrowerName?: string | null, smsType?: string | null): Promise<string> {
  return invoke<string>('send_sms_gateway', { phone, message, borrowerName, smsType })
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

export async function listLoginTrail(limit?: number): Promise<LoginTrailRow[]> {
  return invoke<LoginTrailRow[]>('list_login_trail', { limit })
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  return invoke<void>('change_password', { payload })
}

export async function listSystemUsers(limit?: number): Promise<SystemUser[]> {
  return invoke<SystemUser[]>('list_system_users', { limit })
}

export async function createSystemUser(payload: CreateSystemUserPayload): Promise<number> {
  return invoke<number>('create_system_user', { payload })
}

export async function updateSystemUser(payload: UpdateSystemUserPayload): Promise<void> {
  return invoke<void>('update_system_user', { payload })
}

export async function deleteSystemUser(id: number): Promise<void> {
  return invoke<void>('delete_system_user', { id })
}

export async function resetSystemUserPassword(id: number, newPassword: string): Promise<void> {
  return invoke<void>('reset_system_user_password', { id, newPassword })
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


export async function verifyLicenseKey(key: string): Promise<boolean> {
  return invoke<boolean>('verify_license_key', { key })
}

export async function getLicenseStatus(): Promise<'checking' | 'active' | 'trial' | 'expired'> {
  return invoke<'checking' | 'active' | 'trial' | 'expired'>('get_license_status')
}

export async function getTrialDaysRemaining(): Promise<number> {
  return invoke<number>('get_trial_days_remaining')
}
