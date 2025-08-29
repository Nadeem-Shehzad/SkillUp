import { logger } from "@skillup/common-utils";
import { Order } from "../../model/order.model.js";


export const OrderPublicService = {
   updateOrderStatus(orderId, { status }) {
      logger.info('inside order.update');
      return Order.findByIdAndUpdate(
         orderId,
         { status },
         { new: true });
   },

   findOrderById({ orderId }) {
      return Order.findById(orderId);
   }
}