import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  isDarkMode?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  isDarkMode = false,
  padding = 'md',
  hoverable = false,
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseStyles = `rounded-2xl border transition-all duration-300 ${
    isDarkMode ? 'border-slate-800 bg-[#0a1633]' : 'border-slate-200 bg-white'
  }`;
  
  const hoverStyles = hoverable ? 'hover:shadow-lg' : '';

  return (
    <div className={`${baseStyles} ${paddings[padding]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};
