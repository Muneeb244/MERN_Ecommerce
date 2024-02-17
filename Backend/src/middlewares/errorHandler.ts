import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { controllerType } from "../types/types.js";

export default (err:ErrorHandler, req:Request, res:Response, next:NextFunction) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || "Something went wrong";
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        error: errMsg,
    })
}