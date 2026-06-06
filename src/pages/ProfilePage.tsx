import { useState } from 'react'
import { Camera, Mail, Phone, Calendar, MapPin, User, ShieldCheck, Clock, CheckCircle2, ChevronRight, Lock, BookOpen, RotateCcw, Users } from 'lucide-react'

type ProfilePageProps = {
  isDarkMode: boolean
  activeUsername: string | null
}

export function ProfilePage({ isDarkMode, activeUsername }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'notifications' | 'security' | 'activity'>('info')
  const [isSaving, setIsSaving] = useState(false)
  
  const textPrimary = isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
  const textSecondary = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
  const cardClass = isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const inputClass = isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-900 focus:border-emerald-500'
  
  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 lg:p-8 ${isDarkMode ? 'bg-transparent text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <div className="mx-auto max-w-[1400px] space-y-6">
        
        {/* Header */}
        <header>
          <h1 className={`text-3xl font-black tracking-tight ${textPrimary}`}>My Profile</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className={textSecondary}>Dashboard</span>
            <ChevronRight size={14} className={textSecondary} />
            <span className={textPrimary}>My Profile</span>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-3 space-y-6">
            <div className={`rounded-2xl border p-6 flex flex-col items-center text-center ${cardClass}`}>
              <div className="relative mb-4">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100 text-4xl font-black text-indigo-600 ring-4 ring-white shadow-sm dark:bg-indigo-500/20 dark:text-indigo-400 dark:ring-zinc-800">
                  {activeUsername ? activeUsername.slice(0, 2).toUpperCase() : 'AD'}
                </div>
                <button className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-600 shadow-md ring-1 ring-zinc-200 transition-transform hover:scale-110 dark:bg-zinc-800 dark:text-emerald-400 dark:ring-zinc-700">
                  <Camera size={14} />
                </button>
              </div>
              
              <h2 className={`text-xl font-bold ${textPrimary}`}>{activeUsername || 'Admin'}</h2>
              <p className={`text-sm ${textSecondary}`}>Librarian</p>
              
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                Active
              </div>

              <div className={`mt-6 w-full space-y-4 border-t pt-6 text-sm ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${textSecondary}`}>
                    <User size={14} /> Employee ID
                  </div>
                  <span className={`font-medium ${textPrimary}`}>LIB-2026-001</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${textSecondary}`}>
                    <Mail size={14} /> Email
                  </div>
                  <span className={`font-medium ${textPrimary}`}>admin@primelibrary.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${textSecondary}`}>
                    <Phone size={14} /> Phone
                  </div>
                  <span className={`font-medium ${textPrimary}`}>+63 912 345 6789</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${textSecondary}`}>
                    <BookOpen size={14} /> Department
                  </div>
                  <span className={`font-medium ${textPrimary}`}>Library Administration</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${textSecondary}`}>
                    <User size={14} /> Role
                  </div>
                  <span className={`font-medium ${textPrimary}`}>Librarian</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${textSecondary}`}>
                    <Clock size={14} /> Member Since
                  </div>
                  <span className={`font-medium ${textPrimary}`}>May 12, 2026</span>
                </div>
              </div>

              <button className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-bold transition-colors ${
                isDarkMode 
                  ? 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10' 
                  : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'
              }`}>
                <Lock size={16} /> Change Password
              </button>
            </div>
          </div>

          {/* Middle Column: Main Content */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Tabs Navigation */}
            <div className={`flex items-center gap-8 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
              {[
                { id: 'info', label: 'Profile Information' },
                { id: 'notifications', label: 'Notification Preferences' },
                { id: 'security', label: 'Security' },
                { id: 'activity', label: 'Activity Log' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative pb-4 text-sm font-bold transition-colors ${
                    activeTab === tab.id 
                      ? 'text-emerald-600 dark:text-emerald-500' 
                      : `${textSecondary} hover:${textPrimary}`
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-emerald-600 dark:bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className={`rounded-2xl border p-6 ${cardClass}`}>
              {activeTab === 'info' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h3 className={`mb-6 text-lg font-bold ${textPrimary}`}>Personal Information</h3>
                  
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold ${textSecondary}`}>Full Name</label>
                      <input 
                        type="text" 
                        defaultValue={activeUsername || 'Admin'}
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${inputClass}`} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold ${textSecondary}`}>Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="admin@primelibrary.com"
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${inputClass}`} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold ${textSecondary}`}>Phone Number</label>
                      <input 
                        type="text" 
                        defaultValue="+63 912 345 6789"
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${inputClass}`} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold ${textSecondary}`}>Date of Birth</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          defaultValue="January 1, 1990"
                          className={`w-full rounded-xl border px-4 py-3 pr-10 text-sm outline-none transition-colors ${inputClass}`} 
                        />
                        <Calendar size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold ${textSecondary}`}>Gender</label>
                      <select className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${inputClass}`}>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold ${textSecondary}`}>Address</label>
                      <input 
                        type="text" 
                        defaultValue="Manila, Philippines"
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${inputClass}`} 
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-70"
                    >
                      {isSaving ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Placeholders for other tabs */}
              {activeTab !== 'info' && (
                <div className="py-12 text-center">
                  <p className={textSecondary}>This section is currently under development.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Account Summary */}
          <div className="lg:col-span-3 space-y-6">
            <div className={`rounded-2xl border p-6 ${cardClass}`}>
              <h3 className={`mb-6 text-lg font-bold ${textPrimary}`}>Account Summary</h3>
              
              <div className="mb-6 flex flex-col items-center justify-center rounded-xl bg-emerald-50 py-6 px-4 text-center dark:bg-emerald-500/10">
                <div className="mb-3 rounded-full bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <ShieldCheck size={28} />
                </div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Your account is secure and active.</p>
              </div>

              <div className={`space-y-4 text-sm ${textSecondary}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Clock size={14} /> Last Login</div>
                  <span className={`font-medium ${textPrimary}`}>Jun 6, 2026 1:15 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><MapPin size={14} /> Login IP</div>
                  <span className={`font-medium ${textPrimary}`}>192.168.1.100</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><User size={14} /> Account Status</div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><ShieldCheck size={14} /> Two-Factor Auth</div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Enabled</span>
                </div>
              </div>

              <button className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-bold transition-colors ${
                isDarkMode 
                  ? 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10' 
                  : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'
              }`}>
                <ShieldCheck size={16} /> View Security Settings
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Activity Stats */}
        <div>
          <h3 className={`mb-4 text-lg font-bold ${textPrimary}`}>Your Library Activity</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className={`flex items-center gap-4 rounded-xl border p-4 ${cardClass}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <BookOpen size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className={`text-xs ${textSecondary}`}>Books Added</p>
                <p className={`text-xl font-black ${textPrimary}`}>26</p>
                <p className={`text-[10px] ${textSecondary}`}>Total books added</p>
              </div>
            </div>

            <div className={`flex items-center gap-4 rounded-xl border p-4 ${cardClass}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                <RotateCcw size={24} className="text-amber-500 dark:text-amber-400" />
              </div>
              <div>
                <p className={`text-xs ${textSecondary}`}>Transactions</p>
                <p className={`text-xl font-black ${textPrimary}`}>152</p>
                <p className={`text-[10px] ${textSecondary}`}>Total transactions</p>
              </div>
            </div>

            <div className={`flex items-center gap-4 rounded-xl border p-4 ${cardClass}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                <Users size={24} className="text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className={`text-xs ${textSecondary}`}>Members Assisted</p>
                <p className={`text-xl font-black ${textPrimary}`}>48</p>
                <p className={`text-[10px] ${textSecondary}`}>Total members helped</p>
              </div>
            </div>

            <div className={`flex items-center gap-4 rounded-xl border p-4 ${cardClass}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                <Calendar size={24} className="text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <p className={`text-xs ${textSecondary}`}>Days Active</p>
                <p className={`text-xl font-black ${textPrimary}`}>25</p>
                <p className={`text-[10px] ${textSecondary}`}>Days since joined</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
