import { createWorker } from "../../../../config/bullmq.js";
import { constants } from "../../../../constants/statusCodes.js";
import ApiError from "../../../../utils/apiError.js";
import { imageUpload } from "../../../../utils/image.js";
import { Course } from "../../models/course.model.js";

//console.log('** image worker loads **');

const processImageUploadJob = async (job) => {
   console.log('📨 worker --> Processing ImageUpload job');

   const { imagePath, courseId } = job.data;
   try {
      const thumbnail = await imageUpload(imagePath);
      if (thumbnail.id === '' || thumbnail.url === '') {
         throw new ApiError(constants.SERVER_ERROR, 'Error: Image not Uploaded!');
      }

      const updated = await Course.findByIdAndUpdate(
         courseId,
         {
            $set: {
               thumbnail: {
                  id: thumbnail.id,
                  url: thumbnail.url
               }
            }
         },
         { new: true }
      );

      if (!updated)
         throw new ApiError(constants.SERVER_ERROR, 'Course not found or not updated');

      console.log(`✅ Image uploaded and Course updated: ${courseId}`);

   } catch (err) {
      console.error("❌ Image Worker error:", err);
      throw err; // Always throw to let BullMQ retry the job
   }
};

const imageWorker = createWorker('imageQueue', processImageUploadJob);

imageWorker.on('completed', (job) => {
   console.log(`🎉 Image worker completed job ${job.id}`);
});

imageWorker.on('failed', (job, err) => {
   console.error(`❌ Failed to process image job ${job.id}`, err);
});

imageWorker.on('error', (err) => {
   console.error('❌ Image Worker connection error:', err);
});

imageWorker.on('closed', () => {
   console.warn('⚠️ Image Worker closed unexpectedly');
});

imageWorker.on('drained', () => {
  //console.log("✨ Image worker ----> All jobs in the queue have been processed. Queue is empty.");
});