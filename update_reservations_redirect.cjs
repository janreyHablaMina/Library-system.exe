const fs = require('fs');

function updateReservationsPage() {
  let content = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

  // Add prop to ReservationsPageProps
  content = content.replace(
    /type ReservationsPageProps = \{[\s\S]*?onOpenTransactionDetail: \(id: string\) => void\n\}/,
    `type ReservationsPageProps = {
  isDarkMode: boolean
  onOpenTransactionDetail: (id: string) => void
  onNavigateToBorrow?: (memberId: number, bookId: number) => void
}`
  );

  // Update component definition
  content = content.replace(
    /export function ReservationsPage\(\{ isDarkMode, onOpenTransactionDetail \}: ReservationsPageProps\) \{/,
    `export function ReservationsPage({ isDarkMode, onOpenTransactionDetail, onNavigateToBorrow }: ReservationsPageProps) {`
  );

  // Remove checkout state and functions
  const stateRegex = /\/\/ Checkout Modal State[\s\S]*?setIsCheckoutModalOpen\(false\)\n\s*\}/;
  content = content.replace(stateRegex, '');

  // Update usages of openCheckoutModal
  // 1. In ReservationActionsMenu
  content = content.replace(
    /onComplete=\{\(\) => openCheckoutModal\(res\)\}/g,
    `onComplete={() => onNavigateToBorrow && onNavigateToBorrow(res.memberId, res.bookId)}`
  );

  // 2. In ReservationDetailsViewNew call
  content = content.replace(
    /onCheckOut=\{\(res\) => openCheckoutModal\(res\)\}/g,
    `onCheckOut={(res) => onNavigateToBorrow && onNavigateToBorrow(res.memberId, res.bookId)}`
  );

  // Remove Check Out Book Modal UI
  const modalRegex = /\s*\{\/\* Check Out Book Modal \*\/\}[\s\S]*?Confirm Check Out\s*<\/button>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/;
  content = content.replace(modalRegex, '');

  fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
  console.log('ReservationsPage updated to remove modal and use navigation');
}

updateReservationsPage();
