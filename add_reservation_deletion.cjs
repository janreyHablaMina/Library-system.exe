const fs = require('fs');

function fixBorrowReturnPage() {
  let content = fs.readFileSync('src/pages/BorrowReturnPage.tsx', 'utf8');

  // Add listReservations and deleteReservation to imports
  if (!content.includes('listReservations')) {
    content = content.replace(
      /listBorrowTransactions,\n\s*listMembers,/,
      `listBorrowTransactions,\n  listMembers,\n  listReservations,\n  deleteReservation,`
    );
  }

  // Inject deletion logic in handleConfirmAction
  const borrowActionLogic = `
        await createBorrowTransaction({
          memberId: selectedMember.id,
          bookId: selectedBook.id,
          borrowDate,
          dueDate,
          notes: notes.trim() || null,
        })
        
        // Find and delete matching reservation
        const allRes = await listReservations('All', 500)
        const matchingRes = allRes.find(r => r.memberId === selectedMember.id && r.bookId === selectedBook.id)
        if (matchingRes) {
          await deleteReservation(matchingRes.id)
        }
        
        setShowToast(\`Successfully borrowed "\${selectedBook.title}" to \${selectedMember.name}!\`)
`;

  content = content.replace(
    /await createBorrowTransaction\(\{[\s\S]*?notes: notes\.trim\(\) \|\| null,\n\s*\}\)\n\s*setShowToast\(`Successfully borrowed "\$\{selectedBook\.title\}" to \$\{selectedMember\.name\}!`\)/,
    borrowActionLogic.trim()
  );

  fs.writeFileSync('src/pages/BorrowReturnPage.tsx', content);
  console.log('BorrowReturnPage updated');
}

fixBorrowReturnPage();
