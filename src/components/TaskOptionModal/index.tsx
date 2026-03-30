import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
} from "@arco-design/web-react";
import { useEffect } from "react";
import dayjs from "dayjs";
import type { task } from "@/types/task";
import "./index.less";

interface taskOption {
  type: string;
  task?: task;
  addStatus?: string;
  visible: boolean;
  onVisibleChange?: (visible: boolean) => void;
  onConfirm?: () => void;
}

export default function TaskOptionModal({
  type = "add",
  visible = false,
  task,
  addStatus = "pending",
  onVisibleChange,
  onConfirm,
}: taskOption) {
  const Option = Select.Option;
  const FormItem = Form.Item;
  const [form] = Form.useForm();
  const taskName = task?.taskName ?? "";
  const taskDescription = task?.taskDescription ?? "";
  const taskPriority = task?.taskPriority ?? "low";
  const assignee = task?.members?.[0] ?? "";
  const taskDeadline = task?.taskDeadline
    ? dayjs(task.taskDeadline)
    : undefined;
  const members = task?.members?.join(", ") ?? "";
  const taskStatus = task?.taskStatus ?? addStatus;
  const taskWorkTime = task?.taskWorkTime ?? "";
  const subtasks = task?.subtask?.join(", ") ?? "";

  const handleCancel = () => {
    onVisibleChange?.(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    onVisibleChange?.(false);
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    form.setFieldsValue({
      taskName,
      taskDescription,
      taskPriority,
      assignee,
      taskDeadline,
      members,
      taskStatus,
      taskWorkTime,
      subtasks,
    });
  }, [
    visible,
    form,
    taskName,
    taskDescription,
    taskPriority,
    assignee,
    taskDeadline,
    members,
    taskStatus,
    taskWorkTime,
    subtasks,
  ]);

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      onOk={handleConfirm}
      title={type === "add" ? "添加任务" : "编辑任务"}
      className="editModal"
      style={{ width: 750 }}
    >
      <Form className="optionForm" form={form}>
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
        {/* 负责人 */}
        <FormItem
          label="负责人："
          field="assignee"
          required
          rules={[{ required: true }]}
        >
          <Select>
            {assignee ? <Option value={assignee}>{assignee}</Option> : null}
            <Option value={1}>1</Option>
          </Select>
        </FormItem>
        {/* 截止日期 */}
        <FormItem label="截止日期：" field="taskDeadline">
          <DatePicker style={{ width: "100%" }} />
        </FormItem>
        {/* 参与研发 */}
        <FormItem label="参与研发：" field="members">
          <Input type="text" />
        </FormItem>
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
        <FormItem label="预估工时：" field="taskWorkTime">
          <Input placeholder="例如：2h / 1d" />
        </FormItem>
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
  );
}
