import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { MarkdownPreview } from "./MarkdownPreview";
import { Annotation } from "../types";
import { Trash2, Edit2, Check, X } from "lucide-react";

interface AnnotationThreadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  annotations: Annotation[];
  selectedText?: string;
  onEdit: (id: string, newComment: string) => void;
  onDelete: (id: string) => void;
}

export function AnnotationThread({
  open,
  onOpenChange,
  annotations,
  selectedText,
  onEdit,
  onDelete,
}: AnnotationThreadProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEdit = (annotation: Annotation) => {
    setEditingId(annotation.id);
    setEditComment(annotation.comment);
  };

  const handleSaveEdit = (id: string) => {
    onEdit(id, editComment);
    setEditingId(null);
    setEditComment("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditComment("");
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Annotations</DialogTitle>
          <DialogDescription>
            {selectedText && (
              <span className="block mt-2 p-2 bg-muted rounded text-sm">
                &ldquo;{selectedText}&rdquo;
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {annotations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No annotations yet
            </p>
          ) : (
            annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(annotation.createdAt)}
                  </span>
                  {editingId !== annotation.id && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(annotation)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(annotation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {editingId === annotation.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="min-h-[100px]"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(annotation.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="prose prose-sm max-w-none">
                      <MarkdownPreview content={annotation.comment} />
                    </div>

                    {deleteConfirmId === annotation.id && (
                      <div className="bg-destructive/10 border border-destructive rounded p-3 space-y-2">
                        <p className="text-sm">
                          Are you sure you want to delete this annotation?
                        </p>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelDelete}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleConfirmDelete(annotation.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
