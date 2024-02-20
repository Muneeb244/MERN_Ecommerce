import mongoose, { Schema } from "mongoose";
import Validator from "validator";

interface IUser extends Document {
    _id: string;
    name: string;
    photo: string;
    email: string;
    role: "admin" | "user";
    gender: "male" | "female";
    dob: Date;
    createdAt: Date;
    UpdatedAt: Date;

    // virtual attribute
    age: number;

}

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please enter user ID"],
    },
    name: {
      type: String,
      required: [true, "Please enter name"],
    },
    email: {
      type: String,
      unique: [true, "Email already exist"],
      required: [true, "Please enter name"],
      validate: Validator.default.isEmail,
    },
    photo: {
      type: String,
      required: [true, "Please add photo"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
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
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("age").get(function () {
  const today = new Date();
  const dob:Date = this.dob;
  let age:number = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  )
    age--;

    return age;
});

export const User = mongoose.model<IUser>("User", userSchema);
