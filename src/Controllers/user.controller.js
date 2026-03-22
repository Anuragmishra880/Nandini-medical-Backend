import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../Models/User.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'

const emailValidator = (email) => {
  let at = email.indexOf('@')
  let dot = email.lastIndexOf('.')
  if (!email || at < 1 || dot < at + 2 || dot === email.length - 1) {
    throw new ApiError(400, "please enter  valid Email")
  }
}

// token Generator Function 
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "something went wrong when generating Access token or refresh token")
  }
}
const registerUser = asyncHandler(async (req, res) => {

  const { userName, email, password } = req.body
  emailValidator(email)
  if (!password || password.includes(" ") || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters")
  }
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }]
  })
  if (existedUser) {
    throw new ApiError(409, "UserName or Email is already used by someone")
  }

  // const coverImageLocalPath = req.files?.coverImage[0]?.path.replace(/\\/g, "/");
  // if (!coverImageLocalPath) {
  //   throw new ApiError(400, "Cover image is required");
  // }
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  // if (!coverImage) {
  //       throw new ApiError(400, "Avatar file is required")
  //   }
  const user = await User.create({
    userName: userName.toLowerCase(),
    // coverImage: coverImage,
    email,
    password,

  })
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )

})

const loginHandler = asyncHandler(async (req, res) => {

  const { userName, email, password } = req.body
  if (!(email || userName) || !password) {
    throw new ApiError(400, "  Username or password is required");
  }
  const user = await User.findOne(
    {
      $or: [{ userName }, { email }]
    }
  )
  if (!user) {
    throw new ApiError(404, "Not find Email or Username");
  }
  const isPasswordMatch = await user.isPasswordCorrect(password)
  if (!isPasswordMatch) {
    throw new ApiError(402, 'Password is not correct')
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken')
  const options = {
    // httpOnly: true,
    // secure: false,
    httpOnly: true,
    secure: true,          // 🔥 production me
    sameSite: "None",      // 🔥 MUST for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000
  }




  return res.status(200).cookie("userAccessToken", accessToken, options).cookie("userRefreshToken", refreshToken, options).json(new ApiResponse(200, {
    user: loggedInUser, accessToken, refreshToken

  },
    "Logged in successFully "))
})

const logoutHandler = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(req.user.id
    , {
      $unset: { refreshToken: 1 }
    },
    { new: true }
  )
  const options = {
    // httpOnly: true,
    // secure: false,
    httpOnly: true,
    secure: true,          // 🔥 production me
    sameSite: "None",      // 🔥 MUST for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
  return res
    .status(200)
    .clearCookie("userAccessToken", options)
    .clearCookie("userRefreshToken", options)
    .json(new ApiResponse(200, {}, "Logout successFully "))
})

const userRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.userRefreshToken || req.body.refreshToken
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }
  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  const user = await User.findById(decodedToken.id)
  if (!user) {
    throw new ApiError(401, "invalid refresh token")
  }
  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, ' refresh token is expired')
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id)
  const options = {
    // httpOnly: true,
    // secure: false,
    httpOnly: true,
    secure: true,          // 🔥 production me
    sameSite: "None",      // 🔥 MUST for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
  return res.status(200).cookie("userAccessToken", accessToken, options).cookie("userRefreshToken", newRefreshToken, options).json(new ApiResponse(200, {
    accessToken, refreshToken: newRefreshToken

  },
    "refresh Token refreshed "))
})

const getAllUsers = asyncHandler(async (req, res) => {
  const user = await User.find()

  if (!user) {
    throw new ApiError(404, "user not found")
  }
  return res.status(200).json(new ApiResponse(200, user, "user find successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, "Current user fetched")
  );
});

export { registerUser, loginHandler, logoutHandler, userRefreshToken, getAllUsers, getCurrentUser }