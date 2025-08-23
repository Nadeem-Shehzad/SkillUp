import { imageQueue, imageUpdateQueue } from "../queues/image.queue.js";
import { logger } from "@skillup/common-utils";


export const addImageUploadJob = async ({ imagePath, courseId }) => {

   logger.info('📥 Adding image job to queue...');

   await imageQueue.add('uploadImage', { imagePath, courseId },
      {
         jobId: `image-${Date.now()}`,
         attempts: 3,
         backoff: {
            type: 'exponential',
            delay: 2000
         },
         removeOnComplete: true,
         removeOnFail: false,
      });

   // const jobCounts = await welcomeEmailQueue.getJobCounts();
   // console.log('📊 Job counts:', jobCounts);

   logger.info('✅ Job added to image queue');
};


export const addImageUpdateJob = async ({ newImagePath, oldImagePID, courseId }) => {

   logger.info('📥 Adding imageUpdate job to queue...');

   await imageUpdateQueue.add('UpdateImage', { newImagePath, oldImagePID, courseId }, {
      attempts: 3,
      backoff: {
         type: 'exponential',
         delay: 2000
      },
      removeOnComplete: true,
      removeOnFail: false,
   });

   logger.info('✅ Job added to imageUpdate queue');
}