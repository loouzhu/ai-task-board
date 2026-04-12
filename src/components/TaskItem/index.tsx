import styles from "./index.module.less";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { formatData, formatTaskPriority } from "@/utils/common";
import type { TaskItemProps, task } from "@/types/task";
import { useDeleteTask } from "@/hooks/useTask";
import { useTaskStore } from "@/stores/taskStore";
import { useBoardStore } from "@/stores/boardStore";
import { IconEdit, IconDelete, IconMore } from "@arco-design/web-react/icon";
import { Menu, Dropdown, Modal, Tag, Tooltip } from "@arco-design/web-react";
import TaskOptionModal from "../TaskOptionModal";

export default function TaskItem({ task }: TaskItemProps) {
  const MenuItem = Menu.Item;
  const { boardId } = useParams();
  const safeBoardId = boardId ?? "";
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const {
    taskName,
    taskPriority,
    taskDeadline,
    taskMembers,
    isBlock,
    blockInfo,
    isOverdue,
    overdueInfo,
  } = task;
  const boardMembers = useBoardStore((state) => state.boardMembers);
  const setTask = useTaskStore((state) => state.setTask);
  const deleteTask = useDeleteTask(safeBoardId, task.taskId);

  const handleDeleteOption = () => {
    deleteTask.mutate();
    setDeleteModalVisible(false);
  };

  const handleShowTaskDetail = (task: task) => {
    setTask(task);
  };

  return (
    <div className={styles.taskItem} onClick={() => handleShowTaskDetail(task)}>
      <div className={styles.content}>
        <div className={styles.name}>任务名：{taskName}</div>
        <div className={styles.priority}>
          优先级：{formatTaskPriority(taskPriority)}
        </div>
        <div className={styles.principle}>
          负责人：{taskMembers?.[0] || "-"}{" "}
        </div>
        <div className={styles.deadline}>
          截止日期：{taskDeadline ? formatData(taskDeadline) : "暂无"}
        </div>
      </div>
      <div className={styles.options}>
        <Dropdown
          droplist={
            <Menu>
              <MenuItem key="edit" onClick={() => setEditModalVisible(true)}>
                <IconEdit /> 编辑
              </MenuItem>
              <MenuItem
                key="delete"
                onClick={() => setDeleteModalVisible(true)}
              >
                <IconDelete /> 删除
              </MenuItem>
            </Menu>
          }
        >
          <IconMore />
        </Dropdown>
        {isBlock && (
          <Tooltip content={blockInfo} color="#3491FA">
            <Tag color="gold">阻塞</Tag>
          </Tooltip>
        )}
        {isOverdue && (
          <Tooltip content={overdueInfo} color="#FF4D4F">
            <Tag color="red">逾期</Tag>
          </Tooltip>
        )}
      </div>
      {/* 编辑任务 */}
      <TaskOptionModal
        type="edit"
        visible={editModalVisible}
        task={task}
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
