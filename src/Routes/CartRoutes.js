import express from 'express'

const router = express.Router()


import {
  AddToCart, getCart, updateQuantity, removeCartItem, clearCart
} from "../Controllers/cart.controller.js";
import { verifyJWT } from '../Middlewares/auth.middleware.js';

router.post("/add", verifyJWT,  AddToCart);
router.get("/", verifyJWT, getCart);
router.put("/update", verifyJWT, updateQuantity);
router.delete("/remove", verifyJWT, removeCartItem);
router.delete("/clear", verifyJWT, clearCart);

export default router