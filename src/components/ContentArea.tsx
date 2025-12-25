import { useEditorStore } from "../stores/editor";
import { FileText } from "lucide-react";

export function ContentArea() {
  const { currentFilePath, content, isLoading, error } = useEditorStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        Error: {error}
      </div>
    );
  }

  if (!currentFilePath) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
        <FileText className="w-16 h-16 opacity-20" />
        <p>Select a file to view its contents</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <div className="mb-4 text-sm text-muted-foreground border-b pb-2">
        {currentFilePath}
      </div>
      <div className="prose prose-sm max-w-none">
        <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
      </div>
    </div>
  );
}
