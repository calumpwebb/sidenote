import { create } from "zustand";
import { readFile, writeFile } from "../tauri/commands";

export type EditorMode = "view" | "edit";

interface EditorStore {
  currentFilePath: string | null;
  content: string;
  isDirty: boolean;
  mode: EditorMode;
  isLoading: boolean;
  error: string | null;

  // Actions
  openFile: (path: string) => Promise<void>;
  setContent: (content: string) => void;
  saveFile: () => Promise<void>;
  setMode: (mode: EditorMode) => void;
  clearEditor: () => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  currentFilePath: null,
  content: "",
  isDirty: false,
  mode: "view",
  isLoading: false,
  error: null,

  openFile: async (path: string) => {
    set({ isLoading: true, error: null });
    try {
      const fileContent = await readFile(path);
      set({
        currentFilePath: path,
        content: fileContent,
        isDirty: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to open file",
        isLoading: false,
      });
    }
  },

  setContent: (content: string) => {
    set({ content, isDirty: true });
  },

  saveFile: async () => {
    const { currentFilePath, content } = get();
    if (!currentFilePath) {
      set({ error: "No file is currently open" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await writeFile(currentFilePath, content);
      set({ isDirty: false, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to save file",
        isLoading: false,
      });
    }
  },

  setMode: (mode: EditorMode) => {
    set({ mode });
  },

  clearEditor: () => {
    set({
      currentFilePath: null,
      content: "",
      isDirty: false,
      error: null,
    });
  },
}));
