// 团队名称验证
export const teamNameRules = [
  { required: true, message: "请输入团队名称" },
  { min: 3, max: 8, message: "团队名称长度必须在3-8个字符之间" },
];

// 团队成员验证
export const teamMembersRules = [
  {
    required: true,
    type: "array",
    min: 1,
    message: "请选择团队成员",
  },
];
