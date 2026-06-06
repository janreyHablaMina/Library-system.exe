import { useState, type FormEvent } from 'react'
import { CheckCircle2, Eye, EyeOff, KeyRound, Mail, ShieldCheck, X } from 'lucide-react'
import { completePasswordReset, requestPasswordReset, verifyPasswordResetCode } from '../lib/tauriApi'

type ForgotPasswordModalProps = {
  initialIdentifier?: string
  onClose: () => void
  onCompleted: () => void
}

export function ForgotPasswordModal({ initialIdentifier = '', onClose, onCompleted }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<'request' | 'verify' | 'reset' | 'success'>('request')
  const [identifier, setIdentifier] = useState(initialIdentifier)
  const [code, setCode] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleRequest = async (event: FormEvent) => {
    event.preventDefault()
    if (!identifier.trim()) {
      setError('Enter your username or registered email.')
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      await requestPasswordReset(identifier.trim())
      setStep('verify')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : String(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the six-digit verification code.')
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      const token = await verifyPasswordResetCode(identifier.trim(), code)
      setResetToken(token)
      setStep('reset')
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : String(verifyError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    setIsSubmitting(true)
    setError('')
    try {
      await requestPasswordReset(identifier.trim())
      setCode('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : String(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = async (event: FormEvent) => {
    event.preventDefault()
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      await completePasswordReset(resetToken, newPassword)
      setStep('success')
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : String(resetError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const title = step === 'request'
    ? 'Forgot Password'
    : step === 'verify'
      ? 'Check Your Email'
      : step === 'reset'
        ? 'Create New Password'
        : 'Password Updated'
  const description = step === 'request'
    ? 'Enter your username or registered email to receive a verification code.'
    : step === 'verify'
      ? 'Enter the six-digit code sent to your registered email. It expires in 10 minutes.'
      : step === 'reset'
        ? 'Choose a secure password with at least 8 characters.'
        : 'Your password was reset successfully. You can now sign in.'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              {step === 'request' ? <Mail size={21} /> : step === 'verify' ? <ShieldCheck size={21} /> : step === 'reset' ? <KeyRound size={21} /> : <CheckCircle2 size={21} />}
            </span>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
              <p className="mt-1 text-sm leading-5 text-zinc-500">{description}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900" aria-label="Close password reset">
            <X size={19} />
          </button>
        </div>

        <div className="p-6">
          {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}

          {step === 'request' && (
            <form onSubmit={handleRequest}>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Username or email</label>
              <input
                autoFocus
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Enter your username or email"
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition-colors focus:border-emerald-500"
              />
              <p className="mt-3 text-xs leading-5 text-zinc-500">For security, the app will show the same confirmation whether or not an account is found.</p>
              <ModalFooter onCancel={onClose} submitLabel="Send Code" isSubmitting={isSubmitting} />
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerify}>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Verification code</label>
              <input
                autoFocus
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="h-14 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-center font-mono text-2xl font-bold tracking-[0.45em] text-zinc-900 outline-none transition-colors focus:border-emerald-500"
              />
              <button type="button" disabled={isSubmitting} onClick={() => void handleResend()} className="mt-3 text-xs font-bold text-emerald-600 hover:underline disabled:opacity-50">
                Resend code
              </button>
              <ModalFooter onCancel={onClose} submitLabel="Verify Code" isSubmitting={isSubmitting} />
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <PasswordField label="New password" value={newPassword} onChange={setNewPassword} visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} />
              <PasswordField label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} />
              <ModalFooter onCancel={onClose} submitLabel="Reset Password" isSubmitting={isSubmitting} />
            </form>
          )}

          {step === 'success' && (
            <button type="button" onClick={onCompleted} className="mt-1 h-11 w-full rounded-xl bg-emerald-500 font-bold text-white transition-colors hover:bg-emerald-600">
              Return to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ModalFooter({ onCancel, submitLabel, isSubmitting }: { onCancel: () => void; submitLabel: string; isSubmitting: boolean }) {
  return (
    <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-5">
      <button type="button" onClick={onCancel} className="rounded-xl px-5 py-2.5 font-semibold text-zinc-600 transition-colors hover:bg-zinc-100">Cancel</button>
      <button type="submit" disabled={isSubmitting} className="rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50">
        {isSubmitting ? 'Please wait...' : submitLabel}
      </button>
    </div>
  )
}

function PasswordField({ label, value, onChange, visible, onToggle }: { label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-zinc-700">{label}</label>
      <div className="flex h-11 items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 focus-within:border-emerald-500">
        <input type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none" />
        <button type="button" onClick={onToggle} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100" aria-label={visible ? 'Hide password' : 'Show password'}>
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  )
}
