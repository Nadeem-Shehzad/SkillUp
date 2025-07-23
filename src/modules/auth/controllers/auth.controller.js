import { generateToken } from "../../../utils/token.js";
import {
   createUser,
   findLoginUser,
   updateUserProfile,
   updatePassword,
   validateUser,
   verifyUserEmail,
   verifyUserEmailOTP,
   forgot_Password,
   reset_Password
} from "../services/auth.services.js";


export const register = async (req, res, next) => {
   try {
      const user = await createUser(req);
      res.status(201).json({ success: true, message: 'User registered.', data: user });

   } catch (error) {
      next(error);
   }
}


export const login = async (req, res, next) => {
   try {
      const user = await validateUser(req.body);
      const token = generateToken(user);
      res.status(200).json({ success: true, message: 'User LogedIn.', data: token });

   } catch (error) {
      next(error);
   }
}


export const me = async (req, res, next) => {
   try {
      const user = await findLoginUser(req.user);

      res.status(200).json({ success: true, message: 'Current User', data: user });

   } catch (error) {
      next(error);
   }
}


export const updateProfile = async (req, res, next) => {
   try {
      const user = await findLoginUser(req.user);
      const updatedUser = await updateUserProfile(user, req);

      res.status(200).json({ success: true, message: 'User Profile Updated.', data: updatedUser });

   } catch (error) {
      next(error);
   }
}


export const changePassword = async (req, res, next) => {
   try {
      const user = await findLoginUser(req.user);
      const updatedUser = await updatePassword(user, req.body);

      res.status(200).json({ success: true, message: 'Password Updated.', data: updatedUser });

   } catch (error) {
      next(error);
   }
}


export const verifyEmail = async (req, res, next) => {
   try {
      await verifyUserEmail(req.body);
      res.status(200).json({ success: true, message: 'email sent!', data: null });
   } catch (error) {
      next(error);
   }
}


export const verifyOTP = async (req, res, next) => {
   try {
      await verifyUserEmailOTP(req.body);
      res.status(200).json({ success: true, message: 'Email verified successfully!', data: null });
   } catch (error) {
      next(error);
   }
}


export const forgotPassword = async (req, res, next) => {
   try {
      await forgot_Password(req.body);
      res.status(200).json({ success: true, message: 'Please check your mail inbox. and reset your password!', data: null });
   } catch (error) {
      next(error);
   }
}


export const resetPassword = async (req, res, next) => {
   try {
      await reset_Password(req);
      res.status(200).json({ success: true, message: 'Your Password has been reset.', data: null });
   } catch (error) {
      next(error);
   }
}