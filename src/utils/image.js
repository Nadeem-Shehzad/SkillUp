import cloudinary from "../config/cloudinary.js"


export const imageUpload = async (req) => {
   if (req.files && req.files.image) {
      const file = req.files.image;

      const result = await cloudinary.uploader.upload(file.tempFilePath, {
         public_id: `${Date.now()}`,
         resource_type: "auto",
         folder: "images"
      });

      // check image is uploaded successfully or not
      if (result && result.secure_url) {
         const imageData = {
            id: result.public_id,
            url: result.secure_url
         }
         
         return imageData;
      }
      return null;
   }
}