import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CircleAlert,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ClipboardCheck,
  EllipsisVertical,
  Eye,
  Globe,
  IdCard,
  KeyRound,
  Library,
  Mail,
  MessageCircle,
  PenLine,
  Monitor,
  Moon,
  Plus,
  Pencil,
  RotateCcw,
  Search,
  Send,
  Settings2,
  Shield,
  Sun,
  TriangleAlert,
  Trash2,
  Upload,
  User,
  UserRound,
  UserCog,
  UsersRound,
  View,
  Wrench,
  WalletCards,
} from 'lucide-react'

type SettingsPageProps = {
  isDarkMode: boolean
}

type ThemeMode = 'light' | 'dark' | 'system'

type GeneralSettings = {
  dateFormat: string
  language: string
  timeFormat: string
  theme: ThemeMode
  itemsPerPage: string
  currency: string
}

type SystemPreferences = {
  notifications: boolean
  overdueFine: boolean
  allowSelfRegistration: boolean
  autoGenerateMemberId: boolean
  showCatalogAvailability: boolean
}

type AdditionalPreferences = {
  autoLogout: boolean
  autoReturnToAvailable: boolean
  uniqueMemberId: boolean
  showBarcodeInReceipts: boolean
  dueDateReminders: boolean
  publicCatalog: boolean
}

type LibraryProfile = {
  libraryName: string
  establishedYear: string
  libraryEmail: string
  phoneNumber: string
  website: string
  libraryCode: string
  streetAddress: string
  addressLine2: string
  city: string
  stateProvince: string
  zipPostalCode: string
  country: string
  description: string
}

type UserStatus = 'Active' | 'Inactive'
type UserRole = 'Administrator' | 'Librarian' | 'Assistant' | 'Member Clerk'

type UserRecord = {
  name: string
  username: string
  email: string
  role: UserRole
  status: UserStatus
  lastLogin: string
  avatar: string
  isYou?: boolean
}

type BooksBorrowingSettings = {
  accessionFormat: string
  defaultLanguage: string
  defaultCondition: string
  defaultShelfLocation: string
  allowDuplicateBooks: boolean
  autoGenerateAccessionNumber: boolean
  allowMultipleCategories: boolean
  allowMultipleSubjects: boolean
  showOnPublicCatalog: boolean
  maxBooksPerMember: string
  loanPeriodDays: string
  renewalLimit: string
  renewalPeriodDays: string
  reserveWhenUnavailable: boolean
  autoDueDateCalculation: boolean
  gracePeriodDays: string
  dueDateReminder: string
  allowBorrowingIfOverdue: boolean
  blockBorrowingIfFineExists: boolean
  blockBorrowingIfMembershipExpired: boolean
  minimumDaysBetweenLoans: string
  allowStaffOverrideLoanPolicy: boolean
  returnGracePeriodDays: string
  fineCalculationMethod: string
  fineAmountPerDay: string
  maximumFineAmount: string
  allowBookReturnAfterDueDate: boolean
  clearReservationOnReturn: boolean
  autoCalculateFineOnReturn: boolean
  updateBookAvailabilityOnReturn: boolean
  allowFineWaiver: boolean
  finePaymentRequiredForReturn: boolean
  fineRounding: string
  receiptOnFinePayment: boolean
  allowReservations: boolean
  maxReservationsPerMember: string
  reservationExpiryDays: string
  notifyBeforeExpiryHours: string
  onlyAllowReservationIfNoCopyAvailable: boolean
  allowReservationOnLostDamagedCopies: boolean
  allowReservationOnReferenceBooks: boolean
  allowReservationOnUpcomingBooks: boolean
  queueType: string
  autoCancelReservation: boolean
  nextReservationAfterCancellation: boolean
  queuePriority: string
  reservationConfirmationNotification: boolean
  reservationExpiryReminderNotification: boolean
  reservationCancellationAlertNotification: boolean
  bookReadyNotification: boolean
}

type MembershipTypeRow = {
  type: string
  description: string
  maxBooks: string
  loanPeriodDays: string
  fineExempt: boolean
  icon: LucideIcon
  color: 'violet' | 'emerald' | 'amber' | 'blue' | 'slate'
}

type PenaltyRuleListRow = {
  fineType: string
  applyFinePer: string
  fineAmount: string
  gracePeriod: string
  maxFineAmount: string
  status: 'Active' | 'Inactive'
  icon: LucideIcon
  color: 'amber' | 'rose' | 'violet' | 'orange' | 'blue'
}

type NotificationSettingsState = {
  enableNotifications: boolean
  defaultLanguage: string
  dateFormat: string
  timeFormat: string
  enableQuietHours: boolean
  quietStartTime: string
  quietEndTime: string
  timezone: string
}

type NotificationPreferenceRow = {
  key: string
  label: string
  description: string
  icon: LucideIcon
  color: 'violet' | 'amber' | 'emerald' | 'blue' | 'orange'
  inApp: boolean
  email: boolean
  sms: boolean
  push: boolean
}

type NotificationTemplateRow = {
  key: string
  templateName: string
  description: string
  notificationType: string
  subject: string
  lastUpdated: string
  updatedBy: string
  enabled: boolean
  icon: LucideIcon
  color: 'violet' | 'amber' | 'emerald' | 'blue' | 'orange' | 'rose' | 'cyan'
  channels: Array<'email' | 'sms' | 'push'>
}

type DeliveryChannelRow = {
  key: string
  channel: string
  description: string
  status: 'Active' | 'Inactive'
  isDefault: boolean
  lastTested: string
  icon: LucideIcon
  color: 'violet' | 'emerald' | 'blue' | 'amber' | 'green'
}

type Option = {
  value: string
  label: string
}

type SettingsMenuItem = {
  label: string
  icon: LucideIcon
  group: 'LIBRARY' | 'SYSTEM'
}

type ThemeOption = {
  key: ThemeMode
  label: string
  icon: LucideIcon
}

type PreferenceItem = {
  key: keyof SystemPreferences
  label: string
}

type AdditionalPreferenceItem = {
  key: keyof AdditionalPreferences
  title: string
  detail: string
  icon: LucideIcon
}

const settingsMenuItems: SettingsMenuItem[] = [
  { label: 'General', icon: Settings2, group: 'LIBRARY' },
  { label: 'Library Profile', icon: BookOpen, group: 'LIBRARY' },
  { label: 'Users & Roles', icon: UsersRound, group: 'LIBRARY' },
  { label: 'Books & Borrowing', icon: RotateCcw, group: 'LIBRARY' },
  { label: 'Membership & Penalties', icon: IdCard, group: 'LIBRARY' },
  { label: 'Notifications', icon: Bell, group: 'SYSTEM' },
  { label: 'Email & SMTP', icon: Mail, group: 'SYSTEM' },
  { label: 'Security', icon: Shield, group: 'SYSTEM' },
  { label: 'Backup', icon: RotateCcw, group: 'SYSTEM' },
  { label: 'Activity Logs', icon: Clock3, group: 'SYSTEM' },
]

const dateFormatOptions: Option[] = [
  { value: 'mm-dd-yyyy', label: 'May 12, 2026 (MM DD, YYYY)' },
  { value: 'dd-mm-yyyy', label: '12 May 2026 (DD MM, YYYY)' },
  { value: 'yyyy-mm-dd', label: '2026-05-12 (YYYY-MM-DD)' },
]

const languageOptions: Option[] = [
  { value: 'english', label: 'English' },
  { value: 'filipino', label: 'Filipino' },
]

const timeFormatOptions: Option[] = [
  { value: '12h', label: '12 Hour (02:30 PM)' },
  { value: '24h', label: '24 Hour (14:30)' },
]

const itemsPerPageOptions: Option[] = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
]

const currencyOptions: Option[] = [
  { value: 'php', label: 'PHP - Philippine Peso (P)' },
  { value: 'usd', label: 'USD - US Dollar ($)' },
]

const themeOptions: ThemeOption[] = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'system', label: 'System', icon: Monitor },
]

const systemPreferenceItems: PreferenceItem[] = [
  { key: 'notifications', label: 'Enable notifications' },
  { key: 'overdueFine', label: 'Enable fine for overdue books' },
  { key: 'allowSelfRegistration', label: 'Allow member self-registration' },
  { key: 'autoGenerateMemberId', label: 'Auto-generate member ID' },
  { key: 'showCatalogAvailability', label: 'Show book availability on public catalog' },
]

const additionalPreferenceItems: AdditionalPreferenceItem[] = [
  { key: 'autoLogout', title: 'Auto Logout', detail: 'Automatically logout inactive users', icon: Shield },
  { key: 'autoReturnToAvailable', title: 'Auto Return to Available', detail: 'Automatically set book to available after return', icon: RotateCcw },
  { key: 'uniqueMemberId', title: 'Unique Member ID', detail: 'Generate unique ID for new members', icon: UserCog },
  { key: 'showBarcodeInReceipts', title: 'Show Barcode in Receipts', detail: 'Display book barcode in print receipts', icon: WalletCards },
  { key: 'dueDateReminders', title: 'Due Date Reminders', detail: 'Send reminders before due date', icon: Clock3 },
  { key: 'publicCatalog', title: 'Public Catalog', detail: 'Make catalog publicly accessible', icon: Globe },
]

const initialGeneralSettings: GeneralSettings = {
  dateFormat: 'mm-dd-yyyy',
  language: 'english',
  timeFormat: '12h',
  theme: 'light',
  itemsPerPage: '10',
  currency: 'php',
}

const initialSystemPreferences: SystemPreferences = {
  notifications: true,
  overdueFine: true,
  allowSelfRegistration: true,
  autoGenerateMemberId: true,
  showCatalogAvailability: true,
}

const initialAdditionalPreferences: AdditionalPreferences = {
  autoLogout: true,
  autoReturnToAvailable: true,
  uniqueMemberId: true,
  showBarcodeInReceipts: false,
  dueDateReminders: true,
  publicCatalog: true,
}

const initialLibraryProfile: LibraryProfile = {
  libraryName: 'infoLib Library',
  establishedYear: '2020',
  libraryEmail: 'infolib@example.com',
  phoneNumber: '+63 912 345 6789',
  website: 'https://infolib.com',
  libraryCode: 'INFOLIB-2020',
  streetAddress: '123 Library St.',
  addressLine2: 'Cityville',
  city: 'Cityville',
  stateProvince: 'California',
  zipPostalCode: 'CA 90210',
  country: 'United States',
  description: 'infoLib Library is a modern library dedicated to providing knowledge and resources to inspire learning, research, and community growth.',
}

const userRoleOptions: Option[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'Administrator', label: 'Administrator' },
  { value: 'Librarian', label: 'Librarian' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Member Clerk', label: 'Member Clerk' },
]

