import { imageQueue, imageUpdateQueue } from "../queues/image.queue.js";


export const addImageUploadJob = async ({ imagePath, courseId }) => {

   console.log('📥 Adding image job to queue...');

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

   console.log('✅ Job added to image queue');
};


export const addImageUpdateJob = async ({ newImagePath, oldImagePID, courseId }) => {
   
   console.log('📥 Adding imageUpdate job to queue...');
   await imageUpdateQueue.add('UpdateImage', { newImagePath, oldImagePID, courseId }, {
      attempts: 3,
      backoff: {
         type: 'exponential',
         delay: 2000
      },
      removeOnComplete: true,
      removeOnFail: false,
   });

    console.log('✅ Job added to imageUpdate queue');
}