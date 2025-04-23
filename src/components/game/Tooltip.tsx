
import React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string | null;
  className?: string;
}

export function Tooltip({ content, className }: TooltipProps) {
  if (!content) return null;
  
  return (
    <div 
      className={cn(
        "bg-terminal-light border border-terminal-accent p-3 rounded-md",
        "text-terminal-text text-sm shadow-lg animate-fade-in",
        className
      )}
    >
      <span className="text-terminal-accent">ℹ️ </span>
      {content}
    </div>
  );
}
