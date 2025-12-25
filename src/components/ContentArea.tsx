import { useRef, useEffect, useState } from "react";
import { useEditorStore } from "../stores/editor";
import { useAnnotationStore } from "../stores/annotations";
import { FileText, MessageSquare } from "lucide-react";
import { AnnotatablePreview } from "./AnnotatablePreview";
import { AnnotationThread } from "./AnnotationThread";
import { MarkdownEditor } from "./MarkdownEditor";
import { EditorToolbar } from "./EditorToolbar";
import { useAutoSave } from "../hooks/useAutoSave";
import {
  parseAnnotations,
  updateAnnotation,
  removeAnnotation,
} from "../lib/annotations";
import { Button } from "./ui/button";

export function ContentArea() {
  const { currentFilePath, content, isLoading, error, mode, setContent } =
    useEditorStore();
  const { setAnnotations, annotations } = useAnnotationStore();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [threadOpen, setThreadOpen] = useState(false);

  // Enable auto-save
  useAutoSave();

  // Parse annotations when content changes
  useEffect(() => {
    if (content) {
      const parsed = parseAnnotations(content);
      setAnnotations(parsed);
    }
  }, [content, setAnnotations]);

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

  const handleEditAnnotation = (id: string, newComment: string) => {
    const updated = updateAnnotation(content, id, newComment);
    setContent(updated);
  };

  const handleDeleteAnnotation = (id: string) => {
    const updated = removeAnnotation(content, id);
    setContent(updated);
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
          <div className="mb-4 flex justify-between items-center border-b pb-2">
            <span className="text-sm text-muted-foreground">
              {currentFilePath}
            </span>
            {annotations.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setThreadOpen(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {annotations.length} Annotation
                {annotations.length !== 1 ? "s" : ""}
              </Button>
            )}
          </div>
          <div className="prose prose-sm max-w-none">
            <AnnotatablePreview content={content} />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <MarkdownEditor ref={editorRef} />
        </div>
      )}

      <AnnotationThread
        open={threadOpen}
        onOpenChange={setThreadOpen}
        annotations={annotations}
        onEdit={handleEditAnnotation}
        onDelete={handleDeleteAnnotation}
      />
    </div>
  );
}
