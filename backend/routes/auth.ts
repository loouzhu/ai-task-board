import express, { Request, Response } from "express";
import User from "../models/User";
import {
  protect,
  validateForgetPassword,
  validateLogin,
  validateRegister,
} from "../middleware/auth";

const router = express.Router();

// 用户注册
router.post(
  "/register",
  validateRegister,
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "用户已存在",
        });
      }

      const user = await User.create({
        username,
        password,
      });

      return res.status(201).json({
        success: true,
        user: {
          id: user.userId,
          userId: user.userId,
          username: user.username,
        },
        message: "注册成功",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "服务器错误",
      });
    }
  },
);

// 用户登录
router.post("/login", validateLogin, async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "用户名或密码错误",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "用户名或密码错误",
      });
    }

    req.session.userId = user.userId;

    return res.status(200).json({
      success: true,
      user: {
        id: user.userId,
        userId: user.userId,
        username: user.username,
      },
      message: "登陆成功",
    });
  } catch (error) {
    console.log("登陆错误：", error);
    return res.status(500).json({
      success: false,
      message: "服务器错误",
    });
  }
});

// 用户退出登录
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.status(200).json({
      success: true,
      message: "退出成功",
    });
  });
});

// 获取当前登录用户信息
router.get("/me", protect, async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.userId;
    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "未授权",
      });
    }

    const user = await User.findOne({ userId: currentUserId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "用户不存在",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        userId: user.userId,
        username: user.username,
        avatar: user.avatar || "",
        bio: user.bio || "",
        city: user.city || "",
        email: user.email || "",
        name: user.name || "",
        position: user.position || "",
        province: user.province || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "服务器错误",
    });
  }
});

void validateForgetPassword;

export default router;
