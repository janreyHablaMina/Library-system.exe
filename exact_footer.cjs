const fs = require('fs');

let code = fs.readFileSync('src/pages/AddBookPage.tsx', 'utf8');

const searchStr = `<div className={\`-mx-9 sticky bottom-0 mt-4 border-t px-9 py-4 \${isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'}\`}>`;

const index = code.indexOf(searchStr);

if (index !== -1) {
  // Find the end of this div block. It ends right before `</form>`
  const endSearchStr = `</form>`;
  const endIndex = code.indexOf(endSearchStr, index);
  
  if (endIndex !== -1) {
    const oldBlock = code.substring(index, endIndex);
    
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
        </div>
      `;
      
    code = code.replace(oldBlock, newFooter);
    fs.writeFileSync('src/pages/AddBookPage.tsx', code);
    console.log("Replaced successfully!");
  } else {
    console.log("End not found");
  }
} else {
  console.log("Start not found");
}
