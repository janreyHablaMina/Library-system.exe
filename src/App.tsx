import { useState } from 'react'
import type { FormEvent } from 'react'
import heroImage from './assets/login.avif'

type LoginFormState = {
  username: string
  password: string
  rememberMe: boolean
}

const initialState: LoginFormState = {
  username: '',
  password: '',
  rememberMe: true,
}

function App() {
  const [formState, setFormState] = useState<LoginFormState>(initialState)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.table(formState)
  }

  return (
    <main className="h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,#22c55e33_0%,transparent_40%),linear-gradient(120deg,#03171d_0%,#0b2a35_45%,#1a3f4f_100%)]">
      <div className="h-full overflow-hidden border border-emerald-100/20 bg-[#04202b]/45">
        <div className="grid h-full grid-cols-[1.03fr_1fr]">
          <section className="relative overflow-hidden">
            <img src={heroImage} alt="Library shelves and desk" className="h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,33,30,0.76)_0%,rgba(1,33,35,0.88)_52%,rgba(1,26,29,0.94)_100%)]" />
            <div className="absolute inset-0 px-6 py-3 text-white">
              <div className="absolute left-6 right-6 top-3 bottom-28">
                <div className="mx-auto flex h-full max-w-[450px] flex-col items-center justify-center text-center">
                <div className="grid h-18 w-18 place-items-center rounded-full border border-emerald-300/65 text-emerald-300">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10">
                    <path d="M12 6c-2-1.3-4.4-2-7-2v13c2.6 0 5 .7 7 2 2-1.3 4.4-2 7-2V4c-2.6 0-5 .7-7 2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 6v13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="mt-4 space-y-1.5">
                  <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight">
                    info<span className="text-emerald-400">Lib.</span>
                  </h1>
                  <p className="text-base tracking-[0.1em] text-emerald-100/85">LIBRARY INFORMATION SYSTEM</p>
                  <div className="mx-auto h-[2px] w-32 bg-emerald-400/70" />
                  <p className="max-w-[340px] text-base leading-relaxed text-emerald-100/78">
                    Manage your library resources, borrowers, and transactions efficiently.
                  </p>
                </div>
              </div>
              </div>
              <div className="absolute bottom-4 left-6 right-6 rounded-[1.5rem] border border-emerald-100/15 bg-emerald-950/35 px-4 py-3 backdrop-blur-sm">
                <p className="text-base font-semibold">Secure. Reliable. Efficient.</p>
                <p className="mt-1 text-sm text-emerald-100/80">Your library, better organized.</p>
              </div>
            </div>
          </section>

          <section className="flex h-full items-center justify-center bg-[#f4f6f8] px-5 py-3">
            <form onSubmit={handleSubmit} className="flex h-full w-full max-w-[410px] flex-col px-1 py-1" noValidate>
              <div className="flex flex-1 flex-col justify-center space-y-3">
                <header className="space-y-1 text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Welcome Back! 👋</h2>
                  <p className="text-base text-slate-500">Sign in to continue to your account</p>
                </header>

                <div className="space-y-1">
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-700">User Name</label>
                  <div className="flex h-10 items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="mr-2 h-4 w-4 text-slate-500">
                      <path d="M20 21a8 8 0 0 0-16 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <input
                      id="username"
                      type="text"
                      autoComplete="username"
                      value={formState.username}
                      onChange={(event) => setFormState((previous) => ({ ...previous, username: event.target.value }))}
                      placeholder="Enter your username"
                      className="h-full w-full bg-transparent text-sm text-slate-800 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                  <div className="flex h-10 items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="mr-2 h-4 w-4 text-slate-500">
                      <rect x="4" y="11" width="16" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M8 11V8a4 4 0 1 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={formState.password}
                      onChange={(event) => setFormState((previous) => ({ ...previous, password: event.target.value }))}
                      placeholder="Enter your password"
                      className="h-full w-full bg-transparent text-sm text-slate-800 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-slate-500 hover:text-slate-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" fill="none" stroke="currentColor" strokeWidth="2" />
                          <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                          <path d="M3 3l18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M10.6 10.7a3 3 0 0 0 4.2 4.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M9.9 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3.1 4.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M6.2 6.3A18.5 18.5 0 0 0 2 12s3.5 7 10 7c1 0 2-.2 2.9-.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex cursor-pointer items-center gap-3 text-slate-600">
                    <input
                      type="checkbox"
                      checked={formState.rememberMe}
                      onChange={(event) => setFormState((previous) => ({ ...previous, rememberMe: event.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                    />
                    Remember me
                  </label>
                  <button type="button" className="font-semibold text-emerald-700 hover:text-emerald-800">Forgot password?</button>
                </div>

                <button type="submit" className="flex h-11 w-full items-center justify-between rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 px-5 text-base font-bold text-white shadow-[0_12px_24px_-12px_rgba(5,150,105,0.7)] transition hover:brightness-110">
                  <span className="w-8" />
                  <span>Sign In</span>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-emerald-700">→</span>
                </button>
              </div>

              <p className="mt-auto pt-3 text-center text-xs text-slate-500">© 2026 infoLib. All rights reserved.</p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default App

