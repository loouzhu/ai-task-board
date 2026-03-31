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
import type { CreateTaskPayload } from "@/types/task";
import { useSearchParams } from "react-router-dom";
import { formatInput } from "@/utils/common";
import { useAddTask } from "@/hooks/useTask";
import "./index.less";

interface taskOption {
  type: string;
  boardMembers?: string[];
  task?: CreateTaskPayload;
  addStatus?: string;
  visible: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

export default function TaskOptionModal({
  type = "add",
  visible = false,
  task,
  addStatus = "pending",
  boardMembers = [],
  onVisibleChange,
}: taskOption) {
  const Option = Select.Option;
  const FormItem = Form.Item;
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId") || "";
  const taskName = task?.taskName ?? "";
  const taskDescription = task?.taskDescription ?? "";
  const taskPriority = task?.taskPriority ?? "low";
  const taskDeadline = task?.taskDeadline?.toString()
    ? dayjs(task.taskDeadline)
    : undefined;
  const taskMembers = task?.taskMembers;
  const taskStatus = task?.taskStatus ?? addStatus;
  const taskWorkTime = task?.taskWorkTime ?? "";
  const subtask = task?.subtask ?? "";
  const taskNumber = task?.taskNumber;
  const addTaskMutation = useAddTask(boardId);

  const handleCancel = () => {
    onVisibleChange?.(false);
  };

  const handleConfirm = () => {
    const values = form.getFieldsValue();
    values.subtask = formatInput(values.subtask);
    console.log(values);
    if (type === "add") {
      if (addTaskMutation.isPending) return;
      addTaskMutation.mutate(values as CreateTaskPayload, {
        onSuccess: () => onVisibleChange?.(false),
      });
      return;
    }
    onVisibleChange?.(false);
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
      taskMembers,
      taskStatus,
      taskWorkTime,
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
    taskMembers,
    taskStatus,
    taskWorkTime,
    subtask,
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
        {/* 任务成员 */}
        <FormItem
          label="任务成员："
          field="taskMembers"
          required
          rules={[{ required: true }]}
        >
          <Select placeholder="第一位成员为负责人" mode="multiple">
            {boardMembers?.map((member) => (
              <Option key={member} value={member}>
                {member}
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
        {/* 预估工时 */}
        <FormItem label="预估工时：" field="taskWorkTime">
          <Input placeholder="例如：2h / 1d" />
        </FormItem>
        {/* 子任务清单 */}
        <FormItem label="子任务清单：" field="subtask">
          <Input type="text" />
        </FormItem>
        {/* 附件 */}
        <FormItem label="附件：" field="files">
          <Input type="file" />
        </FormItem>
      </Form>
    </Modal>
  );
}
