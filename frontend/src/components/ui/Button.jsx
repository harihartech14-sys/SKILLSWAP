import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 border border-indigo-500/20',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow',
    outline: 'bg-transparent text-slate-700 border border-slate-200 hover:border-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50',
    ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-600',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-400 hover:to-rose-400 shadow-md shadow-red-500/20',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-md shadow-emerald-500/20',
  };

  const sizes = {
    default: 'h-11 px-5 py-2',
    sm: 'h-9 rounded-lg px-3 text-sm',
    lg: 'h-12 rounded-xl px-8 text-lg',
    icon: 'h-11 w-11',
    smIcon: 'h-8 w-8 rounded-lg',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
Button.displayName = 'Button';
