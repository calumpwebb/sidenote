import { Store } from "@tauri-apps/plugin-store";
import { Project } from "@/types";

// Use Store.load to create a Store instance
let storeInstance: Store | null = null;

async function getStore(): Promise<Store> {
  if (!storeInstance) {
    storeInstance = await Store.load("sidenote.dat");
  }
  return storeInstance;
}

const RECENT_PROJECTS_KEY = "recent_projects";
const MAX_RECENT_PROJECTS = 10;

/**
 * Get the list of recent projects from storage
 */
export async function getRecentProjects(): Promise<Project[]> {
  try {
    const store = await getStore();
    const projects = await store.get<Project[]>(RECENT_PROJECTS_KEY);
    return projects || [];
  } catch (error) {
    console.error("Failed to load recent projects:", error);
    return [];
  }
}

/**
 * Add or update a recent project
 * If the project already exists, update its lastOpened timestamp and move it to the top
 * Keep only the most recent MAX_RECENT_PROJECTS projects
 */
export async function addRecentProject(
  path: string,
  name: string
): Promise<void> {
  try {
    const projects = await getRecentProjects();

    // Find existing project by path
    const existingIndex = projects.findIndex((p) => p.rootPath === path);

    const now = new Date();
    const project: Project = {
      id: path, // Use path as ID for simplicity
      name,
      rootPath: path,
      createdAt:
        existingIndex >= 0 && projects[existingIndex]
          ? projects[existingIndex].createdAt
          : now,
      lastOpened: now,
    };

    // Remove existing entry if found
    if (existingIndex >= 0) {
      projects.splice(existingIndex, 1);
    }

    // Add to the beginning of the list
    projects.unshift(project);

    // Keep only the most recent MAX_RECENT_PROJECTS
    const recentProjects = projects.slice(0, MAX_RECENT_PROJECTS);

    // Save to store
    const store = await getStore();
    await store.set(RECENT_PROJECTS_KEY, recentProjects);
    await store.save();
  } catch (error) {
    console.error("Failed to add recent project:", error);
    throw error;
  }
}
