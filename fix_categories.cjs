const fs = require('fs');
let content = fs.readFileSync('src/pages/CategoriesPage.tsx', 'utf8');

// 1. Dashboard Statistics
content = content.replace(/\{ label: 'Most Popular'[\s\S]*?\},/, '');
content = content.replace(/\{ label: 'New This Month'[\s\S]*?\},/, '');
content = content.replace(/\{ label: 'Most Popular'[\s\S]*?\},/, ''); // For the top-level declaration if present
content = content.replace(/\{ label: 'New This Month'[\s\S]*?\},/, '');
content = content.replace('xl:grid-cols-5', 'xl:grid-cols-3');

// 2. Filters
content = content.replace(/<button className=\{`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all .*?>\s*<Filter size=\{16\} \/>\s*Filter\s*<\/button>/, '');

// 3. Table Headers
content = content.replace(/<th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Created On<\/th>\s*/, '');

// 4. Table Body
content = content.replace(/<td className="px-6 py-4">\s*<p className=\{`text-\[11px\] font-semibold \$\{isDarkMode \? 'text-slate-200' : 'text-slate-700'\}`\}>\{cat\.createdOn\}<\/p>\s*<p className=\{`text-\[10px\] font-medium \$\{isDarkMode \? 'text-slate-500' : 'text-slate-400'\}`\}>\{cat\.createdTime\}<\/p>\s*<\/td>\s*/, '');

fs.writeFileSync('src/pages/CategoriesPage.tsx', content);
