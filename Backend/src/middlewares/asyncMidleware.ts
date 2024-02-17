import { Request, Response, NextFunction } from "express"
import { controllerType } from "../types/types.js"

export const asyncMiddleware = (func:controllerType) => () => {

}