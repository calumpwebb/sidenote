import { useRef } from "react";
import { useEditorStore } from "../stores/editor";
import { FileText } from "lucide-react";
import { MarkdownPreview } from "./MarkdownPreview";
import { MarkdownEditor } from "./MarkdownEditor";
import { EditorToolbar } from "./EditorToolbar";
import { useAutoSave } from "../hooks/useAutoSave";

export function ContentArea() {
  const { currentFilePath, content, isLoading, error, mode, setContent } =
    useEditorStore();
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Enable auto-save
  useAutoSave();

  const handleFormat = (startSyntax: string, endSyntax?: string) => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const finalEndSyntax = endSyntax ?? startSyntax;

    // Insert syntax around selected text
    const newContent =
      content.substring(0, start) +
      startSyntax +
      selectedText +
      finalEndSyntax +
      content.substring(end);

    setContent(newContent);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + startSyntax.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

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
    <div className="h-full flex flex-col">
      <EditorToolbar onFormat={handleFormat} />
      {mode === "view" ? (
        <div className="flex-1 p-4 overflow-auto">
          <div className="mb-4 text-sm text-muted-foreground border-b pb-2">
            {currentFilePath}
          </div>
          <div className="prose prose-sm max-w-none">
            <MarkdownPreview content={content} />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <MarkdownEditor ref={editorRef} />
        </div>
      )}
    </div>
  );
}
