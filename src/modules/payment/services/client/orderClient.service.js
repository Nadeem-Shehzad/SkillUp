import { OrderPublicService } from "../../../order/index.js";


export const OrderClientService = {
   updateOrderStatus(orderId, { status }) {
      return OrderPublicService.updateOrderStatus(orderId, { status });
   },

   findOrderById({ orderId }) {
      return OrderClientService.findOrderById({ orderId });
   }
}