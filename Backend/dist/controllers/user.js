import { User } from "../models/user.js";
export const newUser = async (req, res, next) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    const user = await User.create({ name, email, photo, gender, _id, dob });
    res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}`,
    });
};
