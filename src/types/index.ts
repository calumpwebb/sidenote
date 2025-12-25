/**
 * Core types for the Sidenote application
 */

export interface FileNode {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
  parent?: string | null;
}

export interface Project {
  id: string;
  name: string;
  rootPath: string;
  createdAt: Date;
  lastOpened: Date;
}

export interface Annotation {
  id: string;
  selection: string;
  range: [number, number];
  comment: string;
  createdAt: string;
}

export type EditorMode = "view" | "edit";
