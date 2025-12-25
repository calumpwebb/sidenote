import { useEditorStore } from "../stores/editor";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Bold, Italic, Strikethrough, Code, Link, Eye, Edit } from "lucide-react";

interface EditorToolbarProps {
  onFormat: (syntax: string) => void;
}

export function EditorToolbar({ onFormat }: EditorToolbarProps) {
  const { mode, setMode, isDirty } = useEditorStore();

  const handleToggleMode = () => {
    setMode(mode === "view" ? "edit" : "view");
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-background">
      <div className="flex items-center gap-1">
        <Button
          variant={mode === "view" ? "default" : "ghost"}
          size="sm"
          onClick={handleToggleMode}
          className="h-8"
        >
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
        <Button
          variant={mode === "edit" ? "default" : "ghost"}
          size="sm"
          onClick={handleToggleMode}
          className="h-8"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>

      {mode === "edit" && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormat("**")}
              className="h-8"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormat("*")}
              className="h-8"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormat("~~")}
              className="h-8"
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormat("`")}
              className="h-8"
              title="Code"
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const textarea = document.querySelector("textarea");
                if (!textarea) return;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = textarea.value.substring(start, end);
                const linkText = selectedText || "link text";
                onFormat(`[${linkText}](url)`);
              }}
              className="h-8"
              title="Link"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {isDirty && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <span className="text-xs text-muted-foreground">Unsaved changes</span>
        </>
      )}
    </div>
  );
}
