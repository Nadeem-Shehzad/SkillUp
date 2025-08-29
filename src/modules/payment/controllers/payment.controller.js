import { createPaymentIntentService } from '../services/payment.service.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { ApiError, constants, logger } from '@skillup/common-utils';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import { Order } from '../../order/model/order.model.js';

/**
 * Create a PaymentIntent for an order
 */
export const createPaymentIntent = async (req, res, next) => {
   try {
      const { orderId } = req.body;

      if (!orderId) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Order ID required');
      }

      const order = await Order.findById(orderId);
      if (!order) {
         throw new ApiError(constants.NOT_FOUND, 'Order not found');
      }

      // amount in cents (Stripe requires smallest currency unit)
      const amount = Math.round(order.amount * 100);

      const paymentIntent = await createPaymentIntentService({
         amount,
         currency: order.currency || 'usd',
         orderId
      });

      res.status(200).json({
         clientSecret: paymentIntent.client_secret
      });
   } catch (error) {
      next(error);
   }
};

/**
 * Stripe webhook handler
 */


export const stripeWebhook = async (req, res, next) => {
   const sig = req.headers['stripe-signature'];

   try {
      const event = stripe.webhooks.constructEvent(
         req.body,
         sig,
         process.env.STRIPE_WEBHOOK_SECRET
      );

      // Handle event types
      if (event.type === 'payment_intent.succeeded') {
         const paymentIntent = event.data.object;
         const orderId = paymentIntent.metadata.orderId;

         await Order.findByIdAndUpdate(orderId, { status: 'completed' });
         logger.info(`✅ Order ${orderId} marked as completed`);
      }

      res.json({ received: true });
   } catch (err) {
      logger.error('Webhook error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
   }
};