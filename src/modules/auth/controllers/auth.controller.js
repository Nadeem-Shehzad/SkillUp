import { generateToken } from "../../../utils/token.js";
import { createUser, findLoginUser, updateUserProfile, updatePassword, validateUser } from "../services/auth.services.js";


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
      const updatedUser = await updateUserProfile(user, req.body);

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