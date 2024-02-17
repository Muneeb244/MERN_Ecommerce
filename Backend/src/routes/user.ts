import express from "express";
import {asyncMiddleware} from '../middlewares/asyncMidleware.js'
import { newUser } from "../controllers/user.js";

const app = express.Router();


app.post("/new",asyncMiddleware(newUser))

export default app;