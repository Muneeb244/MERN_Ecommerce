import express from 'express';
import morgan from 'morgan';
import NodeCache from 'node-cache';
import {config} from "dotenv";

// import routes
import userRoute from './routes/user.js'
import productRoute from './routes/products.js'
import orderRoute from './routes/orders.js'
import paymentRoute from './routes/payment.js'
import DashboardRoute from './routes/stats.js'

// import middleware
import errorHandler from './middlewares/errorHandler.js'
import { connectDB } from './utils/features.js';


config({path: "./.env"})

const port = process.env.PORT || 4000;
const mongo_URI = process.env.MONGO_URI || "";

connectDB(mongo_URI);
const app = express();
export const myCache = new NodeCache();

app.get("/",(req, res) => {
    res.send("API working")
})

app.use(morgan('dev'));
app.use(express.json())
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", DashboardRoute);

app.use("/uploads", express.static("uploads"))
app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})