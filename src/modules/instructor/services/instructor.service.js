import cloudinary from "../../../config/cloudinary.js";

import { ApiError, constants } from "@skillup/common-utils";

import { imageUpload } from "../utils/image.js";
import User from "../../auth/models/auth.model.js";
import { Instructor } from "../models/instructor.model.js";



export const getProfile = async (req) => {
   const instrcutorId = req.user.id;

   const instructor = await Instructor.findOne({ user: instrcutorId }).populate('user', 'name email isVerified');

   if (!instructor) {
      throw new ApiError(constants.NOT_FOUND, 'Instructor Not Found!');
   }

   return instructor;
}


export const findLoginInstructor = async ({ id }) => {
   const instructor = await User.findById(id);
   if (!instructor) {
      throw new ApiError(constants.NOT_FOUND, 'Instructor not found!');
   }

   return instructor;
}


export const updateProfile = async (user, req) => {
   const { name, email, bio, expertise, qualifications } = req.body;

   const dataToUpdate = {};
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

   const instructor = await Instructor.findOne({ user: user._id });

   const updateInstructorSpecificData = {};
   if (bio) updateInstructorSpecificData.bio = bio;
   if (expertise) updateInstructorSpecificData.expertise = expertise;
   if (qualifications) updateInstructorSpecificData.qualifications = qualifications;

   if (Object.keys(updateInstructorSpecificData).length > 0) {
      await Instructor.findByIdAndUpdate(
         instructor._id,
         updateInstructorSpecificData
      );
   }
}