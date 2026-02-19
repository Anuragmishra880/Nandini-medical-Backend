import express from 'express'
import { getAllUsers, loginHandler, logoutHandler, refreshToken, registerUser } from '../Controllers/user.controller.js'
// import { upload } from '../Middlewares/multer.js'
const router = express.Router()
import { verifyJWT } from '../Middlewares/auth.middleware.js'
// router.route('/register').post(
//     upload.single('coverImage'),
//     registerUser)

// router.route('/register').post(
//     upload.fields([
//         {
//             name: "coverImage",
//             maxCount: 1
//         }
//     ]),
//     registerUser
// )
router.post("/register", registerUser)
router.post("/login", loginHandler)
router.post("/logout", verifyJWT, logoutHandler)
router.post("/refresh-token", refreshToken)
router.get('/',getAllUsers)
export default router