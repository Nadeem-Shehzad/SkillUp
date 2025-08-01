import { Course } from "../models/course.model.js";
import { addImageUploadJob } from "../bullmq/jobs/image.job.js";
import { CourseContent } from "../models/courseContent.model.js";
import ApiError from "../../../utils/apiError.js";
import { constants } from "../../../constants/statusCodes.js";
import { videoUpload } from "../../../utils/video.js";
import { addVideoUploadJob } from "../bullmq/jobs/video.job.js";



export const allCourses = async () => {
   const courses = await Course.find({});
   return courses;
}


export const createCourse = async (req) => {

   //let thumbnailData = { id: '', url: '' };

   let {
      title,
      description,
      category,
      level,
      price,
      discount,
      tags,
      language,
      totalLectures,
      instructor,
      isPublished
   } = req.body;

   // if (req.files && req.files.image) {
   //    thumbnailData = await imageUpload(req);
   // }

   if (discount > 0) {
      price = price - (price * discount / 100);
   }

   const course = await Course.create({
      title,
      description,
      //thumbnail: thumbnailData,
      category,
      level,
      price,
      discount,
      tags,
      language,
      totalLectures,
      instructor,
      isPublished,
   });

   await addImageUploadJob({
      imagePath: req.files.image,
      courseId: course._id
   });

   return course;
}


export const addCourseContents = async (req) => {

   const { courseId, title, duration, isFree, order } = req.body;

   const course = await Course.findById(courseId);
   if (!course) {
      throw new ApiError(constants.NOT_FOUND, 'Course To add content not Found!');
   }

   if (req.user.id.toString() !== course.instructor.toString()) {
      throw new ApiError(constants.FORBIDDEN, 'Access Denied.');
   }

   const courseContent = await CourseContent.create({
      courseId,
      title,
      duration,
      isFree,
      order
   });
   
   const videoData = await addVideoUploadJob({
      videoPath: req.files.video,
      contentId: courseContent._id
   });

   return courseContent;
}