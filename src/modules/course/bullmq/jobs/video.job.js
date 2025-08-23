import { videoQueue, videoUpdateQueue } from "../queues/video.queue.js";
import { logger } from "@skillup/common-utils";


export const addVideoUploadJob = async ({ videoPath, contentId }) => {
   logger.info('📥 Adding video job to queue...');

   await videoQueue.add('uploadVideo', { videoPath, contentId }, {
      jobId: `video-${Date.now()}`,
      attempts: 3,
      backoff: {
         type: 'exponential',
         delay: 2000
      },
      removeOnComplete: true,
      removeOnFail: false
   });

   logger.info('✅ Job added to video queue');
}


export const addVideoUpdateJob = async ({ newVideoPath, oldVideoPID, contentId }) => {
  
   logger.info('📥 Adding videoUpdate job to queue...');

   await videoUpdateQueue.add('updateVideo', { newVideoPath, oldVideoPID, contentId }, {
      attempts: 3,
      backoff: {
         type: 'exponential',
         delay: 2000
      },
      removeOnComplete: true,
      removeOnFail: false
   });

   logger.info('✅ Job added to videoUpdate queue');
}