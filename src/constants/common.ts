export const status = {
  todo: "待处理",
  processing: "处理中",
  testing: "测试中",
  completed: "已完成",
} as const;

export type StatusType = keyof typeof status;