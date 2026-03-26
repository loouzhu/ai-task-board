import "./index.less";
import { formatData } from "@/utils/common";
import { useState } from "react";
import type { task } from "@/types/task";
import { Modal, Form, Input, Radio } from "@arco-design/web-react";

interface TaskItemProps {
  task: task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const FormItem = Form.Item;
  const RadioGroup = Radio.Group;
  const [visible, setVisible] = useState(false);
  const { taskName, taskPriority, taskDeadline, principle } = task;

  return (
    <div>
      <div className="taskItem" onClick={() => setVisible(true)}>
        <div className="name">任务名：{taskName}</div>
        <div className="priority">优先级：{taskPriority}</div>
        <div className="principle">负责人：{principle} </div>
        <div className="deadline">截止日期：{formatData(taskDeadline)}</div>
      </div>
      <Modal
        title="编辑任务详情"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        focusLock={true}
      >
        <Form>
          <FormItem label="任务名">
            <Input placeholder="请输入任务名" required />
          </FormItem>
          <FormItem label="任务描述">
            <Input.TextArea placeholder="请输入任务描述" />
          </FormItem>
          <FormItem label="优先级">
            <RadioGroup>
              <Radio value="high">高</Radio>
              <Radio value="medium">中</Radio>
              <Radio value="low">低</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="截止日期">
            <Input placeholder="请输入截止日期" required />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}
