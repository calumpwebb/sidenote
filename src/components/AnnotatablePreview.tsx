import { useState, useRef, useEffect } from "react";
import { MarkdownPreview } from "./MarkdownPreview";
import { AnnotationPopover } from "./AnnotationPopover";
import { useAnnotationStore } from "../stores/annotations";
import { useEditorStore } from "../stores/editor";
import { generateId, addAnnotation } from "../lib/annotations";

interface AnnotatablePreviewProps {
  content: string;
}

export function AnnotatablePreview({ content }: AnnotatablePreviewProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { pendingSelection, setPendingSelection, annotations } =
    useAnnotationStore();
  const { setContent } = useEditorStore();

  // Handle text selection
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) {
      return;
    }

    // Get the range within the content
    const range = selection.getRangeAt(0);

    // Find the start and end positions in the content
    const preSelectionRange = range.cloneRange();
    if (containerRef.current) {
      preSelectionRange.selectNodeContents(containerRef.current);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
    }
    const start = preSelectionRange.toString().length;
    const end = start + selectedText.length;

    // Set pending selection
    setPendingSelection({
      selection: selectedText,
      range: [start, end],
    });

    // Position the popover near the selection
    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setPopoverPosition({
        x: rect.left - containerRect.left,
        y: rect.bottom - containerRect.top + 5,
      });
    }

    setPopoverOpen(true);
  };

  const handleSubmit = (comment: string) => {
    if (!pendingSelection) return;

    const annotation = {
      id: generateId(),
      selection: pendingSelection.selection,
      range: pendingSelection.range,
      comment,
      createdAt: new Date().toISOString(),
    };

    // Add annotation to content
    const newContent = addAnnotation(content, annotation);
    setContent(newContent);

    // Clear pending selection and close popover
    setPendingSelection(null);
    setPopoverOpen(false);
  };

  const handleCancel = () => {
    setPendingSelection(null);
    setPopoverOpen(false);
  };

  // Highlight annotated text
  useEffect(() => {
    if (!containerRef.current || annotations.length === 0) return;

    // This is a simple implementation - a more robust solution would
    // involve walking the DOM tree and wrapping annotated ranges
    // For now, we'll add a visual indicator that annotations exist
    // A full implementation would require more sophisticated text highlighting
  }, [annotations]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onMouseUp={handleMouseUp}
        className="cursor-text select-text"
      >
        <MarkdownPreview content={content} />
      </div>

      <AnnotationPopover
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        position={popoverPosition}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
