const fs = require('fs');
let content = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

// 1. Add status to MemberItem
content = content.replace(
  `  avatar: string
  profilePhotoData?: string | null
  outstandingFines: string
}`,
  `  avatar: string
  profilePhotoData?: string | null
  outstandingFines: string
  status: string
}`
);

// 2. Add status to mock data
content = content.replace(
  `profilePhotoData: null, outstandingFines: '$0.00' },`,
  `profilePhotoData: null, outstandingFines: '$0.00', status: 'Active' },`
).replace(
  `profilePhotoData: null, outstandingFines: '$0.00' },`,
  `profilePhotoData: null, outstandingFines: '$0.00', status: 'Active' },`
).replace(
  `profilePhotoData: null, outstandingFines: '$0.00' },`,
  `profilePhotoData: null, outstandingFines: '$0.00', status: 'Active' },`
).replace(
  `profilePhotoData: null, outstandingFines: '$120.00' },`,
  `profilePhotoData: null, outstandingFines: '$120.00', status: 'Suspended' },`
);

// 3. Add status to map in loadData
content = content.replace(
  `              profilePhotoData: member.profilePhotoData || null,
              outstandingFines: '$0.00',
            })),`,
  `              profilePhotoData: member.profilePhotoData || null,
              outstandingFines: '$0.00',
              status: member.status || 'Active',
            })),`
);

// 4. Make Borrowed Count dynamic in Member Information Card
content = content.replace(
  `                                <span className="text-[7.5px] font-bold text-slate-400 block uppercase tracking-wider">Borrowed Count</span>
                                <span className={\`font-extrabold block mt-0.5 text-[10px] \${isDarkMode ? 'text-slate-300' : 'text-slate-700'}\`}>
                                  1 / 5 books
                                </span>`,
  `                                <span className="text-[7.5px] font-bold text-slate-400 block uppercase tracking-wider">Borrowed Count</span>
                                <span className={\`font-extrabold block mt-0.5 text-[10px] \${isDarkMode ? 'text-slate-300' : 'text-slate-700'}\`}>
                                  {selectedMember?.borrowedCount || 0} / 5 books
                                </span>`
);

// 5. Make Membership Status dynamic
content = content.replace(
  `                                <span className="text-[7.5px] font-bold text-slate-400 block uppercase tracking-wider">Membership Status</span>
                                <div className="mt-0.5">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                    <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                                    Active
                                  </span>
                                </div>`,
  `                                <span className="text-[7.5px] font-bold text-slate-400 block uppercase tracking-wider">Membership Status</span>
                                <div className="mt-0.5">
                                  <span className={\`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold \${
                                    selectedMember?.status === 'Active' 
                                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                      : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                  }\`}>
                                    <span className={\`h-1 w-1 rounded-full \${selectedMember?.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}\`}></span>
                                    {selectedMember?.status || 'Active'}
                                  </span>
                                </div>`
);

fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
