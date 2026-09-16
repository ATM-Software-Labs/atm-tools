import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("bg-[#0f172a]/60 border border-slate-800 rounded-2xl p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({ className, variant = 'primary', size = 'md', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger', size?: 'sm' | 'md' | 'lg' }) {
  const variants = {
    primary: 'bg-sky-600 hover:bg-sky-500 text-white border-transparent',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-transparent',
    outline: 'bg-transparent hover:bg-slate-800 text-slate-300 border-slate-700',
    danger: 'bg-red-900/50 hover:bg-red-900/80 text-red-200 border-red-800/50',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors border disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={cn(
        "bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-sm font-medium text-slate-300 mb-1.5", className)} {...props}>
      {children}
    </label>
  );
}
