import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User";
import Board from "../models/Board";
import Task from "../models/Task";

dotenv.config();

async function seedTasksForEachBoard() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI 未配置");
  }

  await mongoose.connect(mongoUri);

  const user = await User.findOne({ username: "test" }).lean();
  if (!user) {
    throw new Error("用户 test 不存在，无法创建任务");
  }

  const boards = await Board.find({ createdBy: user.userId })
    .select("boardId boardName boardMembers -_id")
    .lean();

  const templates = [
    {
      taskName: "需求梳理",
      taskWorkTime: "2h",
      taskDescription: "梳理需求范围并确认验收标准",
      taskPriority: "high",
      taskStatus: "pending",
      isBlock: false,
      blockInfo: "",
      isOverdue: false,
      overdueInfo: "",
      subtask: ["明确目标", "确认边界"],
    },
    {
      taskName: "功能实现",
      taskWorkTime: "6h",
      taskDescription: "按接口与页面需求完成核心功能开发",
      taskPriority: "medium",
      taskStatus: "processing",
      isBlock: false,
      blockInfo: "",
      isOverdue: false,
      overdueInfo: "",
      subtask: ["接口开发", "前端联调"],
    },
    {
      taskName: "测试验收",
      taskWorkTime: "3h",
      taskDescription: "完成功能测试并进行问题回归验收",
      taskPriority: "low",
      taskStatus: "completed",
      isBlock: false,
      blockInfo: "",
      isOverdue: false,
      overdueInfo: "",
      subtask: ["执行测试", "修复复测"],
    },
  ];

  const result = [] as Array<{
    boardId: string;
    boardName: string;
    createdTasks: number;
    taskNumbers: number[];
  }>;

  for (const board of boards) {
    const maxTask = await Task.findOne({ boardId: board.boardId })
      .sort({ taskNumber: -1 })
      .select("taskNumber -_id")
      .lean();

    const nextTaskNumber = maxTask ? maxTask.taskNumber + 1 : 1;
    const dueBase = Date.now();

    const payload = templates.map((template, index) => ({
      boardId: board.boardId,
      createdBy: user.userId,
      taskNumber: nextTaskNumber + index,
      taskName: template.taskName,
      taskDeadline: new Date(dueBase + (index + 1) * 24 * 60 * 60 * 1000),
      taskWorkTime: template.taskWorkTime,
      taskMembers:
        board.boardMembers && board.boardMembers.length
          ? board.boardMembers
          : [user.userId],
      taskDescription: template.taskDescription,
      taskPriority: template.taskPriority,
      taskStatus: template.taskStatus,
      isBlock: template.isBlock,
      blockInfo: template.blockInfo,
      isOverdue: template.isOverdue,
      overdueInfo: template.overdueInfo,
      subtask: template.subtask,
      files: [],
    }));

    const inserted = await Task.insertMany(payload);

    result.push({
      boardId: board.boardId,
      boardName: board.boardName,
      createdTasks: inserted.length,
      taskNumbers: inserted.map((task) => task.taskNumber),
    });
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        username: user.username,
        userId: user.userId,
        boardCount: boards.length,
        totalCreatedTasks: result.reduce(
          (sum, item) => sum + item.createdTasks,
          0,
        ),
        details: result,
      },
      null,
      2,
    ),
  );
}

void seedTasksForEachBoard()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
