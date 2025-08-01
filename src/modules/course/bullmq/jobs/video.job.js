import { videoQueue } from "../queues/video.queue.js";


export const addVideoUploadJob = async ({ videoPath, contentId }) => {
   console.log('📥 Adding video job to queue...');

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

   console.log('✅ Job added to video queue');
}