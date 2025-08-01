import { createWorker } from "../../../../config/index.js";
import { deleteImage, imageUpload } from "../../../../utils/image.js";
import { Course } from "../../models/course.model.js";


//console.log('** imageUpdate worker loads **');

const processImageUpdateJob = async (job) => {
   const { newImagePath, oldImagePID, courseId } = job.data;

   try {

      const thumbnail = await imageUpload(newImagePath);
      if (thumbnail.id === '' || thumbnail.url === '') {
         throw new ApiError(constants.SERVER_ERROR, 'Error: ImageUpdate not Uploaded!');
      }

      await deleteImage(oldImagePID);

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

      console.log(`✅ Image and Course updated: ${courseId}`);

   } catch (error) {
      console.error("❌ ImageUpdate Worker error:", err);
      throw error;
   }
}

const imageUpdateWorker = createWorker('imageUpdateQueue', processImageUpdateJob);

imageUpdateWorker.on('completed', (job) => {
   console.log(`🎉 ImageUpdate Job completed. ${job.id}`);
});

imageUpdateWorker.on('failed', (job, err) => {
   console.error(`❌ Failed to process ImageUpdate job ${job.id}`, err);
});

imageUpdateWorker.on('error', (err) => {
   console.error('❌ ImageUpdate Worker connection error:', err);
});

imageUpdateWorker.on('closed', () => {
   console.warn('⚠️ ImageUpdate Worker closed unexpectedly');
});