import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";
import { logger } from "@skillup/common-utils";


export const ConnectMongoDB = async () => {
   try {
      const connect = await mongoose.connect(MONGO_URI);
      if (connect) {
         logger.info('✅ SkillUp DB connected.');
      }

   } catch (error) {
      logger.error('Error while connecting DB.');
   }
}