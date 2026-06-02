const fs = require('fs');

function injectState() {
  let content = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

  const stateStr = `
    // Checkout Modal State
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
    const [checkoutReservation, setCheckoutReservation] = useState<any>(null)
    const [checkoutDueDate, setCheckoutDueDate] = useState<string>('')
    const [checkoutNotes, setCheckoutNotes] = useState('')

    const openCheckoutModal = (reservation: any) => {
      setCheckoutReservation(reservation)
      const now = new Date()
      now.setDate(now.getDate() + 7)
      setCheckoutDueDate(now.toISOString().slice(0, 10))
      setCheckoutNotes('')
      setIsCheckoutModalOpen(true)
    }

    const handleConfirmCheckout = () => {
      if (checkoutReservation) {
        if (onOpenTransactionDetail) {
          onOpenTransactionDetail('TRX-2026-0001')
        }
      }
      setIsCheckoutModalOpen(false)
    }
  `;

  content = content.replace(
    /const \[reservations, setReservations\] = useState<ReservationRow\[\]>\(\[\]\)/,
    `const [reservations, setReservations] = useState<ReservationRow[]>([])\n${stateStr}`
  );

  fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
  console.log('State injected successfully.');
}

injectState();
