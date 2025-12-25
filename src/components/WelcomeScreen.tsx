import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/stores/project";
import { getRecentProjects } from "@/lib/storage";
import { Project } from "@/types";
import { FolderOpen, Clock } from "lucide-react";

export function WelcomeScreen() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const { selectFolder, loadFileTree } = useProjectStore();

  useEffect(() => {
    // Load recent projects on mount
    getRecentProjects().then(setRecentProjects);
  }, []);

  const handleOpenRecent = async (project: Project) => {
    try {
      await loadFileTree(project.rootPath);
    } catch (error) {
      console.error("Failed to open recent project:", error);
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-2xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Sidenote</h1>
          <p className="text-muted-foreground">
            Markdown notes with inline annotations
          </p>
        </div>

        {/* Open Folder Button */}
        <div className="flex justify-center">
          <Button size="lg" onClick={selectFolder} className="gap-2">
            <FolderOpen className="h-5 w-5" />
            Open Folder
          </Button>
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Recent Projects
            </div>

            <div className="space-y-2">
              {recentProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleOpenRecent(project)}
                  className="w-full text-left p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{project.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {project.rootPath}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(project.lastOpened)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
