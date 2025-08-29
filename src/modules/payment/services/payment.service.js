import Stripe from 'stripe';
import { logger } from '@skillup/common-utils';

import { STRIPE_SECRET_KEY } from '../../../config/index.js';
import { OrderClientService } from './client/orderClient.service.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);



export const createPaymentIntentService = async ({ amount, currency, orderId }) => {
   const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId },
      payment_method_types: ['card'],
   });

   return paymentIntent;
};


export const handleStripeWebhookService = async (event) => {

   switch (event.type) {
      case 'payment_intent.succeeded':
         const orderId = event.data.object.metadata.orderId;
         await OrderClientService.updateOrderStatus(orderId, { status: 'completed' });
         logger.info(`✅ Order ${orderId} marked as completed`);
         break;

      case 'payment_intent.payment_failed':
         const failedOrderId = event.data.object.metadata.orderId;
         await OrderClientService.updateOrderStatus(failedOrderId, { status: 'failed' });
         logger.error(`❌ Order ${failedOrderId} marked as failed`);
         break;

      default:
         logger.warn(`Unhandled event type ${event.type}`);
   }
};