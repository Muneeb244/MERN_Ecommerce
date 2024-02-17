import mongoose from "mongoose";
export const connectDB = () => {
    mongoose
        .connect("mongodb://0.0.0.0:27017", {
        dbName: "Ecommerce",
    })
        .then((con) => console.log(`Connected to ${con.connection.host}`))
        .catch((err) => console.log(err));
};
