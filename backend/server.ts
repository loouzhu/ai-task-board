import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import authRoutes from "./routes/auth";
import aiRoutes from "./routes/ai";
import boardRoutes from "./routes/board";
import taskRoutes from "./routes/task";
import userRoutes from "./routes/user";
import teamRoutes from "./routes/team";
import connectDB from "./config/database";

dotenv.config();

const app = express();
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "请求过于频繁，请稍后再试",
// });

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
// app.use(limiter);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "taskboard_session_secret_dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/user", userRoutes);
app.use("/api/team", teamRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err && typeof err === "object") {
    const error = err as { message?: string; code?: string; name?: string };

    if (error.message === "不支持的文件类型") {
      return res.status(400).json({ success: false, message: error.message });
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ success: false, message: "文件大小超出限制" });
    }

    if (error.name === "MulterError" && error.message) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  return res.status(500).json({ success: false, message: "服务器错误" });
});

void connectDB();

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
