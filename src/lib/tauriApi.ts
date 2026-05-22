import { invoke } from '@tauri-apps/api/core'

export type Book = {
  id: number
  title: string
  author: string
  isbn: string | null
  coverData: string | null
  available: boolean
  createdAt: string
}

export type CreateBookPayload = {
  title: string
  author: string
  isbn?: string | null
  coverData?: string | null
}

export type UpdateBookPayload = {
  id: number
  title: string
  author: string
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
