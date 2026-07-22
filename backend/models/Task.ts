import { randomUUID } from "crypto";
import mongoose from "mongoose";
import {
  TaskPriority,
  TaskStatus,
  TaskPriorityValue,
  TaskStatusValue,
} from "../config/type";

export interface TaskFileRecord {
  fileId?: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  uploadedAt: Date;
}

export interface TaskRecord {
  taskId: string;
  boardId: string;
  createdBy: string;
  taskNumber: number;
  taskName: string;
  taskDeadline?: Date | null;
  taskWorkTime?: string;
  taskMembers: string[];
  taskDescription?: string;
  taskPriority: TaskPriorityValue;
  taskStatus: TaskStatusValue;
  isBlock: boolean;
  blockInfo: string;
  isOverdue: boolean;
  overdueInfo: string;
  has_error?: boolean;
  subtask: string[];
  files: TaskFileRecord[];
  createdAt: Date;
}

const taskFileSchema = new mongoose.Schema<TaskFileRecord>(
  {
    fileId: {
      type: String,
      required: false,
    },
    filename: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false },
);

const taskSchema = new mongoose.Schema<TaskRecord>({
  taskId: {
    type: String,
    required: true,
    unique: true,
    default: () => randomUUID(),
  },
  boardId: {
    type: String,
    required: [true, "看板ID是必填项"],
    index: true,
  },
  createdBy: {
    type: String,
    required: [true, "创建者是必填项"],
  },
  taskNumber: {
    type: Number,
    required: [true, "任务编号是必填项"],
  },
  taskName: {
    type: String,
    required: [true, "任务名称是必填项"],
    trim: true,
    minLength: [3, "任务名称至少为3个字符"],
    maxLength: [8, "任务名称最多为8个字符"],
  },
  taskDeadline: {
    type: Date,
    required: false,
  },
  taskWorkTime: {
    type: String,
    required: false,
  },
  taskMembers: {
    type: [String],
    required: false,
    default: [],
  },
  taskDescription: {
    type: String,
    required: false,
    trim: true,
    maxLength: [100, "任务描述最多为100个字符"],
  },
  taskPriority: {
    type: String,
    enum: Object.values(TaskPriority),
    required: [true, "任务优先级是必填项"],
  },
  taskStatus: {
    type: String,
    enum: Object.values(TaskStatus),
    required: [true, "任务状态是必填项"],
  },
  isBlock: {
    type: Boolean,
    required: [true, "任务阻塞状态是必填项"],
    default: false,
  },
  blockInfo: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  isOverdue: {
    type: Boolean,
    required: [true, "任务逾期状态是必填项"],
    default: false,
  },
  overdueInfo: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  has_error: {
    type: Boolean,
    required: false,
    default: false,
  },
  subtask: {
    type: [String],
    required: false,
    default: [],
  },
  files: {
    type: [taskFileSchema],
    required: false,
    default: [],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

taskSchema.index({ boardId: 1, taskNumber: 1 }, { unique: true });

taskSchema.pre("validate", function () {
  const task = this as mongoose.HydratedDocument<TaskRecord>;
  if (!task.taskId) {
    task.taskId = randomUUID();
  }
});

const Task = mongoose.model<TaskRecord>("Task", taskSchema);

export default Task;
