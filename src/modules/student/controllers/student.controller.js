import { findLoginUser, getStudentProfile, updateUserProfile } from "../services/student.services.js";


export const getProfile = async (req, res, next) => {

    try {
        const user = await getStudentProfile(req);
        return res.status(200).json({ success: true, message: 'User Profile Data.', data: user });

    } catch (error) {
        next(error);
    }
}


export const updateProfile = async (req, res, next) => {
   try {
      const user = await findLoginUser(req.user);
      await updateUserProfile(user, req);
      
      res.status(200).json({ success: true, message: 'User Profile Updated.', data: null });

   } catch (error) {
      next(error);
   }
}


export const addCourseToBookmark = async (req, res, next) => {
   try {
      const user = await findLoginUser(req.user);
      await updateUserProfile(user, req);
      
      res.status(200).json({ success: true, message: 'User Profile Updated.', data: null });

   } catch (error) {
      next(error);
   }
}