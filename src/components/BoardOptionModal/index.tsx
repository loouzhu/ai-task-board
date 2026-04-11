import { Modal, Form, Select, Message, Input } from "@arco-design/web-react";
import { useCreateBoard, useEditBoard } from "@/hooks/useBoard";
import { useSearchParams } from "react-router-dom";
import { useGetAllUsers } from "@/hooks/useUser";
import type { User } from "@/types/user";
import type { boardPayload } from "@/types/board";
import { useEffect } from "react";

interface BoardOptionModalProps {
  type: "edit" | "create";
  board?: boardPayload;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}

export default function BoardOptionModal({
  type = "create",
  visible = false,
  board,
  onVisibleChange,
}: BoardOptionModalProps) {
  const FormItem = Form.Item;
  const Option = Select.Option;
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const boardName = board?.boardName || "";
  const boardId = searchParams.get("boardId") || "";
  const boardMembers = board?.boardMembers || [];
  const createBoardMutation = useCreateBoard();
  const getAllUserQuery = useGetAllUsers();
  const editBoardMutation = useEditBoard();

  useEffect(() => {
    if (!visible) return;
    form.setFieldsValue({
      boardName,
      boardMembers,
    });
  }, [visible, boardName, boardMembers, form]);

  const handleCancel = () => {
    onVisibleChange?.(false);
  };

  const handleConfirm = async () => {
    try {
      const values = await form.validate();
      const payload = {
        boardName: String(values.boardName ?? "").trim(),
        boardMembers: Array.isArray(values.boardMembers) ? values.boardMembers : [],
      };

      if (type === "create") {
        if (createBoardMutation.isPending) return;
        createBoardMutation.mutate(payload, {
          onSuccess: () => onVisibleChange?.(false),
        });
      } else if (type === "edit") {
        if (editBoardMutation.isPending) return;
        if (!boardId) {
          return Message.error("缺少看板Id");
        }
        editBoardMutation.mutate(
          { ...payload, boardId },
          {
            onSuccess: () => onVisibleChange?.(false),
          },
        );
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={type === "edit" ? "编辑看板" : "创建看板"}
      visible={visible}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      className={styles.boardOptionModal}
    >
      <Form form={form}>
        <FormItem
          label="看板名称"
          field="boardName"
          required
          rules={[{ required: true }]}
        >
          <Input />
        </FormItem>
        <FormItem
          label="看板成员："
          field="boardMembers"
          required
          rules={[{ required: true }]}
        >
          <Select placeholder="第一位成员为负责人" mode="multiple">
            {getAllUserQuery.data?.users?.map((user: User) => (
              <Option key={user.userId} value={user.userId}>
                {user.username}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
}
