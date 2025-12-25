import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  FileText,
  Loader2,
} from "lucide-react";
import { FileNode } from "../tauri/commands";
import { useProjectStore } from "../stores/project";
import { useEditorStore } from "../stores/editor";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileTreeNodeProps {
  node: FileNode;
  depth?: number;
}

function FileTreeNode({ node, depth = 0 }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { currentFilePath, openFile } = useEditorStore();
  const isActive = currentFilePath === node.path;

  const handleClick = () => {
    if (node.is_directory) {
      setIsExpanded(!isExpanded);
    } else {
      openFile(node.path);
    }
  };

  const paddingLeft = depth * 12 + 8;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-accent transition-colors text-sm",
          isActive && "bg-accent font-medium"
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleClick}
      >
        {node.is_directory ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            )}
            <Folder className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          </>
        ) : (
          <>
            <div className="w-4" /> {/* Spacer for alignment */}
            {node.name.endsWith(".mdx") ? (
              <FileText className="w-4 h-4 flex-shrink-0 text-blue-500" />
            ) : (
              <File className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
            )}
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {node.is_directory && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree() {
  const { fileTree, isLoading, error } = useProjectStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (fileTree.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center">
        <p className="text-sm text-muted-foreground">
          No markdown files found in this folder
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="py-2">
        {fileTree.map((node) => (
          <FileTreeNode key={node.path} node={node} />
        ))}
      </div>
    </ScrollArea>
  );
}
