// 看板名称验证规则
export const boardNameRules = [
  { required: true, message: "请输入看板名称" },
  { min: 3, max: 8, message: "看板名称必须在3-8个字符之间" },
];

// 看板成员验证
export const boardMembersRules = [
  {
    required: true,
    type: "array",
    min: 1,
    message: "请选择看板成员",
  },
];
