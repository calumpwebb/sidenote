import { useEffect, useRef } from "react";
import { useEditorStore } from "../stores/editor";
import { writeFile } from "../tauri/commands";

const AUTO_SAVE_DELAY = 500; // 500ms after typing stops

export function useAutoSave() {
  const { content, isDirty, currentFilePath } = useEditorStore();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only auto-save if there are unsaved changes and a file is open
    if (!isDirty || !currentFilePath) {
      return;
    }

    // Set up debounced save
    timeoutRef.current = setTimeout(async () => {
      try {
        await writeFile(currentFilePath, content);
        // Mark as no longer dirty after successful save
        useEditorStore.setState({ isDirty: false });
      } catch (error) {
        console.error("Auto-save failed:", error);
        // Set error state if save fails
        useEditorStore.setState({
          error:
            error instanceof Error ? error.message : "Failed to auto-save file",
        });
      }
    }, AUTO_SAVE_DELAY);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, isDirty, currentFilePath]);
}
