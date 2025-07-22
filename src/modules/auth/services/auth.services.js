import ApiError from "../../../utils/apiError.js";
import { comparePassword, hashPassword } from "../../../utils/password.js"
import User from "../models/auth.model.js";
import { constants } from "../../../constants/statusCodes.js";
import { imageUpload } from "../../../utils/image.js";


export const createUser = async (req) => {

   let imageUploadData = { id: '', url: '' };

   const { name, email, password } = req.body;
  
   if (await User.isEmailTaken({ email })) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Email Already Registered!');
   }

   if (req.files && req.files.image) {
      imageUploadData = await imageUpload(req);
   }

   const hPassword = await hashPassword(password);
   const user = await User.create({
      name,
      email,
      password: hPassword,
      role: 'student',
      image: imageUploadData
   });

   return user;
}


export const validateUser = async ({ email, password }) => {

   const user = await User.findOne({ email });
   if (!user) {
      throw new ApiError(constants.NOT_FOUND, 'Email not found. first register ur account!,');
   }

   const isPasswordMatched = await comparePassword(password, user.password);
   if (!isPasswordMatched) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Password!,');
   }

   return user;
}


export const findLoginUser = async ({ id }) => {
   const user = await User.findById(id);
   if (!user) {
      throw new Error(constants.NOT_FOUND, 'User not found!');
   }

   return user;
}


export const updatePassword = async (user, reqBody) => {

   const matchOldPassword = await comparePassword(reqBody.oldPassword, user.password);
   
   if(!matchOldPassword){
      throw new ApiError(constants.UNAUTHORIZED,'Incorrect Old Password.');
   }

   const hashedPassword = await hashPassword(reqBody.password);
   reqBody.password = hashedPassword;

   const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
         $set:{
            password: hashedPassword
         }
      },
      { new: true }
   );

   return updatedUser;
}


export const updateUserProfile = async (user, reqBody) => {

   const updatedUser = await User.findByIdAndUpdate(
      user._id,
      reqBody,
      { new: true }
   );

   return updatedUser;
}