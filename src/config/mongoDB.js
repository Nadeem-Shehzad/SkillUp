import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";


export const ConnectMongoDB = async () => {
   try {
      const connect = await mongoose.connect(MONGO_URI);
      if (connect) {
         console.log('SkillUp DB connected.')
      }

   } catch (error) {
      console.log('Error while connecting DB.');
   }
}