const fs = require('fs');

function fixModalNesting() {
  let content = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

  // Find the Check Out modal code that was accidentally injected inside `reservationToDelete`
  const modalStartRegex = /\s*\{\/\* Check Out Book Modal \*\/\}[\s\S]*?Confirm Check Out\s*<\/button>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/;
  
  const match = content.match(modalStartRegex);
  if (!match) {
    console.log("Could not find the Check Out Book Modal code.");
    return;
  }
  
  const modalCode = match[0];
  
  // Remove it from its current location, and restore the closing tags for reservationToDelete
  content = content.replace(modalStartRegex, `\n          </div>\n        </div>\n      )}`);
  
  // Now, inject the modal at the very end of ReservationsPage
  // The end of ReservationsPage looks like:
  //         </section>
  //       )}
  //     </div>
  //   )
  // }
  
  // We need to inject it right before `    </div>\n  )\n}`
  const endOfPageRegex = /<\/div>\s*\)\s*\}\s*$/;
  if (endOfPageRegex.test(content)) {
    // Strip the final `)}` from modalCode because it was part of the regex match
    const cleanModalCode = modalCode.replace(/\s*\)\}$/, '');
    
    content = content.replace(endOfPageRegex, `\n${cleanModalCode}\n      )}\n    </div>\n  )\n}`);
    fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
    console.log("Successfully fixed modal nesting.");
  } else {
    console.log("Could not find the end of ReservationsPage.");
  }
}

fixModalNesting();
