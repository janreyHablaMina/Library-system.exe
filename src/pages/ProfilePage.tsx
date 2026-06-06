import { useState } from 'react'
import { User, Mail, Shield, Key, Bell, Save, Camera, CheckCircle2 } from 'lucide-react'

type ProfilePageProps = {
  isDarkMode: boolean
  activeUsername: string | null
}

export function ProfilePage({ isDarkMode, activeUsername }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general')
  const [isSaving, setIsSaving] = useState(false)
  
  const textPrimary = isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
  const textSecondary = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
  const cardClass = isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const inputClass = isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200 focus:border-emerald-500' : 'border-zinc-300 bg-white text-zinc-900 focus:border-emerald-500'
  
  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 lg:p-6 ${isDarkMode ? 'bg-transparent text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      <div className="mx-auto max-w-[1000px] space-y-6">
        
        {/* Header */}
        <header>
          <h1 className={`text-2xl font-black ${textPrimary}`}>My Profile</h1>
          <p className={`mt-1 text-sm ${textSecondary}`}>Manage your personal information and preferences.</p>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 shrink-0 space-y-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'general'
                  ? isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                  : isDarkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <User size={18} /> General Info
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'security'
                  ? isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                  : isDarkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <Shield size={18} /> Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'notifications'
                  ? isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                  : isDarkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <Bell size={18} /> Notifications
            </button>
          </div>

          {/* Content Area */}
          <div className={`flex-1 rounded-2xl border p-6 ${cardClass}`}>
            
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700 ring-4 ring-emerald-50 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/10">
                      {activeUsername ? activeUsername.slice(0, 2).toUpperCase() : 'AD'}
                    </div>
                    <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 text-zinc-700 shadow-lg ring-1 ring-zinc-200 transition-transform hover:scale-110 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>{activeUsername || 'Admin User'}</h2>
                    <p className={`text-sm ${textSecondary}`}>Administrator</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className={`text-sm font-bold ${textPrimary}`}>Username</label>
                      <div className="relative">
                        <User size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                        <input 
                          type="text" 
                          defaultValue={activeUsername || ''}
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${inputClass}`} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-bold ${textPrimary}`}>Email Address</label>
                      <div className="relative">
                        <Mail size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                        <input 
                          type="email" 
                          defaultValue="admin@library.system"
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${inputClass}`} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${textPrimary}`}>Bio</label>
                    <textarea 
                      rows={4}
                      defaultValue="System Administrator for infoLib Library System."
                      className={`w-full resize-none rounded-xl border p-3 text-sm outline-none transition-colors ${inputClass}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h3 className={`text-lg font-bold ${textPrimary}`}>Change Password</h3>
                  <p className={`text-sm ${textSecondary}`}>Ensure your account is using a long, random password to stay secure.</p>
                </div>
                
                <div className="space-y-5 max-w-md">
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${textPrimary}`}>Current Password</label>
                    <div className="relative">
                      <Key size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${inputClass}`} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${textPrimary}`}>New Password</label>
                    <div className="relative">
                      <Key size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${inputClass}`} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold ${textPrimary}`}>Confirm New Password</label>
                    <div className="relative">
                      <Key size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${inputClass}`} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h3 className={`text-lg font-bold ${textPrimary}`}>Notification Preferences</h3>
                  <p className={`text-sm ${textSecondary}`}>Choose what updates you want to receive.</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { id: '1', title: 'System Updates', desc: 'Receive notifications about system maintenance and updates.', defaultChecked: true },
                    { id: '2', title: 'New Member Registrations', desc: 'Get alerted when a new member registers.', defaultChecked: true },
                    { id: '3', title: 'Overdue Returns', desc: 'Daily summary of overdue books.', defaultChecked: false },
                    { id: '4', title: 'Low Stock Alerts', desc: 'Notifications when popular books are running low.', defaultChecked: true },
                  ].map(item => (
                    <label key={item.id} className="flex cursor-pointer items-start gap-4 rounded-xl border border-transparent p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <div className="flex h-5 items-center mt-0.5">
                        <input type="checkbox" defaultChecked={item.defaultChecked} className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${textPrimary}`}>{item.title}</p>
                        <p className={`text-xs ${textSecondary}`}>{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className={`mt-8 flex items-center justify-end gap-3 border-t pt-6 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <button className={`px-4 py-2.5 text-sm font-bold transition-colors ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSaving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Save size={16} />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
