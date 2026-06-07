const fs = require('fs');

let code = fs.readFileSync('src/pages/ReservationsPage.tsx', 'utf8');

// The actions div to extract and remove:
const actionsDivSearch = `                  {/* Actions buttons inside the card container at the bottom */}
                  <div className={\`mt-6 pt-5 border-t flex justify-end gap-3 \${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}\`}>
                    {formError ? (
                      <p className="mr-auto self-center text-xs font-semibold text-rose-500">{formError}</p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => { setIsAddModalOpen(false); setEditingReservation(null) }}
                      className={\`h-10 rounded-xl border px-6 text-xs font-bold transition-all \${isDarkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}\`}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      onClick={handleCreateReservation}
                      disabled={isSavingReservation}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-700 px-6 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Calendar size={14} />
                      {isSavingReservation ? 'Saving...' : editingReservation ? 'Save Changes' : 'Create Reservation'}
                    </button>
                  </div>`;

if (code.includes(actionsDivSearch)) {
  code = code.replace(actionsDivSearch, "");
} else {
  console.log("Could not find actions div");
}

// The target to insert before
const formEndSearch = `              </aside>
            </div>
          </form>`;

const stickyFooter = `              </aside>
            </div>

            <div className={\`-mx-6 sticky bottom-0 mt-5 border-t px-6 py-4 \${
              isDarkMode ? 'border-zinc-800 bg-[#18181B]' : 'border-zinc-200 bg-white'
            }\`}>
              <div className="flex justify-end gap-3">
                {formError ? (
                  <p className="mr-auto self-center text-xs font-semibold text-rose-500">{formError}</p>
                ) : null}
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingReservation(null) }}
                  className={\`h-11 rounded-lg border px-8 text-sm font-semibold \${isDarkMode ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'}\`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  onClick={handleCreateReservation}
                  disabled={isSavingReservation}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-700 px-8 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Calendar size={16} />
                  {isSavingReservation ? 'Saving...' : editingReservation ? 'Save Changes' : 'Create Reservation'}
                </button>
              </div>
            </div>
          </form>`;

if (code.includes(formEndSearch)) {
  code = code.replace(formEndSearch, stickyFooter);
} else {
  console.log("Could not find form end");
}

fs.writeFileSync('src/pages/ReservationsPage.tsx', code);
console.log("Updated ReservationsPage.tsx");
