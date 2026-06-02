const fs = require('fs');

function updateReservationDetailsView() {
  let content = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

  // 1. Update Props Interface
  content = content.replace(
    /type ReservationDetailsViewProps = \{[\s\S]*?onBack: \(\) => void\s*\}/,
    `type ReservationDetailsViewProps = {\n  reservationId: string\n  isDarkMode: boolean\n  onBack: () => void\n  onCheckOut?: (reservation: any) => void\n}`
  );

  // 2. Update Component Definition
  content = content.replace(
    /function ReservationDetailsViewNew\(\{ reservationId, isDarkMode, onBack \}: ReservationDetailsViewProps\) \{/,
    `function ReservationDetailsViewNew({ reservationId, isDarkMode, onBack, onCheckOut }: ReservationDetailsViewProps) {`
  );

  // 3. Update Quick Actions to show Check Out Book conditionally
  const quickActionsMatch = content.match(/<h3 className=\{`mb-4 text-lg font-bold.*?Quick Actions<\/h3>\s*<div className="space-y-3">\s*<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">/);
  
  if (quickActionsMatch) {
    const replacement = `<h3 className={\`mb-4 text-lg font-bold \${isDarkMode ? 'text-slate-100' : 'text-[#0a1b4f]'}\`}>Quick Actions</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {reservation.status === 'Ready for Pickup' ? (
                  <button
                    type="button"
                    onClick={() => onCheckOut && onCheckOut(reservation)}
                    className={\`inline-flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors \${
                      isDarkMode
                        ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/35'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }\`}
                  >
                    <CheckCircle2 size={15} />
                    Check Out Book
                  </button>
                ) : (
                  <button
                    type="button"
                    className={\`inline-flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors \${
                      isDarkMode
                        ? 'border-blue-500/30 bg-blue-950/20 text-blue-300 hover:bg-blue-950/35'
                        : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }\`}
                  >
                    <CheckCircle2 size={15} />
                    Mark as Ready for Pickup
                  </button>
                )}`;
                
    content = content.replace(/<h3 className=\{`mb-4 text-lg font-bold.*?Quick Actions<\/h3>\s*<div className="space-y-3">\s*<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">[\s\S]*?Mark as Ready for Pickup\s*<\/button>/, replacement);
  }

  // 4. Update where ReservationDetailsViewNew is rendered in ReservationsPage
  content = content.replace(
    /<ReservationDetailsViewNew\s*\n\s*reservationId={activeViewReservationId}\s*\n\s*isDarkMode={isDarkMode}\s*\n\s*onBack=\{\(\) => setActiveViewReservationId\(null\)\}\s*\n\s*\/>/m,
    `<ReservationDetailsViewNew 
            reservationId={activeViewReservationId} 
            isDarkMode={isDarkMode} 
            onBack={() => setActiveViewReservationId(null)}
            onCheckOut={(res) => openCheckoutModal(res)}
          />`
  );

  fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
  console.log('ReservationDetailsViewNew updated');
}

updateReservationDetailsView();
