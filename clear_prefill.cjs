const fs = require('fs');

// 1. Update BorrowReturnPage.tsx
let borrowCode = fs.readFileSync('src/pages/BorrowReturnPage.tsx', 'utf8');

// Add to BorrowReturnPageProps
const propsSearch = "prefillBorrowData?: { memberId?: number, bookId: number } | null";
const propsReplace = "prefillBorrowData?: { memberId?: number, bookId: number } | null\n  onClearPrefill?: () => void";
if (borrowCode.includes(propsSearch)) {
  borrowCode = borrowCode.replace(propsSearch, propsReplace);
}

// Add to BorrowReturnPage signature
const sigSearch = "export function BorrowReturnPage({ isDarkMode, onOpenTransactions, initialTab = 'borrow', prefillBorrowData }: BorrowReturnPageProps) {";
const sigReplace = "export function BorrowReturnPage({ isDarkMode, onOpenTransactions, initialTab = 'borrow', prefillBorrowData, onClearPrefill }: BorrowReturnPageProps) {";
if (borrowCode.includes(sigSearch)) {
  borrowCode = borrowCode.replace(sigSearch, sigReplace);
}

// Add onClearPrefill?.() to handleConfirmAction
const successSearch = "setShowToast(`Successfully borrowed \"${selectedBook.title}\" to ${selectedMember.name}!`)";
const successReplace = "setShowToast(`Successfully borrowed \"${selectedBook.title}\" to ${selectedMember.name}!`)\n        onClearPrefill?.()";
if (borrowCode.includes(successSearch)) {
  borrowCode = borrowCode.replace(successSearch, successReplace);
}

fs.writeFileSync('src/pages/BorrowReturnPage.tsx', borrowCode);
console.log("BorrowReturnPage updated");


// 2. Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const appUsageSearch = `                prefillBorrowData={borrowPrefill}
                onOpenTransactions={(tab) => {`;
const appUsageReplace = `                prefillBorrowData={borrowPrefill}
                onClearPrefill={() => setBorrowPrefill(null)}
                onOpenTransactions={(tab) => {`;

if (appCode.includes(appUsageSearch)) {
  appCode = appCode.replace(appUsageSearch, appUsageReplace);
  fs.writeFileSync('src/App.tsx', appCode);
  console.log("App.tsx updated");
} else {
  console.log("App.tsx usage search failed");
}
