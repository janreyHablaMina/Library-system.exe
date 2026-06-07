const fs = require('fs');

let code = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

const gridSearch = 'div className="mt-5 grid gap-5 md:grid-cols-2"';
const gridReplace = 'div className="mt-5 grid gap-5"';

code = code.replace(gridSearch, gridReplace);

const notifyStartSearch = '                      <div>\n                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? \'text-zinc-400\' : \'text-zinc-500\'}`}>Notify Member Via</label>';
const notifyEndSearch = '                      <div className="flex flex-col h-full">\n                        <div className="flex items-center justify-between">\n                          <label className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? \'text-zinc-400\' : \'text-zinc-500\'}`}>Notes (Optional)</label>';

const startIdx = code.indexOf(notifyStartSearch);
const endIdx = code.indexOf(notifyEndSearch);

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + code.substring(endIdx);
  fs.writeFileSync('src/pages/ReservationsPage.tsx', code);
  console.log("Removed Notify UI");
} else {
  console.log("Could not find start or end bounds.");
  console.log("startIdx:", startIdx, "endIdx:", endIdx);
}
