import { Request, Response, NextFunction } from "express";
import { controllerType } from "../types/types.js";

export const asyncMiddleware =
  (func: controllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
