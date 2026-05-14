import { useState } from 'react'
import { Users, UserCheck, UserX, ShieldCheck, Calendar, Search, ChevronDown, Filter, Plus, Download, Pencil, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react'

type StaffRole = 'Administrator' | 'Librarian' | 'Assistant Librarian' | 'Library Clerk'
type StaffStatus = 'Active' | 'Inactive'

type StaffMember = {
  id: string
  name: string
  email: string
  role: StaffRole
  branch: string
  status: StaffStatus
  joinedOn: string
  joinedTime: string
  avatar: string
}

type StaffPageProps = {
  isDarkMode: boolean
}

const stats = [
  { label: 'Total Staff', value: '18', subValue: '↑ 2 this month', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Active Staff', value: '16', subValue: '88.9% of total', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Inactive Staff', value: '2', subValue: '11.1% of total', icon: UserX, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Administrators', value: '5', subValue: '27.8% of total', icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'New This Month', value: '1', subValue: 'New staff added', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50' },
]

const staffData: StaffMember[] = [
  { id: 'ST-001', name: 'James Anderson', email: 'james.anderson@infolib.com', role: 'Administrator', branch: 'Central Library', status: 'Active', joinedOn: 'May 10, 2026', joinedTime: '09:15 AM', avatar: '👨🏻' },
  { id: 'ST-002', name: 'Maria Santos', email: 'maria.santos@infolib.com', role: 'Librarian', branch: 'North Branch', status: 'Active', joinedOn: 'May 8, 2026', joinedTime: '02:30 PM', avatar: '👩🏽' },
  { id: 'ST-003', name: 'Juan Dela Cruz', email: 'juan.delacruz@infolib.com', role: 'Assistant Librarian', branch: 'Central Library', status: 'Active', joinedOn: 'May 7, 2026', joinedTime: '11:20 AM', avatar: '👨🏼' },
  { id: 'ST-004', name: 'Ana Lim', email: 'ana.lim@infolib.com', role: 'Librarian', branch: 'West Branch', status: 'Active', joinedOn: 'May 6, 2026', joinedTime: '10:45 AM', avatar: '👩🏻' },
  { id: 'ST-005', name: 'Pedro Reyes', email: 'pedro.reyes@infolib.com', role: 'Assistant Librarian', branch: 'South Branch', status: 'Active', joinedOn: 'May 5, 2026', joinedTime: '03:05 PM', avatar: '👨🏼' },
  { id: 'ST-006', name: 'Sarah Wilson', email: 'sarah.wilson@infolib.com', role: 'Library Clerk', branch: 'Central Library', status: 'Inactive', joinedOn: 'Apr 28, 2026', joinedTime: '09:10 AM', avatar: '👩🏼' },
  { id: 'ST-007', name: 'Carlo Garcia', email: 'carlo.garcia@infolib.com', role: 'Library Clerk', branch: 'North Branch', status: 'Active', joinedOn: 'Apr 25, 2026', joinedTime: '01:45 PM', avatar: '👨🏻' },
  { id: 'ST-008', name: 'Alicia H.', email: 'alicia.h@infolib.com', role: 'Assistant Librarian', branch: 'West Branch', status: 'Active', joinedOn: 'Apr 20, 2026', joinedTime: '11:30 AM', avatar: '👩🏻' },
]

export function StaffPage({ isDarkMode }: StaffPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const getRoleStyle = (role: StaffRole) => {
    switch (role) {
      case 'Administrator': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400'
      case 'Librarian': return 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400'
      case 'Assistant Librarian': return 'text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400'
      case 'Library Clerk': return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400'
    }
  }

  return (
    <div className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <section className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Staff</h2>
            <p className={`mt-1 text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage library staff and their access to the system.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <Download size={16} />
              Export
            </button>
            <button type="button" onClick={() => setIsAddModalOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-sm">
              <Plus size={18} />
              Add Staff Member
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <article key={stat.label} className={`rounded-xl border p-5 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_30px_-18px_rgba(16,185,129,0.55)] ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center gap-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.bg} ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex flex-col">
                    <p className={`text-xs font-bold text-slate-500 dark:text-slate-400`}>{stat.label}</p>
                    <p className={`text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{stat.value}</p>
                  </div>
                </div>
                <p className={`mt-3 text-[11px] font-bold ${stat.color === 'text-rose-600' || stat.color === 'text-violet-600' ? 'text-slate-500 dark:text-slate-400' : stat.color}`}>
                  {stat.subValue}
                </p>
              </article>
            )
          })}
        </section>

        <div className={`mt-8 overflow-hidden rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200/60 bg-white shadow-[0_6px_14px_-12px_rgba(15,23,42,0.22)]'}`}>
          <div className={`flex flex-wrap items-center gap-4 p-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <label className={`group flex h-12 min-w-[320px] flex-1 items-center rounded-xl border px-3 transition-all ${isDarkMode ? 'border-slate-700 focus-within:border-emerald-500 bg-[#0f1f49]' : 'border-slate-200 focus-within:border-emerald-500 bg-slate-50'}`}>
              <Search size={18} className={`mr-2 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
              <input className={`w-full bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`} placeholder="Search staff by name, email or role..." />
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Role</span>
                <div className="relative">
                  <select className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <option>All Roles</option>
                    <option>Administrator</option>
                    <option>Librarian</option>
                    <option>Assistant Librarian</option>
                    <option>Library Clerk</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status</span>
                <div className="relative">
                  <select className={`h-11 min-w-[120px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Branch</span>
                <div className="relative">
                  <select className={`h-11 min-w-[140px] appearance-none rounded-xl border py-2 pl-4 pr-10 text-xs font-bold outline-none ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <option>All Branches</option>
                    <option>Central Library</option>
                    <option>North Branch</option>
                    <option>West Branch</option>
                  </select>
                  <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>

              <button className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-white'}`}>
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className={isDarkMode ? 'bg-[#0f1f49]/50 text-slate-400' : 'bg-slate-50/50 text-slate-500'}>
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Staff Name</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Joined On</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((staff) => (
                  <tr key={staff.id} className={`border-t transition-colors duration-150 ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-full text-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-100'}`}>{staff.avatar}</span>
                        <p className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{staff.name}</p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{staff.email}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${getRoleStyle(staff.role)}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{staff.branch}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-md px-3 py-1 text-[11px] font-semibold tracking-wide ${
                        staff.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{staff.joinedOn}</p>
                      <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{staff.joinedTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button title="Edit Staff" type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-white hover:text-blue-600'}`}>
                          <Pencil size={14} />
                        </button>
                        <button title="Delete Staff" type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-rose-900/30 text-rose-500 hover:bg-rose-500/20' : 'border-rose-100 text-rose-500 hover:bg-rose-50'}`}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-4 border-t p-4 text-xs font-bold ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
            <p>Showing 1 to 8 of 18 staff members</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm">1</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>2</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>3</button>
                <button type="button" className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-white'}`}>
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="relative">
                <select className={`h-8 min-w-[100px] appearance-none rounded-lg border pl-3 pr-8 text-[11px] font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                  <option>10 / page</option>
                  <option>20 / page</option>
                </select>
                <ChevronDown size={12} className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section className={`w-full max-w-2xl rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'}`}>
            <div className={`flex items-start justify-between border-b px-8 py-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Add Staff Member</h3>
                <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Create a new staff profile and set system permissions.</p>
              </div>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <X size={18} />
              </button>
            </div>

            <form className="space-y-6 px-8 py-8">
               <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Full Name <span className="text-rose-500">*</span></label>
                  <input placeholder="e.g. James Anderson" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`} required />
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Email Address <span className="text-rose-500">*</span></label>
                  <input placeholder="email@infolib.com" className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`} required />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>System Role</label>
                  <div className="relative">
                    <select className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`}>
                      <option>Librarian</option>
                      <option>Administrator</option>
                      <option>Assistant Librarian</option>
                      <option>Library Clerk</option>
                    </select>
                    <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Assigned Branch</label>
                  <div className="relative">
                    <select className={`h-12 w-full appearance-none rounded-xl border pl-4 pr-10 text-sm font-bold outline-none transition-all ${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100 focus:border-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-emerald-500'}`}>
                      <option>Central Library</option>
                      <option>North Branch</option>
                      <option>West Branch</option>
                      <option>South Branch</option>
                    </select>
                    <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className={`h-12 flex-1 rounded-xl border font-bold transition-all ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Cancel</button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="h-12 flex-1 rounded-xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all">Add Staff Member</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
