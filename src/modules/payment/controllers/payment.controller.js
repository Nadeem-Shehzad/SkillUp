import Stripe from 'stripe';

import { handleStripeWebhookService } from '../services/payment.service.js';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '../../../config/env.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);


export const stripeWebhook = async (req, res, next) => {
   const sig = req.headers['stripe-signature'];

   try {
      const event = stripe.webhooks.constructEvent(
         req.body,
         sig,
         STRIPE_WEBHOOK_SECRET
      );

      // Handle event types
      await handleStripeWebhookService(event);

      res.json({ received: true });
   } catch (err) {
      logger.error('Webhook error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
   }
};