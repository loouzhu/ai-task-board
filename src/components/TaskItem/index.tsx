import "./index.less";
import { useState } from "react";
import { formatData } from "@/utils/common";
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
  const { taskName, taskPriority, taskDeadline, principle } = task;

  const handleDeleteOption = () => {
    Message.info("删除任务");
    setDeleteModalVisible(false);
  };

  return (
    <div className="taskItem">
      <div className="content">
        <div className="name">任务名：{taskName}</div>
        <div className="priority">优先级：{taskPriority}</div>
        <div className="principle">负责人：{principle} </div>
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
        className="editModal"
      >
        <Form>
          {/* 名称 */}
          <FormItem>
            任务名称：
            <Input type="text" />
          </FormItem>
          {/* 描述 */}
          <FormItem>
            任务描述：
            <textarea></textarea>
          </FormItem>
          {/* 参与研发 */}
          <FormItem>
            参与研发：
            <Input type="text" />
          </FormItem>
          {/* 优先级 */}
          <FormItem>
            优先级：
            <Radio.Group>
              <Radio value="high">高</Radio>
              <Radio value="medium">中</Radio>
              <Radio value="low">低</Radio>
            </Radio.Group>
          </FormItem>
          {/* 负责人 */}
          <FormItem>
            负责人：
            <Select>
              <Option value={1}>1</Option>
            </Select>
          </FormItem>
          {/* 截止日期 */}
          <FormItem>
            截止日期：
            <DatePicker />
          </FormItem>
          {/* 子任务清单 */}
          <FormItem>1</FormItem>
          {/* 附件 */}
          <FormItem>
            附件：
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
