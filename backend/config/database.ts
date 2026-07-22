import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI 未配置");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    console.error(`MongoDB 连接失败: ${message}`);
    process.exit(1);
  }
};

export default connectDB;
