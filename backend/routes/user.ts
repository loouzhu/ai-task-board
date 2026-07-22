import express, { Request, Response } from "express";
import { protect } from "../middleware/auth";
import User from "../models/User";
import { AREA_DATA } from "../public_data/area";

const router = express.Router();

router.use(protect);

// 获取省列表
router.get("/area/provinces", (_req: Request, res: Response) => {
  const provinces = Object.keys(AREA_DATA);

  return res.status(200).json({
    success: true,
    message: "获取省份成功",
    provinces,
  });
});

// 根据省获取市列表
router.get("/area/cities", (req: Request, res: Response) => {
  const province =
    typeof req.query.province === "string" ? req.query.province.trim() : "";

  if (!province) {
    return res.status(400).json({
      success: false,
      message: "province参数不能为空",
    });
  }

  const cities = AREA_DATA[province];
  if (!cities) {
    return res.status(404).json({
      success: false,
      message: "未找到对应省份",
    });
  }

  return res.status(200).json({
    success: true,
    message: "获取城市成功",
    province,
    cities,
  });
});

// 获取系统用户列表
router.get("/list", async (_req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select("userId username -_id")
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "获取用户列表成功",
      users: users.map((user) => ({
        id: user.userId,
        userId: user.userId,
        username: user.username,
      })),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "服务器错误",
    });
  }
});

// 获取个人信息
router.get("/userInfo/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "用户ID不能为空",
      });
    }

    if (userId !== currentUser) {
      return res.status(403).json({
        success: false,
        message: "无权查看其他用户信息",
      });
    }

    const user = await User.findOne({ userId })
      .select(
        "userId username avatar bio city email name position province createdAt -_id",
      )
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "用户不存在",
      });
    }

    return res.status(200).json({
      success: true,
      message: "获取用户信息成功",
      userInfo: {
        id: user.userId,
        ...user,
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

// 更新个人信息
router.put("/userInfo/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user.userId;
    const { username, avatar, bio, city, email, name, position, province } =
      req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "用户ID不能为空",
      });
    }
    if (userId !== currentUser) {
      return res.status(403).json({
        success: false,
        message: "无权修改其他用户信息",
      });
    }

    const normalizedUsername =
      typeof username === "string" ? username.trim() : "";
    if (!normalizedUsername) {
      return res.status(400).json({
        success: false,
        message: "username为必填项",
      });
    }

    const existingUser = await User.findOne({ userId }).select(
      "userId username",
    );
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "用户不存在",
      });
    }

    if (normalizedUsername !== existingUser.username) {
      const duplicatedUsername = await User.findOne({
        username: normalizedUsername,
        userId: { $ne: userId },
      }).select("userId");

      if (duplicatedUsername) {
        return res.status(400).json({
          success: false,
          message: "用户名已存在",
        });
      }
    }

    const updatePayload = {
      username: normalizedUsername,
      avatar: typeof avatar === "string" ? avatar.trim() : "",
      bio: typeof bio === "string" ? bio.trim() : "",
      city: typeof city === "string" ? city.trim() : "",
      email: typeof email === "string" ? email.trim() : "",
      name: typeof name === "string" ? name.trim() : "",
      position: typeof position === "string" ? position.trim() : "",
      province: typeof province === "string" ? province.trim() : "",
    };

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: updatePayload },
      { new: true, runValidators: true },
    )
      .select(
        "userId username avatar bio city email name position province createdAt -_id",
      )
      .lean();

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "用户不存在",
      });
    }

    return res.status(200).json({
      success: true,
      message: "用户信息更新成功",
      user: {
        id: updatedUser.userId,
        ...updatedUser,
      },
    });
  } catch (error) {
    console.log(error);

    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error as { name?: string }).name === "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message: "用户信息格式不正确",
      });
    }

    return res.status(500).json({
      success: false,
      message: "服务器错误",
    });
  }
});

export default router;
