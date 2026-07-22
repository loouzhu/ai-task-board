import dotenv from "dotenv";
import mongoose from "mongoose";
import Task from "../models/Task";

dotenv.config();

async function migrateTaskPriority() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI 未配置");
  }

  await mongoose.connect(mongoUri);

  const priorityMap = {
    低: "low",
    中: "medium",
    高: "high",
  } as const;

  let modified = 0;

  for (const [from, to] of Object.entries(priorityMap)) {
    const result = await Task.updateMany(
      { taskPriority: from },
      { $set: { taskPriority: to } },
    );
    modified += result.modifiedCount || 0;
  }

  const invalidCount = await Task.countDocuments({
    taskPriority: { $nin: ["low", "medium", "high"] },
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

void migrateTaskPriority()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
