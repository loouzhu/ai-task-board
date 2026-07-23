import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  Message,
  Button,
} from "@arco-design/web-react";
import { IconDelete } from "@arco-design/web-react/icon";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import type { TaskFile, TaskPayload } from "@/types/task";
import type { User } from "@/types/user";
import { useTaskStore } from "@/stores/taskStore";
import { useParams } from "react-router-dom";
import { formatInput } from "@/utils/common";
import { useAddTask, useEditTask } from "@/hooks/useTask";
import styles from "./index.module.less";

interface taskOption {
  type: string;
  boardMembers?: User[];
  task?: TaskPayload;
  existingFiles?: TaskFile[];
  taskId?: string;
  addStatus?: string;
  visible: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

type ExistingEntry = {
  id: string;
  name: string;
  url?: string;
  mimeType?: string;
  isExisting: true;
};

type SelectedEntry = {
  id: string;
  name: string;
  url: string;
  mimeType?: string;
  isExisting: false;
  index: number;
};

type AttachmentEntry = ExistingEntry | SelectedEntry;

export default function TaskOptionModal({
  type = "add",
  visible = false,
  task,
  existingFiles,
  addStatus = "pending",
  boardMembers = [],
  onVisibleChange,
}: taskOption) {
  const maxFiles = 5;
  const Option = Select.Option;
  const FormItem = Form.Item;
  const [form] = Form.useForm();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [removedExistingIds, setRemovedExistingIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { boardId } = useParams();
  const taskName = task?.taskName ?? "";
  const taskDescription = task?.taskDescription ?? "";
  const taskPriority = task?.taskPriority ?? "low";
  const taskDeadline = task?.taskDeadline?.toString()
    ? dayjs(task.taskDeadline)
    : undefined;
  const assigneeId = task?.assigneeId;
  const collaboratorIds = useMemo(
    () => task?.collaboratorIds ?? [],
    [task?.collaboratorIds],
  );
  const taskStatus = task?.taskStatus ?? addStatus;
  const taskWorkTime = task?.taskWorkTime ?? "";
  const isBlock = task?.isBlock ?? false;
  const blockInfo = task?.blockInfo ?? "";
  const isOverdue = task?.isOverdue ?? false;
  const overdueInfo = task?.overdueInfo ?? "";
  const subtask = task?.subtask ?? "";
  const taskNumber = task?.taskNumber;
  const filterParams = useTaskStore((state) => state.filterParams);
  const addTaskMutation = useAddTask(boardId || "", filterParams);
  const editTaskMutation = useEditTask(boardId || "", filterParams);
  const uploadBaseUrl = import.meta.env.VITE_UPLOAD_BASE_URL ?? "";
  const currentTask = useTaskStore((state) => state.task);
  const setTask = useTaskStore((state) => state.setTask);

  const getExistingFileId = (file: TaskFile, index: number) =>
    file.fileId ||
    file.storedName ||
    file.url ||
    file.path ||
    file.filename ||
    file.originalname ||
    `file-${index}`;

  const getExistingFileName = (file: TaskFile, index: number) =>
    file.originalname || file.filename || file.name || `附件${index + 1}`;

  const existingEntries = useMemo<ExistingEntry[]>(() => {
    return (existingFiles ?? [])
      .map((file, index) => {
        const id = getExistingFileId(file, index);
        const entry: ExistingEntry = {
          id,
          name: getExistingFileName(file, index),
          url: file.url,
          mimeType: file.mimetype,
          isExisting: true,
        };
        return entry;
      })
      .filter((entry) => !removedExistingIds.includes(entry.id));
  }, [existingFiles, removedExistingIds]);

  const selectedEntries = useMemo<SelectedEntry[]>(() => {
    return selectedFiles.map((file, index) => {
      const entry: SelectedEntry = {
        id: `local-${file.name}-${file.lastModified}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        mimeType: file.type,
        isExisting: false,
        index,
      };
      return entry;
    });
  }, [selectedFiles]);

  const resolveFileUrl = (url?: string) => {
    if (!url) return undefined;
    if (/^(https?:|blob:|data:)/i.test(url)) return url;
    if (uploadBaseUrl) return `${uploadBaseUrl}${url}`;
    return url;
  };

  const getFileExtension = (name?: string) => {
    if (!name) return "";
    const parts = name.split(".");
    return parts.length > 1 ? (parts.at(-1)?.toUpperCase() ?? "") : "";
  };

  const isImageFile = (mimeType?: string, name?: string) => {
    if (mimeType?.startsWith("image/")) return true;
    const ext = getFileExtension(name);
    return ["PNG", "JPG", "JPEG", "GIF", "WEBP", "SVG"].includes(ext);
  };

  const totalFileCount = existingEntries.length + selectedFiles.length;

  useEffect(() => {
    return () => {
      selectedEntries.forEach((entry) => URL.revokeObjectURL(entry.url));
    };
  }, [selectedEntries]);

  const resetAttachments = () => {
    setSelectedFiles([]);
    setRemovedExistingIds([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    resetAttachments();
    onVisibleChange?.(false);
  };

  const handleConfirm = async () => {
    try {
      const values = await form.validate();
      const parsedTaskNumber = Number.parseInt(String(values.taskNumber), 10);

      if (Number.isNaN(parsedTaskNumber)) {
        Message.error("请输入有效的任务编号");
        return;
      }

      const payload: TaskPayload = {
        assigneeId: String(values.assigneeId ?? ""),
        taskNumber: parsedTaskNumber,
        taskName: String(values.taskName).trim(),
        isBlock: Boolean(values.isBlock),
        blockInfo: String(values.blockInfo ?? "").trim(),
        isOverdue: Boolean(values.isOverdue),
        overdueInfo: String(values.overdueInfo ?? "").trim(),
        taskPriority: values.taskPriority,
        collaboratorIds: Array.isArray(values.collaboratorIds)
          ? values.collaboratorIds.filter(
              (collaboratorId: string) => collaboratorId !== values.assigneeId,
            )
          : [],
        taskStatus: values.taskStatus,
      };

      const taskDescription = String(values.taskDescription ?? "").trim();
      const taskWorkTime = String(values.taskWorkTime ?? "").trim();
      const subtask = formatInput(values.subtask ?? "");

      if (taskDescription) {
        payload.taskDescription = taskDescription;
      }

      if (taskWorkTime) {
        payload.taskWorkTime = taskWorkTime;
      }

      if (subtask.length > 0) {
        payload.subtask = subtask;
      }

      if (values.taskDeadline) {
        payload.taskDeadline = dayjs(values.taskDeadline).format("YYYY-MM-DD");
      }

      if (type === "add") {
        if (addTaskMutation.isPending) return;
        addTaskMutation.mutate(
          { task: payload, files: selectedFiles },
          {
            onSuccess: () => {
              resetAttachments();
              onVisibleChange?.(false);
            },
          },
        );
        return;
      } else if (type === "edit") {
        if (editTaskMutation.isPending) return;
        if (!task?.taskId) {
          Message.error("任务ID不能为空");
          return;
        }
        if (removedExistingIds.length > 0) {
          payload.removeFileIds = removedExistingIds;
        }
        editTaskMutation.mutate(
          { taskId: task.taskId, task: payload, files: selectedFiles },
          {
            onSuccess: (updatedTask) => {
              const updatedTaskId =
                (updatedTask as typeof currentTask | undefined)?.taskId ||
                task.taskId;
              const shouldUpdateCurrent = currentTask?.taskId === updatedTaskId;

              if (shouldUpdateCurrent && currentTask) {
                const nextFiles = removedExistingIds.length
                  ? currentTask.files.filter(
                      (file, index) =>
                        !removedExistingIds.includes(
                          getExistingFileId(file, index),
                        ),
                    )
                  : currentTask.files;

                const fallbackTask = {
                  ...currentTask,
                  ...payload,
                  taskId: currentTask.taskId,
                  files: nextFiles,
                };

                setTask(
                  (updatedTask as typeof currentTask | undefined) ??
                    fallbackTask,
                );
              }

              resetAttachments();
              onVisibleChange?.(false);
            },
          },
        );
        return;
      }
      resetAttachments();
      onVisibleChange?.(false);
    } catch {
      return;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files ?? []);
    if (incomingFiles.length === 0) {
      return;
    }

    setSelectedFiles((prevFiles) => {
      const remainingSlots =
        maxFiles - (existingEntries.length + prevFiles.length);
      if (remainingSlots <= 0) {
        Message.warning(`单个任务最多添加${maxFiles}个附件`);
        return prevFiles;
      }

      const nextFiles = prevFiles.concat(
        incomingFiles.slice(0, remainingSlots),
      );
      if (incomingFiles.length > remainingSlots) {
        Message.warning(`单个任务最多添加${maxFiles}个附件`);
      }
      return nextFiles;
    });

    event.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const handleRemoveExistingFile = (id: string) => {
    setRemovedExistingIds((prevIds) =>
      prevIds.includes(id) ? prevIds : [...prevIds, id],
    );
  };

  const handlePickFiles = () => {
    if (totalFileCount >= maxFiles) {
      Message.warning(`单个任务最多添加${maxFiles}个附件`);
      return;
    }
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    form.setFieldsValue({
      taskName,
      taskNumber,
      taskDescription,
      taskPriority,
      taskDeadline,
      assigneeId,
      collaboratorIds,
      taskStatus,
      taskWorkTime,
      isBlock,
      blockInfo,
      isOverdue,
      overdueInfo,
      subtask,
    });
  }, [
    visible,
    form,
    taskName,
    taskNumber,
    taskDescription,
    taskPriority,
    taskDeadline,
    assigneeId,
    collaboratorIds,
    taskStatus,
    taskWorkTime,
    isBlock,
    blockInfo,
    isOverdue,
    overdueInfo,
    subtask,
  ]);

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      onOk={handleConfirm}
      title={type === "add" ? "添加任务" : "编辑任务"}
      className={styles.editModal}
      style={{ width: 750 }}
    >
      <Form className={styles.optionForm} form={form}>
        {/* 任务编号 */}
        <FormItem
          label="任务编号："
          field="taskNumber"
          required
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </FormItem>
        {/* 任务名称 */}
        <FormItem
          label="任务名称："
          field="taskName"
          required
          rules={[{ required: true }]}
        >
          <Input type="text" />
        </FormItem>
        {/* 描述 */}
        <FormItem label="任务描述：" field="taskDescription">
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 2 }} />
        </FormItem>
        {/* 优先级 */}
        <FormItem
          label="优先级："
          field="taskPriority"
          required
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value="high">高</Radio>
            <Radio value="medium">中</Radio>
            <Radio value="low">低</Radio>
          </Radio.Group>
        </FormItem>
        {/* 任务负责人 */}
        <FormItem
          label="负责人："
          field="assigneeId"
          required
          rules={[{ required: true }]}
        >
          <Select placeholder="请选择负责人">
            {boardMembers?.map((member) => (
              <Option key={member.userId} value={member.userId}>
                {member.username}
              </Option>
            ))}
          </Select>
        </FormItem>
        {/* 其他参与人 */}
        <FormItem label="其他参与人：" field="collaboratorIds">
          <Select placeholder="请选择其他参与人" mode="multiple">
            {boardMembers?.map((member) => (
              <Option key={member.userId} value={member.userId}>
                {member.username}
              </Option>
            ))}
          </Select>
        </FormItem>
        {/* 截止日期 */}
        <FormItem label="截止日期：" field="taskDeadline">
          <DatePicker style={{ width: "100%" }} />
        </FormItem>
        {/* 任务状态 */}
        <FormItem
          label="任务状态："
          field="taskStatus"
          required
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="pending">待处理</Option>
            <Option value="processing">处理中</Option>
            <Option value="testing">测试中</Option>
            <Option value="completed">已完成</Option>
          </Select>
        </FormItem>
        {/* 是否阻塞 */}
        <FormItem
          label="是否阻塞："
          field="isBlock"
          initialValue={false}
          required
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={false}>否</Radio>
            <Radio value={true}>是</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="阻塞说明：" field="blockInfo">
          <Input.TextArea autoSize={{ minRows: 1, maxRows: 1 }} />
        </FormItem>
        {/* 是否逾期 */}
        <FormItem
          label="是否逾期："
          field="isOverdue"
          required
          rules={[{ required: true }]}
          initialValue={false}
        >
          <Radio.Group>
            <Radio value={false}>否</Radio>
            <Radio value={true}>是</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="延期说明：" field="overdueInfo">
          <Input.TextArea autoSize={{ minRows: 1, maxRows: 1 }} />
        </FormItem>
        {/* 预估工时 */}
        <FormItem label="预估工时：" field="taskWorkTime">
          <Input placeholder="例如：2h / 1d" />
        </FormItem>
        {/* 子任务清单 */}
        <FormItem label="子任务清单：" field="subtask">
          <Input type="text" />
        </FormItem>
        {/* 附件 */}
        <FormItem label="附件：">
          <div className={styles.attachmentRow}>
            <div className={styles.fileList}>
              {existingEntries.length + selectedEntries.length > 0 ? (
                (
                  [...existingEntries, ...selectedEntries] as AttachmentEntry[]
                ).map((entry) => {
                  const previewUrl = resolveFileUrl(entry.url);
                  const showImage = isImageFile(entry.mimeType, entry.name);
                  const label = getFileExtension(entry.name) || "FILE";
                  return (
                    <div key={entry.id} className={styles.fileItem}>
                      <div className={styles.filePreview}>
                        {previewUrl && showImage ? (
                          <img src={previewUrl} alt={entry.name} />
                        ) : (
                          <div className={styles.fileFallback}>{label}</div>
                        )}
                      </div>
                      <div className={styles.fileName} title={entry.name}>
                        {entry.name}
                      </div>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() =>
                          entry.isExisting
                            ? handleRemoveExistingFile(entry.id)
                            : handleRemoveFile(entry.index)
                        }
                        aria-label="删除附件"
                      >
                        <IconDelete />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className={styles.emptyFiles}>暂无附件</div>
              )}
            </div>
            <div className={styles.uploadArea}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <Button
                size="small"
                type="primary"
                onClick={handlePickFiles}
                disabled={totalFileCount >= maxFiles}
              >
                添加文件
              </Button>
              <div className={styles.uploadHint}>
                {totalFileCount}/{maxFiles}
              </div>
            </div>
          </div>
        </FormItem>
      </Form>
    </Modal>
  );
}
