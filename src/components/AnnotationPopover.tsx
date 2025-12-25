import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { MarkdownPreview } from "./MarkdownPreview";

interface AnnotationPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: { x: number; y: number };
  onSubmit: (comment: string) => void;
  onCancel: () => void;
}

export function AnnotationPopover({
  open,
  onOpenChange,
  position,
  onSubmit,
  onCancel,
}: AnnotationPopoverProps) {
  const [comment, setComment] = useState("");
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
      setMode("edit");
    }
  };

  const handleCancel = () => {
    setComment("");
    setMode("edit");
    onCancel();
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            width: 1,
            height: 1,
            pointerEvents: "none",
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-sm">Add Annotation</h4>
            <div className="flex gap-1">
              <Button
                variant={mode === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode("preview")}
              >
                Preview
              </Button>
              <Button
                variant={mode === "edit" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode("edit")}
              >
                Edit
              </Button>
            </div>
          </div>

          {mode === "edit" ? (
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comment (markdown supported)..."
              className="min-h-[120px] resize-none"
              autoFocus
            />
          ) : (
            <div className="min-h-[120px] border rounded-md p-3 overflow-auto prose prose-sm max-w-none">
              {comment ? (
                <MarkdownPreview content={comment} />
              ) : (
                <p className="text-muted-foreground text-sm">Nothing to preview</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!comment.trim()}
            >
              Submit
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
