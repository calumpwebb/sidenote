import { create } from "zustand";
import { Annotation } from "../types";

interface PendingSelection {
  selection: string;
  range: [number, number];
}

interface AnnotationStore {
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  pendingSelection: PendingSelection | null;

  // Actions
  setAnnotations: (annotations: Annotation[]) => void;
  selectAnnotation: (id: string | null) => void;
  setPendingSelection: (selection: PendingSelection | null) => void;
}

export const useAnnotationStore = create<AnnotationStore>((set) => ({
  annotations: [],
  selectedAnnotationId: null,
  pendingSelection: null,

  setAnnotations: (annotations) => set({ annotations }),
  selectAnnotation: (id) => set({ selectedAnnotationId: id }),
  setPendingSelection: (selection) => set({ pendingSelection: selection }),
}));
