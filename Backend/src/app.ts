import express from 'express';
import morgan from 'morgan';

// import routes
import userRoute from './routes/user.js'
import productRoute from './routes/products.js'

// import middleware
import errorHandler from './middlewares/errorHandler.js'
import { connectDB } from './utils/features.js';


connectDB();
const app = express();
const port = 3000

app.get("/",(req, res) => {
    res.send("API working")
})

app.use(morgan('combined'));
app.use(express.json())
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/uploads", express.static("uploads"))
// app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})