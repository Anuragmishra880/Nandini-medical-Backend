import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Admin } from '../Models/AdminAuth.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'

const emailValidator = (email) => {
  let at = email.indexOf('@')
  let dot = email.lastIndexOf('.')
  if (!email || at < 1 || dot < at + 2 || dot === email.length - 1) {
    throw new ApiError(400, "please enter valid Email")
  }
}

// token Generator Function 
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const admin = await Admin.findById(adminId)
    const accessToken = await admin.generateAccessToken()
    const refreshToken = await admin.generateRefreshToken()
    admin.refreshToken = refreshToken
    await admin.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "something went wrong when generating Access token or refresh token")
  }
}
const registerAdmin = asyncHandler(async (req, res) => {

  const { adminName, email, password } = req.body
  emailValidator(email)
  if (!password || password.includes(" ") || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters")
  }
  const existedAdmin = await Admin.findOne({
    $or: [{ adminName }, { email }]
  })
  if (existedAdmin) {
    throw new ApiError(409, "UserName or Email is already used by someone")
  }

  const coverImageLocalPath = req.file?.path.replace(/\\/g, "/")
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if (!coverImage) {
    throw new ApiError(400, "Avatar file is required")
  }
  const admin = await Admin.create({
    adminName: adminName.toLowerCase(),
    adminImage: {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id
    },
    email,
    password,

  })
  const createdAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  )

  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while registering the Admin")
  }

  return res.status(201).json(
    new ApiResponse(200, createdAdmin, "Admin registered Successfully")
  )

})

const adminLoginHandler = asyncHandler(async (req, res) => {

  const { adminName, email, password } = req.body
  if (!(email || adminName)) {
    throw new ApiError(400, "  Username or password is required");
  }
  const admin = await Admin.findOne(
    {
      $or: [{ adminName }, { email }]
    }
  )
  if (!admin) {
    throw new ApiError(404, "Not find Email or Admin Name");
  }
  const isPasswordMatch = await admin.isPasswordCorrect(password)
  if (!isPasswordMatch) {
    throw new ApiError(402, 'Password is not correct')
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(admin._id)

  const loggedInAdmin = await User.findById(admin._id).select('-password -refreshToken')
  const options = {
    httpOnly: true,
    secure: false,

  }
  console.log(req.cookies);
  console.log(req.adminName);

  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {
    admin: loggedInAdmin, accessToken, refreshToken

  },
    "Logged in successFully "))
})

const adminLogoutHandler = asyncHandler(async (req, res) => {
  // console.log(req.user)
  await Admin.findByIdAndUpdate(req.admin.id
    , {
      $unset: { refreshToken: 1 }
    },
    { new: true }
  )
  const options = {
    httpOnly: true,
    secure: false,

  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logout successFully "))
})

const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }
  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  const admin = await Admin.findById(decodedToken._id)
  if (!admin) {
    throw new ApiError(401, "invalid refresh token")
  }
  if (incomingRefreshToken !== admin?.refreshToken) {
    throw new ApiError(401, ' refresh token is expired')
  }

  const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(admin._id)
  const options = {
    httpOnly: true,
    secure: false,

  }
  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(new ApiResponse(200, {
    accessToken, refreshToken: newRefreshToken

  },
    "refresh Token refreshed "))
})


export { registerAdmin, adminLoginHandler, adminLogoutHandler, refreshToken }