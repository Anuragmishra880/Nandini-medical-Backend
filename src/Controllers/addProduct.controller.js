import { Product } from "../Models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
const AddProduct = asyncHandler(async (req, res) => {
  const { productTitle, productPrice, productDescription, productStock, category } = req.body;

  //  Correct validation
  if (!productTitle || !productPrice || !productDescription || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existedProduct = await Product.findOne({ productTitle });

  if (existedProduct) {
    throw new ApiError(400, "Product already exists");
  }

  //  Multer se image path
  const productImageLocalPath = req.file?.path.replace(/\\/g, "/");
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

    productTitle,
    productPrice,
    productStock,
    productImage: {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id
    },
    productDescription,
    category
  });

  await newProduct.save();

  res.status(201).json(new ApiResponse(200, newProduct, "Product Added Successfully"));
});



const updateProduct = asyncHandler(async (req, res) => {
  const { productStock, productTitle, productPrice, productDescription } = req.body
  const { id } = req.params
  if (!id) {
    throw new ApiError(401, "Product ID is required for update")
  }
  const product = await Product.findById(id)
  if (!product) {
    throw new ApiError(401, "Product not found")
  }

  const productImageLocalPath = req.file?.path.replace(/\\/g, "/");
  if (productImageLocalPath) {
    const uploadedImage = await uploadOnCloudinary(productImageLocalPath);

    if (uploadedImage?.secure_url) {
      await cloudinary.uploader.destroy(
        product.productImage.publicId
      );

      product.productImage = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }
  }
  if (productTitle !== undefined)
    product.productTitle = productTitle;
  if (productStock !== undefined)
    product.productStock = productStock
  if (productPrice !== undefined)
    product.productPrice = productPrice;
  if (productDescription !== undefined)
    product.productDescription = productDescription;

  await product.save();

  return res.status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"))
})


const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  console.log(id)
  if (!id) {
    throw new ApiError(400, "Product ID is required for update")
  }
  const product = await Product.findById(id)
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  await cloudinary.uploader.destroy(product.productImage.publicId)
  await product.deleteOne()
  return res.status(200).json(
    new ApiResponse(200, {}, "Product deleted successfully")
  );
})

const getAllProducts = asyncHandler(async (req, res) => {

  const products = await Product.find()
  if (!products) {
    throw new ApiError(404, "Product not found")
  }

  return res.status(200).json(new ApiResponse(200, products, "Product fetched successfully"))
})

const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Product ID required");
  }
  const product = await Product.findById(id)
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return res.status(200).json(
    new ApiResponse(200, product, "Product fetched successfully"))
})

const getProductsByCategory = asyncHandler(async (req, res) => {

  const { category } = req.params;

  const products = await Product.find({ category });

  if (!products.length) {
    throw new ApiError(404, "No products found");
  }

  return res.status(200).json(
    new ApiResponse(200, products, "Products fetched")
  );
});


export { AddProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct, getProductsByCategory, }