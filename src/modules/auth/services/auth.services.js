import ApiError from "../../../utils/apiError.js";
import { comparePassword, hashPassword } from "../../../utils/password.js"
import User from "../models/auth.model.js";
import { constants } from "../../../constants/statusCodes.js";
import { imageUpload } from "../../../utils/image.js";
import { sendEmail } from "../../../utils/email.js";
import redisClient from "../../../bullmq/connection.js";
import randomstring from 'randomstring';
import cloudinary from "../../../config/cloudinary.js";



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

   if (!matchOldPassword) {
      throw new ApiError(constants.UNAUTHORIZED, 'Incorrect Old Password.');
   }

   const hashedPassword = await hashPassword(reqBody.password);
   //reqBody.password = hashedPassword;

   const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
         $set: {
            password: hashedPassword
         }
      },
      { new: true }
   );

   return updatedUser;
}


export const updateUserProfile = async (user, req) => {

   const dataToUpdate = req.body;

   if (req.files && req.files.image) {

      const imageUploadData = await imageUpload(req);

      dataToUpdate.image = imageUploadData;

      // delete old image if exists
      if(user.image?.id){
         await cloudinary.uploader.destroy(
            user.image.id,
            { resource_type: "image", invalidate: true }
         );
      }
   }

   const updatedUser = await User.findByIdAndUpdate(
      user._id,
      dataToUpdate,
      { new: true }
   );

   return updatedUser;
}


export const verifyUserEmail = async (reqBody) => {
   const { email } = reqBody;
   const code = Math.floor(100000 + Math.random() * 900000).toString();

   // use this if want to send email by BullMQ service 
   // await addWelcomeEmailJob({
   //    to: email,
   //    subject: 'Verify your SkillUp account',
   //    data: `<h3>Your verification code is: <b>${code}</b></h3>`, // Or use template
   // });

   await sendEmail({
      to: email,
      subject: 'Verify your SkillUp account',
      data: `<h3>Your verification code is: <b>${code}</b></h3>`
   });

   await redisClient.setex(`verify:${email}`, 600, code);
}


export const verifyUserEmailOTP = async (reqBody) => {

   const { email, code } = reqBody;

   const storedCode = await redisClient.get(`verify:${email}`);

   if (!storedCode) {
      throw new ApiError(400, 'Code expired or not found');
   }

   if (code !== storedCode) {
      throw new ApiError(400, 'Invalid verification code');
   }

   // here add logic to update user --> isVerified to -> true

   await redisClient.del(`verify:${email}`);
}


export const forgot_Password = async (reqBody) => {

   const { email } = reqBody;

   const isEmailExists = await User.findOne({ email });
   if (!isEmailExists) {
      throw new ApiError(404, 'This email not registered!');
   }

   const ranString = randomstring.generate();

   const subject = 'Password Reset';
   const data = '<p> Hi ' + isEmailExists.name + ', copy link <a href="http://localhost:3000/api/auth/reset-password?token=' + ranString + '"> and reset your password';

   await sendEmail({ to: email, subject, data });

   await redisClient.set(`forgotPassword:${email}`, ranString);
}


export const reset_Password = async (req) => {

   if (!req.query.token) {
      throw new ApiError(400, 'Token missing to reset password.');
   }

   const token = req.query.token;
   const { email, newPassword } = req.body;

   const user = await User.findOne({ email });

   if (!user) {
      throw new ApiError(404, 'Invalid Email to reset password');
   }

   const storedToken = await redisClient.get(`forgotPassword:${email}`);

   if (storedToken !== token) {
      throw new ApiError(400, 'Invalid Token to reset password.');
   }

   const hashedPassword = await hashPassword(newPassword);

   await User.findByIdAndUpdate(
      user._id,
      {
         $set: {
            password: hashedPassword
         }
      }, { new: true }
   );
}