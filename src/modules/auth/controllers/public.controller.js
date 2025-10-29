import { logger } from "@skillup/common-utils";
import { AuthPublicService } from "../services/public/authPublic.service.js";


export const getUserInfo = async (req, res, next) => {
   try {
      logger.warn(`--- Inside AuthPublicController ---`);

      const userId = req.params.userId;
      const user = await AuthPublicService.getUserInfo(userId);

      res.status(200).json({ user });
   } catch (error) {
      next(error);
   }
}