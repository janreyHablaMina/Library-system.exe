const fs = require('fs');

let content = fs.readFileSync('src/pages/TransactionsPage.tsx', 'utf8');

// 1. Update TransactionStatus
content = content.replace(
  `type TransactionStatus = 'Active' | 'Returned' | 'Overdue'`,
  `type TransactionStatus = 'Borrowed' | 'Returned' | 'Overdue'`
);

// 2. Update getStatusClass
content = content.replace(
  `if (status === 'Active') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'`,
  `if (status === 'Borrowed') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'`
);

// 3. Update inferStatus
content = content.replace(
  `return 'Active'`,
  `return 'Borrowed'`
);

// 4. Update TransactionActionsMenuProps and usages inside menu
// The menu checks: (status === 'Active' || status === 'Overdue')
content = content.replace(
  /status === 'Active'/g,
  `status === 'Borrowed'`
);

// 5. Remove columns from <thead>
// ID, Type, Copy ID, Return Date, Fine
content = content.replace(
  /<th className="px-4 py-3 font-semibold">ID<\/th>\r?\n\s*<th className="px-3 py-3 font-semibold">Type<\/th>\r?\n\s*<th className="px-3 py-3 font-semibold">Member<\/th>/,
  `<th className="px-3 py-3 font-semibold">Member</th>`
);
content = content.replace(
  /<th className="px-3 py-3 font-semibold">Book<\/th>\r?\n\s*<th className="px-3 py-3 font-semibold">Copy ID<\/th>\r?\n\s*<th className="px-3 py-3 font-semibold">Borrow Date<\/th>/,
  `<th className="px-3 py-3 font-semibold">Book</th>\n                  <th className="px-3 py-3 font-semibold">Borrow Date</th>`
);
content = content.replace(
  /<th className="px-3 py-3 font-semibold">Due Date<\/th>\r?\n\s*<th className="px-3 py-3 font-semibold">Return Date<\/th>\r?\n\s*<th className="px-3 py-3 font-semibold">Status<\/th>\r?\n\s*<th className="px-3 py-3 font-semibold">Fine<\/th>/,
  `<th className="px-3 py-3 font-semibold">Due Date</th>\n                  <th className="px-3 py-3 font-semibold">Status</th>`
);

// 6. Remove columns from <tbody> (inside paginatedTransactions.map)
content = content.replace(
  /<td className={`px-4 py-3 font-semibold \${isDarkMode \? 'text-slate-300' : 'text-slate-700'}`}>{row\.id}<\/td>\r?\n\s*<td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold \${getTypeClass\(row\.type\)}`}>{row\.type}<\/span><\/td>\r?\n\s*<td className="px-3 py-3">/,
  `<td className="px-3 py-3">`
);

content = content.replace(
  /<td className="px-3 py-3"><p className={`font-semibold \${isDarkMode \? 'text-slate-100' : 'text-slate-900'}`}>{row\.book}<\/p><p className={`text-xs \${isDarkMode \? 'text-slate-400' : 'text-slate-500'}`}>{row\.author}<\/p><\/td>\r?\n\s*<td className={`px-3 py-3 \${isDarkMode \? 'text-slate-300' : 'text-slate-700'}`}>{row\.copyId}<\/td>/,
  `<td className="px-3 py-3"><p className={\`font-semibold \${isDarkMode ? 'text-slate-100' : 'text-slate-900'}\`}>{row.book}</p><p className={\`text-xs \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>{row.author}</p></td>`
);

content = content.replace(
  /<td className={`px-3 py-3 \${isDarkMode \? 'text-slate-300' : 'text-slate-700'}`}>{row\.dueDate}<\/td>\r?\n\s*<td className={`px-3 py-3 \${isDarkMode \? 'text-slate-300' : 'text-slate-700'}`}>{row\.returnDate}<\/td>\r?\n\s*<td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold \${getStatusClass\(row\.status\)}`}>{row\.status}<\/span><\/td>\r?\n\s*<td className={`px-3 py-3 font-semibold \${row\.fineValue > 0 \? 'text-rose-600' : isDarkMode \? 'text-slate-300' : 'text-slate-700'}`}>{row\.fine}<\/td>/,
  `<td className={\`px-3 py-3 \${isDarkMode ? 'text-slate-300' : 'text-slate-700'}\`}>{row.dueDate}</td>\n                    <td className="px-3 py-3"><span className={\`rounded-md px-2 py-1 text-xs font-semibold \${getStatusClass(row.status)}\`}>{row.status}</span></td>`
);

// 7. Update colSpan in the "No transactions found" row from 11 to 6
content = content.replace(
  /<td colSpan=\{11\} className={`px-4 py-8 text-center text-sm/,
  `<td colSpan={6} className={\`px-4 py-8 text-center text-sm`
);

// 8. Wait, is min-w-[1250px] still necessary for 6 columns? We should probably reduce it to auto or min-w-[800px].
content = content.replace(
  /className="min-w-\[1250px\] w-full text-left text-sm"/,
  `className="w-full min-w-[800px] text-left text-sm"`
);

fs.writeFileSync('src/pages/TransactionsPage.tsx', content);
