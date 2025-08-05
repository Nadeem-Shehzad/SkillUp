import { Course } from "../models/course.model.js";
import { addImageUpdateJob, addImageUploadJob } from "../bullmq/jobs/image.job.js";
import { CourseContent } from "../models/courseContent.model.js";
import ApiError from "../../../utils/apiError.js";
import { constants } from "../../../constants/statusCodes.js";
import { addVideoUpdateJob, addVideoUploadJob } from "../bullmq/jobs/video.job.js";
import { Instructor } from "../../instructor/models/instructor.model.js";
import { deleteVideo } from "../../../utils/video.js";
import { redis, REDIS_DATA_EXPIRY_TIME, runInTransaction, NODE_ENV } from "../../../config/index.js";



export const allCourses = async ({ page, limit }) => {

   let key = `allcourses:${page}:${limit}`;
   const cachedData = await redis.get(key);

   if (cachedData) {
      console.log('data coming from redis');
      return JSON.parse(cachedData);
   }

   const courses = await Course.find({}).skip((page - 1) * limit).limit(limit);

   await redis.set(key, JSON.stringify(courses), 'EX', REDIS_DATA_EXPIRY_TIME);

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

   if (NODE_ENV === 'test') {
      course.thumbnail = {
         id: 'mocked-public-id',
         url: 'https://mocked.cloudinary.com/image.jpg',
      };

      await course.save();

   } else {
      await addImageUploadJob({
         imagePath: req?.files?.image,
         courseId: course._id
      });
   }

   return course;
}


export const searchCourseService = async ({ searchQuery, page, limit }) => {

   if (!searchQuery || searchQuery.trim() === '') return [];

   const trimmedQuery = searchQuery.trim();
   const isMultiWord = trimmedQuery.includes(' ') && trimmedQuery.length > 5;

   let courses = [];

   if (isMultiWord) {
      const textFilter = { $text: { $search: `"${trimmedQuery}"` } };
      const projection = { score: { $meta: 'textScore' } };

      courses = await Course.find(textFilter, projection).sort({ score: { $meta: 'textScore' } })
         .skip((page - 1) * limit).limit(limit);

      if (!courses.length) {
         const regexFilter = { title: { $regex: trimmedQuery, $options: 'i' } };
         courses = await Course.find(regexFilter).skip((page - 1) * limit).limit(limit);
      }
   } else {
      const regexFilter = { title: { $regex: trimmedQuery, $options: 'i' } };
      courses = await Course.find(regexFilter).skip((page - 1) * limit).limit(limit);
   }

   return courses;
}


export const searchContentsService = async ({ searchQuery, courseId, page, limit }) => {
   if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) return [];
   if (!courseId) return [];

   const query = searchQuery.trim();

   const contents = await CourseContent.find({
      $and: [
         { courseId },
         {
            title: {
               $regex: query,
               $options: 'i'
            }
         }
      ]
   }).skip((page - 1) * limit).limit(limit);

   return contents;
}


export const searchByInstructorService = async ({ searchQuery, page, limit }) => {

   if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) return [];
   const query = searchQuery.trim();

   const skip = (page - 1) * limit;

   const instructor = await Course.aggregate([
      {
         $lookup: {
            from: 'instructors',
            localField: 'instructor',
            foreignField: 'user',
            as: 'instructor'
         },
      },

      { $unwind: '$instructor' },

      {
         $lookup: {
            from: 'users',
            localField: 'instructor.user',
            foreignField: '_id',
            as: 'user'
         }
      },

      { $unwind: '$user' },

      {
         $match: {
            'user.name': { $regex: query, $options: 'i' }
         }
      },

      { $skip: skip },
      { $limit: limit },

      {
         $project: {
            title: 1,
            instructorName: '$user.name',
            category: 1
         }
      }

   ]);

   return instructor;
}


export const searchTagsService = async ({ searchQuery, page, limit }) => {
   if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) return [];

   const query = searchQuery.trim();

   const courses = await Course.find({ tags: { $in: query } }).skip((page - 1) * limit).limit(limit);

   return courses;
}


export const searchCategoryService = async ({ searchQuery, page, limit }) => {
   if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) return [];

   const query = searchQuery.trim();

   const courses = await Course.find({ category: query }).skip((page - 1) * limit).limit(limit);

   return courses;
}


export const allInstructors = async ({ page, limit }) => {
   const key = `all-instructors:${page}:${limit}`;
   const cachedData = await redis.get(key);

   if (cachedData) {
      console.log('data coming from redis...');
      return JSON.parse(cachedData);
   }

   const instructors = await Instructor.find({})
      .populate('user', 'name email isVerified')
      .skip((page - 1) * limit).limit(limit);

   await redis.set(key, JSON.stringify(instructors), 'EX', REDIS_DATA_EXPIRY_TIME);
   return instructors;
}


export const singleInstructorCourses = async ({ instructorId, page, limit }) => {
   const key = `courses-${instructorId}:${page}:${limit}`;
   const cachedData = await redis.get(key);

   if (cachedData) {
      console.log('data coming from redis...');
      return JSON.parse(cachedData);
   }

   const courses = await Course.find({ instructor: instructorId })
      .skip((page - 1) * limit).limit(limit);

   await redis.set(key, JSON.stringify(courses), 'EX', REDIS_DATA_EXPIRY_TIME);
   return courses;
}


