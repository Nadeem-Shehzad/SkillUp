import { createWorker } from "../../../../config/index.js";
import { constants } from "../../../../constants/statusCodes.js";
import ApiError from "../../../../utils/apiError.js";
import { videoUpload } from "../../../../utils/video.js";
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

      console.log(`✅ video uploaded and CourseContent updated: ${contentId}`);

   } catch (error) {
      console.error("❌ Video Worker error:", err);
      throw error; // Always throw to let BullMQ retry the job
   }
}

const videoWorker = createWorker('videoQueue', processVideoUploadJob);

videoWorker.on('completed', (job) => {
   console.log(`🎉 Video worker completed job ${job.id}`);
});

videoWorker.on('failed', (job, err) => {
   console.error(`❌ Failed to process video job ${job.id}`, err);
});

videoWorker.on('error', (err) => {
   console.error('❌ Video Worker connection error:', err);
});

videoWorker.on('closed', () => {
   console.warn('⚠️ Video Worker closed unexpectedly');
});