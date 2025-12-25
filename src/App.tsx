import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { Layout } from "@/components/Layout";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useProjectStore } from "@/stores/project";
import { addRecentProject } from "@/lib/storage";
import { basename } from "@tauri-apps/api/path";

function App() {
  const { rootPath, loadFileTree } = useProjectStore();

  useEffect(() => {
    // Listen for "open-folder" events from Tauri (CLI arguments)
    const unlisten = listen<string>("open-folder", async (event) => {
      const path = event.payload;
      try {
        await loadFileTree(path);

        // Get the folder name from the path
        const name = await basename(path);

        // Add to recent projects
        await addRecentProject(path, name);
      } catch (error) {
        console.error("Failed to open folder from CLI:", error);
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [loadFileTree]);

  // Update recent projects when a folder is opened via the UI
  useEffect(() => {
    if (rootPath) {
      basename(rootPath).then((name) => {
        addRecentProject(rootPath, name).catch((error) => {
          console.error("Failed to update recent projects:", error);
        });
      });
    }
  }, [rootPath]);

  // Show welcome screen when no project is open
  if (!rootPath) {
    return <WelcomeScreen />;
  }

  return <Layout />;
}

export default App;
