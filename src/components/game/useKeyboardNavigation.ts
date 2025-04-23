
import { useEffect, useState } from 'react';
import { Choice } from '@/types/game.types';

export function useKeyboardNavigation(choices: Choice[], onSelect: (choice: Choice) => void, disabled: boolean) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  useEffect(() => {
    if (disabled) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setSelectedIndex(prev => (prev <= 0 ? choices.length - 1 : prev - 1));
          break;
        case 'ArrowDown':
          setSelectedIndex(prev => (prev >= choices.length - 1 ? 0 : prev + 1));
          break;
        case 'Enter':
          if (selectedIndex >= 0 && selectedIndex < choices.length) {
            onSelect(choices[selectedIndex]);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [choices, disabled, onSelect, selectedIndex]);
  
  return { selectedIndex, setSelectedIndex };
}
