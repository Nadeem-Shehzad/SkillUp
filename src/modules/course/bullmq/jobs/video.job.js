import { videoQueue, videoUpdateQueue } from "../queues/video.queue.js";


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


export const addVideoUpdateJob = async ({ newVideoPath, oldVideoPID, contentId }) => {
  
   console.log('📥 Adding videoUpdate job to queue...');
   await videoUpdateQueue.add('updateVideo', { newVideoPath, oldVideoPID, contentId }, {
      attempts: 3,
      backoff: {
         type: 'exponential',
         delay: 2000
      },
      removeOnComplete: true,
      removeOnFail: false
   });

   console.log('✅ Job added to videoUpdate queue');
}