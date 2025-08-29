import express from "express";

import { ValidateToken } from "../../../middlewares/validateToken.js";
import { checkCourseExists, checkStudentExists } from "../middlewares/external.middlewares.js";
import { checkRole } from "../../../middlewares/checkRole.js";
import { checkAlreadyOrderExists, checkOrderExists } from "../middlewares/order.middlewares.js";

import {
   createOrder,
   getMyOrders,
   getOrderById,
   cancelOrder
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


export default router;
