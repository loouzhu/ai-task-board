export const getTitle = (mode: string) => {
  if (mode === "login") return "登录";
  if (mode === "register") return "注册";
  if (mode === "change-password") return "忘记密码";
  return mode + "错误";
};

// 日期处理
export const formatData = (date: string | Date) => {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(targetDate?.getTime())) {
    return "";
  }

  const year = targetDate?.getFullYear();
  const month = String(targetDate?.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate?.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 任务优先级转换
export const formatTaskPriority = (priority: string) => {
  switch (priority) {
    case "low":
      return "低";
    case "medium":
      return "中";
    case "high":
      return "高";
    default:
      return "未知";
  }
};

// Input输入框格式化
export const formatInput = (value: string) => {
  if (Array.isArray(value)) return value;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item);
};

// 截止日期显示
export const formatDeadline = (taskDeadline?: string) => {
  if (!taskDeadline) {
    return "无截止日期";
  }

  const deadlineDate = new Date(taskDeadline);
  if (Number.isNaN(deadlineDate.getTime())) {
    return taskDeadline;
  }

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const deadlineStart = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate(),
  );
  const diffDays = Math.round(
    (deadlineStart.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (Math.abs(diffDays) > 3) {
    return taskDeadline;
  }

  if (diffDays === 0) {
    return "今天截止";
  }

  if (diffDays > 0) {
    return `${diffDays}天后截止`;
  }

  return `${Math.abs(diffDays)}天前截止`;
};
