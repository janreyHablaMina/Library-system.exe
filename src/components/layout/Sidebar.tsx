import React from 'react';
import { ChevronRight, Settings2 } from 'lucide-react';
import type { NavItem } from '../../types';

type SidebarProps = {
  sidebarCollapsed: boolean;
  activePage: string;
  setActivePage: (page: string) => void;
  setActiveSettingsTab: (tab: string) => void;
  theme: any;
  navItems: NavItem[];
};

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarCollapsed,
  activePage,
  setActivePage,
  setActiveSettingsTab,
  theme,
  navItems,
}) => {
  return (
    <aside className={`hidden h-full shrink-0 border-r transition-all duration-200 lg:flex lg:flex-col ${theme.aside} ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`border-b py-6 ${theme.profileBorder} ${sidebarCollapsed ? 'px-3' : 'px-6'}`}>
        <h1 className={`font-black tracking-tight ${theme.asideTitle} ${sidebarCollapsed ? 'text-2xl text-center' : 'text-4xl'}`}>
          info<span className="text-emerald-300">Lib</span>
        </h1>
        {!sidebarCollapsed && <p className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${theme.asideSub}`}>Library Management System</p>}
      </div>

      <nav className="flex-1 overflow-y-auto py-5 text-sm">
        {/* Dashboard */}
        <div className="px-4 mt-4">
          <button
            onClick={() => setActivePage('Dashboard')}
            className={`group flex w-full items-center gap-3 py-3 rounded-r-xl transition-all duration-200 ${
              activePage === 'Dashboard'
                ? 'border-l-[3px] border-emerald-500 bg-emerald-500/10 text-emerald-400 pl-[13px] pr-4 shadow-[inset_0_0_12px_rgba(16,185,129,0.05)]'
                : 'border-l-[3px] border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-emerald-300 pl-[13px] pr-4'
            }`}
          >
            {React.createElement(navItems[0].icon, { 
              size: 20, 
              className: activePage === 'Dashboard' ? 'text-emerald-400' : '' 
            })}
            {!sidebarCollapsed && <span className="flex-1 text-left font-semibold">Dashboard</span>}
            {activePage === 'Dashboard' && !sidebarCollapsed && <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
          </button>
        </div>

        {/* Sections */}
        {[
          { label: 'Library', range: [1, 6] },
          { label: 'Circulation', range: [6, 8] },
          { label: 'Management', range: [8, 10] },
        ].map((section) => (
          <div key={section.label} className="mt-6 px-4">
            {!sidebarCollapsed && <p className="px-4 text-[11px] font-bold uppercase tracking-[2px] text-zinc-500">{section.label}</p>}
            <div className="mt-4 space-y-1">
              {navItems.slice(section.range[0], section.range[1]).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`group flex w-full items-center gap-3 py-3 rounded-r-xl transition-all duration-200 ${
                    activePage === item.id
                      ? 'border-l-[3px] border-emerald-500 bg-emerald-500/10 text-emerald-400 pl-[13px] pr-4 shadow-[inset_0_0_12px_rgba(16,185,129,0.05)]'
                      : 'border-l-[3px] border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-emerald-300 pl-[13px] pr-4'
                  }`}
                >
                  <item.icon size={20} className={activePage === item.id ? 'text-emerald-400' : ''} />
                  {!sidebarCollapsed && <span className="flex-1 text-left font-semibold">{item.label}</span>}
                  {!sidebarCollapsed && (
                    <ChevronRight size={14} className={`transition-transform duration-300 ${activePage === item.id ? 'rotate-90 text-emerald-400' : 'text-emerald-100/40'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* System */}
        <div className="mt-6 px-4 pb-4">
          {!sidebarCollapsed && <p className="px-4 text-[11px] font-bold uppercase tracking-[2px] text-zinc-500">System</p>}
          <div className="mt-4 space-y-1">
            <button
              onClick={() => {
                setActivePage('Settings');
                setActiveSettingsTab('Overview');
              }}
              className={`group flex w-full items-center gap-3 py-3 rounded-r-xl transition-all duration-200 ${
                activePage === 'Settings'
                  ? 'border-l-[3px] border-emerald-500 bg-emerald-500/10 text-emerald-400 pl-[13px] pr-4 shadow-[inset_0_0_12px_rgba(16,185,129,0.05)]'
                  : 'border-l-[3px] border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-emerald-300 pl-[13px] pr-4'
              }`}
            >
              <Settings2 size={20} className={activePage === 'Settings' ? 'text-emerald-400' : ''} />
              {!sidebarCollapsed && <span className="flex-1 text-left font-semibold">Settings</span>}
            </button>
          </div>
        </div>
      </nav>

      <div className={`border-t ${theme.profileBorder} ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
        {!sidebarCollapsed && (
          <div className="rounded-xl border border-emerald-400/25 bg-emerald-700/20 p-3">
            <p className={`text-sm font-semibold ${theme.profileName}`}>Admin User</p>
            <p className={`text-xs ${theme.profileRole}`}>Librarian</p>
          </div>
        )}
      </div>
    </aside>
  );
};
