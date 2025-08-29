import express from "express";

import { ValidateToken } from "../../../middlewares/validateToken.js";
import { checkCourseExists, checkStudentExists } from "../middlewares/external.middlewares.js";
import { checkRole } from "../../../middlewares/checkRole.js";
import { checkAlreadyOrderExists, checkOrderExists } from "../middlewares/order.middlewares.js";

import {
   createOrder,
   getMyOrders,
   getOrderById,
   cancelOrder,
   updateOrderStatus,
   getAllOrdersForAdmin,
} from "../controllers/order.controller.js";

const router = express.Router();


router.route("/").post(
      ValidateToken, 
      checkRole('student'), 
      checkStudentExists, 
      checkCourseExists,
      checkAlreadyOrderExists,
      createOrder
   ).get(
      ValidateToken,
      checkRole('student'), 
      checkStudentExists, 
      getMyOrders
   );


router.route("/:orderId").get(
   ValidateToken,
   checkRole('student'),
   checkStudentExists,
   checkOrderExists, 
   getOrderById
);


router.route("/:orderId/cancel").patch(
   ValidateToken, 
   checkRole('student'),
   checkStudentExists,
   checkOrderExists,
   cancelOrder
);

// 🔹 Admin updates order status (e.g. refund, mark failed, etc.)
router.route("/:orderId/status")
   .patch(ValidateToken, updateOrderStatus);

// 🔹 Admin can view all orders (with filters like status, date, etc.)
router.route("/admin/all")
   .get(ValidateToken, getAllOrdersForAdmin);

export default router;
