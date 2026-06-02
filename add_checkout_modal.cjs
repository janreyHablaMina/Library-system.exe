const fs = require('fs');

function updateAppTsx() {
  let content = fs.readFileSync('src/App.tsx', 'utf8');

  // Update ReservationsPage props in App.tsx
  content = content.replace(
    /<ReservationsPage isDarkMode={isDarkMode} \/>/g,
    `<ReservationsPage 
                isDarkMode={isDarkMode} 
                onOpenTransactionDetail={(id) => {
                  setSelectedTransactionId(id)
                  setIsTransactionDetailOpen(true)
                  setActivePage('All Transactions')
                }}
              />`
  );

  fs.writeFileSync('src/App.tsx', content);
  console.log('App.tsx updated');
}

function updateReservationsPage() {
  let content = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

  // 1. Update Props
  content = content.replace(
    /interface ReservationsPageProps {/,
    `interface ReservationsPageProps {\n  onOpenTransactionDetail?: (transactionId: string) => void`
  );

  content = content.replace(
    /export function ReservationsPage\(\{ isDarkMode \}: ReservationsPageProps\) {/,
    `export function ReservationsPage({ isDarkMode, onOpenTransactionDetail }: ReservationsPageProps) {`
  );

  // 2. Add Modal State
  const stateInjectionStr = `
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [checkoutReservation, setCheckoutReservation] = useState<any>(null)
  const [checkoutDueDate, setCheckoutDueDate] = useState('')
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
    if (!checkoutReservation) return
    // Remove from active reservations
    setReservationsData((prev) => prev.filter(res => res.id !== checkoutReservation.id))
    setIsCheckoutModalOpen(false)
    // Redirect to transaction detail using mock transaction ID
    if (onOpenTransactionDetail) {
      onOpenTransactionDetail('TRX-2026-0001')
    }
  }
`;

  // Inject state after `const [reservationsData, setReservationsData] = useState(...)`
  content = content.replace(
    /const \[reservationsData, setReservationsData\] = useState\(mappedReservations\)/,
    `const [reservationsData, setReservationsData] = useState(mappedReservations)\n${stateInjectionStr}`
  );

  // 3. Update "Create Borrow Tx" button to "Check Out Book" and use `openCheckoutModal`
  content = content.replace(
    /updateReservationActionStatus\(res.id, 'Converted to Borrow' as any\)/g,
    `openCheckoutModal(res)`
  );
  
  content = content.replace(
    /Create Borrow Tx/g,
    `Check Out Book`
  );

  // 4. Inject Modal UI at the end of the return statement before the final `</div>`
  const modalUI = `
      {/* Check Out Book Modal */}
      {isCheckoutModalOpen && checkoutReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCheckoutModalOpen(false)}></div>
          <div className={\`relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl \${isDarkMode ? 'bg-[#0f1f49] border border-slate-700/50' : 'bg-white'}\`}>
            
            <div className={\`flex items-center justify-between border-b px-6 py-4 \${isDarkMode ? 'border-slate-800' : 'border-slate-100'}\`}>
              <div>
                <h3 className={\`text-lg font-bold \${isDarkMode ? 'text-slate-100' : 'text-slate-900'}\`}>Check Out Book</h3>
                <p className={\`text-xs mt-0.5 \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>Convert reservation to active borrow.</p>
              </div>
              <button onClick={() => setIsCheckoutModalOpen(false)} className={\`rounded-full p-2 transition-colors \${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}\`}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                
                {/* Locked Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={\`text-[11px] font-bold uppercase tracking-wider \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>Member Name</label>
                    <div className={\`mt-1.5 h-11 flex items-center px-3.5 rounded-xl border \${isDarkMode ? 'border-slate-800 bg-slate-900/40 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-500'} cursor-not-allowed opacity-80\`}>
                      <span className="text-xs font-semibold truncate">{checkoutReservation.member.name}</span>
                    </div>
                  </div>
                  <div>
                    <label className={\`text-[11px] font-bold uppercase tracking-wider \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>Member ID</label>
                    <div className={\`mt-1.5 h-11 flex items-center px-3.5 rounded-xl border \${isDarkMode ? 'border-slate-800 bg-slate-900/40 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-500'} cursor-not-allowed opacity-80\`}>
                      <span className="text-xs font-semibold">{checkoutReservation.member.id}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={\`text-[11px] font-bold uppercase tracking-wider \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>Book Title</label>
                  <div className={\`mt-1.5 h-11 flex items-center px-3.5 rounded-xl border \${isDarkMode ? 'border-slate-800 bg-slate-900/40 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-500'} cursor-not-allowed opacity-80\`}>
                    <span className="text-xs font-semibold truncate">{checkoutReservation.book.title}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className={\`text-[11px] font-bold uppercase tracking-wider \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>Borrow Date</label>
                    <div className={\`mt-1.5 flex h-11 items-center gap-2 rounded-xl border px-3.5 \${isDarkMode ? 'border-slate-800 bg-slate-900/40 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-500'} cursor-not-allowed opacity-80\`}>
                      <Calendar size={16} />
                      <span className="text-xs font-semibold">{new Date().toISOString().slice(0, 10)}</span>
                    </div>
                  </div>
                  <div>
                    <label className={\`text-[11px] font-bold uppercase tracking-wider \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>Due Date *</label>
                    <div className={\`mt-1.5 flex h-11 items-center gap-2 rounded-xl border px-3.5 focus-within:border-emerald-500 \${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}\`}>
                      <Calendar size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                      <input type="date" value={checkoutDueDate} onChange={(e) => setCheckoutDueDate(e.target.value)} className={\`w-full bg-transparent outline-none text-xs font-semibold \${isDarkMode ? 'text-slate-200' : 'text-slate-700'}\`} />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className={\`text-[11px] font-bold uppercase tracking-wider \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>Notes (Optional)</label>
                  <textarea 
                    value={checkoutNotes}
                    onChange={(e) => setCheckoutNotes(e.target.value)}
                    placeholder="Add any specific conditions or notes..."
                    rows={2}
                    className={\`mt-1.5 w-full resize-none rounded-xl border p-3 outline-none text-xs font-semibold focus:border-emerald-500 \${isDarkMode ? 'border-slate-700 bg-[#0f1f49] text-slate-200 placeholder-slate-600' : 'border-slate-200 bg-white text-slate-700 placeholder-slate-400'}\`}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className={\`flex items-center justify-end gap-3 border-t px-6 py-4 \${isDarkMode ? 'border-slate-800 bg-slate-900/20' : 'border-slate-100 bg-slate-50/50'}\`}>
              <button onClick={() => setIsCheckoutModalOpen(false)} className={\`h-10 rounded-xl px-5 text-sm font-bold transition-colors \${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}\`}>
                Cancel
              </button>
              <button onClick={handleConfirmCheckout} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm">
                <Check size={16} />
                Confirm Check Out
              </button>
            </div>
          </div>
        </div>
      )}
  `;

  // Find the last </div> wrapping the component and insert the modal before it
  // We can just append it before the very last `</div>` of the return statement.
  // Using regex to replace the final `</div>\n    </div>\n  )\n}` with the modal.

  const finalDivRegex = /<\/div>\s*<\/div>\s*\)\s*}/;
  if (finalDivRegex.test(content)) {
    content = content.replace(
      finalDivRegex,
      `${modalUI}\n    </div>\n    </div>\n  )\n}`
    );
  } else {
    // try a looser regex
    content = content.replace(
      /<\/div>\n\s*\)\n\s*}\s*$/,
      `${modalUI}\n    </div>\n  )\n}`
    );
  }

  fs.writeFileSync('src/pages/ReservationsPage.tsx', content);
  console.log('ReservationsPage.tsx updated');
}

updateAppTsx();
updateReservationsPage();
