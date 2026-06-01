const fs = require('fs');
let content = fs.readFileSync('src/pages/AuthorsPage.tsx', 'utf8');

// 1. Stats
content = content.replace(/\{ label: 'Top Nationality'[\s\S]*?\},/, '');
content = content.replace(/\{ label: 'New This Month'[\s\S]*?\},/, '');
content = content.replace('xl:grid-cols-5', 'xl:grid-cols-3');

// 2. Filters
content = content.replace(/<div className="flex items-center gap-2">\s*<span className="text-xs font-bold text-slate-500">Nationality<\/span>[\s\S]*?<\/div>\s*<\/div>\s*<div className="flex items-center gap-2">\s*<span className="text-xs font-bold text-slate-500">Status<\/span>/, '<div className="flex items-center gap-2">\n                <span className="text-xs font-bold text-slate-500">Status</span>');
content = content.replace(/<button className=\{`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all .*?>\s*<Filter size=\{16\} \/>\s*Filter\s*<\/button>/, '');

// 3. Table Headers
content = content.replace(/<th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Date of Birth<\/th>\s*/, '');
content = content.replace(/<th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Added On<\/th>\s*/, '');

// 4. Table Body
content = content.replace(/<td className=\{`px-6 py-4 text-xs font-medium \$\{isDarkMode \? 'text-slate-300' : 'text-slate-600'\}`\}>\{author\.dob\}<\/td>\s*/, '');
content = content.replace(/<td className="px-6 py-4">\s*<p className=\{`text-\[11px\] font-semibold.*?>\{author.addedOn\}<\/p>\s*<p className=\{`text-\[10px\] font-medium.*?>\{author.addedTime\}<\/p>\s*<\/td>\s*/, '');

fs.writeFileSync('src/pages/AuthorsPage.tsx', content);
