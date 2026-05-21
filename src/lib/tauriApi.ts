import { invoke } from '@tauri-apps/api/core'

export type Book = {
  id: number
  title: string
  author: string
  isbn: string | null
  available: boolean
  createdAt: string
}

export type CreateBookPayload = {
  title: string
  author: string
  isbn?: string | null
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
