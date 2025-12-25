import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onSave: () => void;
  onToggleMode: () => void;
}

export function useKeyboardShortcuts({ onSave, onToggleMode }: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl+S: Save
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        onSave();
      }

      // Cmd/Ctrl+E: Toggle edit/preview mode
      if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
        event.preventDefault();
        onToggleMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave, onToggleMode]);
}
