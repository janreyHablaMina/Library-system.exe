const fs = require('fs');
let code = fs.readFileSync('src/pages/BooksPage.tsx', 'utf8');

const search = `          <button
            type="button"
            className={\`\${itemBase} \${itemNormal}\`}
            role="menuitem"
            onClick={() => { setOpen(false); onBorrow(); }}
          >
            <BookMarked size={15} className="shrink-0 text-emerald-500" />
            Borrow Book
          </button>
          {!isArchived && (
            <button
              type="button"
              className={\`\${itemBase} \${itemNormal}\`}
              role="menuitem"
              onClick={() => { setOpen(false); onReserve(); }}
            >
              <Bookmark size={15} className="shrink-0 text-violet-500" />
              Reserve Book
            </button>
          )}`;

const replace = `          {!isArchived && (
            <>
              <button
                type="button"
                className={\`\${itemBase} \${itemNormal}\`}
                role="menuitem"
                onClick={() => { setOpen(false); onBorrow(); }}
              >
                <BookMarked size={15} className="shrink-0 text-emerald-500" />
                Borrow Book
              </button>
              <button
                type="button"
                className={\`\${itemBase} \${itemNormal}\`}
                role="menuitem"
                onClick={() => { setOpen(false); onReserve(); }}
              >
                <Bookmark size={15} className="shrink-0 text-violet-500" />
                Reserve Book
              </button>
            </>
          )}`;

if (code.includes(search)) {
  code = code.replace(search, replace);
  fs.writeFileSync('src/pages/BooksPage.tsx', code);
  console.log("Updated successfully");
} else {
  // Try regex if spacing is different due to \r\n
  const regex = /<button\s+type="button"\s+className=\{`\$\{itemBase\} \$\{itemNormal\}`\}\s+role="menuitem"\s+onClick=\{\(\) => \{ setOpen\(false\); onBorrow\(\); \}\}\s*>\s*<BookMarked size=\{15\} className="shrink-0 text-emerald-500" \/>\s*Borrow Book\s*<\/button>\s*\{!isArchived && \(\s*<button\s+type="button"\s+className=\{`\$\{itemBase\} \$\{itemNormal\}`\}\s+role="menuitem"\s+onClick=\{\(\) => \{ setOpen\(false\); onReserve\(\); \}\}\s*>\s*<Bookmark size=\{15\} className="shrink-0 text-violet-500" \/>\s*Reserve Book\s*<\/button>\s*\)\}/;
  if (code.match(regex)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/pages/BooksPage.tsx', code);
    console.log("Updated via regex successfully");
  } else {
    console.log("Failed to find target");
  }
}
