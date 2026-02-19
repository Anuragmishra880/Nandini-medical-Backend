import express from 'express'
const router = express.Router()
import { authorizeAdmin } from "../Middlewares/adminAuthorization.middleware.js";
import { adminVerifyJWT } from '../Middlewares/adminAuth.middleware.js';
import { Admin } from '../Models/AdminAuth.js';
import { adminLoginHandler, adminLogoutHandler, refreshToken, registerAdmin } from '../Controllers/adminAuth.js';
import { upload } from '../Middlewares/multer.js'

router.put(
  "/profile",
  adminVerifyJWT,
  authorizeAdmin,
  async (req, res) => {
    const { email } = req.body;

    const admin = await Admin.findById(req.admin._id);

    admin.email = email;
    await admin.save();

    res.json({ message: "Admin email updated" });
  }
);
router.post("/register-admin", upload.single('coverImage'), registerAdmin)
router.post("/login-admin",adminVerifyJWT, adminLoginHandler)
router.post("/logout-admin", adminVerifyJWT, adminLogoutHandler)
router.post("/refresh-token", refreshToken)
export default router