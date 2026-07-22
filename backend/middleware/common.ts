import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("[validation] req.body =", JSON.stringify(req.body, null, 2));
    console.log("[validation] req.files =", req.files);
    console.log("[validation] errors =", errors.array());
    return res.status(400).json({
      success: false,
      message: "参数验证失败",
      errors: errors.array().map((err) => ({
        field: err.type === "field" ? err.path : undefined,
        message: err.msg,
      })),
    });
  }

  return next();
};
