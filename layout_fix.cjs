const fs = require('fs');

let code = fs.readFileSync('src/pages/AddBookPage.tsx', 'utf8');

// 1. Extract Author block
let authorMatch = code.match(/<div>\s*<label className={`text-xs font-bold uppercase tracking-wider \${labelClass}`}>\s*Author \*\s*<\/label>[\s\S]*?<FieldError error={errors\.author} \/>\s*<\/div>/);
let authorHtml = authorMatch ? authorMatch[0] : '';

// 2. Extract Category block
let categoryMatch = code.match(/<div>\s*<label className={`text-xs font-bold uppercase tracking-wider \${labelClass}`}>\s*Category \*\s*<\/label>[\s\S]*?<FieldError error={errors\.category} \/>\s*<\/div>/);
let categoryHtml = categoryMatch ? categoryMatch[0] : '';

// 3. Extract ISBN block
let isbnMatch = code.match(/<div>\s*<label className={`text-xs font-bold uppercase tracking-wider \${labelClass}`}>\s*ISBN\s*<\/label>[\s\S]*?placeholder="Enter ISBN \(optional\)"\s*\/>\s*<\/div>/);
let isbnHtml = isbnMatch ? isbnMatch[0] : '';

// 4. Extract Publisher block
let publisherMatch = code.match(/<div>\s*<label className={`text-xs font-bold uppercase tracking-wider \${labelClass}`}>\s*Publisher\s*<\/label>[\s\S]*?placeholder="Enter publisher \(optional\)"\s*\/>\s*<\/div>/);
let publisherHtml = publisherMatch ? publisherMatch[0] : '';

// 5. Extract Description block
let descMatch = code.match(/<div className="mt-4">\s*<label className={`text-xs font-bold uppercase tracking-wider \${labelClass}`}>\s*Description\s*<\/label>[\s\S]*?{form\.description\.length} \/ {DESCRIPTION_MAX}<\/p>\s*<\/div>/);
let descHtml = descMatch ? descMatch[0] : '';

if (authorHtml && categoryHtml && isbnHtml && publisherHtml && descHtml) {
  console.log("All parts found!");

  // Now, we need to construct the new "Basic Information" layout:
  const newBasicInfoLayout = `
                  <div className="grid gap-4 md:grid-cols-2">
                    ${authorHtml}
                    ${isbnHtml}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    ${categoryHtml}
                    ${publisherHtml}
                  </div>
                  ${descHtml.replace('<div className="mt-4">', '<div>')}
`;

  // Remove the old blocks from code
  code = code.replace(authorHtml, '');
  code = code.replace(categoryHtml, '');
  
  // Remove the entire Optional Details article
  let optionalDetailsArticle = code.match(/<article className={`rounded-2xl border p-6 \${cardClass}`}>\s*<div className="mb-4 flex items-start gap-3">[\s\S]*?<h3 className={`text-lg font-black leading-tight \${isDarkMode \? 'text-zinc-100' : 'text-\[#0a1b4f\]'}`}>Optional Details<\/h3>[\s\S]*?<\/div>[\s\S]*?<\/article>/);
  if (optionalDetailsArticle) {
    code = code.replace(optionalDetailsArticle[0], '');
    console.log("Optional Details article removed.");
  } else {
    console.log("Optional details article NOT found. Check regex.");
  }

  // Insert new layout after the Title block in Basic Info
  let titleBlockEndMatch = code.match(/<FieldError error={errors\.title} \/>\s*<\/div>/);
  if (titleBlockEndMatch) {
    let indexToInsert = titleBlockEndMatch.index + titleBlockEndMatch[0].length;
    code = code.slice(0, indexToInsert) + '\n' + newBasicInfoLayout + code.slice(indexToInsert);
    console.log("New layout inserted.");
    
    // Change <div className="space-y-5"> to <div className="space-y-4">
    code = code.replace(/<div className="space-y-5">/, '<div className="space-y-4">');

    fs.writeFileSync('src/pages/AddBookPage.tsx', code);
    console.log("File saved!");
  } else {
    console.log("Could not find title block end.");
  }

} else {
  console.log("Failed to extract one or more parts:");
  console.log("Author:", !!authorHtml);
  console.log("Category:", !!categoryHtml);
  console.log("ISBN:", !!isbnHtml);
  console.log("Publisher:", !!publisherHtml);
  console.log("Description:", !!descHtml);
}
