import { useState } from "react";
import { FolderOpen, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileTree } from "./FileTree";
import { ContentArea } from "./ContentArea";
import { useProjectStore } from "../stores/project";

export function Layout() {
  const { rootPath, selectFolder, isLoading } = useProjectStore();
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return;
    const newWidth = Math.min(Math.max(e.clientX, 150), 500);
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
    <div
      className="h-screen flex flex-col bg-background"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="border-b px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-semibold font-mono">Sidenote</h1>
        <Button
          onClick={selectFolder}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          {rootPath ? "Change Folder" : "Open Folder"}
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {rootPath ? (
          <>
            {/* Sidebar */}
            <div
              className="h-full border-r bg-card flex-shrink-0"
              style={{ width: sidebarWidth }}
            >
              <FileTree />
            </div>

            {/* Resize Handle */}
            <div
              className="w-1 h-full bg-border hover:bg-primary cursor-col-resize flex items-center justify-center flex-shrink-0 transition-colors"
              onMouseDown={handleMouseDown}
            >
              <GripVertical className="w-3 h-3 text-muted-foreground" />
            </div>

            {/* Content */}
            <div className="flex-1 h-full overflow-hidden">
              <ContentArea />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <FolderOpen className="w-16 h-16 opacity-20" />
            <p className="text-lg">Open a folder to get started</p>
            <Button onClick={selectFolder} disabled={isLoading}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Open Folder
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
