import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

interface UseFileWatchProps {
  filePath: string | null;
  isDirty: boolean;
  onFileChanged: () => void;
}

export function useFileWatch({ filePath, isDirty, onFileChanged }: UseFileWatchProps) {
  useEffect(() => {
    if (!filePath) return;

    // Start watching the file
    invoke('watch_file', { path: filePath }).catch((err) => {
      console.error('Failed to start watching file:', err);
    });

    // Listen for file change events
    const unlisten = listen<string>('file-changed', (event) => {
      // Only process events for the current file
      if (event.payload === filePath) {
        if (isDirty) {
          // User has local changes - prompt for confirmation
          const reload = window.confirm(
            'The file has been changed externally. Do you want to reload it? Your unsaved changes will be lost.'
          );
          if (reload) {
            onFileChanged();
          }
        } else {
          // No local changes - silently reload
          onFileChanged();
        }
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [filePath, isDirty, onFileChanged]);
}
