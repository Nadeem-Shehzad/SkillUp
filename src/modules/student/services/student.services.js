import cloudinary from "../../../config/cloudinary.js";
import { constants } from "../../../constants/statusCodes.js";
import ApiError from "../../../utils/apiError.js";
import { imageUpload } from "../../../utils/image.js";
import User from "../../auth/models/auth.model.js";
import { Student } from "../models/student.model.js";



export const getStudentProfile = async (req) => {
   const userId = req.user.id;

   const user = await Student.findOne({ user: userId }).populate('user', 'name email isVerified');

   if (!user) {
      throw new ApiError(constants.NOT_FOUND, 'User Not Found!');
   }

   return user;
}


export const findLoginUser = async ({ id }) => {
   const user = await User.findById(id);
   if (!user) {
      throw new ApiError(constants.NOT_FOUND, 'User not found!');
   }

   return user;
}


export const updateUserProfile = async (user, req) => {

   const { name, email, educationLevel, language, learningGoal, bio } = req.body;
   const student = await Student.findOne({ user: user._id });

   if(!student){
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

   if(Object.keys(updateData).length > 0){
      await Student.findByIdAndUpdate(
         student._id,
         updateData
      );
   }
}