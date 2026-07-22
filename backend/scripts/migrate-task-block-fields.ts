import dotenv from "dotenv";
import mongoose from "mongoose";
import Task from "../models/Task";

dotenv.config();

async function migrateTaskBlockFields() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI 未配置");
  }

  await mongoose.connect(mongoUri);

  const missingIsBlockResult = await Task.updateMany(
    { isBlock: { $exists: false } },
    { $set: { isBlock: false } },
  );

  const missingBlockInfoResult = await Task.updateMany(
    { blockInfo: { $exists: false } },
    { $set: { blockInfo: "" } },
  );

  const migratedLegacyIsOverdueResult = await Task.collection.updateMany(
    {
      isOverdue: { $exists: false },
      isDelay: { $exists: true },
    },
    [{ $set: { isOverdue: "$isDelay" } }],
  );

  const missingIsOverdueResult = await Task.updateMany(
    { isOverdue: { $exists: false } },
    { $set: { isOverdue: false } },
  );

  const migratedLegacyOverdueInfoResult = await Task.collection.updateMany(
    {
      overdueInfo: { $exists: false },
      delayInfo: { $exists: true },
    },
    [{ $set: { overdueInfo: "$delayInfo" } }],
  );

  const missingOverdueInfoResult = await Task.updateMany(
    { overdueInfo: { $exists: false } },
    { $set: { overdueInfo: "" } },
  );

  const cleanupLegacyDelayInfoResult = await Task.updateMany(
    { delayInfo: { $exists: true } },
    { $unset: { delayInfo: "" } },
  );

  const cleanupLegacyIsDelayResult = await Task.updateMany(
    { isDelay: { $exists: true } },
    { $unset: { isDelay: "" } },
  );

  const invalidIsBlockCount = await Task.countDocuments({
    isBlock: { $nin: [true, false] },
  });

  const invalidIsOverdueCount = await Task.countDocuments({
    isOverdue: { $nin: [true, false] },
  });

  console.log(
    JSON.stringify(
      {
        success: true,
        modifiedIsBlock: missingIsBlockResult.modifiedCount || 0,
        modifiedBlockInfo: missingBlockInfoResult.modifiedCount || 0,
        migratedLegacyIsOverdue:
          migratedLegacyIsOverdueResult.modifiedCount || 0,
        modifiedIsOverdue: missingIsOverdueResult.modifiedCount || 0,
        migratedLegacyOverdueInfo:
          migratedLegacyOverdueInfoResult.modifiedCount || 0,
        modifiedOverdueInfo: missingOverdueInfoResult.modifiedCount || 0,
        cleanedLegacyIsDelay: cleanupLegacyIsDelayResult.modifiedCount || 0,
        cleanedLegacyDelayInfo: cleanupLegacyDelayInfoResult.modifiedCount || 0,
        invalidIsBlockCount,
        invalidIsOverdueCount,
      },
      null,
      2,
    ),
  );
}

void migrateTaskBlockFields()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
