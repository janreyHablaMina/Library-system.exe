const fs = require('fs');

let code = fs.readFileSync('src/pages/AddBookPage.tsx', 'utf8');

// Find the sticky footer
const footerRegex = /<div className={`-mx-9 sticky bottom-0 mt-4 border-t px-9 py-4 \${isDarkMode \? 'border-zinc-800 bg-\[#18181B\]' : 'border-zinc-200 bg-white'}`}>[\s\S]*?<Save size={15} \/>\s*\{isSaving \? 'Saving\.\.\.' : 'Save Book'\}\s*<\/button>\s*<\/div>\s*<\/div>/;

const newFooter = `<div className={\`-mx-9 sticky bottom-0 mt-5 border-t px-9 py-4 \${
          isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
        }\`}>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className={\`h-11 rounded-lg border px-8 text-sm font-semibold \${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'}\`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-700 px-8 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              <Save size={16} />
              Save Book
            </button>
          </div>
        </div>`;

if (code.match(footerRegex)) {
  code = code.replace(footerRegex, newFooter);
  fs.writeFileSync('src/pages/AddBookPage.tsx', code);
  console.log("Footer replaced!");
} else {
  console.log("Footer NOT matched.");
}
