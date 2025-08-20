import { createWorker } from "../../../../config/index.js";
import { constants } from "../../../../constants/statusCodes.js";
import ApiError from "../../../../utils/apiError.js";
import { deleteVideo, videoUpload } from "../../../../utils/video.js";
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

      console.log(`✅ Video and Content updated: ${contentId}`);

   } catch (error) {
      console.error("❌ VideoUpdate Worker error:", error);
      throw error;
   }
}

const videoUpdateWorker = createWorker('videoUpdateQueue', processVideoUpdateJob);

videoUpdateWorker.on('completed', (job) => {
   console.log(`🎉 VideoUpdate Job completed. ${job.id}`);
});

videoUpdateWorker.on('failed', (job, err) => {
   console.error(`❌ Failed to process VideoUpdate job ${job.id}`, err);
});

videoUpdateWorker.on('error', (err) => {
   console.error('❌ VideoUpdate Worker connection error:', err);
});

videoUpdateWorker.on('closed', () => {
   console.warn('⚠️ VideoUpdate Worker closed unexpectedly');
});

videoUpdateWorker.on('drained', () => {
  //console.log("✨ VideoUpdate worker ---->  All jobs in the queue have been processed. Queue is empty.");
});