import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  Message,
} from "@arco-design/web-react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { TaskPayload } from "@/types/task";
import { useSearchParams } from "react-router-dom";
import { formatInput } from "@/utils/common";
import { useAddTask, useEditTask } from "@/hooks/useTask";
import "./index.less";

interface taskOption {
  type: string;
  boardMembers?: string[];
  task?: TaskPayload;
  taskId?: string;
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
  const isBlock = task?.isBlock ?? false;
  const blockInfo = task?.blockInfo ?? "";
  const isOverdue = task?.isOverdue ?? false;
  const overdueInfo = task?.overdueInfo ?? "";
  const subtask = task?.subtask ?? "";
  const taskNumber = task?.taskNumber;
  const addTaskMutation = useAddTask(boardId);
  const editTaskMutation = useEditTask(boardId);

  const handleCancel = () => {
    onVisibleChange?.(false);
  };

  const handleConfirm = async () => {
    try {
      const values = await form.validate();
      const parsedTaskNumber = Number.parseInt(String(values.taskNumber), 10);

      if (Number.isNaN(parsedTaskNumber)) {
        Message.error("请输入有效的任务编号");
        return;
      }

      const payload: TaskPayload = {
        taskNumber: parsedTaskNumber,
        taskName: String(values.taskName).trim(),
        isBlock: Boolean(values.isBlock),
        blockInfo: String(values.blockInfo ?? "").trim(),
        isOverdue: Boolean(values.isOverdue),
        overdueInfo: String(values.overdueInfo ?? "").trim(),
        taskPriority: values.taskPriority,
        taskMembers: Array.isArray(values.taskMembers)
          ? values.taskMembers
          : [],
        taskStatus: values.taskStatus,
      };

      const taskDescription = String(values.taskDescription ?? "").trim();
      const taskWorkTime = String(values.taskWorkTime ?? "").trim();
      const subtask = formatInput(values.subtask ?? "");

      if (taskDescription) {
        payload.taskDescription = taskDescription;
      }

      if (taskWorkTime) {
        payload.taskWorkTime = taskWorkTime;
      }

      if (subtask.length > 0) {
        payload.subtask = subtask;
      }

      if (values.taskDeadline) {
        payload.taskDeadline = dayjs(values.taskDeadline).format("YYYY-MM-DD");
      }

      if (type === "add") {
        if (addTaskMutation.isPending) return;
        addTaskMutation.mutate(
          { task: payload, files: selectedFiles },
          {
            onSuccess: () => onVisibleChange?.(false),
          },
        );
        return;
      } else if (type === "edit") {
        if (editTaskMutation.isPending) return;
        if (!task?.taskId) {
          Message.error("任务ID不能为空");
          return;
        }
        editTaskMutation.mutate(
          { taskId: task.taskId, task: payload, files: selectedFiles },
          {
            onSuccess: () => onVisibleChange?.(false),
          },
        );
        return;
      }
      onVisibleChange?.(false);
    } catch {
      return;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(Array.from(event.target.files ?? []));
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
      isBlock,
      blockInfo,
      isOverdue,
      overdueInfo,
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
    isBlock,
    blockInfo,
    isOverdue,
    overdueInfo,
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
        {/* 是否阻塞 */}
        <FormItem
          label="是否阻塞："
          field="isBlock"
          initialValue={false}
          required
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={false}>否</Radio>
            <Radio value={true}>是</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="阻塞说明：" field="blockInfo">
          <Input.TextArea autoSize={{ minRows: 1, maxRows: 1 }} />
        </FormItem>
        {/* 是否逾期 */}
        <FormItem
          label="是否逾期："
          field="isOverdue"
          required
          rules={[{ required: true }]}
          initialValue={false}
        >
          <Radio.Group>
            <Radio value={false}>否</Radio>
            <Radio value={true}>是</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="延期说明：" field="overdueInfo">
          <Input.TextArea autoSize={{ minRows: 1, maxRows: 1 }} />
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
        <FormItem label="附件：">
          <input type="file" multiple onChange={handleFileChange} />
        </FormItem>
      </Form>
    </Modal>
  );
}
