const fs = require('fs');

// 1. Update BooksPage.tsx
let booksCode = fs.readFileSync('src/pages/BooksPage.tsx', 'utf8');

// Add to BookActionsMenuProps
const actionsMenuPropsSearch = "onReserve: () => void";
const actionsMenuPropsReplace = "onReserve: () => void\n  onBorrow: () => void";
booksCode = booksCode.replace(actionsMenuPropsSearch, actionsMenuPropsReplace);

// Add to BookActionsMenu signature
const actionsMenuSigSearch = "function BookActionsMenu({ isDarkMode, isArchived, onViewDetails, onEdit, onReserve, onDelete, onArchive }: BookActionsMenuProps) {";
const actionsMenuSigReplace = "function BookActionsMenu({ isDarkMode, isArchived, onViewDetails, onEdit, onReserve, onBorrow, onDelete, onArchive }: BookActionsMenuProps) {";
booksCode = booksCode.replace(actionsMenuSigSearch, actionsMenuSigReplace);

// Call onBorrow in "Borrow Book" click handler
const borrowClickSearch = `            onClick={() => setOpen(false)}
          >
            <BookMarked size={15} className="shrink-0 text-emerald-500" />
            Borrow Book`;
const borrowClickReplace = `            onClick={() => { setOpen(false); onBorrow(); }}
          >
            <BookMarked size={15} className="shrink-0 text-emerald-500" />
            Borrow Book`;
booksCode = booksCode.replace(borrowClickSearch, borrowClickReplace);

// Add to BooksPageProps
const booksPagePropsSearch = "onReserveBook: (bookId: number) => void";
const booksPagePropsReplace = "onReserveBook: (bookId: number) => void\n  onBorrowBook: (bookId: number) => void";
booksCode = booksCode.replace(booksPagePropsSearch, booksPagePropsReplace);

// Add to BooksPage signature
const booksPageSigSearch = "export function BooksPage({ isDarkMode, onOpenBookDetail, onOpenAddBook, onReserveBook, refreshKey = 0, externalToastMessage = null, onExternalToastConsumed }: BooksPageProps) {";
const booksPageSigReplace = "export function BooksPage({ isDarkMode, onOpenBookDetail, onOpenAddBook, onReserveBook, onBorrowBook, refreshKey = 0, externalToastMessage = null, onExternalToastConsumed }: BooksPageProps) {";
booksCode = booksCode.replace(booksPageSigSearch, booksPageSigReplace);

// Pass onBorrow to BookActionsMenu (first usage)
const menuUsageSearch1 = "onReserve={() => onReserveBook(book.id)} onDelete={() => setBookToDelete(book)} onArchive={async () => {";
const menuUsageReplace1 = "onReserve={() => onReserveBook(book.id)} onBorrow={() => onBorrowBook(book.id)} onDelete={() => setBookToDelete(book)} onArchive={async () => {";
booksCode = booksCode.replace(menuUsageSearch1, menuUsageReplace1);

// Pass onBorrow to BookActionsMenu (second usage)
const menuUsageSearch2 = "onReserve={() => onReserveBook(book.id)} onDelete={() => setBookToDelete(book)} onArchive={async () => {"; // Since I replaced the first one, the second one is now the first match. Wait! Just replace globally or do it twice.
// I will just replace globally for this specific string since it's identical
booksCode = booksCode.replaceAll(menuUsageSearch1, menuUsageReplace1);

fs.writeFileSync('src/pages/BooksPage.tsx', booksCode);
console.log("BooksPage updated");


// 2. Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const appUsageSearch = `                onReserveBook={(bookId) => {
                  setReservationInitialBookId(bookId)
                  setActivePage('Reservations')
                }}`;
const appUsageReplace = `                onReserveBook={(bookId) => {
                  setReservationInitialBookId(bookId)
                  setActivePage('Reservations')
                }}
                onBorrowBook={(bookId) => {
                  setBorrowPrefill({ bookId })
                  setBorrowReturnActiveTab('borrow')
                  setActivePage('Transactions')
                }}`;

appCode = appCode.replace(appUsageSearch, appUsageReplace);

fs.writeFileSync('src/App.tsx', appCode);
console.log("App.tsx updated");
