import { createPaymentIntentService } from "../payment.service.js";


export const PaymentPublicService = {
   createPaymentIntent({ amount, currency, orderId }) {
      return createPaymentIntentService({ amount, currency, orderId });
   }
}