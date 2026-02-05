import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

let isConfigured = false;
const configureCloudinary = () => {
  if (isConfigured) return;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  isConfigured = true;
};
// Uploader function
const uploadOnCloudinary = async (localFilePath) => {
  configureCloudinary()

  try {
    if (!localFilePath && !public_id) {
      throw new Error("Local file path missing");
    }
    // upload files
    const res = await cloudinary.uploader
      .upload(
        localFilePath, {
        resource_type: 'auto',
      }
      )
    // if uploading is  successfully done  → delete local file safely
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return res;
  }
  catch (error) {
    console.error("❌ CLOUDINARY UPLOAD ERROR =>", error);

    // cleanup 
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw error; 
  }

}
export { uploadOnCloudinary }
