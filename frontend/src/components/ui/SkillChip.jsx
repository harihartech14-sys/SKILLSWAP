import React from 'react';
import { cn } from './Button';
import { X } from 'lucide-react';

export function SkillChip({ skill, onRemove, type = 'teach', className }) {
  const typeStyles = {
    teach: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60 hover:border-indigo-300 shadow-sm',
    learn: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60 hover:border-emerald-300 shadow-sm'
  };

  return (
    <div className={cn("inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors", typeStyles[type], className)}>
      <span>{skill}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className={cn(
            "ml-2 -mr-1.5 inline-flex items-center justify-center p-0.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1",
            type === 'teach' ? 'hover:bg-indigo-200/50 hover:text-indigo-900 focus:ring-indigo-500 text-indigo-500' : 'hover:bg-emerald-200/50 hover:text-emerald-900 focus:ring-emerald-500 text-emerald-500'
          )}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
