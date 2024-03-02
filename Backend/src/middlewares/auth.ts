import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { asyncMiddleware } from "./asyncMidleware.js";

export const adminOnly = asyncMiddleware( async (req, res, next) => {
    const {id} = req.query;

    if(!id) return next(new ErrorHandler(" admin authorized only", 401))

    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("Invalid Id", 401))
    if(user.role !== "admin") return next(new ErrorHandler("Unauthorized", 403))

    next();
})