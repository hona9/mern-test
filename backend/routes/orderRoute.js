import express from "express";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/", authMiddleware, placeOrder);
orderRouter.get("/", getAllOrders);
orderRouter.get("/user", authMiddleware, getUserOrders);

export default orderRouter;
