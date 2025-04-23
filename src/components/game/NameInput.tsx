
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface NameInputProps {
  onSubmit: (name: string) => void;
  className?: string;
}

export function NameInput({ onSubmit, className }: NameInputProps) {
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("font-mono", className)}>
      <div className="flex flex-col space-y-2">
        <label htmlFor="player-name" className="text-terminal-text">
          <span className="text-terminal-blue">$ </span>
          Enter your trader name:
        </label>
        <div className="flex">
          <input
            type="text"
            id="player-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(
              "flex-grow bg-terminal-dark border border-terminal-light rounded-l-md px-3 py-2",
              "text-terminal-text placeholder:text-terminal-muted focus:outline-none focus:ring-1 focus:ring-terminal-accent"
            )}
            placeholder="John Trader"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className={cn(
              "bg-terminal-accent text-terminal-dark py-2 px-4 rounded-r-md font-bold",
              "hover:bg-terminal-blue disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
