export interface task {
  boardId: string;
  createdAt: string;
  createdBy: string;
  files: [];
  subtask: string[];
  taskDeadline: string;
  taskDescription: string;
  taskId: string;
  principle: string;
  taskMembers: string[];
  taskName: string;
  taskNumber: number;
  taskPriority: string;
  taskStatus: taskType;
  taskWorkTime: Date;
}

export type taskType = "pending" | "processing" | "testing" | "completed";
