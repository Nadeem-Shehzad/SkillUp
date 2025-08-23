import { createWorker } from "../../../../config/index.js";
import { deleteImage, imageUpload } from "../../utils/image.js";
import { Course } from "../../models/course.model.js";

import { logger } from "@skillup/common-utils";


//console.log('** imageUpdate worker loads **');

const processImageUpdateJob = async (job) => {
   const { newImagePath, oldImagePID, courseId } = job.data;

   try {

      const thumbnail = await imageUpload(newImagePath);
      if (thumbnail.id === '' || thumbnail.url === '') {
         throw new ApiError(constants.SERVER_ERROR, 'Error: ImageUpdate not Uploaded!');
      }

      await deleteImage(oldImagePID);

      const updated = await Course.findByIdAndUpdate(
         courseId,
         {
            $set: {
               thumbnail: {
                  id: thumbnail.id,
                  url: thumbnail.url
               }
            }
         },
         { new: true }
      );

      if (!updated)
         throw new ApiError(constants.SERVER_ERROR, 'Course not found or not updated');

      logger.info(`✅ Image and Course updated: ${courseId}`);

   } catch (error) {
      logger.error("❌ ImageUpdate Worker error:", err);
      throw error;
   }
}

const imageUpdateWorker = createWorker('imageUpdateQueue', processImageUpdateJob);

imageUpdateWorker.on('completed', (job) => {
   logger.info(`🎉 ImageUpdate Job completed. ${job.id}`);
});

imageUpdateWorker.on('failed', (job, err) => {
   logger.error(`❌ Failed to process ImageUpdate job ${job.id}`, err);
});

imageUpdateWorker.on('error', (err) => {
   logger.error('❌ ImageUpdate Worker connection error:', err);
});

imageUpdateWorker.on('closed', () => {
   logger.error('⚠️ ImageUpdate Worker closed unexpectedly');
});

imageUpdateWorker.on('drained', () => {
   //logger.error("✨ ImageUpdate worker ---->  All jobs in the queue have been processed. Queue is empty.");
});