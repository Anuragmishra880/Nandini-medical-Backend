import { User } from '../Models/User.js'
import { ApiError } from './ApiError.js';
const AdminCreator = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new ApiError(404, "adminEmail and adminPassword is required")
  }
  const existingAdmin = await User.findOne({ role: "admin" })
  if (existingAdmin) {
    throw new ApiError(404, "Admin already exist")
  }
  await User.create({
    userName: "shopowner",
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });
}
export { AdminCreator }