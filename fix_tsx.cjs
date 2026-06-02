const fs = require('fs');
let content = fs.readFileSync('src/pages/TransactionDetailPage.tsx', 'utf8');

// Fix type imports
content = content.replace(
  `import {\n  BorrowTransaction,\n  Book,\n  Member,\n  listBorrowTransactions,`,
  `import type { BorrowTransaction, Book, Member } from '../lib/tauriApi'\nimport {\n  listBorrowTransactions,`
);

// Fix member properties
content = content.replace(/member\?\.type/g, 'member?.memberType');
content = content.replace(/member\?\.joinDate/g, 'member?.createdAt');
content = content.replace(/member\?\.phone/g, 'member?.contactNumber');

// Remove book publisher since it's not in Book type
content = content.replace(
  `              <div className="flex items-center text-sm">\n                <span className={\`flex items-center gap-3 w-32 font-medium \${labelClass}\`}><StickyNote size={15} className="opacity-60" /> Publisher</span>\n                <span className={\`font-semibold truncate \${valueClass}\`}>{book?.publisher || '-'}</span>\n              </div>`,
  ''
);

// Remove unused imports
content = content.replace(/import sarahAvatar from '\.\.\/assets\/sarah_avatar\.png'\n/g, '');
content = content.replace(/import bookCover from '\.\.\/assets\/login\.avif'\n/g, '');

fs.writeFileSync('src/pages/TransactionDetailPage.tsx', content);
