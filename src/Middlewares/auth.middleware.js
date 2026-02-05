import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../Models/User.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {

  // const token = req.cookies?.accessToken // if we use only website
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "") // it works for website and Apps both
    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken.id).select("-password -refreshToken")
    // console.log(decodedToken.id)
    if (!user) {
      throw new ApiError(401, "Invalid Access Token")
    }
    req.user = user;
    next()
  }
  catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access token")
  }

})