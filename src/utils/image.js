import cloudinary from "../config/cloudinary.js"


export const imageUpload = async (imagePath) => {
   if (imagePath) {

      const result = await cloudinary.uploader.upload(imagePath.tempFilePath, {
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
      return {
         id: '',
         url: ''
      };
   } else {
      console.log(`Image: Image Path missing!.`);
   }
}


export const deleteImage = async (imagePublicId) => {
   const response = await cloudinary.uploader.destroy(
      imagePublicId,
      { resource_type: "image", invalidate: true }
   );

   if (response.result !== 'ok' && response.result !== 'not found') {
      throw new Error(`Image deletion failed: ${response.result}`);
   }
}