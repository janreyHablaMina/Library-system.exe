const fs = require('fs');
let content = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

// 1. Dynamic states
content = content.replace(
  `  const [reservationDate, setReservationDate] = useState('2026-05-21')
  const [expiresOn, setExpiresOn] = useState('2026-05-28')`,
  `  const [reservationDate, setReservationDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [expiresOn, setExpiresOn] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10)
  })`
);

// 2. Dynamic button click
content = content.replace(
  `setReservationDate('2026-05-21'); setExpiresOn('2026-05-28');`,
  `const now = new Date(); setReservationDate(now.toISOString().slice(0, 10)); now.setDate(now.getDate() + 7); setExpiresOn(now.toISOString().slice(0, 10));`
);

// 3. Update grid from cols-3 to cols-2 and remove Priority UI
content = content.replace(
  `                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div>
                          <label className={\`text-[11px] font-bold uppercase tracking-wider \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>Reservation Date</label>`,
  `                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className={\`text-[11px] font-bold uppercase tracking-wider \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>Reservation Date</label>`
);

const priorityDropdownPattern = `                        <div>
                          <label className={\`text-[11px] font-bold uppercase tracking-wider \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>Priority</label>
                          <div className="relative mt-1.5">
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} className={\`h-11 w-full appearance-none rounded-xl border pl-4 pr-10 outline-none text-xs font-semibold focus:border-emerald-500 \${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-100' : 'border-slate-200 bg-white text-slate-700'}\`}>
                              <option>Normal</option>
                              <option>High</option>
                              <option>Urgent</option>
                            </select>
                            <ChevronDown size={16} className={\`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`} />
                          </div>
                        </div>`;

content = content.replace(priorityDropdownPattern, '');

// 4. Remove from Reservation Overview
const priorityOverviewPattern = `                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400 font-bold">Priority</span>
                          <span className={\`font-extrabold \${isDarkMode ? 'text-slate-300' : 'text-slate-700'}\`}>{priority}</span>
                        </div>`;

content = content.replace(priorityOverviewPattern, '');

fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
