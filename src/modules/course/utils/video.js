
import cloudinary from "../../../config/cloudinary.js";

import { ApiError } from "@skillup/common-utils";
import { constants } from "@skillup/common-utils";


export const videoUpload = async (videoPath) => {
   const pathToUpload = videoPath?.tempFilePath || videoPath;

   if (pathToUpload) {

      const result = await cloudinary.uploader.upload(pathToUpload, {
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
      return {
         id: '',
         url: ''
      };
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