import { createWorker } from "../../../../config/index.js";

import { ApiError, constants, logger } from "@skillup/common-utils";

import { videoUpload } from "../../utils/video.js";
import { CourseContent } from "../../models/courseContent.model.js";

//console.log('** video worker loads **');

const processVideoUploadJob = async (job) => {
   try {
      const { videoPath, contentId } = job.data;

      await new Promise(res => setTimeout(res, 5000));

      const video = await videoUpload(videoPath);
      if (video.id === '' || video.url === '') {
         throw new ApiError(constants.SERVER_ERROR, 'Error: video not Uploaded!');
      }

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
         throw new ApiError(constants.SERVER_ERROR, 'CourseContent not found or not updated')

      logger.info(`✅ video uploaded and CourseContent updated: ${contentId}`);

   } catch (error) {
      logger.error("❌ Video Worker error:", err);
      throw error; 
   }
}

const videoWorker = createWorker('videoQueue', processVideoUploadJob);

videoWorker.on('completed', (job) => {
   logger.info(`🎉 Video worker completed job ${job.id}`);
});

videoWorker.on('failed', (job, err) => {
   logger.error(`❌ Failed to process video job ${job.id}`, err);
});

videoWorker.on('error', (err) => {
   logger.error('❌ Video Worker connection error:', err);
});

videoWorker.on('closed', () => {
   logger.warn('⚠️ Video Worker closed unexpectedly');
});

videoWorker.on('drained', () => {
   //logger.error("✨ Video worker ---->  All jobs in the queue have been processed. Queue is empty.");
});