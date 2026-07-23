import { Modal, Form, Select, Message, Input } from "@arco-design/web-react";
import { useCreateBoard, useEditBoard } from "@/hooks/useBoard";
import { useParams } from "react-router-dom";
import { useGetTeamInfo } from "@/hooks/useTeam";
import type { User } from "@/types/user";
import type { boardListProps } from "@/types/board";
import { boardNameRules, boardMembersRules } from "@/rules/board";
import { useEffect } from "react";
import styles from "./index.module.less";

interface BoardOptionModalProps {
  type: "edit" | "create";
  board?: boardListProps;
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
  const boardName = board?.boardName || "";
  const { teamId, boardId } = useParams();
  const createBoardMutation = useCreateBoard();
  const getTeamInfoQuery = useGetTeamInfo(teamId || "");
  const editBoardMutation = useEditBoard();

  useEffect(() => {
    if (!visible) return;
    const boardMembers = board?.boardMembers.map((member) => member.userId) || [];
    form.setFieldsValue({
      boardName,
      boardMembers,
    });
  }, [visible, boardName, board, form]);

  const handleCancel = () => {
    onVisibleChange?.(false);
  };

  const handleConfirm = async () => {
    try {
      const values = await form.validate();
      const payload = {
        boardName: String(values.boardName ?? "").trim(),
        boardMembers: Array.isArray(values.boardMembers)
          ? values.boardMembers
          : [],
      };
      if (!teamId) return Message.error("缺少团队Id");
      if (type === "create") {
        if (createBoardMutation.isPending) return;
        createBoardMutation.mutate(
          { ...payload, teamId },
          {
            onSuccess: () => onVisibleChange?.(false),
          },
        );
      } else if (type === "edit") {
        if (editBoardMutation.isPending) return;
        if (!boardId) {
          return Message.error("缺少看板Id");
        }
        editBoardMutation.mutate(
          { ...payload, boardId, teamId },
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
          rules={boardNameRules}
        >
          <Input placeholder="请输入看板名称" />
        </FormItem>
        <FormItem
          label="看板成员："
          field="boardMembers"
          required
          rules={boardMembersRules}
        >
          <Select placeholder="请选择看板成员" mode="multiple">
            {getTeamInfoQuery.data?.team?.teamMembers?.map((user: User) => (
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
