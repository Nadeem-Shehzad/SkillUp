import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";
import logger from "../utils/logger.js";


export const ConnectMongoDB = async () => {
   try {
      const connect = await mongoose.connect(MONGO_URI);
      if (connect) {
         logger.info('✅ SkillUp-Review-Service --> DB connected.');
      }

   } catch (error) {
      logger.error('SkillUp-Review-Service --> Error while connecting DB.');
   }
}