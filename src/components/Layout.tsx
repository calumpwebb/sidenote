import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileTree } from "./FileTree";
import { ContentArea } from "./ContentArea";
import { useProjectStore } from "../stores/project";

export function Layout() {
  const { rootPath, selectFolder, isLoading } = useProjectStore();

  return (
    <div className="h-screen flex flex-col bg-background">
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
      <div className="flex-1 overflow-hidden">
        {rootPath ? (
          <ResizablePanelGroup orientation="horizontal">
            {/* File Tree Panel */}
            <ResizablePanel defaultSize={30} minSize={20} maxSize={60}>
              <FileTree />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Content Panel */}
            <ResizablePanel defaultSize={75}>
              <ContentArea />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
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
