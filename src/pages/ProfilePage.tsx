import { Mail, Phone, Calendar, MapPin, User, ShieldCheck, Clock, ChevronRight, Lock, BookOpen, LogIn, Users, Building, IdCard, Pencil } from 'lucide-react'

type ProfilePageProps = {
  isDarkMode: boolean
  activeUsername: string | null
}

export function ProfilePage({ isDarkMode, activeUsername }: ProfilePageProps) {
  const textPrimary = isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
  const textSecondary = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
  const cardClass = isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 lg:p-8 ${isDarkMode ? 'bg-transparent text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <div className="mx-auto max-w-[1200px] space-y-6">
        
        {/* Header */}
        <header>
          <h1 className={`text-3xl font-black tracking-tight ${textPrimary}`}>My Profile</h1>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium">
            <span className={textSecondary}>Dashboard</span>
            <ChevronRight size={14} className={textSecondary} />
            <span className={textPrimary}>My Profile</span>
          </div>
        </header>

        {/* Top Profile Card */}
        <div className={`flex flex-col lg:flex-row rounded-2xl border ${cardClass}`}>
          
          {/* Avatar Section */}
          <div className={`flex flex-col items-center justify-center p-8 lg:w-[300px] lg:border-r ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <div className="relative mb-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500 text-4xl font-black text-white ring-8 ring-emerald-50 dark:ring-emerald-500/10">
                {activeUsername ? activeUsername.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <button className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm ring-1 ring-zinc-200 transition-transform hover:scale-110 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
                <Pencil size={14} />
              </button>
            </div>
            <h2 className={`text-xl font-black ${textPrimary}`}>{activeUsername || 'Admin'}</h2>
            <p className={`text-sm ${textSecondary}`}>Librarian</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              Active
            </div>
          </div>

          {/* Details Section */}
          <div className={`grid flex-1 grid-cols-1 sm:grid-cols-2 p-8 gap-y-8 gap-x-12 lg:border-r ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
            
            {/* Column 1 */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 ${textSecondary}`}><Mail size={18} /></div>
                <div>
                  <p className={`text-xs font-medium ${textSecondary}`}>Email</p>
                  <p className={`text-sm font-semibold ${textPrimary}`}>admin@primelibrary.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 ${textSecondary}`}><Phone size={18} /></div>
                <div>
                  <p className={`text-xs font-medium ${textSecondary}`}>Phone</p>
                  <p className={`text-sm font-semibold ${textPrimary}`}>+63 912 345 6789</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 ${textSecondary}`}><Calendar size={18} /></div>
                <div>
                  <p className={`text-xs font-medium ${textSecondary}`}>Date of Birth</p>
                  <p className={`text-sm font-semibold ${textPrimary}`}>January 1, 1990</p>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 ${textSecondary}`}><IdCard size={18} /></div>
                <div>
                  <p className={`text-xs font-medium ${textSecondary}`}>Employee ID</p>
                  <p className={`text-sm font-semibold ${textPrimary}`}>LIB-2026-001</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 ${textSecondary}`}><Building size={18} /></div>
                <div>
                  <p className={`text-xs font-medium ${textSecondary}`}>Department</p>
                  <p className={`text-sm font-semibold ${textPrimary}`}>Library Administration</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 ${textSecondary}`}><User size={18} /></div>
                <div>
                  <p className={`text-xs font-medium ${textSecondary}`}>Role</p>
                  <p className={`text-sm font-semibold ${textPrimary}`}>Librarian</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Section */}
          <div className="flex flex-col justify-center p-8 lg:w-[320px]">
            <h3 className={`mb-4 text-sm font-bold ${textPrimary}`}>Account Status</h3>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <ShieldCheck size={28} />
              </div>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">Active</p>
              <p className={`mt-1 text-xs ${textSecondary}`}>Your account is secure and active.</p>
            </div>
            
            <div className={`space-y-3 text-xs border-t pt-5 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 ${textSecondary}`}><Clock size={12} /> Last Login</div>
                <span className={`font-medium ${textPrimary}`}>Jun 6, 2026 1:15 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 ${textSecondary}`}><MapPin size={12} /> Login IP</div>
                <span className={`font-medium ${textPrimary}`}>192.168.1.100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 ${cardClass}`}>
          <div className="flex items-start gap-4">
            <div className={`mt-1 ${textSecondary}`}>
              <Lock size={20} />
            </div>
            <div>
              <h3 className={`text-base font-bold ${textPrimary}`}>Security</h3>
              <p className={`text-sm ${textSecondary}`}>Manage your password and keep your account secure.</p>
            </div>
          </div>
          <button className={`shrink-0 flex items-center justify-center gap-2 rounded-xl border py-2.5 px-5 text-sm font-bold transition-colors ${
            isDarkMode 
              ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' 
              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
          }`}>
            <Lock size={16} /> Change Password
          </button>
        </div>

        {/* Recent Activity Card */}
        <div className={`rounded-2xl border ${cardClass}`}>
          <div className={`flex items-center justify-between border-b p-5 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <div className="flex items-center gap-3">
              <Clock size={20} className={textSecondary} />
              <h3 className={`text-base font-bold ${textPrimary}`}>Recent Activity</h3>
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400">
              View all activity <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="p-2">
            {/* Activity Item 1 */}
            <div className={`flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <LogIn size={18} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${textPrimary}`}>Logged in to the system</p>
                <div className={`mt-0.5 flex items-center gap-2 text-xs ${textSecondary}`}>
                  <span>Jun 6, 2026 1:15 PM</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                  <span>192.168.1.100</span>
                </div>
              </div>
            </div>
            
            {/* Activity Item 2 */}
            <div className={`flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                <BookOpen size={18} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${textPrimary}`}>Added new book</p>
                <div className={`mt-0.5 flex items-center gap-2 text-xs ${textSecondary}`}>
                  <span>Jun 6, 2026 10:20 AM</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                  <span>The Clean Code</span>
                </div>
              </div>
            </div>

            {/* Activity Item 3 */}
            <div className={`flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400">
                <Users size={18} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${textPrimary}`}>Updated member information</p>
                <div className={`mt-0.5 flex items-center gap-2 text-xs ${textSecondary}`}>
                  <span>Jun 5, 2026 4:45 PM</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                  <span>Juan Dela Cruz</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
