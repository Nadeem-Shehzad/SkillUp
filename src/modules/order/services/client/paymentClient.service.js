import { PaymentPublicService } from "../../../payment/index.js";


export const PaymentClientService = {
   getPaymentIntentData({ amount, currency, orderId }) {
      return PaymentPublicService.createPaymentIntent({ amount, currency, orderId });
   }
}