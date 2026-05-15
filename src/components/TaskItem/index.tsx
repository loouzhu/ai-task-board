import styles from "./index.module.less";
import { formatData, formatTaskPriority } from "@/utils/common";
import type { TaskItemProps, task } from "@/types/task";
import { useTaskStore } from "@/stores/taskStore";
import { IconEdit, IconDelete, IconMore } from "@arco-design/web-react/icon";
import { Menu, Dropdown, Tag, Tooltip } from "@arco-design/web-react";

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const MenuItem = Menu.Item;
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
  const setTask = useTaskStore((state) => state.setTask);
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
              <MenuItem key="edit" onClick={() => onEdit?.(task)}>
                <IconEdit /> 编辑
              </MenuItem>
              <MenuItem key="delete" onClick={() => onDelete?.(task)}>
                <IconDelete /> 删除
              </MenuItem>
            </Menu>
          }
        >
          <span
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <IconMore />
          </span>
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
    </div>
  );
}
