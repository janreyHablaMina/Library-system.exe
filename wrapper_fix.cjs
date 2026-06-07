const fs = require('fs');

let code = fs.readFileSync('src/pages/AddBookPage.tsx', 'utf8');

// Replace 1: <div className={`min-h-0 flex-1 overflow-auto p-4
const divSearch = "className={`min-h-0 flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}";
const divReplace = "className={`min-h-0 flex-1 overflow-auto px-4 pt-4 ${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}`}";

if (code.includes(divSearch)) {
  code = code.replace(divSearch, divReplace);
}

// Replace 2: <form onSubmit={handleSubmit} className="p-5">
const formSearch = 'form onSubmit={handleSubmit} className="p-5"';
const formReplace = 'form onSubmit={handleSubmit} className="px-5 pt-5 pb-0"';

if (code.includes(formSearch)) {
  code = code.replace(formSearch, formReplace);
}

fs.writeFileSync('src/pages/AddBookPage.tsx', code);
console.log("Wrapper padding fixed.");
