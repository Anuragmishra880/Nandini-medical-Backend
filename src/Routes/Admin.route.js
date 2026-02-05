import express from 'express'
const router = express.Router()
import { authorizeAdmin } from "../Middlewares/adminAuthorization.middleware.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

router.put(
  "/profile",
  verifyJWT,
  authorizeAdmin,
  async (req, res) => {
    const { email } = req.body;

    const admin = await User.findById(req.user._id);

    admin.email = email;
    await admin.save();

    res.json({ message: "Admin email updated" });
  }
);
export default router