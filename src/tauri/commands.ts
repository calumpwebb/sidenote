import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export interface FileNode {
  name: string;
  path: string;
  is_directory: boolean;
  children?: FileNode[];
}

export async function pickFolder(): Promise<string | null> {
  const selected = await open({
    directory: true,
    multiple: false,
  });

  if (typeof selected === "string") {
    return selected;
  }

  return null;
}

export async function getFileTree(rootPath: string): Promise<FileNode[]> {
  return await invoke<FileNode[]>("get_file_tree", { rootPath });
}

export async function readFile(path: string): Promise<string> {
  return await invoke<string>("read_file", { path });
}

export async function writeFile(
  path: string,
  content: string
): Promise<void> {
  await invoke("write_file", { path, content });
}
