import express from 'express';
import { discount, newCoupon, allCoupons, deleteCoupon } from '../controllers/coupon.js';
import { adminOnly } from '../middlewares/auth.js';
const app = express.Router();
// route - /api/v1/payment/coupon/new
app.get("/discount", discount);
// route - /api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly, newCoupon);
// route - /api/v1/payment/coupon/all
app.get("/coupon/all", adminOnly, allCoupons);
// route - /api/v1/payment/coupon/:id
app.delete("/coupon/:id", adminOnly, deleteCoupon);
export default app;
