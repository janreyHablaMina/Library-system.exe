const fs = require('fs');
let content = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

// The problematic snippet is:
//       )}
//   
//     </div>
//     </div>
//   )
// }
//       {activeViewReservationId ? (

const badSnippetRegex = /\s*\)\}\s*<\/div>\s*<\/div>\s*\)\s*\}\s*\{activeViewReservationId \? \(/;

if (badSnippetRegex.test(content)) {
  content = content.replace(badSnippetRegex, `\n      )}\n      {activeViewReservationId ? (`);
  fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
  console.log('Fixed syntax error!');
} else {
  console.log('Snippet not found, trying an alternate match...');
  const altMatch = content.match(/<\/div>\s*<\/div>\s*\)\s*\}\s*\{activeViewReservationId \? \(/);
  if (altMatch) {
      content = content.replace(/<\/div>\s*<\/div>\s*\)\s*\}\s*\{activeViewReservationId \? \(/, `      {activeViewReservationId ? (`);
      fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
      console.log('Fixed using alternate match');
  } else {
      console.log('Could not find the problematic snippet at all.');
  }
}
