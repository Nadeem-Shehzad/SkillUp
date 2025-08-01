import { imageQueue } from "../queues/image.queue.js";


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
