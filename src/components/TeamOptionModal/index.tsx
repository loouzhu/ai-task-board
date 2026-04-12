import styles from "./index.module.less";
import { useEffect } from "react";
import { Modal, Form, Select, Message, Input } from "@arco-design/web-react";
import { useGetAllUsers } from "@/hooks/useUser";
import { useCreateTeam, useEditTeam } from "@/hooks/useTeam";
import type { teamPayload } from "@/types/team";
import { teamNameRules, teamMembersRules } from "@/rules/team";
import { useParams } from "react-router-dom";
import type { User } from "@/types/user";

interface TeamOptionModalProps {
  type: "edit" | "create";
  team?: teamPayload;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}

export default function TeamOptionModal({
  type = "create",
  visible = false,
  team,
  onVisibleChange,
}: TeamOptionModalProps) {
  const FormItem = Form.Item;
  const Option = Select.Option;
  const [form] = Form.useForm();
  const teamName = team?.teamName || "";
  const teamId = useParams().teamId;
  const useCreateTeamMutation = useCreateTeam();
  const useEditTeamMutation = useEditTeam();
  const getAllUserQuery = useGetAllUsers();

  useEffect(() => {
    if (!visible) return;
    const teamMembers = Array.isArray(team?.teamMembers)
      ? team.teamMembers
      : [];
    form.setFieldsValue({
      teamName,
      teamMembers,
    });
  }, [visible, teamName, team, form]);

  const handleCancel = () => {
    onVisibleChange?.(false);
  };

  const handleConfirm = async () => {
    try {
      const values = await form.validate();
      const payload = {
        teamName: String(values.teamName.trim()),
        teamMembers: Array.isArray(values.teamMembers)
          ? values.teamMembers
          : [],
      };
      if (type === "create") {
        if (useCreateTeamMutation.isPending) return;
        await useCreateTeamMutation.mutateAsync(payload, {
          onSuccess: () => onVisibleChange?.(false),
        });
      } else if (type === "edit") {
        if (useEditTeamMutation.isPending) return;
        if (!teamId) return Message.error("缺少团队ID");
        await useEditTeamMutation.mutateAsync(
          { ...payload, teamId },
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
      className={styles.container}
      title={type === "edit" ? "编辑团队" : "创建团队"}
      visible={visible}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    >
      <Form form={form}>
        <FormItem
          label="团队名称"
          field="teamName"
          required
          rules={teamNameRules}
        >
          <Input placeholder="请输入团队名称" />
        </FormItem>
        <FormItem
          label="团队成员"
          field="teamMembers"
          required
          rules={teamMembersRules}
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
