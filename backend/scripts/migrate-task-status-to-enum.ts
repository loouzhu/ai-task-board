import dotenv from "dotenv";
import mongoose from "mongoose";
import Task from "../models/Task";

dotenv.config();

async function migrateTaskStatus() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI 未配置");
  }

  await mongoose.connect(mongoUri);

  const statusMap = {
    未开始: "pending",
    进行中: "processing",
    已完成: "completed",
    出现错误: "testing",
  } as const;

  let modified = 0;

  for (const [from, to] of Object.entries(statusMap)) {
    const result = await Task.updateMany(
      { taskStatus: from },
      { $set: { taskStatus: to } },
    );
    modified += result.modifiedCount || 0;
  }

  const invalidCount = await Task.countDocuments({
    taskStatus: { $nin: ["pending", "processing", "testing", "completed"] },
  });

  console.log(
    JSON.stringify(
      {
        success: true,
        modified,
        invalidCount,
      },
      null,
      2,
    ),
  );
}

void migrateTaskStatus()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
