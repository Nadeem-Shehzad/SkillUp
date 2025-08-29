import { Order } from "../model/order.model.js";
import { ApiError, constants, logger } from "@skillup/common-utils";
import { CourseClientService } from "./client/courseClient.service.js";
import { StudentClientService } from "./client/studentClient.service.js";



export const createOrderService = async (studentId, courseId, currency, metadata = {}) => {

   if (!currency) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Currency Data.');
   }

   const course = await CourseClientService.checkCourse({ courseId });

   const order = await Order.create({
      studentId,
      courseId,
      amount: course.price,
      discount: course.discount,
      currency,
      metadata,
      status: "pending",
   });
   return order;
};


export const getMyOrdersService = async (studentId) => {
   const orders = await Order.find({ studentId }).sort({ createdAt: -1 }).lean();

   const result = await Promise.all(
      orders.map(async (order) => {
         const courseId = order.courseId;
         const course = await CourseClientService.checkCourse({ courseId });

         const studentId = order.studentId;
         const student = await StudentClientService.getStudentUserData({ studentId });

         return {
            studentName: student.user.name,
            courseName: course.title,
            ...order
         }
      })
   );


   return result;
};


export const getOrderByIdService = async (orderId) => {
   const order = await Order.findById(orderId).lean();

   const courseId = order.courseId;
   const course = await CourseClientService.checkCourse({ courseId });

   const studentId = order.studentId;
   const student = await StudentClientService.getStudentUserData({ studentId });

   return {
      studentName: student.user.name,
      courseName: course.title,
      ...order
   }
};


export const cancelOrderService = async (orderId, studentId) => {

   const order = await Order.findOne({ _id: orderId, studentId });
   if (order.status !== "pending") {
      throw new ApiError(constants.FORBIDDEN, "Only pending orders can be cancelled");
   }

   order.status = "cancelled";
   await order.save();
   return order;
};



// 🔹 Admin updates order status
export const updateOrderStatusService = async (orderId, status) => {
   const order = await Order.findById(orderId);

   if (!order) throw new Error("Order not found");

   order.status = status;
   await order.save();
   return order;
};

// 🔹 Admin: Get all orders (with optional filters later)
export const getAllOrdersForAdminService = async () => {
   return await Order.find().sort({ createdAt: -1 });
};