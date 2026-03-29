import "./index.less";
import { useState } from "react";
import { formatData, formatTaskPriority } from "@/utils/common";
import type { task } from "@/types/task";
import { IconEdit, IconDelete, IconMore } from "@arco-design/web-react/icon";
import {
  Menu,
  Dropdown,
  Modal,
  Form,
  Radio,
  Select,
  DatePicker,
  Input,
  Message,
} from "@arco-design/web-react";

interface TaskItemProps {
  task: task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const MenuItem = Menu.Item;
  const FormItem = Form.Item;
  const Option = Select.Option;
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { taskName, taskPriority, taskDeadline, members } = task;
  const assignee = members?.[0] ?? "-";

  const handleDeleteOption = () => {
    Message.info("删除任务");
    setDeleteModalVisible(false);
  };

  return (
    <div className="taskItem">
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
      <Modal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        title="编辑任务"
        className="editModal"
        style={{ width: 720 }}
      >
        <Form className="editForm">
          {/* 名称 */}
          <FormItem label="任务名称：" field="taskName">
            <Input type="text" />
          </FormItem>
          {/* 描述 */}
          <FormItem label="任务描述：" field="taskDescription">
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
          </FormItem>

          <div className="formRow">
            {/* 优先级 */}
            <FormItem
              label="优先级："
              field="taskPriority"
              className="halfItem"
            >
              <Radio.Group>
                <Radio value="high">高</Radio>
                <Radio value="medium">中</Radio>
                <Radio value="low">低</Radio>
              </Radio.Group>
            </FormItem>
            {/* 负责人 */}
            <FormItem label="负责人：" field="assignee" className="halfItem">
              <Select>
                <Option value={1}>1</Option>
              </Select>
            </FormItem>
          </div>

          <div className="formRow">
            {/* 截止日期 */}
            <FormItem
              label="截止日期："
              field="taskDeadline"
              className="halfItem"
            >
              <DatePicker />
            </FormItem>
            {/* 参与研发 */}
            <FormItem label="参与研发：" field="members" className="halfItem">
              <Input type="text" />
            </FormItem>
          </div>

          {/* 子任务清单 */}
          <FormItem label="子任务清单：" field="subtasks">
            <Input type="text" />
          </FormItem>
          {/* 附件 */}
          <FormItem label="附件：" field="attachments">
            <Input type="file" />
          </FormItem>
        </Form>
      </Modal>
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
