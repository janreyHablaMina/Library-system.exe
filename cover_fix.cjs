const fs = require('fs');

let code = fs.readFileSync('src/pages/AddBookPage.tsx', 'utf8');

// 1. Add DynamicBookCover import if missing
if (!code.includes('DynamicBookCover')) {
  code = code.replace(
    "import { Toast } from '../components/ui/Toast'",
    "import { Toast } from '../components/ui/Toast'\nimport { DynamicBookCover } from '../components/ui/DynamicBookCover'"
  );
}

// 2. Replace the Book Cover drag zone
let coverMatch = code.match(/<div\s*onDragOver=[\s\S]*?<input\s*ref={coverInputRef}[\s\S]*?\/>\s*<\/div>\s*{coverError \? <p className="mt-2 text-xs font-semibold text-rose-600">{coverError}<\/p> : null}/);

if (coverMatch) {
  const newCoverLayout = `
              <div className="flex gap-4">
                {/* Visual Cover Preview */}
                {coverPreviewUrl ? (
                  <div className="relative w-[145px] h-[195px] rounded-lg shadow-md overflow-hidden shrink-0 border border-zinc-200/10">
                    <img src={coverPreviewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-[195px] w-[145px] shrink-0 rounded-lg shadow-md overflow-hidden">
                    <DynamicBookCover title={form.title || 'Unknown Title'} author={form.author || 'Unknown Author'} seed="preview-seed" />
                  </div>
                )}
                
                {/* Upload zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    handleCoverSelection(e.dataTransfer.files?.[0] ?? null)
                  }}
                  onClick={() => coverInputRef.current?.click()}
                  className={\`flex-1 rounded-xl border-2 border-dashed p-4 text-center flex flex-col justify-center items-center cursor-pointer transition \${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/60'
                      : isDarkMode
                        ? 'border-zinc-700 hover:border-zinc-500 bg-[#27272A]/50 hover:bg-[#27272A]/70'
                        : 'border-zinc-200 hover:border-emerald-500 bg-zinc-50/40 hover:bg-emerald-50/20'
                  }\`}
                >
                  <CloudUpload size={28} className={\`mb-2 \${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}\`} />
                  <p className={\`text-xs font-semibold \${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}\`}>Drag and drop image here</p>
                  <p className={\`text-[10px] my-1 \${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}\`}>or</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); coverInputRef.current?.click(); }}
                    className={\`rounded-lg border px-3 py-1.5 text-xs font-semibold \${isDarkMode ? 'border-zinc-600 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'}\`}
                  >
                    Choose File
                  </button>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleCoverSelection(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  <p className={\`text-[9px] mt-2 leading-tight \${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}\`}>
                    Recommended: 600 x 800px (JPG, PNG)<br />Max file size: 2MB
                  </p>
                </div>
              </div>

              {coverPreviewUrl ? (
                <button
                  type="button"
                  onClick={() => handleCoverSelection(null)}
                  className="mt-4 w-full border border-rose-500/25 hover:bg-rose-500/5 text-rose-500 font-semibold text-xs h-10 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <X size={14} />
                  Remove Cover
                </button>
              ) : null}
              {coverError ? <p className="mt-2 text-xs font-semibold text-rose-600">{coverError}</p> : null}`;

  code = code.replace(coverMatch[0], newCoverLayout);
  
  fs.writeFileSync('src/pages/AddBookPage.tsx', code);
  console.log("Book Cover layout replaced successfully.");
} else {
  console.log("Failed to match the Book Cover block.");
}
