export const TaskPriority = {
  low: "low",
  medium: "medium",
  high: "high",
} as const;

export const TaskStatus = {
  pending: "pending",
  processing: "processing",
  testing: "testing",
  completed: "completed",
} as const;

export const imageTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/svg+xml",
  "image/tiff",
  "image/x-icon",
];

export const documentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
];

export const archiveTypes = [
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/x-tar",
  "application/gzip",
  "application/vnd.rar",
];

export const codeTypes = [
  "text/javascript",
  "text/typescript",
  "text/html",
  "text/css",
  "application/json",
  "application/xml",
  "text/markdown",
  "text/x-python",
  "text/x-java-source",
];

export type TaskPriorityValue =
  (typeof TaskPriority)[keyof typeof TaskPriority];
export type TaskStatusValue = (typeof TaskStatus)[keyof typeof TaskStatus];
