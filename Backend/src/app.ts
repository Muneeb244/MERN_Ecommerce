import cors from "cors";
import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import NodeCache from "node-cache";
import Stripe from "stripe";

// import routes
import orderRoute from "./routes/orders.js";
import paymentRoute from "./routes/payment.js";
import productRoute from "./routes/products.js";
import DashboardRoute from "./routes/stats.js";
import userRoute from "./routes/user.js";

// import middleware
import errorHandler from "./middlewares/errorHandler.js";

config({ path: "./.env" });

const port = process.env.PORT || 4000;
const mongo_URI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPEKEY || "";

export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();

const app = express();
app.use(express.json());

app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", DashboardRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API working");
});

mongoose.connect(mongo_URI, {
    dbName: "Ecommerce",
  })
  .then((con) => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    console.log(`Connected to ${con.connection.host}`);
  })
  .catch((err) => console.log(err));
