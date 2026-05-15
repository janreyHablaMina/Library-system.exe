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
            <button type="button" className={`relative rounded-lg p-2 ${theme.iconBtn}`}>
              <MessageCircle size={18} strokeWidth={1.9} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </button>
            <button type="button" className={`relative rounded-lg p-2 ${theme.iconBtn}`}>
              <Bell size={18} strokeWidth={1.9} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </button>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-700/50 pl-4 group relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-bold text-white shadow-lg cursor-pointer">
              AU
            </div>
            <div className="hidden sm:block">
              <p className={`text-xs font-bold ${theme.profileName}`}>Admin User</p>
              <p className="text-[10px] font-medium text-slate-500">Librarian</p>
            </div>
            
            {/* Logout Tooltip/Menu */}
            <button 
              onClick={onLogout}
              className="absolute -bottom-10 right-0 hidden rounded-md bg-white p-2 text-xs font-bold text-rose-600 shadow-xl border border-slate-100 group-hover:block dark:bg-slate-800 dark:border-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
