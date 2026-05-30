export interface TaskFile {
  fileId?: string;
  name?: string;
  filename?: string;
  originalname?: string;
  mimetype?: string;
  path?: string;
  storedName?: string;
  uploadedAt?: string;
  size?: number | string;
  url?: string;
}

export interface task {
  boardId: string;
  blockInfo: string;
  createdAt: string;
  createdBy: string;
  files: TaskFile[];
  isBlock: boolean;
  isOverdue: boolean;
  overdueInfo: string;
  subtask: string[];
  taskDeadline: string;
  taskDescription: string;
  taskId: string;
  taskMembers: string[];
  taskName: string;
  taskNumber: number;
  taskPriority: string;
  taskStatus: taskType;
  taskWorkTime: string;
  boardName?: string;
}

export type taskType = "pending" | "processing" | "testing" | "completed";

export interface taskFilterParams {
  filterMember?: string;
  taskPriority?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  taskStatus?: string;
}
export interface TaskItemProps {
  task: task;
  onEdit?: (task: task) => void;
  onDelete?: (task: task) => void;
}

export interface TaskPayload {
  taskId?: string;
  taskNumber: number;
  taskName: string;
  isBlock: boolean;
  blockInfo: string;
  isOverdue: boolean;
  overdueInfo: string;
  taskDescription?: string;
  taskPriority: string;
  taskDeadline?: string;
  taskMembers: string[];
  taskStatus: taskType;
  taskWorkTime?: string;
  subtask?: string[];
  removeFileIds?: string[];
  files?: File[];
}

export type dateType = "week" | "month";
