const fs = require('fs');

function cleanFilters() {
  let content = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

  // Remove branch filter state
  content = content.replace(
    /const \[branchFilter, setBranchFilter\] = useState<'All Branches' \| string>\('All Branches'\)\n/,
    ''
  );

  // Update filteredReservations logic
  content = content.replace(
    /const matchesStatus = statusFilter === 'All' \|\| reservation\.status === statusFilter\n\s*const matchesBranch = branchFilter === 'All Branches' \|\| reservation\.pickupBranch === branchFilter\n\n\s*return matchesSearch && matchesStatus && matchesBranch/,
    `const matchesStatus = statusFilter === 'All' || reservation.status === statusFilter\n\n    return matchesSearch && matchesStatus`
  );

  // Remove branch filter JSX
  const branchFilterRegex = /<div className="flex items-center gap-2">\s*<span className="text-xs font-bold text-slate-500">Branch<\/span>\s*<div className="relative">[\s\S]*?<\/div>\s*<\/div>/;
  content = content.replace(branchFilterRegex, '');

  // Remove branch filter reset
  content = content.replace(
    /setBranchFilter\('All Branches'\)\n/,
    ''
  );

  // Remove "Ready for Pickup" option from Status filter
  content = content.replace(
    /<option value="Ready for Pickup">Ready for Pickup<\/option>\n/,
    ''
  );

  fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
  console.log('Filters cleaned up');
}

cleanFilters();
