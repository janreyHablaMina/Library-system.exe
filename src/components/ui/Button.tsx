import React from 'react';
import type { LucideIcon } from 'lucide-react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  isDarkMode?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  isDarkMode = false,
  type = 'button',
  disabled = false,
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    outline: isDarkMode 
      ? 'border border-slate-800 bg-[#0f1f49] text-slate-200 hover:bg-slate-800/50' 
      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    ghost: isDarkMode
      ? 'text-slate-400 hover:bg-slate-800/50 hover:text-emerald-300'
      : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600',
    danger: isDarkMode
      ? 'border border-rose-900/20 text-rose-500 hover:bg-rose-900/40'
      : 'border border-rose-100 text-rose-500 hover:bg-rose-50',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
    icon: 'h-11 w-11 p-0',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 18} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 18} />}
    </button>
  );
};
