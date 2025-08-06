import mongoose from "mongoose";
import cloudinary from "../../../config/cloudinary.js";
import { constants } from "../../../constants/statusCodes.js";
import ApiError from "../../../utils/apiError.js";
import { imageUpload } from "../../../utils/image.js";
import User from "../../auth/models/auth.model.js";
import { Student } from "../models/student.model.js";
import { Course } from "../../course/models/course.model.js";



export const getStudentProfile = async (req) => {

   const userId = req.user.id;
   const user = await Student.findOne({ user: userId }).populate('user', 'name email isVerified');

   if (!user) {
      throw new ApiError(constants.NOT_FOUND, 'User Not Found!');
   }

   return user;
}


export const updateUserProfile = async (user, req) => {

   const { name, email, educationLevel, language, learningGoal, bio } = req.body;
   const student = await Student.findOne({ user: user._id });

   if (!student) {
      throw new ApiError(constants.NOT_FOUND, 'Student Not Found!');
   }

   // update user-auth module
   const dataToUpdate = {}
   if (name) dataToUpdate.name = name;
   if (email) dataToUpdate.email = email;

   if (req.files && req.files.image) {

      const imageUploadData = await imageUpload(req);

      dataToUpdate.image = imageUploadData;

      // delete old image if exists
      if (user.image?.id) {
         await cloudinary.uploader.destroy(
            user.image.id,
            { resource_type: "image", invalidate: true }
         );
      }
   }

   if (Object.keys(dataToUpdate).length > 0) {
      await User.findByIdAndUpdate(user._id, dataToUpdate);
   }

   // update user-student module
   const updateData = {};
   if (bio) updateData.bio = bio;
   if (educationLevel) updateData.educationLevel = educationLevel;
   if (learningGoal) updateData['preferences.learningGoal'] = learningGoal;
   if (language) updateData['preferences.language'] = language;

   if (Object.keys(updateData).length > 0) {
      await Student.findByIdAndUpdate(
         student._id,
         updateData
      );
   }
}


export const findLoginStudent = async ({ id }) => {

   const user = await User.findById(id);
   if (!user) {
      throw new ApiError(constants.NOT_FOUND, 'Error: Studnet not found in User DB!');
   }

   const student = await Student.findOne({ user: user._id });
   if (!student) {
      throw new ApiError(constants.NOT_FOUND, 'Error: Student not Found!');
   }

   return student;
}


export const addBookmarkCourseService = async ({ studentId, courseId }) => {

   if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Error: Invalid CourseId!');
   }

   const course = await Course.findById(courseId);
   if (!course) {
      throw new ApiError(constants.NOT_FOUND, 'Error: Course not Found!');
   }

   const student = await Student.findOneAndUpdate(
      { _id: studentId },
      {
         $addToSet: {
            bookmarks: course._id,
         }
      },
      { new: true }
   );

   return student.bookmarks;
}


export const getBookmarksService = async ({ studentId }) => {

   const bookmarks = await Student.findById(studentId)
      .select('-_id bookmarks')
      .populate('bookmarks', 'title')
      .lean();

   return bookmarks;
}


export const deleteBookmarkService = async ({ student, bookmarkId }) => {

   if (!mongoose.Types.ObjectId.isValid(bookmarkId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Error: Invalid BookmakId!');
   }

   if(!student.bookmarks.includes(bookmarkId.toString())){
      throw new ApiError(constants.NOT_FOUND, 'Error: BookMark to be delete not Found!');
   }

   student.bookmarks = student.bookmarks.filter((bookmark) => bookmark._id.toString() !== bookmarkId.toString());

   await student.save();
}