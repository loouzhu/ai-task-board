import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import User from "../models/User";
import { handleValidation } from "./common";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionUserId = req.session?.userId;
    if (sessionUserId) {
      const user = await User.findOne({ userId: sessionUserId })
        .select("userId username createdAt -_id")
        .lean();

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "用户不存在",
        });
      }

      req.user = {
        userId: user.userId,
        username: user.username,
        createdAt: user.createdAt,
      };

      return next();
    }

    return res.status(401).json({
      success: false,
      message: "未授权，缺少会话",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "服务端错误",
    });
  }
};

const usernameValidation = body("username")
  .trim()
  .notEmpty()
  .withMessage("用户名不能为空")
  .isLength({ min: 3, max: 8 })
  .withMessage("用户名长度必须在3-8位之间")
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage("用户名只能包含字母、数字和下划线");

const passwordValidation = body("password")
  .notEmpty()
  .withMessage("密码不能为空")
  .isLength({ min: 6, max: 20 })
  .withMessage("密码长度必须在6-20位之间");

const newPasswordValidation = body("newPassword")
  .notEmpty()
  .withMessage("新密码不能为空")
  .isLength({ min: 6, max: 20 })
  .withMessage("新密码长度必须在6-20位之间")
  .custom((value, { req }) => {
    if (value === req.body.password) {
      throw new Error("新密码不能与旧密码相同");
    }
    return true;
  });

export const validateLogin = [
  usernameValidation,
  passwordValidation,
  handleValidation,
];
export const validateRegister = [
  usernameValidation,
  passwordValidation,
  handleValidation,
];
export const validateForgetPassword = [
  usernameValidation,
  passwordValidation,
  newPasswordValidation,
  handleValidation,
];
