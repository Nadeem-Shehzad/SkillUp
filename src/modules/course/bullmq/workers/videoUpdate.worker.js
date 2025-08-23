import { createWorker } from "../../../../config/index.js";

import { ApiError, constants, logger } from "@skillup/common-utils";

import { deleteVideo, videoUpload } from "../../utils/video.js";
import { CourseContent } from "../../models/courseContent.model.js";


//console.log('** videoUpdate worker loads **');

const processVideoUpdateJob = async (job) => {
   const { newVideoPath, oldVideoPID, contentId } = job.data;
   try {
      const video = await videoUpload(newVideoPath);
      if (video.id === '' || video.url === '') {
         throw new ApiError(constants.SERVER_ERROR, 'Error: VideoUpdate not Uploaded!');
      }

      await deleteVideo(oldVideoPID);

      const updated = await CourseContent.findByIdAndUpdate(
         contentId,
         {
            $set: {
               video: {
                  id: video.id,
                  url: video.url
               }
            }
         },
         { new: true }
      );

      if (!updated)
         throw new ApiError(constants.SERVER_ERROR, 'Content not found or not updated');

      logger.info(`✅ Video and Content updated: ${contentId}`);

   } catch (error) {
      logger.error("❌ VideoUpdate Worker error:", error);
      throw error;
   }
}

const videoUpdateWorker = createWorker('videoUpdateQueue', processVideoUpdateJob);

videoUpdateWorker.on('completed', (job) => {
   logger.info(`🎉 VideoUpdate Job completed. ${job.id}`);
});

videoUpdateWorker.on('failed', (job, err) => {
   logger.error(`❌ Failed to process VideoUpdate job ${job.id}`, err);
});

videoUpdateWorker.on('error', (err) => {
   logger.error('❌ VideoUpdate Worker connection error:', err);
});

videoUpdateWorker.on('closed', () => {
   logger.warn('⚠️ VideoUpdate Worker closed unexpectedly');
});

videoUpdateWorker.on('drained', () => {
   //logger.warn("✨ VideoUpdate worker ---->  All jobs in the queue have been processed. Queue is empty.");
});