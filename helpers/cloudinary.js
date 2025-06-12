const cloudinary = require("cloudinary").v2;

async function uploadToCloudinary(reqFile, name) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const fileBase64 = `data:${
      reqFile.mimetype
    };base64,${reqFile.buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(fileBase64, {
      public_id: `cuisine_${name}`,
    });

    console.log(uploadResult);
    return uploadResult.secure_url;
  } catch (error) {
    throw error;
  }
}

module.exports = uploadToCloudinary;
