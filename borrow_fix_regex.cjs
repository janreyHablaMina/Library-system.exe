const fs = require('fs');

let booksCode = fs.readFileSync('src/pages/BooksPage.tsx', 'utf8');

// Use exact line indexes and string replacement with robust matching

// 1. Add to BookActionsMenuProps
const actionsMenuPropsSearch = /onReserve: \(\) => void/;
if (booksCode.match(actionsMenuPropsSearch)) {
  booksCode = booksCode.replace(actionsMenuPropsSearch, "onReserve: () => void\n  onBorrow: () => void");
}

// 2. Add to BookActionsMenu signature
const actionsMenuSigSearch = /function BookActionsMenu\(\{ isDarkMode, isArchived, onViewDetails, onEdit, onReserve, onDelete, onArchive \}: BookActionsMenuProps\) \{/;
if (booksCode.match(actionsMenuSigSearch)) {
  booksCode = booksCode.replace(actionsMenuSigSearch, "function BookActionsMenu({ isDarkMode, isArchived, onViewDetails, onEdit, onReserve, onBorrow, onDelete, onArchive }: BookActionsMenuProps) {");
}

// 3. Call onBorrow in "Borrow Book" click handler
// Because of \r\n vs \n, regex is safer
const borrowClickSearch = /onClick=\{\(\) => setOpen\(false\)\}\s*>\s*<BookMarked size=\{15\} className="shrink-0 text-emerald-500" \/>\s*Borrow Book/g;
if (booksCode.match(borrowClickSearch)) {
  booksCode = booksCode.replace(borrowClickSearch, `onClick={() => { setOpen(false); onBorrow(); }}\n          >\n            <BookMarked size={15} className="shrink-0 text-emerald-500" />\n            Borrow Book`);
} else {
  console.log("Could not find Borrow Book click handler");
}

// 4. Add to BooksPageProps
const booksPagePropsSearch = /onReserveBook: \(bookId: number\) => void/;
if (booksCode.match(booksPagePropsSearch)) {
  booksCode = booksCode.replace(booksPagePropsSearch, "onReserveBook: (bookId: number) => void\n  onBorrowBook: (bookId: number) => void");
}

// 5. Add to BooksPage signature
const booksPageSigSearch = /export function BooksPage\(\{ isDarkMode, onOpenBookDetail, onOpenAddBook, onReserveBook, refreshKey = 0, externalToastMessage = null, onExternalToastConsumed \}: BooksPageProps\) \{/;
if (booksCode.match(booksPageSigSearch)) {
  booksCode = booksCode.replace(booksPageSigSearch, "export function BooksPage({ isDarkMode, onOpenBookDetail, onOpenAddBook, onReserveBook, onBorrowBook, refreshKey = 0, externalToastMessage = null, onExternalToastConsumed }: BooksPageProps) {");
}

// 6. Pass onBorrow to BookActionsMenu
const menuUsageSearch = /onReserve=\{\(\) => onReserveBook\(book\.id\)\} onDelete=\{\(\) => setBookToDelete\(book\)\} onArchive=\{async \(\) => \{/g;
if (booksCode.match(menuUsageSearch)) {
  booksCode = booksCode.replace(menuUsageSearch, "onReserve={() => onReserveBook(book.id)} onBorrow={() => onBorrowBook(book.id)} onDelete={() => setBookToDelete(book)} onArchive={async () => {");
}

fs.writeFileSync('src/pages/BooksPage.tsx', booksCode);
console.log("BooksPage updated correctly");
