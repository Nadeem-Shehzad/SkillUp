import { ApiError, constants, logger } from "@skillup/common-utils";
import { Order } from "../model/order.model.js";
import mongoose from "mongoose";


export const checkAlreadyOrderExists = async (req, res, next) => {
   try {

      const studentId = req.studentId;
      const courseId = req.courseId;

      const orderExists = await Order.findOne({ studentId, courseId });
      if (orderExists) {
         throw new ApiError(constants.CONFLICT, 'Order Already Exists.');
      }

      next();
   } catch (error) {
      next(error);
   }
}


export const checkOrderExists = async (req, res, next) => {
   try {

      const orderId = req.params.orderId;
      if(!mongoose.Types.ObjectId.isValid(orderId)){
         throw new ApiError(constants.VALIDATION_ERROR,'Invalid OrderId!');
      }

      const orderExists = await Order.exists({ _id: orderId });
      if (!orderExists) {
         throw new ApiError(constants.NOT_FOUND, 'Order Not Found.');
      }

      next();
   } catch (error) {
      next(error);
   }
}