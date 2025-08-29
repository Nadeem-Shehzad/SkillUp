import {
   createOrderService,
   getMyOrdersService,
   getOrderByIdService,
   cancelOrderService,
   updateOrderStatusService,
   getAllOrdersForAdminService,
} from "../services/order.service.js";


export const createOrder = async (req, res, next) => {
   try {
      const { courseId, currency, metadata } = req.body;
      const studentId = req.studentId;

      const order = await createOrderService(studentId, courseId, currency, metadata);
      res.status(201).json({ success: true, message: 'Order Placed.', data: order });
   } catch (error) {
      next(error);
   }
};


export const getMyOrders = async (req, res, next) => {
   try {
      const studentId = req.studentId;
      const orders = await getMyOrdersService(studentId);
      res.status(200).json({ success: true, message: 'All Orders.', data: orders });
   } catch (error) {
      next(error);
   }
};


export const getOrderById = async (req, res, next) => {
   try {
      const orderId = req.params.orderId;
      const order = await getOrderByIdService(orderId);
      res.status(200).json({ success: true, message: 'Order Details', data: order });
   } catch (error) {
      next(error);
   }
};


export const cancelOrder = async (req, res, next) => {
   try {
      const { orderId } = req.params;
      const studentId = req.studentId;

      const order = await cancelOrderService(orderId, studentId);
      res.status(200).json({ success: true, message: 'Order Cancelled.', data: order });
   } catch (error) {
      next(error);
   }
};

// 🔹 Admin Update Status
export const updateOrderStatus = async (req, res, next) => {
   try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await updateOrderStatusService(orderId, status);
      res.status(200).json({ success: true, data: order });
   } catch (error) {
      next(error);
   }
};

// 🔹 Admin Get All Orders
export const getAllOrdersForAdmin = async (req, res, next) => {
   try {
      const orders = await getAllOrdersForAdminService();
      res.status(200).json({ success: true, data: orders });
   } catch (error) {
      next(error);
   }
};
