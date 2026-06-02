const fs = require('fs');

function updateReservationsPage() {
  let content = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

  // 1. Update ReservationStatus Type
  content = content.replace(
    /type ReservationStatus = 'Pending' \| 'Ready for Pickup' \| 'Completed' \| 'Cancelled'/,
    "type ReservationStatus = 'Reserved' | 'Ready for Pickup' | 'Expired' | 'Cancelled'"
  );

  // 2. Update stats blocks
  content = content.replace(
    /{ label: 'Pending', value: '24', subValue: '42.9% of total', icon: Clock3, color: 'text-blue-600', bg: 'bg-blue-50' },/g,
    "{ label: 'Reserved', value: '24', subValue: '42.9% of total', icon: Clock3, color: 'text-blue-600', bg: 'bg-blue-50' },"
  );
  content = content.replace(
    /{ label: 'Completed', value: '12', subValue: '21.4% of total', icon: CheckCircle2, color: 'text-violet-600', bg: 'bg-violet-50' },/g,
    "{ label: 'Expired', value: '12', subValue: '21.4% of total', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },"
  );
  
  // Note: we need to import XCircle if not imported.
  if (!content.includes('XCircle')) {
    content = content.replace('Clock3,', 'Clock3, XCircle,');
  }

  // 3. Update mock data statuses
  content = content.replace(/status: 'Pending'/g, "status: 'Reserved'");
  content = content.replace(/status: 'Completed'/g, "status: 'Expired'"); // convert to Expired in mock data for testing

  // 4. Update getStatusColor function logic
  content = content.replace(/case 'Pending':/g, "case 'Reserved':");
  content = content.replace(/case 'Completed': return 'bg-slate-50 text-slate-600 dark:bg-slate-500\/10 dark:text-slate-400'/g, "case 'Expired': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'");

  // 5. Update timeline steps in ReservationDetailsViewNew
  content = content.replace(
    /{ title: 'Ready for Pickup', at: '-', note: 'Pending', done: false },\s*{ title: 'Picked Up', at: '-', note: 'Pending', done: false },\s*{ title: 'Completed \/ Cancelled', at: '-', note: 'Pending', done: false },/g,
    `{ title: 'Ready for Pickup', at: '-', note: 'Reserved', done: false },
    { title: 'Converted to Borrow', at: '-', note: 'Reserved', done: false },
    { title: 'Expired / Cancelled', at: '-', note: 'Reserved', done: false },`
  );

  // 6. Update action buttons (Replace 'Mark as Completed' with 'Convert to Borrow')
  content = content.replace(/Mark as Completed/g, 'Create Borrow Tx');
  
  // 7. Update status filter mapping
  content = content.replace(/return 'Pending'/g, "return 'Reserved'");
  
  content = content.replace(
    /status === 'Ready for Pickup' \|\| status === 'Completed' \|\| status === 'Cancelled' \? status : 'Pending'/g,
    "status === 'Ready for Pickup' || status === 'Expired' || status === 'Cancelled' ? status : 'Reserved'"
  );

  // 8. Update edit form select options
  content = content.replace(/<option value="Pending">Pending<\/option>/g, '<option value="Reserved">Reserved</option>');
  content = content.replace(/<option value="Completed">Completed<\/option>/g, '<option value="Expired">Expired</option>');

  // 9. Update onComplete to onConvertToBorrow or just pass 'Expired' since 'Completed' is removed.
  // Wait, the action `updateReservationActionStatus(res.id, 'Completed')` is now going to remove the item from reservations list.
  // We can just keep the function `updateReservationActionStatus` but filter out 'Converted to Borrow' manually.
  content = content.replace(
    /updateReservationActionStatus\(res.id, 'Completed'\)/g,
    "updateReservationActionStatus(res.id, 'Converted to Borrow' as any)"
  );
  
  // Let's modify updateReservationActionStatus to remove the reservation entirely if the status is 'Converted to Borrow'
  content = content.replace(
    /setReservationsData\(\(prev\) =>\s*prev.map\(\(res\) =>\s*res.id === id \? { \.\.\.res, status } : res\s*\)\s*\)/g,
    `setReservationsData((prev) => {
        if (status === 'Converted to Borrow' as any) {
          return prev.filter(res => res.id !== id);
        }
        return prev.map((res) => res.id === id ? { ...res, status } : res)
      })`
  );

  // Fix wait time string calculation
  content = content.replace(
    /r.status === 'Pending'/g,
    "r.status === 'Reserved'"
  );

  fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
  console.log('ReservationsPage.tsx updated');
}

function updateMemberDetailData() {
  let content = fs.readFileSync('src/pages/memberDetailData.ts', 'utf8');
  content = content.replace(/status: 'Pending'/g, "status: 'Reserved'");
  content = content.replace(/statusLabel: 'Pending arrival'/g, "statusLabel: 'Reserved'");
  content = content.replace(/status: 'Ready' \| 'Pending'/g, "status: 'Ready' | 'Reserved'");
  content = content.replace(/pending warning/g, "pending warning"); // don't replace this one, it's valid text
  fs.writeFileSync('src/pages/memberDetailData.ts', content);
  console.log('memberDetailData.ts updated');
}

function updateAppTsx() {
  // If there are stats in App.tsx that use 'Pending Emails', those are emails, not reservations, so leave them alone!
  // Same for tauriApi.ts `pending: number` in `emailStats`.
}

updateReservationsPage();
updateMemberDetailData();
