import "./index.less";
import { useState } from "react";
import { Modal, Form, Input, Radio } from "@arco-design/web-react";

interface Task {
  name: string;
  priority: string;
  deadline: string;
  info?: string;
}

interface TaskProp {
  task: Task;
}

const handleEditTask = () => {};

export default function TaskItem({ task }: TaskProp) {
  const FormItem = Form.Item;
  const RadioGroup = Radio.Group;
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="taskItem" onClick={handleEditTask}>
        <div className="name">任务名：{task.name}</div>
        <div className="priority">
          优先级：
          {task.priority === "high"
            ? "高"
            : task.priority === "medium"
              ? "中"
              : "低"}
        </div>
        <div className="assignee">负责人：张三</div>
        <div className="deadline">截止日期：{task.deadline}</div>
        {task.info && <div className="else">{task.info}</div>}
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
