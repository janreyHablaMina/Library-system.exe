import { useState, useEffect, useRef } from 'react'
import { Mail, Phone, Calendar, MapPin, User, ShieldCheck, Clock, ChevronRight, Lock, BookOpen, LogIn, Users, Building, IdCard, Pencil, Save, CheckCircle2, Camera } from 'lucide-react'
import { getUserProfile, updateUserProfile, type UserProfile } from '../lib/tauriApi'

type ProfilePageProps = {
  isDarkMode: boolean
  activeUsername: string | null
  onProfileUpdate?: () => void
}

export function ProfilePage({ isDarkMode, activeUsername, onProfileUpdate }: ProfilePageProps) {
  const textPrimary = isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
  const textSecondary = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
  const cardClass = isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const inputClass = isDarkMode ? 'border-zinc-700 bg-[#27272A] text-zinc-200 focus:border-emerald-500' : 'border-zinc-200 bg-white text-zinc-900 focus:border-emerald-500'

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Editable fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [department, setDepartment] = useState('')
  const [photoData, setPhotoData] = useState<string | null>(null)

  useEffect(() => {
    if (activeUsername) {
      loadProfile(activeUsername)
    }
  }, [activeUsername])

  const loadProfile = async (username: string) => {
    try {
      const data = await getUserProfile(username)
      setProfile(data)
      setFullName(data.fullName || '')
      setEmail(data.email || '')
      setPhone(data.phone || '')
      setDob(data.dateOfBirth || '')
      setEmployeeId(data.employeeId || '')
      setDepartment(data.department || '')
      setPhotoData(data.profilePhotoData || null)
    } catch (e) {
      console.error('Failed to load profile', e)
    }
  }

  const handleSave = async () => {
    if (!activeUsername) return
    setIsSaving(true)
    try {
      await updateUserProfile({
        username: activeUsername,
        fullName: fullName || null,
        email: email || null,
        phone: phone || null,
        dateOfBirth: dob || null,
        employeeId: employeeId || null,
        department: department || null,
        profilePhotoData: photoData || null,
      })
      await loadProfile(activeUsername)
      onProfileUpdate?.()
      setIsEditing(false)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (e) {
      console.error('Failed to update profile', e)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoData(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 lg:p-8 ${isDarkMode ? 'bg-transparent text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-xl animate-in slide-in-from-top-2 fade-in">
          <CheckCircle2 size={18} />
          Profile updated successfully!
        </div>
      )}

      <div className="mx-auto max-w-[1200px] space-y-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-black tracking-tight ${textPrimary}`}>My Profile</h1>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium">
              <span className={textSecondary}>Dashboard</span>
              <ChevronRight size={14} className={textSecondary} />
              <span className={textPrimary}>My Profile</span>
            </div>
          </div>
          <div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors ${
                  isDarkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-white border shadow-sm text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <Pencil size={16} /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setIsEditing(false)
                    if (profile) loadProfile(profile.username) // reset
                  }}
                  className={`px-4 py-2.5 text-sm font-bold transition-colors ${textSecondary} hover:${textPrimary}`}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-70"
                >
                  {isSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={16} />}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Top Profile Card */}
        <div className={`flex flex-col lg:flex-row rounded-2xl border ${cardClass}`}>
          
          {/* Avatar Section */}
          <div className={`flex flex-col items-center justify-center p-8 lg:w-[300px] lg:border-r ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <div className="relative mb-4 group">
              {photoData ? (
                <img src={photoData} alt="Profile" className="h-28 w-28 rounded-full object-cover ring-8 ring-emerald-50 dark:ring-emerald-500/10" />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500 text-4xl font-black text-white ring-8 ring-emerald-50 dark:ring-emerald-500/10">
                  {activeUsername ? activeUsername.slice(0, 2).toUpperCase() : 'AD'}
                </div>
              )}
              
              {isEditing && (
                <>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload} 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm ring-1 ring-zinc-200 transition-transform hover:scale-110 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
                  >
                    <Camera size={14} />
                  </button>
                </>
              )}
            </div>
            <h2 className={`text-xl font-black ${textPrimary}`}>{profile?.fullName || activeUsername || 'Admin'}</h2>
            <p className={`text-sm ${textSecondary}`}>{profile?.role || 'Librarian'}</p>
            <div className={`mt-3 inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold ${profile?.isActive !== false ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
              {profile?.isActive !== false ? 'Active' : 'Inactive'}
            </div>
          </div>

          {/* Details Section */}
          <div className={`grid flex-1 grid-cols-1 sm:grid-cols-2 p-8 gap-y-8 gap-x-12 lg:border-r ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
            
            {/* Column 1 */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className={`mt-2 ${textSecondary}`}><User size={18} /></div>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${textSecondary}`}>Full Name</p>
                  {isEditing ? (
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inputClass}`} placeholder="John Doe" />
                  ) : (
                    <p className={`mt-1 text-sm font-semibold ${textPrimary}`}>{profile?.fullName || 'Not provided'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`mt-2 ${textSecondary}`}><Mail size={18} /></div>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${textSecondary}`}>Email</p>
                  {isEditing ? (
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inputClass}`} placeholder="you@example.com" />
                  ) : (
                    <p className={`mt-1 text-sm font-semibold ${textPrimary}`}>{profile?.email || 'Not provided'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`mt-2 ${textSecondary}`}><Phone size={18} /></div>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${textSecondary}`}>Phone</p>
                  {isEditing ? (
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inputClass}`} placeholder="+1 234 567 890" />
                  ) : (
                    <p className={`mt-1 text-sm font-semibold ${textPrimary}`}>{profile?.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className={`mt-2 ${textSecondary}`}><Calendar size={18} /></div>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${textSecondary}`}>Date of Birth</p>
                  {isEditing ? (
                    <input type="date" style={{ colorScheme: isDarkMode ? 'dark' : 'light' }} value={dob} onChange={e => setDob(e.target.value)} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inputClass}`} />
                  ) : (
                    <p className={`mt-1 text-sm font-semibold ${textPrimary}`}>{profile?.dateOfBirth || 'Not provided'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`mt-2 ${textSecondary}`}><IdCard size={18} /></div>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${textSecondary}`}>Employee ID</p>
                  {isEditing ? (
                    <input type="text" value={employeeId} onChange={e => setEmployeeId(e.target.value)} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inputClass}`} placeholder="LIB-000-000" />
                  ) : (
                    <p className={`mt-1 text-sm font-semibold ${textPrimary}`}>{profile?.employeeId || 'Not provided'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`mt-2 ${textSecondary}`}><User size={18} /></div>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${textSecondary}`}>Role</p>
                  <p className={`mt-1 text-sm font-semibold ${textPrimary}`}>{profile?.role || 'Librarian'}</p>
                  {isEditing && <p className={`mt-0.5 text-[10px] ${textSecondary}`}>Role cannot be changed here</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Section */}
          <div className="flex flex-col justify-center p-8 lg:w-[320px]">
            <h3 className={`mb-4 text-sm font-bold ${textPrimary}`}>Account Status</h3>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className={`mb-3 rounded-full p-3 ${profile?.isActive !== false ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                <ShieldCheck size={28} />
              </div>
              <p className={`text-base font-bold ${profile?.isActive !== false ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {profile?.isActive !== false ? 'Active' : 'Inactive'}
              </p>
              <p className={`mt-1 text-xs ${textSecondary}`}>Your account is secure.</p>
            </div>
            
            <div className={`space-y-3 text-xs border-t pt-5 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 ${textSecondary}`}><Clock size={12} /> Last Login</div>
                <span className={`font-medium ${textPrimary}`}>Just now</span>
              </div>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 ${textSecondary}`}><MapPin size={12} /> Login IP</div>
                <span className={`font-medium ${textPrimary}`}>127.0.0.1</span>
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
                  <span>Just now</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                  <span>127.0.0.1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
