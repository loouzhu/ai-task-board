import styles from "./index.module.less";
import { useEffect } from "react";
import { Modal, Form, Select, Message, Input } from "@arco-design/web-react";
import { useGetAllUsers } from "@/hooks/useUser";
import { useCreateTeam, useEditTeam } from "@/hooks/useTeam";
import type { teamPayload } from "@/types/team";
import { teamNameRules, teamMembersRules } from "@/rules/team";
import { useParams } from "react-router-dom";
import type { User } from "@/types/user";

type TeamMemberValue = { userId?: string; username?: string };

const normalizeTeamMembers = (members: unknown): string[] => {
  if (!Array.isArray(members)) {
    return [];
  }

  return members
    .map((member) => {
      if (typeof member === "string") {
        return member;
      }

      if (member && typeof member === "object") {
        const teamMember = member as TeamMemberValue;
        return typeof teamMember.userId === "string" ? teamMember.userId : "";
      }

      return "";
    })
    .filter(Boolean);
};

interface TeamOptionModalProps {
  type: "edit" | "create";
  teamInfo?: teamPayload;
  teams: teamPayload[];
  userId: string;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}

export default function TeamOptionModal({
  type = "create",
  visible = false,
  teamInfo,
  teams,
  userId,
  onVisibleChange,
}: TeamOptionModalProps) {
  const FormItem = Form.Item;
  const Option = Select.Option;
  const [form] = Form.useForm();
  const teamName = teamInfo?.teamName || "";
  const teamId = useParams().teamId;
  const useCreateTeamMutation = useCreateTeam(userId);
  const useEditTeamMutation = useEditTeam(userId);
  const getAllUserQuery = useGetAllUsers();

  useEffect(() => {
    if (!visible) return;
    const teamMembers = normalizeTeamMembers(teamInfo?.teamMembers);
    form.setFieldsValue({
      teamName,
      teamMembers,
    });
  }, [visible, teamName, teamInfo, form]);

  const handleCancel = () => {
    onVisibleChange?.(false);
  };

  const handleConfirm = async (type: "edit" | "create") => {
    try {
      const values = await form.validate();
      teams.forEach((team) => {
        if (team.teamName === values.teamName && type === "create") {
          Message.error("团队名称已存在");
          return;
        }
      });
      const payload = {
        teamName: String(values.teamName.trim()),
        teamMembers: normalizeTeamMembers(values.teamMembers),
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
      onConfirm={() => handleConfirm(type)}
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
          <Select placeholder="请选择团队成员" mode="multiple">
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
