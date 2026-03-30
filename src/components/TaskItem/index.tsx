import "./index.less";
import { useState } from "react";
import { formatData, formatTaskPriority } from "@/utils/common";
import type { TaskItemProps, task } from "@/types/task";
import { useTaskStore } from "@/stores/taskStore";
import { IconEdit, IconDelete, IconMore } from "@arco-design/web-react/icon";
import { Menu, Dropdown, Modal, Message } from "@arco-design/web-react";
import TaskOptionModal from "../TaskOptionModal";

export default function TaskItem({ task }: TaskItemProps) {
  const MenuItem = Menu.Item;
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { taskName, taskPriority, taskDeadline, members } = task;
  const assignee = members?.[0] ?? "-";

  const handleDeleteOption = () => {
    Message.info("删除任务");
    setDeleteModalVisible(false);
  };

  const setTask = useTaskStore((state) => state.setTask);

  const handleShowTaskDetail = (task: task) => {
    setTask(task);
  };

  return (
    <div className="taskItem" onClick={() => handleShowTaskDetail(task)}>
      <div className="content">
        <div className="name">任务名：{taskName}</div>
        <div className="priority">
          优先级：{formatTaskPriority(taskPriority)}
        </div>
        <div className="principle">负责人：{assignee} </div>
        <div className="deadline">截止日期：{formatData(taskDeadline)}</div>
      </div>
      <div className="options">
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
      </div>
      {/* 编辑任务 */}
      <TaskOptionModal
        type="edit"
        visible={editModalVisible}
        task={task}
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
