
import cloudinary from "../config/cloudinary.js"


export const videoUpload = async (videoPath) => {
   if (videoPath) {

      const result = await cloudinary.uploader.upload(videoPath.tempFilePath, {
         public_id: `${Date.now()}`,
         resource_type: "video",
         folder: "videos"
      });
      
      // check image is uploaded successfully or not
      if (result && result.secure_url) {
         const videoData = {
            id: result.public_id,
            url: result.secure_url
         }
         
         return videoData;
      }
      return {
         id: '',
         url: ''
      };
   } else {
      console.log(`Video: Video Path missing!.`);
   }
}