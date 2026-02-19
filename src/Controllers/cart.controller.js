import { Cart } from '../Models/Cart.js'
import { Product } from '../Models/Product.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const AddToCart = asyncHandler(async (req, res) => {


  const { productId, quantity = 1 } = req.body
  // if (quantity < 1) {
  //   throw new ApiError(400, "Invalid quantity");
  // }
  const product = await Product.findById( productId)

  if (!product) {
    throw new ApiError(404, "Product not found")
  }
  let cart = await Cart.findOne({ user: req.user.id })
  

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [{
        productId,
        quantity,

      }],
    })
    return res.status(200).json(
      new ApiResponse(200, cart, "Product added successfully")
    );

  }
  else {
    const item = cart.items.find((i) =>
      i.productId.toString() === productId
    )
    if (item) {
      item.quantity += quantity;
    }
    else {
      cart.items.push({
        productId,
        quantity
      })
    }
    await cart.save()

    return res.status(200).json(
      new ApiResponse(200, cart, "Product added Successfully")
    )
  }



})

const getCart = asyncHandler(async (req, res) => {

  const cart = await Cart.findOne({ user: req.user.id })
    .populate("items.productId");
  if (!cart) {
    return res.json(new ApiResponse(200, { items: [] }));
  }
  return res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));

})

const updateQuantity = asyncHandler(async (req, res) => {

  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    throw new ApiError(404, "Cart not found")
  }
  const item = cart.items.find((i) => i.productId.toString() === productId)
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  item.quantity = quantity;
  await cart.save();

  return res.status(200).json(
    new ApiResponse(200, cart, "Quantity updated")
  );
});


const removeCartItem = asyncHandler(async (req, res) => {

  const { productId } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  cart.items = cart.items.filter((i) => i.productId.toString() !== productId
  );

  await cart.save();
  return res.status(201).json(new ApiResponse(200, cart, "Item removed"));


})

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [] }
  );

  return res.status(200).json(
    new ApiResponse(200, {}, "Cart cleared")
  )

})

export { AddToCart, getCart, updateQuantity, removeCartItem, clearCart }