
import {
   findLoginInstructor,
   getProfile,
   updateProfile
} from "../services/instructor.service.js";


export const getInstructorProfile = async (req, res, next) => {

   try {
      const user = await getProfile(req);
      return res.status(200).json({ success: true, message: 'Instructor Profile Data.', data: user });

   } catch (error) {
      next(error);
   }
}


export const updateInstructorProfile = async (req, res, next) => {
   try {
      const user = await findLoginInstructor(req.user);
      await updateProfile(user, req);

      res.status(200).json({ success: true, message: 'Instructor Profile Updated.', data: null });

   } catch (error) {
      next(error);
   }
}
