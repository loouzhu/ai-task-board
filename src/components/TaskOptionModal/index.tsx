import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
} from "@arco-design/web-react";

interface taskOption {
  type: string;
  visible: boolean;
}

export default function TaskOptionModal({
  type = "add",
  visible = false,
}: taskOption) {
  const Option = Select.Option;
  const FormItem = Form.Item;
  const [modalVisible, setModalVisible] = React.useState(visible);
  return (
    <div className={`taskOptionModal ${type}`}>
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        title={type === "add" ? "添加任务" : "编辑任务"}
        className="editModal"
        style={{ width: 720 }}
      >
        <Form className="editForm">
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
          <div className="formRow">
            {/* 优先级 */}
            <FormItem
              label="优先级："
              field="taskPriority"
              className="halfItem"
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
              className="halfItem"
              required
              rules={[{ required: true }]}
            >
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
              <DatePicker style={{ width: "100%" }} />
            </FormItem>
            {/* 参与研发 */}
            <FormItem label="参与研发：" field="members" className="halfItem">
              <Input type="text" />
            </FormItem>
          </div>
          <div className="formRow">
            <FormItem
              label="任务状态："
              field="taskStatus"
              className="halfItem"
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
            <FormItem
              label="预估工时："
              field="taskWorkTime"
              className="halfItem"
            >
              <Input placeholder="例如：2h / 1d" />
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
    </div>
  );
}
