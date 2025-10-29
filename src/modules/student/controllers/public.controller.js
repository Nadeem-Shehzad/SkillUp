import { logger } from "@skillup/common-utils";
import { StudentPublicService } from "../services/public/studentPublic.service.js";


export const checkStudentExists = async (req, res, next) => {

   try {
      const studentId = req.params.studentId;
      const user = await StudentPublicService.studentExists(studentId);

      logger.warn(`User --> ${user}`);

      return res.status(200).json(user);

   } catch (error) {
      next(error);
   }
}
