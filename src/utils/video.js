
import cloudinary from "../config/cloudinary.js"
import { constants } from "../constants/statusCodes.js";


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


export const deleteVideo = async (videoPublicId) => {
   try {
      const response = await cloudinary.uploader.destroy(
         videoPublicId,
         { resource_type: "video", invalidate: true }
      );
   
      if (response.result !== 'ok' && response.result !== 'not found') {
         throw new Error(`Video deletion failed: ${response.result}`);
      }
   } catch (err) {
      console.error('❌ Video delete error:', err.message);
      throw new ApiError(constants.SERVER_ERROR, 'Video deletion failed!');
   }
}