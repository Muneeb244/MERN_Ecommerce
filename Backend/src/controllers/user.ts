import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import { NewUserReqBody } from "../types/types.js";

export const newUser = async (
  req: Request<{}, {}, NewUserReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, photo, gender, _id, dob } = req.body;

  const user = await User.create({ name, email, photo, gender, _id, dob });

  res.status(201).json({
    success: true,
    message: `Welcome, ${user.name}`,
  });
};
