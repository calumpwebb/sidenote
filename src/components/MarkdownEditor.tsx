import { forwardRef } from "react";
import { useEditorStore } from "../stores/editor";

export const MarkdownEditor = forwardRef<HTMLTextAreaElement>(
  (_, ref) => {
    const { content, setContent } = useEditorStore();

    return (
      <textarea
        ref={ref}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-full resize-none p-4 bg-background text-foreground font-mono text-sm focus:outline-none"
        placeholder="Start typing your markdown here..."
        spellCheck={false}
      />
    );
  }
);

MarkdownEditor.displayName = "MarkdownEditor";
