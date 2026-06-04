import React from 'react';
import { ArrowLeft, ArrowRight, Bell, MessageCircle, Moon, Search, Sun } from 'lucide-react';

type TopbarProps = {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  theme: any;
  onLogout?: () => void;
};

export const Topbar: React.FC<TopbarProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  isDarkMode,
  setIsDarkMode,
  theme,
  onLogout,
}) => {
  return (
    <header className={`sticky top-0 z-20 flex h-20 items-center border-b px-5 ${theme.header}`}>
      <div className="flex w-full items-center gap-4">
        <button
          type="button"
          onClick={() => setSidebarCollapsed((value) => !value)}
          className={`grid h-10 w-10 place-items-center rounded-lg ${theme.iconBtn}`}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ArrowRight size={20} strokeWidth={2.2} /> : <ArrowLeft size={20} strokeWidth={2.2} />}
        </button>

        <form className={`group flex h-12 w-[520px] items-center rounded-full border px-4 focus-within:border-emerald-500 ${theme.search}`} role="search">
          <Search size={16} className={`mr-3 transition-colors ${theme.searchIcon}`} />
          <input
            type="search"
            placeholder="Search books, members, authors, categories..."
            className={`w-full bg-transparent text-sm font-light outline-none ${theme.searchInput}`}
          />
        </form>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => setIsDarkMode((value) => !value)}
              className={`rounded-lg p-2 ${theme.iconBtn}`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={18} strokeWidth={1.9} /> : <Moon size={18} strokeWidth={1.9} />}
            </button>
            <div className="relative" ref={messageMenuRef}>
              <button 
                type="button" 
                onClick={() => setIsMessageMenuOpen(!isMessageMenuOpen)}
                className={`relative rounded-lg p-2 ${isMessageMenuOpen ? 'bg-emerald-500/10 text-emerald-500' : theme.iconBtn}`}
              >
                <MessageCircle size={18} strokeWidth={1.9} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </button>

              {isMessageMenuOpen && (
                <div className={`absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border shadow-2xl ${isDarkMode ? 'border-zinc-700 bg-[#18181B]' : 'border-zinc-200 bg-white'}`}>
                  <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Recent Outbound Messages</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'}`}>
                      {recentMessages.length} New
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {recentMessages.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-zinc-500">
                        No recent messages.
                      </div>
                    ) : (
                      <div className={`divide-y ${isDarkMode ? 'divide-zinc-800/50' : 'divide-zinc-100'}`}>
                        {recentMessages.map((msg) => (
                          <div key={msg.id} className={`flex flex-col gap-1 p-4 transition-colors ${isDarkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                                To: {msg.borrower_name}
                              </p>
                              <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                msg.status === 'Sent' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : msg.status === 'Failed' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                              }`}>
                                {msg.status}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {msg.email_type} • {new Date(msg.sent_at).toLocaleDateString()} {new Date(msg.sent_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                              Reminder for <span className="font-semibold text-emerald-600 dark:text-emerald-400">{msg.book_title}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsMessageMenuOpen(false)}
                    className={`w-full border-t p-3 text-center text-xs font-bold transition-colors ${isDarkMode ? 'border-zinc-800 text-emerald-500 hover:bg-zinc-800/50' : 'border-zinc-100 text-emerald-600 hover:bg-zinc-50'}`}
                  >
                    Close Menu
                  </button>
                </div>
              )}
            </div>
            <button type="button" className={`relative rounded-lg p-2 ${theme.iconBtn}`}>
              <Bell size={18} strokeWidth={1.9} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </button>
          </div>

          <div className="flex items-center gap-3 border-l border-zinc-700/50 pl-4 group relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-bold text-white shadow-lg cursor-pointer">
              AU
            </div>
            <div className="hidden sm:block">
              <p className={`text-xs font-bold ${theme.profileName}`}>Admin User</p>
              <p className="text-[10px] font-medium text-zinc-500">Librarian</p>
            </div>
            
            {/* Logout Tooltip/Menu */}
            <button 
              onClick={onLogout}
              className="absolute -bottom-10 right-0 hidden rounded-md bg-white p-2 text-xs font-bold text-rose-600 shadow-xl border border-zinc-100 group-hover:block dark:bg-zinc-800 dark:border-zinc-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
