const fs = require('fs');

function updateReservationDetailsView() {
  let content = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

  // 1. Update Props Interface
  content = content.replace(
    /type ReservationDetailsViewProps = \{[\s\S]*?reservationId: string\n  isDarkMode: boolean/,
    `type ReservationDetailsViewProps = {
  reservation: ReservationRow
  isDarkMode: boolean`
  );

  // 2. Update Component Definition and Data Fetching
  // Remove the `reservationsData.find`, `mockBooks.find`, `mockMembers.find`
  const compRegex = /function ReservationDetailsViewNew\(\{ reservationId, isDarkMode, onBack, onCheckOut \}: ReservationDetailsViewProps\) \{[\s\S]*?const member = mockMembers\.find\(\(item\) => item\.name === reservation\.member\.name\) \?\? mockMembers\[0\]/;
  
  content = content.replace(
    compRegex,
    `function ReservationDetailsViewNew({ reservation, isDarkMode, onBack, onCheckOut }: ReservationDetailsViewProps) {
    const book = reservation.book
    const member = reservation.member`
  );

  // 3. Update the Parent component call
  // Find where it's rendered:
  // <ReservationDetailsViewNew
  //   reservationId={activeViewReservationId}
  //   isDarkMode={isDarkMode}
  content = content.replace(
    /<ReservationDetailsViewNew\s+reservationId=\{activeViewReservationId\}/g,
    `<ReservationDetailsViewNew
            reservation={reservations.find(r => r.id === activeViewReservationId)!}`
  );

  fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
  console.log('ReservationDetailsViewNew updated to use dynamic data');
}

updateReservationDetailsView();
