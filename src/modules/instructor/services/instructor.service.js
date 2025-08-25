import cloudinary from "../../../config/cloudinary.js";
import { ApiError, constants } from "@skillup/common-utils";

import { imageUpload } from "../utils/image.js";
import { Instructor } from "../models/instructor.model.js";

import { AuthClientService } from "./client/authClient.service.js";



export const getProfile = async (req) => {
   const instrcutorId = req.user.id;

   const instructor = await Instructor.findOne({ user: instrcutorId }).populate('user', 'name email isVerified');

   if (!instructor) {
      throw new ApiError(constants.NOT_FOUND, 'Instructor Not Found!');
   }

   return instructor;
}


export const findLoginInstructor = async ({ id }) => {
   const userId = id;

   const instructor = await AuthClientService.findUser({ userId });
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
      const userId = user._id;
      await AuthClientService.updateUserData({ userId, dataToUpdate });
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