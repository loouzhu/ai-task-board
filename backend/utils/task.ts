import path from "path";
import { getUserMap, formatUser } from "./user";

interface TaskLike {
  createdBy: string;
  taskMembers?: string[];
  taskStatus?: string;
  taskDeadline?: Date | string | null;
}

const normalizeFilesForDisplay = (files: unknown) => {
  if (!Array.isArray(files)) {
    return files;
  }

  return files.map((file) => {
    if (!file || typeof file !== "object") {
      return file;
    }

    const fileRecord = file as Record<string, unknown>;
    const originalname =
      typeof fileRecord.originalname === "string"
        ? fileRecord.originalname
        : "";
    const filename =
      typeof fileRecord.filename === "string" ? fileRecord.filename : "";

    const fileIdValue =
      typeof fileRecord.fileId === "string" && fileRecord.fileId
        ? fileRecord.fileId
        : filename
          ? path.parse(filename).name || filename
          : "";

    if (!originalname || !filename) {
      return fileRecord;
    }

    return {
      ...fileRecord,
      ...(fileIdValue ? { fileId: fileIdValue } : {}),
      storedName: filename,
      filename: originalname,
    };
  });
};

const isTaskOverdueNow = (task: TaskLike) => {
  if (task.taskStatus === "completed" || !task.taskDeadline) {
    return false;
  }

  const deadline = new Date(task.taskDeadline);
  if (Number.isNaN(deadline.getTime())) {
    return false;
  }

  return deadline < new Date();
};

export const formatTaskInfo = async <T extends TaskLike>(tasks: T[]) => {
  try {
    const userMap = await getUserMap(
      tasks.flatMap((task) => [task.createdBy, ...(task.taskMembers || [])]),
    );

    return tasks.map((task) => {
      const files = normalizeFilesForDisplay(
        (task as TaskLike & { files?: unknown }).files,
      );

      return {
        ...task,
        ...(typeof files === "undefined" ? {} : { files }),
        isOverdue: isTaskOverdueNow(task),
        createdBy: formatUser(task.createdBy, userMap),
        taskMembers: (task.taskMembers || []).map((memberId) =>
          formatUser(memberId, userMap),
        ),
      };
    });
  } catch (error) {
    console.log(error);
    return tasks;
  }
};
