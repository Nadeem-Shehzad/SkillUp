import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a payment intent for an order
 */
export const createPaymentIntentService = async ({ amount, currency, orderId }) => {
   const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in smallest currency unit (e.g., cents)
      currency,
      metadata: { orderId },
   

      payment_method_types: ['card'], // only allow card in sandbox
   });

   return paymentIntent;
};