const userStatusOptions: Option[] = [
  { value: 'all', label: 'All Status' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

const mockUsers: UserRecord[] = [
  { name: 'Admin User', username: 'admin', email: 'admin@infolib.com', role: 'Administrator', status: 'Active', lastLogin: 'May 12, 2026 10:30 AM', avatar: '🧑🏻', isYou: true },
  { name: 'Sarah Johnson', username: 'sarah.j', email: 'sarah@infolib.com', role: 'Librarian', status: 'Active', lastLogin: 'May 12, 2026 09:15 AM', avatar: '👩🏻' },
  { name: 'Michael Brown', username: 'michael.b', email: 'michael@infolib.com', role: 'Librarian', status: 'Active', lastLogin: 'May 11, 2026 04:45 PM', avatar: '👨🏽' },
  { name: 'Emily Davis', username: 'emily.d', email: 'emily@infolib.com', role: 'Assistant', status: 'Active', lastLogin: 'May 10, 2026 02:20 PM', avatar: '👩🏼' },
  { name: 'James Wilson', username: 'james.w', email: 'james@infolib.com', role: 'Member Clerk', status: 'Inactive', lastLogin: 'May 5, 2026 11:10 AM', avatar: '👨🏻' },
  { name: 'Olivia Martinez', username: 'olivia.m', email: 'olivia@infolib.com', role: 'Assistant', status: 'Active', lastLogin: 'May 8, 2026 03:30 PM', avatar: '👩🏽' },
]

const roles = [
  { name: 'Administrator', detail: 'Full system access and configuration', users: 5, icon: Shield, color: 'violet' },
  { name: 'Librarian', detail: 'Manage books, members and circulation', users: 8, icon: BookOpen, color: 'blue' },
  { name: 'Assistant', detail: 'Assist with daily library operations', users: 4, icon: UserCog, color: 'amber' },
  { name: 'Member Clerk', detail: 'Manage members and basic circulation', users: 3, icon: UsersRound, color: 'cyan' },
  { name: 'Guest View', detail: 'Read-only access to catalog', users: 0, icon: View, color: 'slate' },
] as const

const languageSelectOptions: Option[] = [
  { value: 'English', label: 'English' },
  { value: 'Filipino', label: 'Filipino' },
]

const conditionOptions: Option[] = [
  { value: 'New', label: 'New' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
]

const reminderOptions: Option[] = [
  { value: '1 day before', label: '1 day before' },
  { value: '2 days before', label: '2 days before' },
  { value: '3 days before', label: '3 days before' },
]

const fineCalculationOptions: Option[] = [
  { value: 'Per Day', label: 'Per Day' },
  { value: 'Per Hour', label: 'Per Hour' },
  { value: 'Fixed Fee', label: 'Fixed Fee' },
]

const fineRoundingOptions: Option[] = [
  { value: '$0.10', label: '$0.10' },
  { value: '$0.25', label: '$0.25' },
  { value: '$0.50', label: '$0.50' },
]

const queueTypeOptions: Option[] = [
  { value: 'FIFO (First In First Out)', label: 'FIFO (First In First Out)' },
  { value: 'LIFO (Last In First Out)', label: 'LIFO (Last In First Out)' },
]

const queuePriorityOptions: Option[] = [
  { value: 'By Reservation Date', label: 'By Reservation Date' },
  { value: 'By Member Type', label: 'By Member Type' },
]

const initialBooksBorrowingSettings: BooksBorrowingSettings = {
  accessionFormat: 'ACC-(YYYY)-(#####)',
  defaultLanguage: 'English',
  defaultCondition: 'New',
  defaultShelfLocation: 'General Shelf',
  allowDuplicateBooks: true,
  autoGenerateAccessionNumber: true,
  allowMultipleCategories: true,
  allowMultipleSubjects: true,
  showOnPublicCatalog: true,
  maxBooksPerMember: '5',
  loanPeriodDays: '14',
  renewalLimit: '2',
  renewalPeriodDays: '7',
  reserveWhenUnavailable: true,
  autoDueDateCalculation: true,
  gracePeriodDays: '1',
  dueDateReminder: '2 days before',
  allowBorrowingIfOverdue: true,
  blockBorrowingIfFineExists: false,
  blockBorrowingIfMembershipExpired: true,
  minimumDaysBetweenLoans: '0',
  allowStaffOverrideLoanPolicy: true,
  returnGracePeriodDays: '1',
  fineCalculationMethod: 'Per Day',
  fineAmountPerDay: '0.50',
  maximumFineAmount: '25.00',
  allowBookReturnAfterDueDate: true,
  clearReservationOnReturn: true,
  autoCalculateFineOnReturn: true,
  updateBookAvailabilityOnReturn: true,
  allowFineWaiver: true,
  finePaymentRequiredForReturn: false,
  fineRounding: '$0.10',
  receiptOnFinePayment: true,
  allowReservations: true,
  maxReservationsPerMember: '5',
  reservationExpiryDays: '2',
  notifyBeforeExpiryHours: '24',
  onlyAllowReservationIfNoCopyAvailable: true,
  allowReservationOnLostDamagedCopies: false,
  allowReservationOnReferenceBooks: false,
  allowReservationOnUpcomingBooks: true,
  queueType: 'FIFO (First In First Out)',
  autoCancelReservation: true,
  nextReservationAfterCancellation: true,
  queuePriority: 'By Reservation Date',
  reservationConfirmationNotification: true,
  reservationExpiryReminderNotification: true,
  reservationCancellationAlertNotification: true,
  bookReadyNotification: true,
}

const membershipTypeRows: MembershipTypeRow[] = [
  { type: 'Student', description: 'For enrolled students', maxBooks: '5', loanPeriodDays: '14', fineExempt: false, icon: UserRound, color: 'violet' },
  { type: 'Faculty', description: 'For teaching staff', maxBooks: '10', loanPeriodDays: '30', fineExempt: false, icon: UserCog, color: 'emerald' },
  { type: 'Staff', description: 'For library and administrative staff', maxBooks: '8', loanPeriodDays: '21', fineExempt: false, icon: User, color: 'amber' },
  { type: 'Member', description: 'For regular library members', maxBooks: '5', loanPeriodDays: '14', fineExempt: true, icon: UserRound, color: 'blue' },
  { type: 'Guest', description: 'For guest users', maxBooks: '2', loanPeriodDays: '7', fineExempt: false, icon: User, color: 'slate' },
]

const penaltyRuleListRows: PenaltyRuleListRow[] = [
  { fineType: 'Overdue Fine', applyFinePer: 'Per Day', fineAmount: '$ 0.50', gracePeriod: '1 day', maxFineAmount: '$ 25.00', status: 'Active', icon: Clock3, color: 'amber' },
  { fineType: 'Lost Item Fine', applyFinePer: 'Per Item', fineAmount: '$ 20.00', gracePeriod: '0 days', maxFineAmount: '$ 100.00', status: 'Active', icon: BookOpen, color: 'rose' },
  { fineType: 'Damaged Item Fine', applyFinePer: 'Per Item', fineAmount: '$ 15.00', gracePeriod: '0 days', maxFineAmount: '$ 75.00', status: 'Active', icon: Wrench, color: 'violet' },
  { fineType: 'Fine Waived (Staff)', applyFinePer: 'Per Day', fineAmount: '$ 0.00', gracePeriod: '0 days', maxFineAmount: '$ 0.00', status: 'Active', icon: UserCog, color: 'orange' },
  { fineType: 'Reservation Late Fine', applyFinePer: 'Per Day', fineAmount: '$ 0.25', gracePeriod: '1 day', maxFineAmount: '$ 10.00', status: 'Inactive', icon: CalendarDays, color: 'blue' },
]

const notificationLanguageOptions: Option[] = [
  { value: 'English', label: 'English' },
  { value: 'Filipino', label: 'Filipino' },
]

const notificationDateFormatOptions: Option[] = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
]

const notificationTimeFormatOptions: Option[] = [
  { value: '12 Hour (AM/PM)', label: '12 Hour (AM/PM)' },
  { value: '24 Hour', label: '24 Hour' },
]

const quietTimeOptions: Option[] = [
  { value: '10:00 PM', label: '10:00 PM' },
  { value: '11:00 PM', label: '11:00 PM' },
  { value: '12:00 AM', label: '12:00 AM' },
  { value: '07:00 AM', label: '07:00 AM' },
  { value: '08:00 AM', label: '08:00 AM' },
]

const timezoneOptions: Option[] = [
  { value: '(GMT+08:00) Asia/Manila', label: '(GMT+08:00) Asia/Manila' },
  { value: '(GMT+08:00) Asia/Singapore', label: '(GMT+08:00) Asia/Singapore' },
]

const initialNotificationSettings: NotificationSettingsState = {
  enableNotifications: true,
  defaultLanguage: 'English',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12 Hour (AM/PM)',
  enableQuietHours: true,
  quietStartTime: '10:00 PM',
  quietEndTime: '07:00 AM',
  timezone: '(GMT+08:00) Asia/Manila',
}

const initialNotificationPreferences: NotificationPreferenceRow[] = [
  { key: 'due-date-reminder', label: 'Due Date Reminder', description: 'Remind member before a book is due.', icon: CalendarDays, color: 'violet', inApp: true, email: true, sms: false, push: true },
  { key: 'overdue-notification', label: 'Overdue Notification', description: 'Notify when a book is overdue.', icon: Clock3, color: 'amber', inApp: true, email: true, sms: true, push: true },
  { key: 'reservation-confirmation', label: 'Reservation Confirmation', description: 'Notify when a reservation is confirmed.', icon: CircleAlert, color: 'emerald', inApp: true, email: true, sms: false, push: true },
  { key: 'reservation-cancellation', label: 'Reservation Cancellation', description: 'Notify when a reservation is cancelled.', icon: CircleAlert, color: 'blue', inApp: true, email: true, sms: false, push: false },
  { key: 'fine-payment-receipt', label: 'Fine Payment Receipt', description: 'Send receipt after fine payment.', icon: Mail, color: 'orange', inApp: false, email: true, sms: false, push: false },
]

const templateTypeOptions: Option[] = [
  { value: 'All Notification Types', label: 'All Notification Types' },
  { value: 'Due Date Reminder', label: 'Due Date Reminder' },
  { value: 'Overdue Notification', label: 'Overdue Notification' },
  { value: 'Reservation Confirmation', label: 'Reservation Confirmation' },
]

const templatePageSizeOptions: Option[] = [
  { value: '10 / page', label: '10 / page' },
  { value: '20 / page', label: '20 / page' },
  { value: '50 / page', label: '50 / page' },
]

const initialNotificationTemplates: NotificationTemplateRow[] = [
  { key: 'due-date-reminder', templateName: 'Due Date Reminder', description: 'Remind member before a book is due.', notificationType: 'Due Date Reminder', subject: 'Reminder: Book due on {{due_date}}', lastUpdated: 'May 12, 2024', updatedBy: 'Admin User', enabled: true, icon: CalendarDays, color: 'violet', channels: ['email', 'sms', 'push'] },
  { key: 'overdue-notification', templateName: 'Overdue Notification', description: 'Notify when a book is overdue.', notificationType: 'Overdue Notification', subject: 'Overdue Alert: {{title}} is overdue', lastUpdated: 'May 10, 2024', updatedBy: 'Admin User', enabled: true, icon: Clock3, color: 'amber', channels: ['email', 'sms', 'push'] },
  { key: 'reservation-confirmation', templateName: 'Reservation Confirmation', description: 'Notify when a reservation is confirmed.', notificationType: 'Reservation Confirmation', subject: 'Your reservation for {{title}} is confirmed', lastUpdated: 'May 8, 2024', updatedBy: 'Admin User', enabled: true, icon: CircleAlert, color: 'emerald', channels: ['email', 'push'] },
  { key: 'reservation-cancellation', templateName: 'Reservation Cancellation', description: 'Notify when a reservation is cancelled.', notificationType: 'Reservation Cancellation', subject: 'Reservation cancelled for {{title}}', lastUpdated: 'May 6, 2024', updatedBy: 'Admin User', enabled: true, icon: CircleAlert, color: 'blue', channels: ['email', 'sms', 'push'] },
  { key: 'fine-payment-receipt', templateName: 'Fine Payment Receipt', description: 'Send receipt after fine payment.', notificationType: 'Fine Payment Receipt', subject: 'Receipt for fine payment', lastUpdated: 'May 5, 2024', updatedBy: 'Admin User', enabled: true, icon: Mail, color: 'orange', channels: ['email'] },
  { key: 'welcome-member', templateName: 'Welcome New Member', description: 'Welcome email for new members.', notificationType: 'General', subject: 'Welcome to {{library_name}}!', lastUpdated: 'Apr 30, 2024', updatedBy: 'Admin User', enabled: false, icon: UsersRound, color: 'rose', channels: ['email'] },
  { key: 'system-announcement', templateName: 'System Announcement', description: 'Send important library announcements.', notificationType: 'Announcement', subject: 'Important Announcement', lastUpdated: 'Apr 28, 2024', updatedBy: 'Admin User', enabled: true, icon: Bell, color: 'cyan', channels: ['email', 'push'] },
]

const initialDeliveryChannels: DeliveryChannelRow[] = [
  { key: 'email', channel: 'Email', description: 'Send notifications via email.', status: 'Active', isDefault: true, lastTested: 'May 12, 2024 10:30 AM', icon: Mail, color: 'violet' },
  { key: 'sms', channel: 'SMS', description: 'Send notifications via SMS.', status: 'Active', isDefault: false, lastTested: 'May 12, 2024 10:28 AM', icon: MessageCircle, color: 'emerald' },
  { key: 'in-app', channel: 'In-App', description: 'Send notifications inside the system.', status: 'Active', isDefault: true, lastTested: 'May 12, 2024 10:25 AM', icon: Bell, color: 'blue' },
  { key: 'push', channel: 'Push Notification', description: 'Send push notifications to mobile app.', status: 'Active', isDefault: false, lastTested: 'May 12, 2024 10:20 AM', icon: Upload, color: 'amber' },
  { key: 'whatsapp', channel: 'WhatsApp', description: 'Send notifications via WhatsApp.', status: 'Inactive', isDefault: false, lastTested: 'Never', icon: MessageCircle, color: 'green' },
  { key: 'telegram', channel: 'Telegram', description: 'Send notifications via Telegram.', status: 'Inactive', isDefault: false, lastTested: 'Never', icon: Send, color: 'violet' },
]

type InputFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  isDarkMode: boolean
  rightIcon?: LucideIcon
  hint?: string
}

function InputField({ label, value, onChange, isDarkMode, rightIcon, hint }: InputFieldProps) {
  const RightIcon = rightIcon
  return (
    <label className="space-y-1.5">
      <span className={`block text-[13px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
      <div className="relative">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-10 w-full rounded-xl border px-3 pr-9 text-[14px] outline-none transition-colors ${
            isDarkMode
              ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
              : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
          }`}
        />
        {RightIcon ? <RightIcon size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} /> : null}
      </div>
      {hint ? <span className={`block text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{hint}</span> : null}
    </label>
  )
}

type SelectFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  isDarkMode: boolean
}

function SelectField({ label, value, onChange, options, isDarkMode }: SelectFieldProps) {
  return (
    <label className="space-y-1.5">
      <span className={`block text-[13px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-10 w-full appearance-none rounded-xl border py-2 pl-3 pr-10 text-[14px] outline-none transition-colors ${
            isDarkMode
              ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500'
              : 'border-slate-200 bg-white text-slate-700 focus:border-emerald-500'
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
      </div>
    </label>
  )
}

type SwitchFieldProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  isDarkMode: boolean
}

function SwitchField({ checked, onChange, isDarkMode }: SwitchFieldProps) {
  return (
    <span className="relative inline-flex items-center">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className={`h-6 w-11 rounded-full transition-colors ${checked ? 'bg-indigo-600' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
      <span className={`pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </span>
  )
}

export function SettingsPage({ isDarkMode }: SettingsPageProps) {
  const [activeSettingsMenu, setActiveSettingsMenu] = useState('General')
  const [general, setGeneral] = useState(initialGeneralSettings)
  const [systemPreferences, setSystemPreferences] = useState(initialSystemPreferences)
  const [additionalPreferences, setAdditionalPreferences] = useState(initialAdditionalPreferences)
  const [libraryProfile, setLibraryProfile] = useState(initialLibraryProfile)
  const [usersRoleTab, setUsersRoleTab] = useState<'Users' | 'Roles'>('Users')
  const [booksBorrowingTab, setBooksBorrowingTab] = useState<'Book Settings' | 'Borrowing Settings' | 'Return Settings' | 'Reservation Settings'>('Book Settings')
  const [membershipPenaltyTab, setMembershipPenaltyTab] = useState<'Membership Types' | 'Penalty Rules'>('Membership Types')
  const [notificationsTab, setNotificationsTab] = useState<'Notification Settings' | 'Notification Templates' | 'Delivery Channels'>('Notification Settings')
  const [booksBorrowingSettings, setBooksBorrowingSettings] = useState(initialBooksBorrowingSettings)
  const [notificationSettings, setNotificationSettings] = useState(initialNotificationSettings)
  const [notificationPreferences, setNotificationPreferences] = useState(initialNotificationPreferences)
  const [notificationTemplates, setNotificationTemplates] = useState(initialNotificationTemplates)
  const [deliveryChannels] = useState(initialDeliveryChannels)
  const [templateSearch, setTemplateSearch] = useState('')
  const [templateTypeFilter, setTemplateTypeFilter] = useState('All Notification Types')
  const [templatePageSize, setTemplatePageSize] = useState('10 / page')
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com')
  const [smtpPort, setSmtpPort] = useState('587')
  const [smtpUsername, setSmtpUsername] = useState('infolib.system@gmail.com')
  const [smtpPassword, setSmtpPassword] = useState('••••••••••••')
  const [smtpEncryption, setSmtpEncryption] = useState('TLS')
  const [smtpUseAuth, setSmtpUseAuth] = useState(true)
  const [senderName, setSenderName] = useState('InfoLib Library System')
  const [senderEmail, setSenderEmail] = useState('infolib.system@gmail.com')
  const [replyToEmail, setReplyToEmail] = useState('support@infolib.com')
  const [testEmailTo, setTestEmailTo] = useState('admin@infolib.com')
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)
  const [queueEmailsEnabled, setQueueEmailsEnabled] = useState(true)
  const [retryFailedEmailsEnabled, setRetryFailedEmailsEnabled] = useState(true)
  const [securityTab, setSecurityTab] = useState<'Authentication' | 'Password Policy' | 'Session Management' | 'IP Restrictions' | 'Other Settings'>('Authentication')
  const [enable2FA, setEnable2FA] = useState(true)
  const [twoFaAdmins, setTwoFaAdmins] = useState(true)
  const [twoFaLibrarians, setTwoFaLibrarians] = useState(true)
  const [twoFaStaff, setTwoFaStaff] = useState(false)
  const [twoFaMembers, setTwoFaMembers] = useState(false)
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5 Attempts')
  const [lockoutDuration, setLockoutDuration] = useState('30 Minutes')
  const [captchaOnLogin, setCaptchaOnLogin] = useState(true)
  const [rememberMeEnabled, setRememberMeEnabled] = useState(true)
  const [accountVerificationEnabled, setAccountVerificationEnabled] = useState(false)
  const [backupSchedule, setBackupSchedule] = useState('Daily')
  const [backupTime, setBackupTime] = useState('02:00 AM')
  const [backupRetention, setBackupRetention] = useState('30 Days')
  const [includeAttachments, setIncludeAttachments] = useState(true)
  const [emailBackupSummary, setEmailBackupSummary] = useState(true)
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [userStatusFilter, setUserStatusFilter] = useState('all')

  const shellClass = isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
  const cardClass = isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'
  const textMutedClass = isDarkMode ? 'text-slate-400' : 'text-slate-500'

  const updateGeneral = <Key extends keyof GeneralSettings>(key: Key, value: GeneralSettings[Key]) => {
    setGeneral((previous) => ({ ...previous, [key]: value }))
  }

  const updateSystemPreference = (key: keyof SystemPreferences, value: boolean) => {
    setSystemPreferences((previous) => ({ ...previous, [key]: value }))
  }

  const updateAdditionalPreference = (key: keyof AdditionalPreferences, value: boolean) => {
    setAdditionalPreferences((previous) => ({ ...previous, [key]: value }))
  }
  const updateLibraryProfile = <Key extends keyof LibraryProfile>(key: Key, value: LibraryProfile[Key]) => {
    setLibraryProfile((previous) => ({ ...previous, [key]: value }))
  }
  const updateBooksBorrowing = <Key extends keyof BooksBorrowingSettings>(key: Key, value: BooksBorrowingSettings[Key]) => {
    setBooksBorrowingSettings((previous) => ({ ...previous, [key]: value }))
  }
  const updateNotificationSettings = <Key extends keyof NotificationSettingsState>(key: Key, value: NotificationSettingsState[Key]) => {
    setNotificationSettings((previous) => ({ ...previous, [key]: value }))
  }
  const updateNotificationPreferenceChannel = (rowKey: string, channel: 'inApp' | 'email' | 'sms' | 'push', value: boolean) => {
    setNotificationPreferences((previous) => previous.map((item) => (item.key === rowKey ? { ...item, [channel]: value } : item)))
  }
  const updateTemplateEnabled = (rowKey: string, value: boolean) => {
    setNotificationTemplates((previous) => previous.map((item) => (item.key === rowKey ? { ...item, enabled: value } : item)))
  }

  const libraryItems = settingsMenuItems.filter((item) => item.group === 'LIBRARY')
  const systemItems = settingsMenuItems.filter((item) => item.group === 'SYSTEM')
  const filteredUsers = mockUsers.filter((user) => {
    const q = userSearch.trim().toLowerCase()
    const searchMatch = !q || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.username.toLowerCase().includes(q)
    const roleMatch = userRoleFilter === 'all' || user.role === userRoleFilter
    const statusMatch = userStatusFilter === 'all' || user.status === userStatusFilter
    return searchMatch && roleMatch && statusMatch
  })
  const filteredNotificationTemplates = notificationTemplates.filter((template) => {
    const q = templateSearch.trim().toLowerCase()
    const searchMatch = !q || template.templateName.toLowerCase().includes(q) || template.subject.toLowerCase().includes(q)
    const typeMatch = templateTypeFilter === 'All Notification Types' || template.notificationType === templateTypeFilter
    return searchMatch && typeMatch
  })

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-6 ${shellClass}`}>
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={`rounded-2xl border p-4 ${cardClass}`}>
            <h2 className="px-2 py-2 text-[26px] font-bold tracking-tight">Settings</h2>

            <p className="px-2 pt-2 text-xs font-bold tracking-[0.08em] text-indigo-600">LIBRARY</p>
            <nav className="mt-2 space-y-1">
              {libraryItems.map((item) => {
                const ItemIcon = item.icon
                const isActive = item.label === activeSettingsMenu
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveSettingsMenu(item.label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                      isActive
                        ? isDarkMode
                          ? 'bg-indigo-500/20 text-indigo-200'
                          : 'bg-indigo-50 text-indigo-700'
                        : isDarkMode
                          ? 'text-slate-300 hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ItemIcon size={16} />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className={`my-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} />

            <p className="px-2 pt-2 text-xs font-bold tracking-[0.08em] text-indigo-600">SYSTEM</p>
            <nav className="mt-2 space-y-1">
              {systemItems.map((item) => {
                const ItemIcon = item.icon
                const isActive = item.label === activeSettingsMenu
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveSettingsMenu(item.label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                      isActive
                        ? isDarkMode
                          ? 'bg-indigo-500/20 text-indigo-200'
                          : 'bg-indigo-50 text-indigo-700'
                        : isDarkMode
                          ? 'text-slate-300 hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ItemIcon size={16} />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className={`mt-6 rounded-2xl border p-4 text-center ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50'}`}>
              <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${isDarkMode ? 'bg-slate-700 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                <Shield size={24} />
              </div>
              <p className={`mt-3 text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>System Security</p>
              <p className={`mt-2 text-sm ${textMutedClass}`}>Keep your system secure and up to date.</p>
              <button type="button" className={`mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-white'}`}>
                Security Settings
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <p className={`mt-6 text-xs font-semibold ${textMutedClass}`}>(c) 2026 infoLib</p>
            <p className={`mt-1 text-xs ${textMutedClass}`}>v1.0.0</p>
          </aside>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-semibold ${textMutedClass}`}>
                  Home
                  <span className="mx-2">/</span>
                  Settings
                  <span className="mx-2">/</span>
                  {activeSettingsMenu}
                </p>
                <h3 className="mt-1 text-[30px] font-medium tracking-tight">{activeSettingsMenu === 'General' ? 'General Settings' : activeSettingsMenu}</h3>
                <p className={`mt-1 text-sm ${textMutedClass}`}>
                  {activeSettingsMenu === 'Library Profile'
                    ? "Update your library's details and contact information."
                    : activeSettingsMenu === 'Users & Roles'
                      ? 'Manage system users and their roles and permissions.'
                    : activeSettingsMenu === 'Books & Borrowing'
                      ? 'Configure book management and circulation settings.'
                    : activeSettingsMenu === 'Membership & Penalties'
                        ? 'Configure membership types and penalty rules for overdue materials.'
                      : activeSettingsMenu === 'Notifications'
                        ? 'Configure system notification preferences and templates.'
                      : activeSettingsMenu === 'Email & SMTP'
                        ? 'Configure SMTP settings to send emails and system notifications.'
                      : activeSettingsMenu === 'Security'
                        ? 'Manage security settings to protect your library system and data.'
                      : activeSettingsMenu === 'Backup'
                        ? 'Create and manage backups of your library system data. Backups help you restore your system in case of data loss.'
                      : 'Manage your system preferences and configurations.'}
                </p>
              </div>
              {activeSettingsMenu === 'Users & Roles' ? (
                <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(79,70,229,0.85)] transition-colors hover:bg-indigo-700">
                  <Plus size={15} />
                  Add User
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(79,70,229,0.85)] transition-colors hover:bg-indigo-700"
                >
                  <Check size={15} />
                  Save Changes
                </button>
              )}
            </div>

            {activeSettingsMenu === 'General' ? (
              <>
                <section className={`rounded-2xl border p-6 ${cardClass}`}>
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_285px]">
                <div>
                  <h4 className="text-[20px] font-semibold tracking-tight">System Preferences</h4>
                  <div className="mt-2 mb-3 h-0.5 w-24 rounded-full bg-indigo-500" />
                  <p className={`text-sm ${textMutedClass}`}>Configure general system preferences.</p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <SelectField label="Date Format" value={general.dateFormat} onChange={(value) => updateGeneral('dateFormat', value)} options={dateFormatOptions} isDarkMode={isDarkMode} />
                    <SelectField label="Language" value={general.language} onChange={(value) => updateGeneral('language', value)} options={languageOptions} isDarkMode={isDarkMode} />
                    <SelectField label="Time Format" value={general.timeFormat} onChange={(value) => updateGeneral('timeFormat', value)} options={timeFormatOptions} isDarkMode={isDarkMode} />

                    <div className="space-y-1.5">
                      <span className={`block text-[13px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Default Theme</span>
                      <div className="grid grid-cols-3 gap-2">
                        {themeOptions.map((option) => {
                          const ThemeIcon = option.icon
                          const isSelected = general.theme === option.key

                          return (
                            <button
                              key={option.key}
                              type="button"
                              onClick={() => updateGeneral('theme', option.key)}
                              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-[14px] font-semibold transition-colors ${
                                isSelected
                                  ? isDarkMode
                                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200'
                                    : 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                  : isDarkMode
                                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <ThemeIcon size={15} />
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <SelectField label="Items Per Page" value={general.itemsPerPage} onChange={(value) => updateGeneral('itemsPerPage', value)} options={itemsPerPageOptions} isDarkMode={isDarkMode} />
                    <SelectField label="Currency" value={general.currency} onChange={(value) => updateGeneral('currency', value)} options={currencyOptions} isDarkMode={isDarkMode} />
                  </div>
                </div>

                <aside className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50'}`}>
                  <h5 className="text-xl font-semibold">System Preferences</h5>
                  <div className="mt-4 space-y-3">
                    {systemPreferenceItems.map((item) => (
                      <label key={item.key} className="flex items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={systemPreferences[item.key]}
                          onChange={(event) => updateSystemPreference(item.key, event.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-600"
                        />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </aside>
              </div>
                </section>

                <section className={`rounded-2xl border p-6 ${cardClass}`}>
              <h4 className="text-[20px] font-semibold tracking-tight">Additional Preferences</h4>
              <div className="mt-2 mb-3 h-0.5 w-24 rounded-full bg-indigo-500" />
              <p className={`text-sm ${textMutedClass}`}>Configure additional system preferences.</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {additionalPreferenceItems.map((item) => {
                  const ItemIcon = item.icon
                  return (
                    <article key={item.key} className={`flex items-center justify-between rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 grid h-10 w-10 place-items-center rounded-xl ${isDarkMode ? 'bg-slate-700 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                          <ItemIcon size={18} />
                        </span>
                        <div>
                          <p className={`text-[15px] font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{item.title}</p>
                          <p className={`text-sm ${textMutedClass}`}>{item.detail}</p>
                        </div>
                      </div>
                      <SwitchField
                        checked={additionalPreferences[item.key]}
                        onChange={(value) => updateAdditionalPreference(item.key, value)}
                        isDarkMode={isDarkMode}
                      />
                    </article>
                  )
                })}
              </div>

              <div className={`mt-5 rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                These settings will be applied across the entire system.
              </div>
                </section>
              </>
            ) : null}

            {activeSettingsMenu === 'Library Profile' ? (
              <>
                <section className={`rounded-2xl border p-5 ${cardClass}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-[20px] font-semibold tracking-tight">Library Details</h4>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Basic information about your library.</p>
                    </div>
                    <button type="button" className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                      <Eye size={15} />
                      Preview Library Profile
                    </button>
                  </div>

                  <div className="mt-5 grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
                    <div className={`rounded-xl border p-4 text-center ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-slate-50'}`}>
                      <div className="relative mx-auto w-fit">
                        <div className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${isDarkMode ? 'bg-slate-700 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                          <Building2 size={36} />
                        </div>
                        <span className={`absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                          <Pencil size={14} />
                        </span>
                      </div>
                      <p className={`mt-3 text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Current Logo</p>
                      <p className={`mt-1 text-xs ${textMutedClass}`}>PNG, JPG or SVG. Max size 2MB</p>
                      <button type="button" className={`mt-3 inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-white'}`}>
                        <Upload size={14} />
                        Change Logo
                      </button>
                      <button type="button" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600">
                        <Trash2 size={14} />
                        Remove Logo
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField label="Library Name *" value={libraryProfile.libraryName} onChange={(value) => updateLibraryProfile('libraryName', value)} isDarkMode={isDarkMode} />
                      <InputField label="Established Year" value={libraryProfile.establishedYear} onChange={(value) => updateLibraryProfile('establishedYear', value)} isDarkMode={isDarkMode} rightIcon={CalendarDays} />
                      <InputField label="Library Email *" value={libraryProfile.libraryEmail} onChange={(value) => updateLibraryProfile('libraryEmail', value)} isDarkMode={isDarkMode} />
                      <InputField label="Phone Number *" value={libraryProfile.phoneNumber} onChange={(value) => updateLibraryProfile('phoneNumber', value)} isDarkMode={isDarkMode} />
                      <InputField label="Website" value={libraryProfile.website} onChange={(value) => updateLibraryProfile('website', value)} isDarkMode={isDarkMode} />
                      <InputField label="Library Code / ID" value={libraryProfile.libraryCode} onChange={(value) => updateLibraryProfile('libraryCode', value)} isDarkMode={isDarkMode} />
                    </div>
                  </div>
                </section>

                <section className={`rounded-2xl border p-5 ${cardClass}`}>
                  <h4 className="text-[20px] font-semibold tracking-tight">Address</h4>
                  <p className={`mt-1 text-sm ${textMutedClass}`}>Library location and address details.</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <InputField label="Street Address *" value={libraryProfile.streetAddress} onChange={(value) => updateLibraryProfile('streetAddress', value)} isDarkMode={isDarkMode} />
                    <InputField label="Address Line 2" value={libraryProfile.addressLine2} onChange={(value) => updateLibraryProfile('addressLine2', value)} isDarkMode={isDarkMode} />
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-4">
                    <InputField label="City *" value={libraryProfile.city} onChange={(value) => updateLibraryProfile('city', value)} isDarkMode={isDarkMode} />
                    <InputField label="State / Province *" value={libraryProfile.stateProvince} onChange={(value) => updateLibraryProfile('stateProvince', value)} isDarkMode={isDarkMode} />
                    <InputField label="ZIP / Postal Code *" value={libraryProfile.zipPostalCode} onChange={(value) => updateLibraryProfile('zipPostalCode', value)} isDarkMode={isDarkMode} />
                    <SelectField label="Country *" value={libraryProfile.country} onChange={(value) => updateLibraryProfile('country', value)} options={[{ value: 'United States', label: 'United States' }, { value: 'Philippines', label: 'Philippines' }]} isDarkMode={isDarkMode} />
                  </div>

                  <div className={`mt-5 border-t pt-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <h4 className="text-[20px] font-semibold tracking-tight">Library Description</h4>
                    <p className={`mt-1 text-sm ${textMutedClass}`}>Brief description about your library.</p>
                    <textarea
                      value={libraryProfile.description}
                      onChange={(event) => updateLibraryProfile('description', event.target.value.slice(0, 500))}
                      rows={4}
                      className={`mt-3 w-full resize-none rounded-xl border px-3 py-2 text-[14px] outline-none transition-colors ${
                        isDarkMode
                          ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
                          : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
                      }`}
                    />
                    <p className={`mt-2 text-right text-xs ${textMutedClass}`}>{libraryProfile.description.length} / 500</p>
                  </div>
                </section>
              </>
            ) : null}

            {activeSettingsMenu === 'Users & Roles' ? (
              <section className={`rounded-2xl border p-0 ${cardClass}`}>
                <div className="px-6 pt-4">
                  <div className={`flex items-center gap-5 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    {(['Users', 'Roles'] as const).map((tab) => {
                      const active = usersRoleTab === tab
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setUsersRoleTab(tab)}
                          className={`border-b-2 px-1 pb-3 text-[22px] font-semibold transition-colors ${
                            active
                              ? 'border-indigo-600 text-indigo-600'
                              : isDarkMode
                                ? 'border-transparent text-slate-300 hover:text-slate-100'
                                : 'border-transparent text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          {tab}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {usersRoleTab === 'Users' ? (
                  <>
                    <div className="px-6 py-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[280px] flex-1">
                          <Search size={16} className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                          <input
                            value={userSearch}
                            onChange={(event) => setUserSearch(event.target.value)}
                            placeholder="Search users by name, email, or username..."
                            className={`h-10 w-full rounded-xl border py-2 pl-10 pr-3 text-[14px] outline-none transition-colors ${
                              isDarkMode
                                ? 'border-slate-700 bg-[#0f1f49] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
                                : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
                            }`}
                          />
                        </div>

                        <div className="w-[190px]">
                          <SelectField label="" value={userRoleFilter} onChange={setUserRoleFilter} options={userRoleOptions} isDarkMode={isDarkMode} />
                        </div>
                        <div className="w-[150px]">
                          <SelectField label="" value={userStatusFilter} onChange={setUserStatusFilter} options={userStatusOptions} isDarkMode={isDarkMode} />
                        </div>

                        <button type="button" className={`ml-auto inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                          <Upload size={14} />
                          Export
                        </button>
                      </div>
                    </div>

                    <div className="px-6 pb-0">
                      <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className={`grid grid-cols-[1.35fr_0.8fr_1.2fr_1fr_0.85fr_1.35fr_0.35fr] gap-3 border-b px-4 py-3 text-[13px] font-semibold ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                          <p>User</p>
                          <p>Username</p>
                          <p>Email</p>
                          <p>Role</p>
                          <p>Status</p>
                          <p>Last Login</p>
                          <p className="text-right">Actions</p>
                        </div>

                        {filteredUsers.map((user) => (
                          <div key={user.email} className={`grid grid-cols-[1.35fr_0.8fr_1.2fr_1fr_0.85fr_1.35fr_0.35fr] items-center gap-3 border-b px-4 py-3 last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <div className="flex items-center gap-3">
                              <span className={`grid h-9 w-9 place-items-center rounded-full text-lg ${isDarkMode ? 'bg-slate-700' : 'bg-indigo-100'}`}>{user.avatar}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{user.name}</span>
                                {user.isYou ? <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>You</span> : null}
                              </div>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{user.username}</p>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{user.email}</p>
                            <p>
                              <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                user.role === 'Administrator'
                                  ? isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'
                                  : user.role === 'Librarian'
                                    ? isDarkMode ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'
                                    : user.role === 'Member Clerk'
                                      ? isDarkMode ? 'bg-cyan-500/20 text-cyan-200' : 'bg-cyan-100 text-cyan-700'
                                      : isDarkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {user.role}
                              </span>
                            </p>
                            <p>
                              <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                user.status === 'Active'
                                  ? isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'
                                  : isDarkMode ? 'bg-rose-500/20 text-rose-200' : 'bg-rose-100 text-rose-700'
                              }`}>
                                {user.status}
                              </span>
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{user.lastLogin}</p>
                            <button type="button" className={`ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
                              <EllipsisVertical size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`mt-3 flex items-center justify-between border-t px-6 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                      <p className={`text-sm ${textMutedClass}`}>Showing 1 to {filteredUsers.length} of {filteredUsers.length} users</p>
                      <div className="flex items-center gap-2">
                        <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                          <ChevronLeft size={15} />
                        </button>
                        <button type="button" className="grid h-8 min-w-8 place-items-center rounded-lg bg-indigo-600 px-2 text-sm font-semibold text-white">1</button>
                        <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="px-6 py-5">
                    <div className="grid gap-4 xl:grid-cols-[460px_minmax(0,1fr)]">
                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h4 className="text-[20px] font-semibold tracking-tight">Roles</h4>
                            <p className={`mt-1 text-sm ${textMutedClass}`}>Manage user roles and their permissions.</p>
                          </div>
                          <button type="button" className={`inline-flex h-8 items-center gap-1 rounded-lg border px-3 text-xs font-semibold transition-colors ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                            <Plus size={12} />
                            Add Role
                          </button>
                        </div>

                        <div className="relative mt-4">
                          <Search size={15} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                          <input
                            placeholder="Search roles..."
                            className={`h-10 w-full rounded-xl border py-2 pl-3 pr-9 text-[14px] outline-none transition-colors ${
                              isDarkMode
                                ? 'border-slate-700 bg-[#0b1738] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
                                : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
                            }`}
                          />
                        </div>

                        <div className={`mt-3 overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                          {roles.map((role, index) => {
                            const RoleIcon = role.icon
                            const isActive = index === 0
                            const badgeClass =
                              role.color === 'violet'
                                ? isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'
                                : role.color === 'blue'
                                  ? isDarkMode ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'
                                  : role.color === 'amber'
                                    ? isDarkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'
                                    : role.color === 'cyan'
                                      ? isDarkMode ? 'bg-cyan-500/20 text-cyan-200' : 'bg-cyan-100 text-cyan-700'
                                      : isDarkMode ? 'bg-slate-600 text-slate-200' : 'bg-slate-100 text-slate-700'

                            return (
                              <div
                                key={role.name}
                                className={`flex items-center justify-between gap-3 border-b px-3 py-3 last:border-b-0 ${
                                  isActive
                                    ? isDarkMode ? 'border-slate-700 bg-indigo-500/10' : 'border-slate-200 bg-indigo-50/60'
                                    : isDarkMode ? 'border-slate-700' : 'border-slate-200'
                                }`}
                              >
                                <div className="flex min-w-0 items-start gap-3">
                                  <span className={`mt-0.5 grid h-8 w-8 place-items-center rounded-lg ${badgeClass}`}>
                                    <RoleIcon size={15} />
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold">{role.name}</p>
                                    <p className={`truncate text-xs ${textMutedClass}`}>{role.detail}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>{role.users} Users</span>
                                  <button type="button" className={`grid h-7 w-7 place-items-center rounded-md ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
                                    <EllipsisVertical size={14} />
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <p className={`mt-4 text-sm ${textMutedClass}`}>Showing 1 to 5 of 5 roles</p>
                      </section>

                      <section className={`rounded-xl border ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <div className={`border-b p-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <span className={`grid h-12 w-12 place-items-center rounded-xl ${isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'}`}>
                                <Shield size={22} />
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-[20px] font-semibold tracking-tight">Administrator</h4>
                                  <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'}`}>System Role</span>
                                </div>
                                <p className={`mt-1 text-sm ${textMutedClass}`}>Full system access and configuration</p>
                              </div>
                            </div>
                            <button type="button" className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                              <PenLine size={14} />
                              Edit Role
                            </button>
                          </div>

                          <div className="mt-4 flex items-center gap-5">
                            <button type="button" className="border-b-2 border-indigo-600 pb-2 text-sm font-semibold text-indigo-600">Permissions</button>
                            <button type="button" className={`border-b-2 border-transparent pb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Users (5)</button>
                            <button type="button" className={`border-b-2 border-transparent pb-2 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Role Details</button>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                              <h5 className="text-[20px] font-semibold tracking-tight">Permissions</h5>
                              <p className={`mt-1 text-sm ${textMutedClass}`}>Manage what this role can access and do.</p>
                            </div>
                            <button type="button" className={`inline-flex h-8 items-center gap-1 rounded-lg border px-3 text-xs font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                              Expand All
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-slate-50'}`}>
                                <p className="flex items-center gap-2 text-sm font-semibold"><KeyRound size={15} />Dashboard</p>
                                <ChevronUp size={15} />
                              </div>
                              <div className="px-4 py-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span>View dashboard</span>
                                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>Allowed</span>
                                </div>
                              </div>
                            </div>

                            <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-slate-50'}`}>
                                <p className="flex items-center gap-2 text-sm font-semibold"><Library size={15} />Books</p>
                                <ChevronDown size={15} />
                              </div>
                              <div className="space-y-0">
                                {['View books', 'Add new books', 'Edit books', 'Delete books'].map((item) => (
                                  <div key={item} className={`flex items-center justify-between border-b px-4 py-2.5 text-sm last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <span>{item}</span>
                                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>Allowed</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-slate-50'}`}>
                                <p className="flex items-center gap-2 text-sm font-semibold"><UserRound size={15} />Members</p>
                                <ChevronDown size={15} />
                              </div>
                              <div className="space-y-0">
                                {['View members', 'Add new members', 'Edit members', 'Delete members'].map((item) => (
                                  <div key={item} className={`flex items-center justify-between border-b px-4 py-2.5 text-sm last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <span>{item}</span>
                                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>Allowed</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                )}
              </section>
            ) : null}

            {activeSettingsMenu === 'Books & Borrowing' ? (
              <section className={`rounded-2xl border p-0 ${cardClass}`}>
                <div className="px-6 pt-4">
                  <div className={`flex items-center gap-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    {(['Book Settings', 'Borrowing Settings', 'Return Settings', 'Reservation Settings'] as const).map((tab) => {
                      const active = booksBorrowingTab === tab
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setBooksBorrowingTab(tab)}
                          className={`border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                            active
                              ? 'border-indigo-600 text-indigo-600'
                              : isDarkMode
                                ? 'border-transparent text-slate-300 hover:text-slate-100'
                                : 'border-transparent text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          {tab}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {booksBorrowingTab === 'Book Settings' ? (
                  <div className="space-y-4 p-6">
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <h4 className="text-[20px] font-semibold tracking-tight">Book Management</h4>
                        <p className={`mt-1 text-sm ${textMutedClass}`}>Configure general settings for managing books in the library.</p>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <InputField
                            label="Accession Number Format"
                            value={booksBorrowingSettings.accessionFormat}
                            onChange={(value) => updateBooksBorrowing('accessionFormat', value)}
                            isDarkMode={isDarkMode}
                            hint="Use (YYYY) for year and (#####) for number"
                          />
                          <SelectField
                            label="Default Language"
                            value={booksBorrowingSettings.defaultLanguage}
                            onChange={(value) => updateBooksBorrowing('defaultLanguage', value)}
                            options={languageSelectOptions}
                            isDarkMode={isDarkMode}
                          />
                          <SelectField
                            label="Default Condition"
                            value={booksBorrowingSettings.defaultCondition}
                            onChange={(value) => updateBooksBorrowing('defaultCondition', value)}
                            options={conditionOptions}
                            isDarkMode={isDarkMode}
                          />
                          <InputField
                            label="Default Shelf Location"
                            value={booksBorrowingSettings.defaultShelfLocation}
                            onChange={(value) => updateBooksBorrowing('defaultShelfLocation', value)}
                            isDarkMode={isDarkMode}
                          />
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
                            <div>
                              <p className="text-sm font-semibold">Allow Duplicate Books</p>
                              <p className={`text-xs ${textMutedClass}`}>Allow adding multiple copies of the same book.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.allowDuplicateBooks} onChange={(value) => updateBooksBorrowing('allowDuplicateBooks', value)} isDarkMode={isDarkMode} />
                          </div>
                          <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
                            <div>
                              <p className="text-sm font-semibold">Auto-generate Accession Number</p>
                              <p className={`text-xs ${textMutedClass}`}>Automatically generate accession number when adding books.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.autoGenerateAccessionNumber} onChange={(value) => updateBooksBorrowing('autoGenerateAccessionNumber', value)} isDarkMode={isDarkMode} />
                          </div>
                        </div>
                      </section>

                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <h4 className="text-[20px] font-semibold tracking-tight">Book Categories & Subjects</h4>
                        <p className={`mt-1 text-sm ${textMutedClass}`}>Manage how categories and subjects work.</p>
                        <div className="mt-4 space-y-0">
                          <div className={`flex items-center justify-between gap-3 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} border-b`}>
                            <div>
                              <p className="text-sm font-semibold">Allow Multiple Categories</p>
                              <p className={`text-xs ${textMutedClass}`}>A book can be assigned to multiple categories.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.allowMultipleCategories} onChange={(value) => updateBooksBorrowing('allowMultipleCategories', value)} isDarkMode={isDarkMode} />
                          </div>
                          <div className={`flex items-center justify-between gap-3 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} border-b`}>
                            <div>
                              <p className="text-sm font-semibold">Allow Multiple Subjects</p>
                              <p className={`text-xs ${textMutedClass}`}>A book can be assigned to multiple subjects.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.allowMultipleSubjects} onChange={(value) => updateBooksBorrowing('allowMultipleSubjects', value)} isDarkMode={isDarkMode} />
                          </div>
                          <div className="flex items-center justify-between gap-3 py-4">
                            <div>
                              <p className="text-sm font-semibold">Show on Public Catalog</p>
                              <p className={`text-xs ${textMutedClass}`}>Make newly added books visible on the public catalog.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.showOnPublicCatalog} onChange={(value) => updateBooksBorrowing('showOnPublicCatalog', value)} isDarkMode={isDarkMode} />
                          </div>
                        </div>
                      </section>
                    </div>

                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <h4 className="text-[20px] font-semibold tracking-tight">Circulation Rules (General)</h4>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Set general rules that apply to all book transactions.</p>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <InputField label="Maximum Books Per Member" value={booksBorrowingSettings.maxBooksPerMember} onChange={(value) => updateBooksBorrowing('maxBooksPerMember', value)} isDarkMode={isDarkMode} hint="Number of books a member can borrow at a time." />
                        <InputField label="Loan Period (Days)" value={booksBorrowingSettings.loanPeriodDays} onChange={(value) => updateBooksBorrowing('loanPeriodDays', value)} isDarkMode={isDarkMode} hint="Default number of days for borrowing books." />
                        <InputField label="Renewal Limit" value={booksBorrowingSettings.renewalLimit} onChange={(value) => updateBooksBorrowing('renewalLimit', value)} isDarkMode={isDarkMode} hint="Maximum number of times a book can be renewed." />
                        <InputField label="Renewal Period (Days)" value={booksBorrowingSettings.renewalPeriodDays} onChange={(value) => updateBooksBorrowing('renewalPeriodDays', value)} isDarkMode={isDarkMode} hint="Number of days added on each renewal." />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
                          <div>
                            <p className="text-sm font-semibold">Reserve When Unavailable</p>
                            <p className={`text-xs ${textMutedClass}`}>Allow members to reserve books that are currently borrowed.</p>
                          </div>
                          <SwitchField checked={booksBorrowingSettings.reserveWhenUnavailable} onChange={(value) => updateBooksBorrowing('reserveWhenUnavailable', value)} isDarkMode={isDarkMode} />
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
                          <div>
                            <p className="text-sm font-semibold">Auto Due Date Calculation</p>
                            <p className={`text-xs ${textMutedClass}`}>Automatically calculate due date based on loan period.</p>
                          </div>
                          <SwitchField checked={booksBorrowingSettings.autoDueDateCalculation} onChange={(value) => updateBooksBorrowing('autoDueDateCalculation', value)} isDarkMode={isDarkMode} />
                        </div>
                        <InputField label="Grace Period (Days)" value={booksBorrowingSettings.gracePeriodDays} onChange={(value) => updateBooksBorrowing('gracePeriodDays', value)} isDarkMode={isDarkMode} hint="Grace period before fine is applied." />
                        <SelectField label="Due Date Reminder" value={booksBorrowingSettings.dueDateReminder} onChange={(value) => updateBooksBorrowing('dueDateReminder', value)} options={reminderOptions} isDarkMode={isDarkMode} />
                      </div>
                    </section>

                    <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                      <p className="font-semibold">Default Values</p>
                      <p className="mt-1">These settings will be applied globally across the system. You can override some of these values for specific members or books when needed.</p>
                    </div>
                  </div>
                ) : booksBorrowingTab === 'Borrowing Settings' ? (
                  <div className="space-y-4 p-6">
                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <h4 className="text-[20px] font-semibold tracking-tight">Borrowing Settings</h4>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Configure rules and policies for borrowing books.</p>

                      <div className={`mt-4 rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <ClipboardCheck size={15} className="text-indigo-600" />
                          Loan Policy
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-4">
                          <InputField
                            label="Maximum Books Per Member"
                            value={booksBorrowingSettings.maxBooksPerMember}
                            onChange={(value) => updateBooksBorrowing('maxBooksPerMember', value)}
                            isDarkMode={isDarkMode}
                            hint="Total books a member can borrow."
                          />
                          <InputField
                            label="Loan Period (Days)"
                            value={booksBorrowingSettings.loanPeriodDays}
                            onChange={(value) => updateBooksBorrowing('loanPeriodDays', value)}
                            isDarkMode={isDarkMode}
                            hint="Default number of days for borrowing."
                          />
                          <InputField
                            label="Renewal Limit"
                            value={booksBorrowingSettings.renewalLimit}
                            onChange={(value) => updateBooksBorrowing('renewalLimit', value)}
                            isDarkMode={isDarkMode}
                            hint="Maximum number of times a book can be renewed."
                          />
                          <InputField
                            label="Renewal Period (Days)"
                            value={booksBorrowingSettings.renewalPeriodDays}
                            onChange={(value) => updateBooksBorrowing('renewalPeriodDays', value)}
                            isDarkMode={isDarkMode}
                            hint="Number of days added on each renewal."
                          />
                        </div>
                      </div>

                      <div className={`mt-3 rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <Shield size={15} className="text-indigo-600" />
                          Borrowing Restrictions
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">Allow Borrowing If Member Has Overdue</p>
                                <p className={`text-xs ${textMutedClass}`}>If enabled, members can borrow even with overdue books.</p>
                              </div>
                              <SwitchField
                                checked={booksBorrowingSettings.allowBorrowingIfOverdue}
                                onChange={(value) => updateBooksBorrowing('allowBorrowingIfOverdue', value)}
                                isDarkMode={isDarkMode}
                              />
                            </div>

                            <InputField
                              label="Minimum Days Between Loans"
                              value={booksBorrowingSettings.minimumDaysBetweenLoans}
                              onChange={(value) => updateBooksBorrowing('minimumDaysBetweenLoans', value)}
                              isDarkMode={isDarkMode}
                              hint="Minimum wait days before borrowing again."
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">Block Borrowing If Fine Exists</p>
                                <p className={`text-xs ${textMutedClass}`}>If enabled, members with fines cannot borrow.</p>
                              </div>
                              <SwitchField
                                checked={booksBorrowingSettings.blockBorrowingIfFineExists}
                                onChange={(value) => updateBooksBorrowing('blockBorrowingIfFineExists', value)}
                                isDarkMode={isDarkMode}
                              />
                            </div>

                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">Block Borrowing If Membership Expired</p>
                                <p className={`text-xs ${textMutedClass}`}>If enabled, expired members cannot borrow.</p>
                              </div>
                              <SwitchField
                                checked={booksBorrowingSettings.blockBorrowingIfMembershipExpired}
                                onChange={(value) => updateBooksBorrowing('blockBorrowingIfMembershipExpired', value)}
                                isDarkMode={isDarkMode}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`mt-3 rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <Wrench size={15} className="text-indigo-600" />
                          Additional Options
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">Auto Due Date Calculation</p>
                                <p className={`text-xs ${textMutedClass}`}>Automatically calculate due date based on loan period.</p>
                              </div>
                              <SwitchField
                                checked={booksBorrowingSettings.autoDueDateCalculation}
                                onChange={(value) => updateBooksBorrowing('autoDueDateCalculation', value)}
                                isDarkMode={isDarkMode}
                              />
                            </div>

                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">Allow Staff to Override Loan Policy</p>
                                <p className={`text-xs ${textMutedClass}`}>Allow staff to override loan rules when necessary.</p>
                              </div>
                              <SwitchField
                                checked={booksBorrowingSettings.allowStaffOverrideLoanPolicy}
                                onChange={(value) => updateBooksBorrowing('allowStaffOverrideLoanPolicy', value)}
                                isDarkMode={isDarkMode}
                              />
                            </div>
                          </div>

                          <div>
                            <SelectField
                              label="Due Date Reminder"
                              value={booksBorrowingSettings.dueDateReminder}
                              onChange={(value) => updateBooksBorrowing('dueDateReminder', value)}
                              options={reminderOptions}
                              isDarkMode={isDarkMode}
                            />
                            <p className={`mt-1 text-xs ${textMutedClass}`}>Send reminder before due date.</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                      <p className="flex items-center gap-2 font-semibold"><CircleAlert size={15} />Note</p>
                      <p className="mt-1">These borrowing settings will be applied to all members unless specific rules are set for individual member types.</p>
                    </div>
                  </div>
                ) : booksBorrowingTab === 'Return Settings' ? (
                  <div className="space-y-4 p-6">
                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <ClipboardCheck size={15} className="text-indigo-600" />
                        Return Policy
                      </p>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Configure rules for returning books.</p>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <InputField
                          label="Grace Period (Days)"
                          value={booksBorrowingSettings.returnGracePeriodDays}
                          onChange={(value) => updateBooksBorrowing('returnGracePeriodDays', value)}
                          isDarkMode={isDarkMode}
                          hint="Grace period before fine is applied."
                        />
                        <SelectField
                          label="Fine Calculation Method"
                          value={booksBorrowingSettings.fineCalculationMethod}
                          onChange={(value) => updateBooksBorrowing('fineCalculationMethod', value)}
                          options={fineCalculationOptions}
                          isDarkMode={isDarkMode}
                        />
                        <InputField
                          label="Fine Amount (Per Day)"
                          value={booksBorrowingSettings.fineAmountPerDay}
                          onChange={(value) => updateBooksBorrowing('fineAmountPerDay', value)}
                          isDarkMode={isDarkMode}
                          hint="Fine amount charged per overdue day."
                        />
                        <InputField
                          label="Maximum Fine Amount"
                          value={booksBorrowingSettings.maximumFineAmount}
                          onChange={(value) => updateBooksBorrowing('maximumFineAmount', value)}
                          isDarkMode={isDarkMode}
                          hint="Maximum fine charged per book."
                        />
                      </div>
                    </section>

                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <Shield size={15} className="text-indigo-600" />
                        Return Processing
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">Allow Book Return After Due Date</p>
                              <p className={`text-xs ${textMutedClass}`}>Members can return books even after the due date.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.allowBookReturnAfterDueDate} onChange={(value) => updateBooksBorrowing('allowBookReturnAfterDueDate', value)} isDarkMode={isDarkMode} />
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">Auto-Calculate Fine on Return</p>
                              <p className={`text-xs ${textMutedClass}`}>Automatically calculate fine when a book is returned.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.autoCalculateFineOnReturn} onChange={(value) => updateBooksBorrowing('autoCalculateFineOnReturn', value)} isDarkMode={isDarkMode} />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">Clear Reservation on Return</p>
                              <p className={`text-xs ${textMutedClass}`}>Remove member&apos;s reservation when the book is returned.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.clearReservationOnReturn} onChange={(value) => updateBooksBorrowing('clearReservationOnReturn', value)} isDarkMode={isDarkMode} />
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">Update Book Availability on Return</p>
                              <p className={`text-xs ${textMutedClass}`}>Make the book available immediately after return.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.updateBookAvailabilityOnReturn} onChange={(value) => updateBooksBorrowing('updateBookAvailabilityOnReturn', value)} isDarkMode={isDarkMode} />
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <Wrench size={15} className="text-indigo-600" />
                        Fine Handling
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">Allow Fine Waiver</p>
                              <p className={`text-xs ${textMutedClass}`}>Librarians can waive fines manually.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.allowFineWaiver} onChange={(value) => updateBooksBorrowing('allowFineWaiver', value)} isDarkMode={isDarkMode} />
                          </div>

                          <SelectField
                            label="Fine Rounding"
                            value={booksBorrowingSettings.fineRounding}
                            onChange={(value) => updateBooksBorrowing('fineRounding', value)}
                            options={fineRoundingOptions}
                            isDarkMode={isDarkMode}
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">Fine Payment Required for Return</p>
                              <p className={`text-xs ${textMutedClass}`}>Require fine payment before returning a book.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.finePaymentRequiredForReturn} onChange={(value) => updateBooksBorrowing('finePaymentRequiredForReturn', value)} isDarkMode={isDarkMode} />
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">Receipt on Fine Payment</p>
                              <p className={`text-xs ${textMutedClass}`}>Generate receipt when fine is paid.</p>
                            </div>
                            <SwitchField checked={booksBorrowingSettings.receiptOnFinePayment} onChange={(value) => updateBooksBorrowing('receiptOnFinePayment', value)} isDarkMode={isDarkMode} />
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                      <p className="flex items-center gap-2 font-semibold"><CircleAlert size={15} />Note</p>
                      <p className="mt-1">These return settings will be applied to all members unless specific rules are set for individual member types.</p>
                    </div>
                  </div>
                ) : booksBorrowingTab === 'Reservation Settings' ? (
                  <div className="space-y-4 p-6">
                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <ClipboardCheck size={15} className="text-indigo-600" />
                        Reservation Rules
                      </p>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Configure general rules for book reservations.</p>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-sm font-semibold">Allow Reservations</p>
                          <div className="mt-3">
                            <SwitchField checked={booksBorrowingSettings.allowReservations} onChange={(value) => updateBooksBorrowing('allowReservations', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-3 text-xs ${textMutedClass}`}>Enable members to reserve books.</p>
                        </div>
                        <InputField
                          label="Maximum Reservations Per Member"
                          value={booksBorrowingSettings.maxReservationsPerMember}
                          onChange={(value) => updateBooksBorrowing('maxReservationsPerMember', value)}
                          isDarkMode={isDarkMode}
                          hint="Maximum number of active reservations."
                        />
                        <InputField
                          label="Reservation Expiry (Days)"
                          value={booksBorrowingSettings.reservationExpiryDays}
                          onChange={(value) => updateBooksBorrowing('reservationExpiryDays', value)}
                          isDarkMode={isDarkMode}
                          hint="Days to hold a reserved book."
                        />
                        <InputField
                          label="Notify Before Expiry (Hours)"
                          value={booksBorrowingSettings.notifyBeforeExpiryHours}
                          onChange={(value) => updateBooksBorrowing('notifyBeforeExpiryHours', value)}
                          isDarkMode={isDarkMode}
                          hint="Send reminder before reservation expires."
                        />
                      </div>
                    </section>

                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <Shield size={15} className="text-indigo-600" />
                        Reservation Conditions
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">Only Allow Reservation if No Copy Available</p>
                            <SwitchField checked={booksBorrowingSettings.onlyAllowReservationIfNoCopyAvailable} onChange={(value) => updateBooksBorrowing('onlyAllowReservationIfNoCopyAvailable', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-2 text-xs ${textMutedClass}`}>Members can reserve only when all copies are currently borrowed.</p>
                        </div>
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">Allow Reservation on Lost/Damaged Copies</p>
                            <SwitchField checked={booksBorrowingSettings.allowReservationOnLostDamagedCopies} onChange={(value) => updateBooksBorrowing('allowReservationOnLostDamagedCopies', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-2 text-xs ${textMutedClass}`}>Allow reservation even if some copies are marked lost or damaged.</p>
                        </div>
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">Allow Reservation on Reference Books</p>
                            <SwitchField checked={booksBorrowingSettings.allowReservationOnReferenceBooks} onChange={(value) => updateBooksBorrowing('allowReservationOnReferenceBooks', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-2 text-xs ${textMutedClass}`}>Enable reservation for reference (non-circulating) books.</p>
                        </div>
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">Allow Reservation on Upcoming Books</p>
                            <SwitchField checked={booksBorrowingSettings.allowReservationOnUpcomingBooks} onChange={(value) => updateBooksBorrowing('allowReservationOnUpcomingBooks', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-2 text-xs ${textMutedClass}`}>Allow reservation for books that will be available in future.</p>
                        </div>
                      </div>
                    </section>

                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <UsersRound size={15} className="text-indigo-600" />
                        Reservation Queue
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <SelectField
                          label="Queue Type"
                          value={booksBorrowingSettings.queueType}
                          onChange={(value) => updateBooksBorrowing('queueType', value)}
                          options={queueTypeOptions}
                          isDarkMode={isDarkMode}
                        />
                        <div>
                          <p className="text-sm font-semibold">Automatically Cancel Reservation</p>
                          <div className="mt-3">
                            <SwitchField checked={booksBorrowingSettings.autoCancelReservation} onChange={(value) => updateBooksBorrowing('autoCancelReservation', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-3 text-xs ${textMutedClass}`}>Cancel reservation if member doesn&apos;t collect the book within the expiry period.</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Next Reservation After Cancellation</p>
                          <div className="mt-3">
                            <SwitchField checked={booksBorrowingSettings.nextReservationAfterCancellation} onChange={(value) => updateBooksBorrowing('nextReservationAfterCancellation', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-3 text-xs ${textMutedClass}`}>Automatically assign the next reservation in the queue.</p>
                        </div>
                        <div>
                          <SelectField
                            label="Queue Priority"
                            value={booksBorrowingSettings.queuePriority}
                            onChange={(value) => updateBooksBorrowing('queuePriority', value)}
                            options={queuePriorityOptions}
                            isDarkMode={isDarkMode}
                          />
                          <p className={`mt-1 text-xs ${textMutedClass}`}>Prioritize reservations by date or member type.</p>
                        </div>
                      </div>
                    </section>

                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <Bell size={15} className="text-indigo-600" />
                        Notifications
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">Reservation Confirmation</p>
                            <SwitchField checked={booksBorrowingSettings.reservationConfirmationNotification} onChange={(value) => updateBooksBorrowing('reservationConfirmationNotification', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-2 text-xs ${textMutedClass}`}>Notify members when their reservation is confirmed.</p>
                        </div>
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">Reservation Expiry Reminder</p>
                            <SwitchField checked={booksBorrowingSettings.reservationExpiryReminderNotification} onChange={(value) => updateBooksBorrowing('reservationExpiryReminderNotification', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-2 text-xs ${textMutedClass}`}>Send reminder before reservation expires.</p>
                        </div>
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">Reservation Cancellation Alert</p>
                            <SwitchField checked={booksBorrowingSettings.reservationCancellationAlertNotification} onChange={(value) => updateBooksBorrowing('reservationCancellationAlertNotification', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-2 text-xs ${textMutedClass}`}>Notify members when their reservation is cancelled.</p>
                        </div>
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">Book Ready Notification</p>
                            <SwitchField checked={booksBorrowingSettings.bookReadyNotification} onChange={(value) => updateBooksBorrowing('bookReadyNotification', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-2 text-xs ${textMutedClass}`}>Notify members when the reserved book is ready to collect.</p>
                        </div>
                      </div>
                    </section>

                    <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                      <p className="flex items-center gap-2 font-semibold"><CircleAlert size={15} />Note</p>
                      <p className="mt-1">These reservation settings will be applied to all members unless specific rules are set for individual member types.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <section className={`rounded-xl border p-6 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <h4 className="text-[20px] font-semibold tracking-tight">{booksBorrowingTab}</h4>
                      <p className={`mt-2 text-sm ${textMutedClass}`}>This section is ready next. We can implement it with the same detail level as Book Settings.</p>
                    </section>
                  </div>
                )}
              </section>
            ) : null}

            {activeSettingsMenu === 'Membership & Penalties' ? (
              <section className={`rounded-2xl border p-0 ${cardClass}`}>
                <div className="px-6 pt-4">
                  <div className={`flex items-center gap-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <button
                      type="button"
                      onClick={() => setMembershipPenaltyTab('Membership Types')}
                      className={`border-b-2 px-1 pb-3 text-sm font-semibold ${membershipPenaltyTab === 'Membership Types' ? 'border-indigo-600 text-indigo-600' : isDarkMode ? 'border-transparent text-slate-300' : 'border-transparent text-slate-700'}`}
                    >
                      Membership Types
                    </button>
                    <button
                      type="button"
                      onClick={() => setMembershipPenaltyTab('Penalty Rules')}
                      className={`border-b-2 px-1 pb-3 text-sm font-semibold ${membershipPenaltyTab === 'Penalty Rules' ? 'border-indigo-600 text-indigo-600' : isDarkMode ? 'border-transparent text-slate-300' : 'border-transparent text-slate-700'}`}
                    >
                      Penalty Rules
                    </button>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  {membershipPenaltyTab === 'Membership Types' ? (
                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 text-sm font-semibold"><UsersRound size={15} className="text-indigo-600" />Membership Types</p>
                        <p className={`mt-1 text-sm ${textMutedClass}`}>Manage different membership types and their borrowing privileges.</p>
                      </div>
                      <button type="button" className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                        <Plus size={14} />
                        Add Membership Type
                      </button>
                    </div>

                    <div className={`mt-4 overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                      <div className={`grid grid-cols-[1.1fr_1.6fr_0.7fr_0.9fr_0.8fr_0.6fr] gap-3 border-b px-4 py-3 text-[13px] font-semibold ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                        <p>Membership Type</p>
                        <p>Description</p>
                        <p>Max Books</p>
                        <p>Loan Period (Days)</p>
                        <p>Fine Exempt</p>
                        <p>Actions</p>
                      </div>

                      {membershipTypeRows.map((row) => {
                        const Icon = row.icon
                        const chipColor =
                          row.color === 'violet'
                            ? isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'
                            : row.color === 'emerald'
                              ? isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'
                              : row.color === 'amber'
                                ? isDarkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'
                                : row.color === 'blue'
                                  ? isDarkMode ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'
                                  : isDarkMode ? 'bg-slate-600 text-slate-200' : 'bg-slate-100 text-slate-700'

                        return (
                          <div key={row.type} className={`grid grid-cols-[1.1fr_1.6fr_0.7fr_0.9fr_0.8fr_0.6fr] items-center gap-3 border-b px-4 py-3 last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <div className="flex items-center gap-2">
                              <span className={`grid h-8 w-8 place-items-center rounded-lg ${chipColor}`}><Icon size={14} /></span>
                              <span className="text-sm font-semibold">{row.type}</span>
                            </div>
                            <p className={`text-sm ${textMutedClass}`}>{row.description}</p>
                            <p className="text-sm">{row.maxBooks}</p>
                            <p className="text-sm">{row.loanPeriodDays}</p>
                            <p>
                              <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${row.fineExempt ? isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700' : isDarkMode ? 'bg-slate-600 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
                                {row.fineExempt ? 'Yes' : 'No'}
                              </span>
                            </p>
                            <div className="flex items-center gap-2">
                              <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-indigo-300 hover:bg-slate-800' : 'border-slate-200 text-indigo-600 hover:bg-indigo-50'}`}><Pencil size={14} /></button>
                              <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-rose-300 hover:bg-slate-800' : 'border-slate-200 text-rose-600 hover:bg-rose-50'}`}><Trash2 size={14} /></button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <p className={`mt-3 text-sm ${textMutedClass}`}>Showing 1 to 5 of 5 types</p>
                    </section>
                  ) : (
                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="flex items-center gap-2 text-sm font-semibold"><TriangleAlert size={15} className="text-indigo-600" />Penalty Rules</p>
                          <p className={`mt-1 text-sm ${textMutedClass}`}>Define fine rules for overdue, lost or damaged materials.</p>
                        </div>
                        <button type="button" className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                          <Plus size={14} />
                          Add Penalty Rule
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="relative w-full max-w-[420px]">
                          <Search size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${textMutedClass}`} />
                          <input
                            placeholder="Search penalty rules..."
                            className={`h-10 w-full rounded-xl border px-3 pr-9 text-[14px] outline-none transition-colors ${
                              isDarkMode
                                ? 'border-slate-700 bg-[#0b1738] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
                                : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
                            }`}
                          />
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                          <div className="w-[190px]">
                            <SelectField label="" value="All Fine Types" onChange={() => undefined} options={[{ value: 'All Fine Types', label: 'All Fine Types' }]} isDarkMode={isDarkMode} />
                          </div>
                          <button type="button" className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                            <Settings2 size={14} />
                            Filters
                          </button>
                        </div>
                      </div>

                      <div className={`mt-4 overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className={`grid grid-cols-[0.35fr_1.2fr_1fr_0.9fr_1fr_1fr_0.9fr_0.8fr] gap-3 border-b px-4 py-3 text-[13px] font-semibold ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                          <p>#</p><p>Fine Type</p><p>Apply Fine Per</p><p>Fine Amount</p><p>Grace Period (Days)</p><p>Max Fine Amount</p><p>Status</p><p>Actions</p>
                        </div>
                        {penaltyRuleListRows.map((row, idx) => {
                          const Icon = row.icon
                          const iconBg =
                            row.color === 'amber'
                              ? isDarkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'
                              : row.color === 'rose'
                                ? isDarkMode ? 'bg-rose-500/20 text-rose-200' : 'bg-rose-100 text-rose-700'
                                : row.color === 'violet'
                                  ? isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'
                                  : row.color === 'orange'
                                    ? isDarkMode ? 'bg-orange-500/20 text-orange-200' : 'bg-orange-100 text-orange-700'
                                    : isDarkMode ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'
                          return (
                            <div key={`${row.fineType}-${idx}`} className={`grid grid-cols-[0.35fr_1.2fr_1fr_0.9fr_1fr_1fr_0.9fr_0.8fr] items-center gap-3 border-b px-4 py-3 last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <p className="text-sm">{idx + 1}</p>
                              <div className="flex items-center gap-2"><span className={`grid h-8 w-8 place-items-center rounded-lg ${iconBg}`}><Icon size={14} /></span><span className="text-sm font-semibold">{row.fineType}</span></div>
                              <p className="text-sm">{row.applyFinePer}</p>
                              <p className="text-sm">{row.fineAmount}</p>
                              <p className="text-sm">{row.gracePeriod}</p>
                              <p className="text-sm">{row.maxFineAmount}</p>
                              <p><span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${row.status === 'Active' ? isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700' : isDarkMode ? 'bg-slate-600 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>{row.status}</span></p>
                              <div className="flex items-center gap-2">
                                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-indigo-300 hover:bg-slate-800' : 'border-slate-200 text-indigo-600 hover:bg-indigo-50'}`}><Pencil size={14} /></button>
                                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-rose-300 hover:bg-slate-800' : 'border-slate-200 text-rose-600 hover:bg-rose-50'}`}><Trash2 size={14} /></button>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <p className={`text-sm ${textMutedClass}`}>Showing 1 to 5 of 5 rules</p>
                        <div className="flex items-center gap-2">
                          <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}><ChevronLeft size={14} /></button>
                          <button type="button" className="grid h-8 min-w-8 place-items-center rounded-lg bg-indigo-600 px-2 text-sm font-semibold text-white">1</button>
                          <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}><ChevronRight size={14} /></button>
                        </div>
                      </div>
                    </section>
                  )}

                  <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                    <p className="flex items-center gap-2 font-semibold"><CircleAlert size={15} />Note</p>
                    <p className="mt-1">These membership and penalty settings will be applied to all members unless specific rules are set for individual member types.</p>
                  </div>
                </div>
              </section>
            ) : null}

            {activeSettingsMenu === 'Notifications' ? (
              <section className={`rounded-2xl border p-0 ${cardClass}`}>
                <div className="px-6 pt-4">
                  <div className={`flex items-center gap-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    {(['Notification Settings', 'Notification Templates', 'Delivery Channels'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setNotificationsTab(tab)}
                        className={`border-b-2 px-1 pb-3 text-sm font-semibold ${notificationsTab === tab ? 'border-indigo-600 text-indigo-600' : isDarkMode ? 'border-transparent text-slate-300' : 'border-transparent text-slate-700'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {notificationsTab === 'Notification Settings' ? (
                  <div className="space-y-4 p-6">
                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold"><Settings2 size={15} className="text-indigo-600" />General Notification Settings</p>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Configure how and when notifications are sent.</p>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-sm font-semibold">Enable Notifications</p>
                          <div className="mt-3">
                            <SwitchField checked={notificationSettings.enableNotifications} onChange={(value) => updateNotificationSettings('enableNotifications', value)} isDarkMode={isDarkMode} />
                          </div>
                          <p className={`mt-2 text-xs ${textMutedClass}`}>Enable or disable all system notifications.</p>
                        </div>
                        <SelectField label="Default Language" value={notificationSettings.defaultLanguage} onChange={(value) => updateNotificationSettings('defaultLanguage', value)} options={notificationLanguageOptions} isDarkMode={isDarkMode} />
                        <SelectField label="Date Format" value={notificationSettings.dateFormat} onChange={(value) => updateNotificationSettings('dateFormat', value)} options={notificationDateFormatOptions} isDarkMode={isDarkMode} />
                        <SelectField label="Time Format" value={notificationSettings.timeFormat} onChange={(value) => updateNotificationSettings('timeFormat', value)} options={notificationTimeFormatOptions} isDarkMode={isDarkMode} />
                      </div>
                    </section>

                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold"><Bell size={15} className="text-indigo-600" />Notification Preferences</p>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Choose which events should trigger notifications.</p>

                      <div className={`mt-4 overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className={`grid grid-cols-[1.9fr_0.65fr_0.65fr_0.65fr_0.65fr_0.45fr] gap-3 border-b px-4 py-3 text-[13px] font-semibold ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                          <p>Notification Type</p><p>In-App</p><p>Email</p><p>SMS</p><p>Push</p><p>Actions</p>
                        </div>
                        {notificationPreferences.map((row) => {
                          const RowIcon = row.icon
                          const iconBg =
                            row.color === 'violet'
                              ? isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'
                              : row.color === 'amber'
                                ? isDarkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'
                                : row.color === 'emerald'
                                  ? isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'
                                  : row.color === 'blue'
                                    ? isDarkMode ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'
                                    : isDarkMode ? 'bg-orange-500/20 text-orange-200' : 'bg-orange-100 text-orange-700'
                          return (
                            <div key={row.key} className={`grid grid-cols-[1.9fr_0.65fr_0.65fr_0.65fr_0.65fr_0.45fr] items-center gap-3 border-b px-4 py-3 last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <div className="flex items-center gap-3">
                                <span className={`grid h-8 w-8 place-items-center rounded-lg ${iconBg}`}><RowIcon size={14} /></span>
                                <div>
                                  <p className="text-sm font-semibold">{row.label}</p>
                                  <p className={`text-xs ${textMutedClass}`}>{row.description}</p>
                                </div>
                              </div>
                              <SwitchField checked={row.inApp} onChange={(value) => updateNotificationPreferenceChannel(row.key, 'inApp', value)} isDarkMode={isDarkMode} />
                              <SwitchField checked={row.email} onChange={(value) => updateNotificationPreferenceChannel(row.key, 'email', value)} isDarkMode={isDarkMode} />
                              <SwitchField checked={row.sms} onChange={(value) => updateNotificationPreferenceChannel(row.key, 'sms', value)} isDarkMode={isDarkMode} />
                              <SwitchField checked={row.push} onChange={(value) => updateNotificationPreferenceChannel(row.key, 'push', value)} isDarkMode={isDarkMode} />
                              <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-indigo-300 hover:bg-slate-800' : 'border-slate-200 text-indigo-600 hover:bg-indigo-50'}`}><Pencil size={14} /></button>
                            </div>
                          )
                        })}
                      </div>
                      <button type="button" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                        <Plus size={14} />
                        Add Custom Notification
                      </button>
                    </section>

                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold"><Clock3 size={15} className="text-indigo-600" />Quiet Hours</p>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Set the time range when notifications should not be sent.</p>
                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-sm font-semibold">Enable Quiet Hours</p>
                          <p className={`mt-1 text-xs ${textMutedClass}`}>Disable non-urgent notifications during this time.</p>
                          <div className="mt-2"><SwitchField checked={notificationSettings.enableQuietHours} onChange={(value) => updateNotificationSettings('enableQuietHours', value)} isDarkMode={isDarkMode} /></div>
                        </div>
                        <SelectField label="Start Time" value={notificationSettings.quietStartTime} onChange={(value) => updateNotificationSettings('quietStartTime', value)} options={quietTimeOptions} isDarkMode={isDarkMode} />
                        <SelectField label="End Time" value={notificationSettings.quietEndTime} onChange={(value) => updateNotificationSettings('quietEndTime', value)} options={quietTimeOptions} isDarkMode={isDarkMode} />
                        <SelectField label="Timezone" value={notificationSettings.timezone} onChange={(value) => updateNotificationSettings('timezone', value)} options={timezoneOptions} isDarkMode={isDarkMode} />
                      </div>
                    </section>

                    <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                      <p className="flex items-center gap-2 font-semibold"><CircleAlert size={15} />Note</p>
                      <p className="mt-1">Notifications marked as urgent will still be sent even during quiet hours.</p>
                    </div>
                  </div>
                ) : notificationsTab === 'Notification Templates' ? (
                  <div className="space-y-4 p-6">
                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-[320px]">
                            <Search size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${textMutedClass}`} />
                            <input
                              value={templateSearch}
                              onChange={(event) => setTemplateSearch(event.target.value)}
                              placeholder="Search templates..."
                              className={`h-10 w-full rounded-xl border px-3 pr-9 text-[14px] outline-none transition-colors ${
                                isDarkMode
                                  ? 'border-slate-700 bg-[#0b1738] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
                                  : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-emerald-500'
                              }`}
                            />
                          </div>
                          <div className="w-[220px]">
                            <SelectField label="" value={templateTypeFilter} onChange={setTemplateTypeFilter} options={templateTypeOptions} isDarkMode={isDarkMode} />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                            <Settings2 size={14} />
                            Filters
                          </button>
                          <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
                            <Plus size={14} />
                            Create Template
                          </button>
                        </div>
                      </div>

                      <div className={`mt-4 overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className={`grid grid-cols-[1.5fr_1.1fr_0.8fr_1.7fr_0.9fr_0.7fr_0.7fr] gap-3 border-b px-4 py-3 text-[13px] font-semibold ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                          <p>Template Name</p><p>Notification Type</p><p>Channels</p><p>Subject</p><p>Last Updated</p><p>Status</p><p>Actions</p>
                        </div>
                        {filteredNotificationTemplates.map((row) => {
                          const RowIcon = row.icon
                          const iconBg =
                            row.color === 'violet'
                              ? isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'
                              : row.color === 'amber'
                                ? isDarkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'
                                : row.color === 'emerald'
                                  ? isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'
                                  : row.color === 'blue'
                                    ? isDarkMode ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'
                                    : row.color === 'orange'
                                      ? isDarkMode ? 'bg-orange-500/20 text-orange-200' : 'bg-orange-100 text-orange-700'
                                      : row.color === 'rose'
                                        ? isDarkMode ? 'bg-rose-500/20 text-rose-200' : 'bg-rose-100 text-rose-700'
                                        : isDarkMode ? 'bg-cyan-500/20 text-cyan-200' : 'bg-cyan-100 text-cyan-700'
                          return (
                            <div key={row.key} className={`grid grid-cols-[1.5fr_1.1fr_0.8fr_1.7fr_0.9fr_0.7fr_0.7fr] items-center gap-3 border-b px-4 py-3 last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <div className="flex items-center gap-3">
                                <span className={`grid h-9 w-9 place-items-center rounded-lg ${iconBg}`}><RowIcon size={15} /></span>
                                <div>
                                  <p className="text-sm font-semibold">{row.templateName}</p>
                                  <p className={`text-xs ${textMutedClass}`}>{row.description}</p>
                                </div>
                              </div>
                              <p><span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${iconBg}`}>{row.notificationType}</span></p>
                              <div className="flex items-center gap-1">
                                {row.channels.includes('email') ? <span className={`grid h-6 w-6 place-items-center rounded-md ${isDarkMode ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}><Mail size={12} /></span> : null}
                                {row.channels.includes('sms') ? <span className={`grid h-6 w-6 place-items-center rounded-md ${isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}><MessageCircle size={12} /></span> : null}
                                {row.channels.includes('push') ? <span className={`grid h-6 w-6 place-items-center rounded-md ${isDarkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'}`}><Bell size={12} /></span> : null}
                              </div>
                              <p className="text-sm">{row.subject}</p>
                              <div>
                                <p className="text-sm font-semibold">{row.lastUpdated}</p>
                                <p className={`text-xs ${textMutedClass}`}>by {row.updatedBy}</p>
                              </div>
                              <SwitchField checked={row.enabled} onChange={(value) => updateTemplateEnabled(row.key, value)} isDarkMode={isDarkMode} />
                              <div className="flex items-center gap-2">
                                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-indigo-300 hover:bg-slate-800' : 'border-slate-200 text-indigo-600 hover:bg-indigo-50'}`}><Pencil size={14} /></button>
                                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-rose-300 hover:bg-slate-800' : 'border-slate-200 text-rose-600 hover:bg-rose-50'}`}><Trash2 size={14} /></button>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <p className={`text-sm ${textMutedClass}`}>Showing 1 to {filteredNotificationTemplates.length} of {filteredNotificationTemplates.length} templates</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}><ChevronLeft size={14} /></button>
                            <button type="button" className="grid h-8 min-w-8 place-items-center rounded-lg bg-indigo-600 px-2 text-sm font-semibold text-white">1</button>
                            <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}><ChevronRight size={14} /></button>
                          </div>
                          <div className="w-[120px]">
                            <SelectField label="" value={templatePageSize} onChange={setTemplatePageSize} options={templatePageSizeOptions} isDarkMode={isDarkMode} />
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                      <p className="flex items-center gap-2 font-semibold"><CircleAlert size={15} />Note</p>
                      <p className="mt-1">You can use variables in templates like {'{{member_name}}'}, {'{{title}}'}, {'{{due_date}}'}, {'{{fine_amount}}'}, {'{{library_name}}'}.</p>
                      <p className="mt-1">These will be replaced with actual values when the notification is sent.</p>
                    </div>
                  </div>
                ) : notificationsTab === 'Delivery Channels' ? (
                  <div className="space-y-4 p-6">
                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="flex items-center gap-2 text-sm font-semibold"><Bell size={15} className="text-indigo-600" />Configured Channels</p>
                          <p className={`mt-1 text-sm ${textMutedClass}`}>Enable and configure different delivery channels for sending notifications.</p>
                        </div>
                        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
                          <Plus size={14} />
                          Add Channel
                        </button>
                      </div>

                      <div className={`mt-4 overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className={`grid grid-cols-[1fr_1.4fr_0.7fr_0.6fr_0.9fr_0.6fr] gap-3 border-b px-4 py-3 text-[13px] font-semibold ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                          <p>Channel</p><p>Description</p><p>Status</p><p>Default</p><p>Last Tested</p><p>Actions</p>
                        </div>
                        {deliveryChannels.map((row) => {
                          const RowIcon = row.icon
                          const iconBg =
                            row.color === 'violet'
                              ? isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'
                              : row.color === 'emerald'
                                ? isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'
                                : row.color === 'blue'
                                  ? isDarkMode ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'
                                  : row.color === 'amber'
                                    ? isDarkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'
                                    : isDarkMode ? 'bg-green-500/20 text-green-200' : 'bg-green-100 text-green-700'
                          return (
                            <div key={row.key} className={`grid grid-cols-[1fr_1.4fr_0.7fr_0.6fr_0.9fr_0.6fr] items-center gap-3 border-b px-4 py-3 last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <div className="flex items-center gap-2">
                                <span className={`grid h-8 w-8 place-items-center rounded-lg ${iconBg}`}><RowIcon size={14} /></span>
                                <span className="text-sm font-semibold">{row.channel}</span>
                              </div>
                              <p className={`text-sm ${textMutedClass}`}>{row.description}</p>
                              <p><span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${row.status === 'Active' ? isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700' : isDarkMode ? 'bg-slate-600 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>{row.status}</span></p>
                              <p className="text-sm font-semibold">{row.isDefault ? '★' : '–'}</p>
                              <p className="text-sm">{row.lastTested}</p>
                              <div className="flex items-center gap-2">
                                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-indigo-300 hover:bg-slate-800' : 'border-slate-200 text-indigo-600 hover:bg-indigo-50'}`}><Pencil size={14} /></button>
                                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-rose-300 hover:bg-slate-800' : 'border-slate-200 text-rose-600 hover:bg-rose-50'}`}><Trash2 size={14} /></button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>

                    <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold"><RotateCcw size={15} className="text-indigo-600" />Fallback Order</p>
                        <p className={`mt-1 text-sm ${textMutedClass}`}>Set the order in which notifications will be sent if the primary channel fails.</p>
                        <div className="mt-4 space-y-2">
                          {['Email', 'In-App', 'SMS'].map((item, idx) => (
                            <div key={item} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-white'}`}>
                              <div className="flex items-center gap-3">
                                <span className="text-sm">⋮⋮</span>
                                <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>{idx + 1}</span>
                                <span className="text-sm font-semibold">{item}</span>
                              </div>
                              <button type="button" className={`text-sm ${textMutedClass}`}>×</button>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-indigo-500/30 bg-indigo-500/10' : 'border-indigo-200 bg-indigo-50'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold"><CircleAlert size={15} className="text-indigo-600" />About Delivery Channels</p>
                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>The default channel will be used first to send notifications. If it fails, the system will try the channels in the fallback order.</p>
                        <p className={`mt-3 text-sm ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Make sure to test each channel after configuration to ensure notifications are delivered successfully.</p>
                        <button type="button" className={`mt-4 inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${isDarkMode ? 'border-indigo-400 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-100'}`}>
                          <Wrench size={14} />
                          Test All Channels
                        </button>
                      </section>
                    </div>

                    <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                      <p className="flex items-center gap-2 font-semibold"><CircleAlert size={15} />Note</p>
                      <p className="mt-1">Changes to delivery channels will apply to all notification templates and preferences.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <section className={`rounded-xl border p-6 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <h4 className="text-[20px] font-semibold tracking-tight">{notificationsTab}</h4>
                      <p className={`mt-2 text-sm ${textMutedClass}`}>This section is ready next. We can implement templates and channel gateways in the same style.</p>
                    </section>
                  </div>
                )}
              </section>
            ) : null}

            {activeSettingsMenu === 'Email & SMTP' ? (
              <section className={`rounded-2xl border p-0 ${cardClass}`}>
                <div className="p-6">
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_500px]">
                    <div className="space-y-4">
                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold"><Mail size={15} className="text-indigo-600" />SMTP Configuration</p>
                        <p className={`mt-1 text-sm ${textMutedClass}`}>Configure your SMTP server details to send emails.</p>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <InputField label="SMTP Host" value={smtpHost} onChange={setSmtpHost} isDarkMode={isDarkMode} />
                          <InputField label="Port" value={smtpPort} onChange={setSmtpPort} isDarkMode={isDarkMode} />
                        </div>

                        <div className="mt-4">
                          <InputField label="Username" value={smtpUsername} onChange={setSmtpUsername} isDarkMode={isDarkMode} />
                        </div>

                        <div className="mt-4">
                          <InputField label="Password" value={smtpPassword} onChange={setSmtpPassword} isDarkMode={isDarkMode} rightIcon={Eye} />
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <SelectField label="Encryption" value={smtpEncryption} onChange={setSmtpEncryption} options={[{ value: 'TLS', label: 'TLS' }, { value: 'SSL', label: 'SSL' }, { value: 'None', label: 'None' }]} isDarkMode={isDarkMode} />
                          <div className="flex items-center gap-3 pt-7">
                            <input id="smtp-auth" type="checkbox" checked={smtpUseAuth} onChange={(event) => setSmtpUseAuth(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-600" />
                            <label htmlFor="smtp-auth" className="text-sm font-semibold">Use Authentication</label>
                          </div>
                        </div>

                        <div className={`mt-6 border-t pt-5 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                          <p className="flex items-center gap-2 text-sm font-semibold"><UserCog size={15} className="text-indigo-600" />Sender Information</p>
                          <p className={`mt-1 text-sm ${textMutedClass}`}>Set the default sender details for all outgoing emails.</p>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <InputField label="Sender Name" value={senderName} onChange={setSenderName} isDarkMode={isDarkMode} />
                            <InputField label="Sender Email" value={senderEmail} onChange={setSenderEmail} isDarkMode={isDarkMode} />
                          </div>
                          <div className="mt-4">
                            <InputField label="Reply-To Email (Optional)" value={replyToEmail} onChange={setReplyToEmail} isDarkMode={isDarkMode} hint="Replies to emails will be sent to this address." />
                          </div>
                        </div>
                      </section>

                      <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                        <p className="flex items-center gap-2 font-semibold"><CircleAlert size={15} />Note</p>
                        <p className="mt-1">Ensure your SMTP credentials are correct. Incorrect settings may prevent emails from being sent.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold"><CircleAlert size={15} className="text-emerald-600" />SMTP Connection Status</p>
                        <div className="mt-3 inline-flex rounded-md bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Connected</div>
                        <p className={`mt-2 text-sm ${textMutedClass}`}>Last tested: May 12, 2024 10:30 AM</p>
                        <button type="button" className={`mt-4 inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                          <RotateCcw size={14} />
                          Test Connection Again
                        </button>
                      </section>

                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold"><Send size={15} className="text-indigo-600" />Test Email</p>
                        <p className={`mt-1 text-sm ${textMutedClass}`}>Send a test email to verify your SMTP configuration.</p>
                        <div className="mt-4">
                          <InputField label="Send Test Email To" value={testEmailTo} onChange={setTestEmailTo} isDarkMode={isDarkMode} />
                        </div>
                        <button type="button" className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
                          <Send size={14} />
                          Send Test Email
                        </button>
                      </section>

                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold"><Settings2 size={15} className="text-indigo-600" />Email Features</p>
                        <div className="mt-4 space-y-4">
                          <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <div><p className="text-sm font-semibold">Enable Email Notifications</p><p className={`text-xs ${textMutedClass}`}>Enable sending emails for notifications and alerts.</p></div>
                            <SwitchField checked={emailNotificationsEnabled} onChange={setEmailNotificationsEnabled} isDarkMode={isDarkMode} />
                          </div>
                          <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <div><p className="text-sm font-semibold">Queue Emails</p><p className={`text-xs ${textMutedClass}`}>Store emails in queue if SMTP is temporarily unavailable.</p></div>
                            <SwitchField checked={queueEmailsEnabled} onChange={setQueueEmailsEnabled} isDarkMode={isDarkMode} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div><p className="text-sm font-semibold">Retry Failed Emails</p><p className={`text-xs ${textMutedClass}`}>Automatically retry failed emails.</p></div>
                            <SwitchField checked={retryFailedEmailsEnabled} onChange={setRetryFailedEmailsEnabled} isDarkMode={isDarkMode} />
                          </div>
                        </div>
                      </section>

                      <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                        <p className="flex items-center gap-2 text-sm font-semibold"><Mail size={15} className="text-indigo-600" />Email Templates</p>
                        <p className={`mt-1 text-sm ${textMutedClass}`}>Manage and customize email templates for different notifications.</p>
                        <button type="button" className={`mt-4 inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                          Go to Templates
                          <ChevronRight size={14} />
                        </button>
                      </section>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {activeSettingsMenu === 'Security' ? (
              <section className={`rounded-2xl border p-0 ${cardClass}`}>
                <div className="px-6 pt-4">
                  <div className={`flex items-center gap-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    {(['Authentication', 'Password Policy', 'Session Management', 'IP Restrictions', 'Other Settings'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setSecurityTab(tab)}
                        className={`border-b-2 px-1 pb-3 text-sm font-semibold ${securityTab === tab ? 'border-indigo-600 text-indigo-600' : isDarkMode ? 'border-transparent text-slate-300' : 'border-transparent text-slate-700'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {securityTab === 'Authentication' ? (
                  <div className="space-y-4 p-6">
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                      <div className="space-y-4">
                        <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="flex items-center gap-2 text-sm font-semibold"><Shield size={15} className="text-indigo-600" />Two-Factor Authentication (2FA)</p>
                              <p className={`mt-1 text-sm ${textMutedClass}`}>Add an extra layer of security by requiring a verification code in addition to password.</p>
                            </div>
                            <SwitchField checked={enable2FA} onChange={setEnable2FA} isDarkMode={isDarkMode} />
                          </div>

                          <div className={`mt-4 rounded-lg border p-3 ${isDarkMode ? 'border-slate-700 bg-[#0b1738]' : 'border-slate-200 bg-slate-50'}`}>
                            <p className="text-sm font-semibold">Applies To</p>
                            <div className="mt-3 flex flex-wrap items-center gap-5">
                              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={twoFaAdmins} onChange={(e) => setTwoFaAdmins(e.target.checked)} className="h-4 w-4 accent-indigo-600" />Administrators</label>
                              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={twoFaLibrarians} onChange={(e) => setTwoFaLibrarians(e.target.checked)} className="h-4 w-4 accent-indigo-600" />Librarians</label>
                              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={twoFaStaff} onChange={(e) => setTwoFaStaff(e.target.checked)} className="h-4 w-4 accent-indigo-600" />Staff</label>
                              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={twoFaMembers} onChange={(e) => setTwoFaMembers(e.target.checked)} className="h-4 w-4 accent-indigo-600" />Members</label>
                            </div>
                          </div>
                        </section>

                        <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                          <p className="flex items-center gap-2 text-sm font-semibold"><Shield size={15} className="text-emerald-600" />Login Security</p>
                          <p className={`mt-1 text-sm ${textMutedClass}`}>Configure login attempt limits and account lockout settings.</p>
                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <SelectField label="Maximum Login Attempts" value={maxLoginAttempts} onChange={setMaxLoginAttempts} options={[{ value: '3 Attempts', label: '3 Attempts' }, { value: '5 Attempts', label: '5 Attempts' }, { value: '10 Attempts', label: '10 Attempts' }]} isDarkMode={isDarkMode} />
                            <SelectField label="Lockout Duration" value={lockoutDuration} onChange={setLockoutDuration} options={[{ value: '15 Minutes', label: '15 Minutes' }, { value: '30 Minutes', label: '30 Minutes' }, { value: '60 Minutes', label: '60 Minutes' }]} isDarkMode={isDarkMode} />
                          </div>
                        </section>

                        <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">CAPTCHA on Login</p><p className={`text-xs ${textMutedClass}`}>Enable CAPTCHA verification on the login page to prevent automated attacks.</p></div><SwitchField checked={captchaOnLogin} onChange={setCaptchaOnLogin} isDarkMode={isDarkMode} /></div>
                        </section>
                        <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Remember Me</p><p className={`text-xs ${textMutedClass}`}>Allow users to stay signed in on trusted devices.</p></div><SwitchField checked={rememberMeEnabled} onChange={setRememberMeEnabled} isDarkMode={isDarkMode} /></div>
                        </section>
                        <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Account Verification</p><p className={`text-xs ${textMutedClass}`}>Require email verification for new user registrations.</p></div><SwitchField checked={accountVerificationEnabled} onChange={setAccountVerificationEnabled} isDarkMode={isDarkMode} /></div>
                        </section>
                      </div>

                      <div className="space-y-4">
                        <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                          <p className="flex items-center gap-2 text-sm font-semibold"><Shield size={15} className="text-indigo-600" />Security Overview</p>
                          <div className="mt-3 space-y-2 text-sm">
                            <p className="flex items-center gap-2"><span className="text-emerald-600">●</span>Your system is secure</p>
                            <p className="flex items-center gap-2"><span className="text-emerald-600">●</span>SSL/TLS is enabled</p>
                            <p className="flex items-center gap-2"><span className="text-emerald-600">●</span>Strong password policy is active</p>
                            <p className="flex items-center gap-2"><span className="text-amber-600">▲</span>2FA is not enabled for all user roles</p>
                          </div>
                        </section>

                        <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-semibold"><Monitor size={15} className="text-indigo-600" />Active Sessions</p><span className={`rounded-md px-2 py-1 text-xs font-semibold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>3 Active</span></div>
                          <div className="mt-3 space-y-3 text-sm">
                            <div className="flex items-center justify-between"><div><p className="font-semibold">Chrome on Windows</p><p className={textMutedClass}>192.168.1.10 • May 12, 2024 10:30 AM</p></div><span className={`rounded-md px-2 py-1 text-xs font-semibold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>Current Session</span></div>
                            <div className="flex items-center justify-between"><div><p className="font-semibold">Mobile App on Android</p><p className={textMutedClass}>192.168.1.15 • May 12, 2024 09:15 AM</p></div><button className={`rounded-md border px-2 py-1 text-xs ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>End Session</button></div>
                            <div className="flex items-center justify-between"><div><p className="font-semibold">Safari on macOS</p><p className={textMutedClass}>192.168.1.8 • May 11, 2024 04:45 PM</p></div><button className={`rounded-md border px-2 py-1 text-xs ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>End Session</button></div>
                          </div>
                          <button type="button" className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All Sessions</button>
                        </section>

                        <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                          <p className="flex items-center gap-2 text-sm font-semibold"><CircleAlert size={15} className="text-indigo-600" />Security Tips</p>
                          <ul className={`mt-3 space-y-2 text-sm ${textMutedClass}`}>
                            <li>Use strong passwords and change them regularly.</li>
                            <li>Enable Two-Factor Authentication for all admin users.</li>
                            <li>Log out from shared or public devices.</li>
                            <li>Keep your system and plugins up to date.</li>
                          </ul>
                          <button type="button" className={`mt-4 inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                            <CircleAlert size={14} />
                            Learn More
                          </button>
                        </section>
                      </div>
                    </div>

                    <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                      <p className="flex items-center gap-2 font-semibold"><CircleAlert size={15} />Note</p>
                      <p className="mt-1">Changes made in security settings may require users to log in again or verify their accounts.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <section className={`rounded-xl border p-6 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <h4 className="text-[20px] font-semibold tracking-tight">{securityTab}</h4>
                      <p className={`mt-2 text-sm ${textMutedClass}`}>This section is ready next. We can implement this tab in the same style.</p>
                    </section>
                  </div>
                )}
              </section>
            ) : null}

            {activeSettingsMenu === 'Backup' ? (
              <section className={`rounded-2xl border p-0 ${cardClass}`}>
                <div className="space-y-4 p-6">
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_520px]">
                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold"><RotateCcw size={15} className="text-indigo-600" />Backup Settings</p>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <SelectField label="Backup Schedule" value={backupSchedule} onChange={setBackupSchedule} options={[{ value: 'Daily', label: 'Daily' }, { value: 'Weekly', label: 'Weekly' }, { value: 'Monthly', label: 'Monthly' }]} isDarkMode={isDarkMode} />
                        <SelectField label="Backup Time" value={backupTime} onChange={setBackupTime} options={[{ value: '02:00 AM', label: '02:00 AM' }, { value: '03:00 AM', label: '03:00 AM' }, { value: '04:00 AM', label: '04:00 AM' }]} isDarkMode={isDarkMode} />
                      </div>
                      <div className="mt-4">
                        <SelectField label="Backup Retention" value={backupRetention} onChange={setBackupRetention} options={[{ value: '7 Days', label: '7 Days' }, { value: '30 Days', label: '30 Days' }, { value: '90 Days', label: '90 Days' }]} isDarkMode={isDarkMode} />
                        <p className={`mt-1 text-xs ${textMutedClass}`}>Backups older than the retention period will be deleted automatically.</p>
                      </div>
                      <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Include Attachments & Documents</p><p className={`text-xs ${textMutedClass}`}>Backup uploaded files and documents.</p></div><SwitchField checked={includeAttachments} onChange={setIncludeAttachments} isDarkMode={isDarkMode} /></div>
                        <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Email Backup Summary</p><p className={`text-xs ${textMutedClass}`}>Send email notification after backup is completed.</p></div><SwitchField checked={emailBackupSummary} onChange={setEmailBackupSummary} isDarkMode={isDarkMode} /></div>
                      </div>
                    </section>

                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="flex items-center gap-2 text-sm font-semibold"><Upload size={15} className="text-indigo-600" />Manual Backup</p>
                      <p className={`mt-1 text-sm ${textMutedClass}`}>Create a backup of your library system data immediately.</p>
                      <div className={`mt-4 rounded-lg border p-3 ${isDarkMode ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                        This will backup all system data including books, members, transactions, settings, and more.
                      </div>
                      <button type="button" className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
                        <Upload size={14} />
                        Create Backup Now
                      </button>
                    </section>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="text-[20px] font-semibold">Backup History</p>
                      <div className={`mt-4 overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className={`grid grid-cols-[1.1fr_0.8fr_0.95fr_0.7fr_0.8fr_0.7fr] gap-3 border-b px-4 py-3 text-[13px] font-semibold ${isDarkMode ? 'border-slate-700 bg-[#0b1738] text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                          <p>Backup Name</p><p>Type</p><p>Date & Time</p><p>Size</p><p>Status</p><p>Actions</p>
                        </div>
                        {[
                          ['Daily Backup', 'Manual', 'May 12, 2024 02:05 AM', '245.8 MB'],
                          ['Daily Backup', 'Scheduled', 'May 11, 2024 02:00 AM', '243.1 MB'],
                          ['Daily Backup', 'Scheduled', 'May 10, 2024 02:00 AM', '241.7 MB'],
                          ['Daily Backup', 'Scheduled', 'May 9, 2024 02:00 AM', '240.5 MB'],
                          ['Daily Backup', 'Scheduled', 'May 8, 2024 02:00 AM', '239.9 MB'],
                        ].map((row, idx) => (
                          <div key={`${row[0]}-${idx}`} className={`grid grid-cols-[1.1fr_0.8fr_0.95fr_0.7fr_0.8fr_0.7fr] items-center gap-3 border-b px-4 py-3 last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <div><p className="text-sm font-semibold">{row[0]}</p><p className={`text-xs ${textMutedClass}`}>{row[1]}</p></div>
                            <p><span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${row[1] === 'Manual' ? isDarkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700' : isDarkMode ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'}`}>{row[1]}</span></p>
                            <p className="text-sm">{row[2]}</p>
                            <p className="text-sm">{row[3]}</p>
                            <p><span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>Completed</span></p>
                            <div className="flex items-center gap-2">
                              <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-indigo-300 hover:bg-slate-800' : 'border-slate-200 text-indigo-600 hover:bg-indigo-50'}`}><ChevronDown size={14} /></button>
                              <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border ${isDarkMode ? 'border-slate-700 text-rose-300 hover:bg-slate-800' : 'border-slate-200 text-rose-600 hover:bg-rose-50'}`}><Trash2 size={14} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All Backups</button>
                    </section>

                    <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-700 bg-[#0f1f49]' : 'border-slate-200 bg-white'}`}>
                      <p className="text-[20px] font-semibold">Backup Storage</p>
                      <div className="mt-4 grid place-items-center">
                        <div className={`grid h-44 w-44 place-items-center rounded-full border-[18px] ${isDarkMode ? 'border-indigo-500/70 text-slate-100' : 'border-indigo-500 text-slate-800'}`}>
                          <div className="text-center">
                            <p className="text-2xl font-bold">1.24 GB</p>
                            <p className={`text-xs ${textMutedClass}`}>Used</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <p className="flex items-center justify-between"><span>Used Space</span><span>1.24 GB (62%)</span></p>
                        <p className="flex items-center justify-between"><span>Available Space</span><span>760 MB (38%)</span></p>
                        <p className="flex items-center justify-between"><span>Total Storage</span><span>2.0 GB</span></p>
                      </div>
                      <div className={`mt-4 rounded-lg border p-3 text-sm ${isDarkMode ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                        Storage is calculated based on all backups.
                      </div>
                      <button type="button" className={`mt-4 inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${isDarkMode ? 'border-indigo-500/70 text-indigo-200 hover:bg-indigo-500/10' : 'border-indigo-400 text-indigo-700 hover:bg-indigo-50'}`}>
                        <Settings2 size={14} />
                        Manage Storage
                      </button>
                    </section>
                  </div>

                  <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                    <p className="flex items-center gap-2 font-semibold"><CircleAlert size={15} />Note</p>
                    <p className="mt-1">Ensure backups are stored securely. We recommend downloading important backups and storing them in a safe location.</p>
                  </div>
                </div>
              </section>
            ) : null}

            {activeSettingsMenu !== 'General' && activeSettingsMenu !== 'Library Profile' && activeSettingsMenu !== 'Users & Roles' && activeSettingsMenu !== 'Books & Borrowing' && activeSettingsMenu !== 'Membership & Penalties' && activeSettingsMenu !== 'Notifications' && activeSettingsMenu !== 'Email & SMTP' && activeSettingsMenu !== 'Security' && activeSettingsMenu !== 'Backup' ? (
              <section className={`rounded-2xl border p-6 ${cardClass}`}>
                <h4 className="text-[20px] font-semibold tracking-tight">{activeSettingsMenu}</h4>
                <p className={`mt-2 text-sm ${textMutedClass}`}>This tab is ready for implementation next.</p>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
