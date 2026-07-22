// header组件
export const pageList = [
  {
    id: 1,
    name: "任务看板",
    path: "/board",
    element:"@/pages/Board"
  },
  {
    id: 2,
    name: "数据视图",
    path: "/data-view",
    element:"@/pages/DataView"
  },
];

export type AuthStatus = "unknown" | "authenticated" | "unauthenticated";
