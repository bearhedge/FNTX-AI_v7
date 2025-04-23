
import React from 'react';
import { Choice } from '@/types/game.types';
import { cn } from '@/lib/utils';
import { useKeyboardNavigation } from './useKeyboardNavigation';

interface ChoiceButtonsProps {
  choices: Choice[];
  onSelect: (choice: Choice) => void;
  onHover: (id: string | null) => void;
  disabled?: boolean;
}

export function ChoiceButtons({ choices, onSelect, onHover, disabled = false }: ChoiceButtonsProps) {
  const { selectedIndex, setSelectedIndex } = useKeyboardNavigation(choices, onSelect, disabled);

  return (
    <div className="space-y-2 mt-4">
      {choices.map((choice, index) => (
        <button
          key={choice.id}
          onClick={() => onSelect(choice)}
          onMouseEnter={() => {
            onHover(choice.id);
            setSelectedIndex(index);
          }}
          onMouseLeave={() => onHover(null)}
          disabled={disabled}
          className={cn(
            "w-full text-left px-4 py-3 rounded-md font-mono transition-all duration-200",
            "border border-terminal-light bg-terminal-dark text-terminal-text",
            "hover:bg-terminal-light hover:text-terminal-text",
            "focus:outline-none focus:ring-2 focus:ring-terminal-accent",
            selectedIndex === index && "bg-terminal-light border-terminal-accent shadow-[0_0_8px_rgba(30,174,219,0.4)]",
            disabled && "opacity-50 cursor-not-allowed",
            "animate-fade-in"
          )}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <span className={cn(
            "text-terminal-blue mr-2 transition-all",
            selectedIndex === index ? "text-terminal-accent" : "text-terminal-blue"
          )}>
            {selectedIndex === index ? ">" : "$"}
          </span>
          {choice.text}
        </button>
      ))}
    </div>
  );
}
