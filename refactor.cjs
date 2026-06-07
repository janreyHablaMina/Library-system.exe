const fs = require('fs')

let code = fs.readFileSync('src/pages/AddBookPage.tsx', 'utf8')

// 1. Fix the styling constants
code = code.replace(
  `  const cardClass = isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const iconBoxClass = isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
  const labelClass = isDarkMode ? 'text-zinc-200' : 'text-zinc-800'
  const inputClass = isDarkMode
    ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500'
    : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400'
  const subtleCardShadow = isDarkMode ? '' : 'shadow-[0_12px_32px_-28px_rgba(15,23,42,0.45)]'`,
  `  const cardClass = isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'
  const iconBoxClass = 'bg-emerald-500/10 text-emerald-500 shrink-0'
  const labelClass = isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
  const inputClass = isDarkMode
    ? 'border-zinc-700 bg-[#27272A] text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500'
    : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400 focus:border-emerald-500'
  const subtleCardShadow = ''`
)

// 2. Fix layout grid container
code = code.replace(
  `className={\`min-h-0 flex-1 overflow-auto p-4 \${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}\`}
    >
      <form onSubmit={handleSubmit} className="p-5">`,
  `className={\`min-h-0 flex-1 overflow-auto px-4 pt-4 \${isDarkMode ? 'bg-[transparent] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900'}\`}
    >
      <form onSubmit={handleSubmit} className="px-5 pt-5 pb-0">`
)

code = code.replace(
  `className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_480px]"`,
  `className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_450px]"`
)

// 3. Remove subtleCardShadow from articles
code = code.replaceAll(' ${subtleCardShadow}', '')

// 4. Update the Basic Information header
code = code.replace(
  `<div className={\`grid h-11 w-11 place-items-center rounded-full \${iconBoxClass}\`}>
                  <BookOpen size={19} />
                </div>
                <div>
                  <h3 className={\`text-lg font-black leading-tight \${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}\`}>Basic Information</h3>
                </div>`,
  `<div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                  <BookOpen size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Basic Information</h3>
                  <p className={\`text-xs \${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}\`}>Provide the essential details about the book.</p>
                </div>`
)

code = code.replace(
  `mb-6 flex items-start gap-4`,
  `mb-5 flex items-start gap-3 border-b border-zinc-200/10 pb-4`
)

// 5. Update inputs and labels across the board
code = code.replaceAll('text-xs font-black ${labelClass}', 'text-xs font-bold uppercase tracking-wider ${labelClass}')
code = code.replaceAll('mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none focus:border-emerald-500', 'mt-1.5 h-11 w-full rounded-xl border px-4 outline-none')
code = code.replaceAll('h-12 w-full rounded-xl border px-4 pr-10 text-sm outline-none focus:border-emerald-500', 'h-11 w-full rounded-xl border px-4 pr-10 outline-none')
code = code.replaceAll('h-12 w-full rounded-xl border px-4 pr-10 text-left text-sm outline-none focus:border-emerald-500', 'h-11 w-full rounded-xl border px-4 pr-10 text-left outline-none')
code = code.replaceAll('h-12 w-full appearance-none rounded-xl border px-10 pr-10 text-sm outline-none focus:border-emerald-500', 'h-11 w-full appearance-none rounded-xl border pl-10 pr-10 outline-none')
code = code.replaceAll('mt-2 min-h-[126px] w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-emerald-500', 'mt-1.5 min-h-[116px] w-full rounded-xl border px-4 py-3 outline-none')

// 6. Merge Optional Details fields into Basic Information
const optionalDetailsStart = code.indexOf('<article className={`rounded-2xl border p-6  ${cardClass}`}>')

if (optionalDetailsStart !== -1) {
  // Extract Optional Details content
  const articleRegex = /<article className={`rounded-2xl border p-6  \${cardClass}`}>\s*<div className="mb-6 flex items-start gap-4">[\s\S]*?<h3 className={`text-lg font-black leading-tight \${isDarkMode \? 'text-zinc-100' : 'text-\[#0a1b4f\]'}`}>Optional Details<\/h3>[\s\S]*?<\/div>\s*<\/div>\s*([\s\S]*?)<\/article>/;
  
  const match = code.match(articleRegex);
  if (match) {
    const fieldsHtml = match[1];
    
    // Remove the entire Optional Details article
    code = code.replace(match[0], '');
    
    // Let's do it with string split:
    // First, find `</div>\n            </article>\n\n          </div>`
    code = code.replace(
      /<\/div>\s*<\/article>\s*<\/div>\s*<aside className="space-y-4">/,
      `\n${fieldsHtml}\n              </div>\n            </article>\n          </div>\n\n          <aside className="space-y-6">`
    );
  } else {
    console.error("Optional details NOT MATCHED!")
  }
}

// 7. Update Cover and Inventory Headers
code = code.replace(
  `<div className={\`grid h-11 w-11 place-items-center rounded-full \${iconBoxClass}\`}>
                  <ImagePlus size={19} />
                </div>
                <div>
                  <h3 className={\`text-lg font-black leading-tight \${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}\`}>Book Cover</h3>
                  <p className={\`mt-1 text-xs font-medium \${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}\`}>Upload a cover image for this book.</p>
                </div>`,
  `<div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
                  <ImagePlus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Book Cover</h3>
                  <p className={\`text-xs \${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}\`}>Upload a cover image for this book.</p>
                </div>`
)

code = code.replace(
  `<div className={\`grid h-11 w-11 place-items-center rounded-full \${iconBoxClass}\`}>
                  <Package size={19} />
                </div>
                <div>
                  <h3 className={\`text-lg font-black leading-tight \${isDarkMode ? 'text-zinc-100' : 'text-[#0a1b4f]'}\`}>Inventory Information</h3>
                  <p className={\`mt-1 text-xs font-medium \${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}\`}>Provide inventory and availability details.</p>
                </div>`,
  `<div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Package size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Inventory Information</h3>
                  <p className={\`text-xs \${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}\`}>
                    Provide inventory and availability details.
                  </p>
                </div>`
)

code = code.replace(
  /mb-6 flex items-start gap-4/g,
  `mb-4 flex items-start gap-3`
)

// 8. Fix Sticky Footer gap
code = code.replace(
  `<div className={\`-mx-9 sticky bottom-0 mt-4 border-t px-9 py-3 \${isDarkMode ? 'border-zinc-800 bg-[transparent]' : 'border-zinc-200 bg-white'}\`}>`,
  `<div className={\`-mx-9 sticky bottom-0 mt-4 border-t px-9 py-4 \${isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'}\`}>`
)

fs.writeFileSync('src/pages/AddBookPage.tsx', code)
console.log('Refactored AddBookPage.tsx')
