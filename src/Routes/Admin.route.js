import express from 'express'
const router = express.Router()
import { authorizeAdmin } from "../Middlewares/adminAuthorization.middleware.js";
import { adminVerifyJWT } from '../Middlewares/adminAuth.middleware.js';
import { Admin } from '../Models/AdminAuth.js';
import { adminLoginHandler, adminLogoutHandler, checkAdminExist, getCurrentAdmin, adminRefreshToken, registerAdmin } from '../Controllers/adminAuth.controller.js';
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
router.post("/register-admin", upload.single('adminImage'), registerAdmin)
router.post("/login-admin", adminLoginHandler)
router.post("/logout-admin", adminVerifyJWT, adminLogoutHandler)
router.post("/refresh-token", adminRefreshToken)
router.get("/me", adminVerifyJWT, getCurrentAdmin);
router.post("/check-admin", checkAdminExist);

export default router