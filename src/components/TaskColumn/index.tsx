import type { task, taskType } from "@/types/task";
import { useState } from "react";
import { Empty, Modal } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import TaskOptionModal from "../TaskOptionModal";
import TaskItem from "../TaskItem";
import { useParams } from "react-router-dom";
import { useBoardStore } from "@/stores/boardStore";
import { useDeleteTask } from "@/hooks/useTask";
import styles from "./index.module.less";

interface taskColumnProp {
  className?: string;
  columnStatus: taskType;
  columnLabel?: string;
  count: number;
  tasks: task[];
}

export default function TaskColumn({
  className = "",
  columnStatus,
  columnLabel,
  count = 0,
  tasks = [],
}: taskColumnProp) {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [activeTask, setActiveTask] = useState<task | null>(null);
  const { boardId } = useParams();
  const safeBoardId = boardId ?? "";
  const boardMembers = useBoardStore((state) => state.boardMembers);
  const handleAddTask = () => {
    setAddModalVisible(true);
  };
  const deleteTask = useDeleteTask(safeBoardId, activeTask?.taskId ?? "");
  const handleDeleteOption = () => {
    if (!activeTask) {
      return;
    }
    deleteTask.mutate();
    setDeleteModalVisible(false);
  };
  const handleTaskEdit = (taskItem: task) => {
    setActiveTask(taskItem);
    setEditModalVisible(true);
  };
  const handleTaskDelete = (taskItem: task) => {
    setActiveTask(taskItem);
    setDeleteModalVisible(true);
  };
  const activeTaskPayload = activeTask
    ? {
        taskId: activeTask.taskId,
        taskNumber: activeTask.taskNumber,
        taskName: activeTask.taskName,
        isBlock: activeTask.isBlock,
        blockInfo: activeTask.blockInfo,
        isOverdue: activeTask.isOverdue,
        overdueInfo: activeTask.overdueInfo,
        taskDescription: activeTask.taskDescription,
        taskPriority: activeTask.taskPriority,
        taskDeadline: activeTask.taskDeadline,
        taskMembers: activeTask.taskMembers,
        taskStatus: activeTask.taskStatus,
        taskWorkTime: activeTask.taskWorkTime,
        subtask: activeTask.subtask,
      }
    : undefined;

  return (
    <div className={`${styles.taskColumns} ${className}`} key={columnStatus}>
      {/* 列头 */}
      <div className={styles.status}>
        <div className={styles.left}>
          <div className={styles.type}>{columnLabel ?? columnStatus}</div>
          <IconPlus onClick={handleAddTask} style={{ cursor: "pointer" }} />
        </div>
        <div className={styles.count}>{count}个任务</div>
      </div>

      {/* 任务列表 */}
      {tasks.length > 0 ? (
        <div className={styles.taskItems}>
          {tasks.map((task) => (
            <TaskItem
              key={task.taskId}
              task={task}
              onEdit={handleTaskEdit}
              onDelete={handleTaskDelete}
            />
          ))}
        </div>
      ) : (
        <Empty description="暂无任务" />
      )}

      <TaskOptionModal
        type="add"
        visible={addModalVisible}
        addStatus={columnStatus}
        boardMembers={boardMembers}
        onVisibleChange={setAddModalVisible}
      />
      {/* 编辑任务 */}
      <TaskOptionModal
        type="edit"
        visible={editModalVisible && !!activeTask}
        task={activeTaskPayload}
        existingFiles={activeTask?.files}
        boardMembers={boardMembers}
        onVisibleChange={setEditModalVisible}
      />
      {/* 删除任务 */}
      <Modal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteOption}
        title="删除任务"
      >
        <div>确定要删除该任务吗？</div>
      </Modal>
    </div>
  );
}
