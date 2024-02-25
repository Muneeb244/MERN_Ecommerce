import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";

export default (err:ErrorHandler, req:Request, res:Response, next:NextFunction) => {
    const errStatus = err.statusCode || 500;
    let errMsg = err.message || "Something went wrong";

    if(err.name === "CastError") errMsg = "Invalid Id"

    res.status(errStatus).json({
        success: false,
        status: errStatus,
        error: errMsg,
    })
}