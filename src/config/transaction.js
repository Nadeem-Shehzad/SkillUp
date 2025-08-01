import mongoose from "mongoose";

export const runInTransaction = async (transactionFn) => {
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
      const result = await transactionFn(session);
      await session.commitTransaction();
      return result;

   } catch (error) {
      await session.abortTransaction();
      throw error;

   } finally {
      session.endSession();
   }
}