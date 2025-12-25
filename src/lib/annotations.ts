import { Annotation } from "../types";

const ANNOTATION_PREFIX = "<!-- sidenote: ";
const ANNOTATION_SUFFIX = " -->";

/**
 * Generate a unique ID for an annotation
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Parse annotations from HTML comment strings in content
 */
export function parseAnnotations(content: string): Annotation[] {
  const annotations: Annotation[] = [];
  const regex = /<!-- sidenote: ({[^}]+}) -->/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    try {
      const jsonStr = match[1];
      if (!jsonStr) continue;

      const annotation = JSON.parse(jsonStr);
      // Validate the annotation has required fields
      if (
        annotation.id &&
        annotation.selection &&
        annotation.range &&
        annotation.comment &&
        annotation.createdAt
      ) {
        annotations.push(annotation);
      }
    } catch (error) {
      console.error("Failed to parse annotation:", error);
    }
  }

  return annotations;
}

/**
 * Serialize an annotation to HTML comment string
 */
export function serializeAnnotation(annotation: Annotation): string {
  const json = JSON.stringify(annotation);
  return `${ANNOTATION_PREFIX}${json}${ANNOTATION_SUFFIX}`;
}

/**
 * Add an annotation to content
 */
export function addAnnotation(
  content: string,
  annotation: Annotation
): string {
  const annotationComment = serializeAnnotation(annotation);
  return content + "\n" + annotationComment;
}

/**
 * Remove an annotation from content by ID
 */
export function removeAnnotation(content: string, id: string): string {
  const annotations = parseAnnotations(content);
  const filtered = annotations.filter((a) => a.id !== id);

  // Remove all annotation comments
  let result = content.replace(/<!-- sidenote: {[^}]+} -->\n?/g, "");

  // Add back the filtered annotations
  filtered.forEach((annotation) => {
    result = addAnnotation(result, annotation);
  });

  return result;
}

/**
 * Update an annotation's comment
 */
export function updateAnnotation(
  content: string,
  id: string,
  newComment: string
): string {
  const annotations = parseAnnotations(content);
  const updated = annotations.map((a) =>
    a.id === id ? { ...a, comment: newComment } : a
  );

  // Remove all annotation comments
  let result = content.replace(/<!-- sidenote: {[^}]+} -->\n?/g, "");

  // Add back the updated annotations
  updated.forEach((annotation) => {
    result = addAnnotation(result, annotation);
  });

  return result;
}
