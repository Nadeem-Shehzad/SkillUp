import ApiError from "../../../utils/apiError.js";
import { comparePassword, hashPassword } from "../../../utils/password.js"
import User from "../models/auth.model.js";
import { constants } from "../../../constants/statusCodes.js";
import { imageUpload } from "../../../utils/image.js";
import { sendEmail } from "../../../utils/email.js";
import { redis } from "../../../config/index.js";
import randomstring from 'randomstring';
import { verifyToken } from "../../../utils/token.js";
import jwt from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRES_IN } from "../../../config/env.js";
import { Student } from "../../student/models/student.model.js";
import { Instructor } from "../../instructor/models/instructor.model.js";
import {addEmailJob} from '../jobs/addEmailJob.js'




export const createUser = async (req) => {

   let imageUploadData = { id: '', url: '' };

   const { name, email, password, role } = req.body;

   const allowedRoles = ['student', 'instructor'];
   if (!allowedRoles.includes(role)) {
      throw new ApiError(constants.FORBIDDEN, 'Invalid role to register!')
   }

   if (await User.isEmailTaken({ email })) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Email Already Registered!');
   }

   if (req.files && req.files.image) {
      console.log('inside register...');
      const imagePath = req.files.image;
      imageUploadData = await imageUpload(imagePath);
   }

   const hPassword = await hashPassword(password);
   const user = await User.create({
      name,
      email,
      password: hPassword,
      role,
      image: imageUploadData
   });

   if (user.role === 'student') {
      await Student.create({ user: user._id });
   }

   if (user.role === 'instructor') {
      await Instructor.create({ user: user._id });
   }

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


export const verifyUserEmail = async (reqBody) => {
   const { email } = reqBody;
   const code = Math.floor(100000 + Math.random() * 900000).toString();

   //use this if want to send email by BullMQ service 
   await addEmailJob({
      to: email,
      subject: 'Verify your SkillUp account',
      data: `<h3>Your verification code is: <b>${code}</b></h3>`, // Or use template
   });

   // await sendEmail({
   //    to: email,
   //    subject: 'Verify your SkillUp account',
   //    data: `<h3>Your verification code is: <b>${code}</b></h3>`
   // });

   await redis.setex(`verify:${email}`, 600, code);
}


export const verifyUserEmailOTP = async (reqBody) => {

   const { email, code } = reqBody;

   const storedCode = await redis.get(`verify:${email}`);

   if (!storedCode) {
      throw new ApiError(400, 'Code expired or not found');
   }

   if (code !== storedCode) {
      throw new ApiError(400, 'Invalid verification code');
   }

   const user = await User.findOne({ email });
   if (!user) {
      throw new ApiError(404, 'User not Found!');
   }

   user.isVerified = true;
   await user.save();

   await redis.del(`verify:${email}`);
}


export const handleRefreshToken = async (req) => {
   const token = req.cookies.refreshToken;

   if (!token) {
      throw new ApiError(constants.UNAUTHORIZED, 'No Refresh Token');
   }

   const decoded = verifyToken(token);
   const userId = decoded.user.id;

   const storedRFToken = await redis.get(`rfToken:${userId}`);
   if (!storedRFToken !== token) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid refresh Token');
   }

   const accessToken = jwt.sign({
      user: decoded.user
   }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

   return accessToken;
}


export const handleLogout = async (req) => {
   const userId = req.user.id;
   const deletedCount = await redis.del(`rfToken:${userId}`);

   return deletedCount === 1;
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

   await redis.set(`forgotPassword:${email}`, ranString);
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

   const storedToken = await redis.get(`forgotPassword:${email}`);

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