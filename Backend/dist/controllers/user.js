import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { asyncMiddleware } from "../middlewares/asyncMidleware.js";
export const newUser = asyncMiddleware(async (req, res, next) => {
    // throw new ErrorHandler("abhi ka error",404)
    const { name, email, photo, gender, _id, dob } = req.body;
    let user = await User.findById(_id);
    if (user)
        return res.status(201).json({
            success: true,
            message: `Welcome back, ${user.name}`,
        });
    if (!_id || !name || !email || !photo || !gender || !dob)
        return next(new ErrorHandler("Please add all fields", 400));
    user = await User.create({ name, email, photo, gender, _id, dob });
    res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}`,
    });
});
export const getAllUsers = asyncMiddleware(async (req, res, next) => {
    const users = await User.find({});
    return res.status(201).json({
        success: true,
        users
    });
});
export const getUser = asyncMiddleware(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    return res.status(201).json({
        success: true,
        user
    });
});
export const deleteUser = asyncMiddleware(async (req, res, next) => {
    // changes this here
    // const id = (req.params as {id:string}).id;
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    await user.deleteOne();
    return res.status(201).json({
        success: true,
        message: "User deleted successfully"
    });
});