export const publish_Course = async ({ instructorId, courseId }) => {

   const course = await Course.findById(courseId);

   if (!course) {
      throw new ApiError(constants.NOT_FOUND, 'Course not Found!');
   }

   if (course.instructor.toString() !== instructorId.toString()) {
      throw new ApiError(constants.FORBIDDEN, 'Access Denied.');
   }

   course.isPublished = true;
   await course.save();

   return course;
}


export const unpublish_Course = async ({ instructorId, courseId }) => {
   const course = await Course.findById(courseId);

   if (!course) {
      throw new ApiError(constants.NOT_FOUND, 'Course not Found!');
   }

   if (course.instructor.toString() !== instructorId.toString()) {
      throw new ApiError(constants.FORBIDDEN, 'Access Denied.');
   }

   course.isPublished = false;
   await course.save();

   return course;
}


export const update_Course = async ({ instructorId, courseId, dataToUpdate, imageData }) => {

   const course = await Course.findById(courseId);

   if (!course) {
      throw new ApiError(constants.NOT_FOUND, 'Course not Found!');
   }

   if (course.instructor.toString() !== instructorId.toString()) {
      throw new ApiError(constants.FORBIDDEN, 'Access Denied.');
   }

   const updated = await Course.findByIdAndUpdate(
      courseId,
      dataToUpdate
   );

   if (!updated) {
      throw new ApiError(constants.SERVER_ERROR, 'Data not updated!');
   }

   if (imageData) {
      await addImageUpdateJob({
         newImagePath: imageData,
         oldImagePID: course.thumbnail.id,
         courseId: courseId
      });
   }

   return true;
}


export const delete_Course = async ({ instructorId, courseId }) => {
   return runInTransaction(async (session) => {
      const course = await Course.findById(courseId).session(session);

      if (!course) {
         throw new ApiError(constants.NOT_FOUND, 'Course not Found!');
      }

      if (course.instructor.toString() !== instructorId.toString()) {
         throw new ApiError(constants.FORBIDDEN, 'Access Denied.');
      }

      const contents = await CourseContent.find({ courseId }).session(session);

      await Promise.all(contents.map(content => deleteVideo(content.video.id)));

      await CourseContent.deleteMany({ courseId: courseId }).session(session);
      await Course.findByIdAndDelete(courseId).session(session);

      return true;
   });
}


// contents api-services
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

   if (NODE_ENV === 'test') {
      // courseContent.video = {
      //    id: 'mocked-public-id',
      //    url: 'https://mocked.cloudinary.com/image.jpg',
      // };

      // await courseContent.save();

   } else {
      const videoData = await addVideoUploadJob({
         videoPath: req.files.video,
         contentId: courseContent._id
      });
   }

   // const videoData = await addVideoUploadJob({
   //    videoPath: req.files.video,
   //    contentId: courseContent._id
   // });

   return courseContent;
}


export const get_CourseContents = async ({ courseId, page, limit }) => {

   const key = `contents-${courseId}:${page}:${limit}`;
   const cachedData = await redis.get(key);

   if (cachedData) {
      console.log('data coming from redis...');
      return JSON.parse(cachedData);
   }

   const contents = await CourseContent.find({ courseId }).skip((page - 1) * limit).limit(limit);

   await redis.set(key, JSON.stringify(contents), 'EX', REDIS_DATA_EXPIRY_TIME);
   console.log('***** inside get contents service *****');

   return contents;
}


export const get_CourseContent = async ({ contentId }) => {
   
   const content = await CourseContent.findById(contentId);
   if (!content) {
      throw new ApiError(constants.NOT_FOUND, 'Content Data not Found!');
   }

   return content;
}


export const update_CourseContent = async ({ instructorId, contentId, dataToUpdate, videoData }) => {

   const content = await CourseContent.findById(contentId);
   if (!content) {
      throw new ApiError(constants.NOT_FOUND, 'Content Data not Found!');
   }

   const course = await Course.findById(content.courseId);
   if (!content) {
      throw new ApiError(constants.NOT_FOUND, 'Error: Course not Found!');
   }

   if (instructorId.toString() !== course.instructor.toString()) {
      throw new ApiError(constants.FORBIDDEN, 'Access Denied.');
   }

   const updatedContent = await CourseContent.findByIdAndUpdate(
      contentId,
      dataToUpdate,
      { new: true }
   );

   if (!updatedContent) {
      throw new ApiError(constants.SERVER_ERROR, 'Content not updated!');
   }

   if (videoData) {
      await addVideoUpdateJob({
         newVideoPath: videoData,
         oldVideoPID: content.video.id,
         contentId
      });
   }

   return updatedContent;
}


export const deleteCourseContents = async ({ instructorId, contentId }) => {
   return runInTransaction(async (session) => {

      const content = await CourseContent.findById(contentId).session(session);
      if (!content) {
         throw new ApiError(constants.NOT_FOUND, 'Error: Content not Found!');
      }

      const course = await Course.findById(content.courseId).session(session);
      if (!content) {
         throw new ApiError(constants.NOT_FOUND, 'Error: Course not Found!');
      }

      if (instructorId.toString() !== course.instructor.toString()) {
         throw new ApiError(constants.FORBIDDEN, 'Access Denied.');
      }

      await deleteVideo(content.video.id);

      await CourseContent.findByIdAndDelete(contentId).session(session);

      return true;
   });
}