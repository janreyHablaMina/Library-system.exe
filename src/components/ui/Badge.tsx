import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'emerald' | 'blue' | 'violet' | 'rose' | 'amber' | 'sky' | 'slate';
  className?: string;
  isDarkMode?: boolean;
};

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'emerald', 
  className = '', 
  isDarkMode = false 
}) => {
  const variants = {
    emerald: isDarkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-700',
    blue: isDarkMode ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-700',
    violet: isDarkMode ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-50 text-violet-700',
    rose: isDarkMode ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-50 text-rose-700',
    amber: isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-700',
    sky: isDarkMode ? 'bg-sky-500/15 text-sky-400' : 'bg-sky-50 text-sky-700',
    slate: isDarkMode ? 'bg-zinc-500/15 text-zinc-400' : 'bg-zinc-50 text-zinc-700',
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
