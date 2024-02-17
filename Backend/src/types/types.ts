import { NextFunction, Request, Response } from "express";

export interface NewUserReqBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export type controllerType = (
  req: Request<{}, {}, NewUserReqBody>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;
