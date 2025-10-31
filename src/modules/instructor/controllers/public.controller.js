import { InstructorPublicService } from "../services/public/instructorPublic.service.js";


export const checkInstructor = async (req, res, next) => {

   try {
      const instructorId = req.params.instructorId;
      const user = await InstructorPublicService.checkInstructorExists(instructorId);

      return res.status(200).json(user);

   } catch (error) {
      next(error);
   }
}


export const InstructorData = async (req, res, next) => {

   try {
      const instructorId = req.params.instructorId;
      const user = await InstructorPublicService.getInstructorData(instructorId);

      return res.status(200).json(user);

   } catch (error) {
      next(error);
   }
}


export const updateInstructorData = async (req, res, next) => {

   try {
      const instructorId = req.params.instructorId;
      const { avgRating } = req.body;
      
      const user = await InstructorPublicService.updateInstructorRating(instructorId, avgRating);

      return res.status(200).json(user);

   } catch (error) {
      next(error);
   }
}