import { Product } from "../Models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
const AddProduct = asyncHandler(async (req, res) => {
  const { product_id, product_Title, product_Price, product_description } = req.body;

  //  Correct validation
  if (!product_id || !product_Title || !product_Price || !product_description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existedProduct = await Product.findOne({ product_id });
  if (existedProduct) {
    return res.status(400).json({ message: "Product already exists" });
  }

  //  Multer se image path
  const productImageLocalPath = req.files?.product_Image?.[0]?.path.replace(/\\/g, "/");
  console.log("Local Path:", productImageLocalPath);

  if (!productImageLocalPath) {
    return res.status(400).json({ message: "Product image is required" });
  }

  //  Cloudinary upload
  const uploadedImage = await uploadOnCloudinary(productImageLocalPath);
  // console.log("Cloudinary Response:", uploadedImage.secure_url);

  if (!uploadedImage) {
    return res.status(400).json({ message: "Product image upload failed" });
  }

  //  Save product
  const newProduct = new Product({
    product_id,
    product_Title,
    product_Price,
    product_Image: {
      url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id
    },
    product_description,
  });

  await newProduct.save();

  res.status(201).json(new ApiResponse(200, newProduct, "Product Added Successfully"));
});


const updateProduct = asyncHandler(async (req, res) => {
  const { product_id } = req.params
  if (!product_id) {
    throw new ApiError(401, "Product ID is required for update")
  }
  const product = await Product.findOne({ product_id })
  if (!product) {
    throw new ApiError(401, "Product not found")
  }
  let productImageUrl = product.product_Image;
  const productImageLocalPath = req.files?.product_Image?.[0]?.path.replace(/\\/g, "/");
  if (productImageLocalPath) {
    const uploadedImage = await uploadOnCloudinary(productImageLocalPath);

    if (uploadedImage?.secure_url) {
      await cloudinary.uploader.destroy(
        product.product_Image.public_id
      );

      product.product_Image = {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }
  }
  if (req.body.product_Title !== undefined)
    product.product_Title = req.body.product_Title;

  if (req.body.product_Price !== undefined)
    product.product_Price = req.body.product_Price;

  if (req.body.product_description !== undefined)
    product.product_description = req.body.product_description;

  await product.save();

  return res.status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"))
})


const deleteProduct = asyncHandler(async (req, res) => {
  const { product_id } = req.params
  if (!product_id) {
    throw new ApiError(400, "Product ID is required for update")
  }
  const product = await Product.findOne({ product_id })
  if (!product) {
    throw new ApiError(404, "Product not found")
  }
  await cloudinary.uploader.destroy(product.product_Image.public_id)
  await product.deleteOne()
  return res.status(200).json(
    new ApiResponse(200, {}, "Product deleted successfully")
  );
})
export { AddProduct, updateProduct, deleteProduct }