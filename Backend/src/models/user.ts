import mongoose from "mongoose";
import Validator from "validator";

const schama =  new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter user ID"]
    },
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    email: {
        type: String,
        unique: [true, "Email already exist"],
        required: [true, "Please enter name"],
        validate: Validator.default.isEmail,
    },
    photo: {
        type: String,
        required: [true, "Please add photo"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter gender"],
    },
    dob: {
        type: Date,
        required: [true, "Please enter dateof birth"],
    },
}, {
    timestamps: true
});

export const User = mongoose.model("User");