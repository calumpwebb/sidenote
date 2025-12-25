import { create } from "zustand";
import { FileNode, getFileTree, pickFolder } from "../tauri/commands";

interface ProjectStore {
  rootPath: string | null;
  fileTree: FileNode[];
  isLoading: boolean;
  error: string | null;

  // Actions
  selectFolder: () => Promise<void>;
  loadFileTree: (path: string) => Promise<void>;
  clearProject: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  rootPath: null,
  fileTree: [],
  isLoading: false,
  error: null,

  selectFolder: async () => {
    try {
      const path = await pickFolder();
      if (path) {
        set({ rootPath: path, error: null });
        await get().loadFileTree(path);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to select folder" });
    }
  },

  loadFileTree: async (path: string) => {
    set({ isLoading: true, error: null, rootPath: path });
    try {
      const tree = await getFileTree(path);
      set({ fileTree: tree, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load file tree",
        isLoading: false,
        fileTree: [],
        rootPath: null,
      });
    }
  },

  clearProject: () => {
    set({ rootPath: null, fileTree: [], error: null });
  },
}));
