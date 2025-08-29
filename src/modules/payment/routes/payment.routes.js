import express from 'express';
import { createPaymentIntent, stripeWebhook } from '../controllers/payment.controller.js';

const router = express.Router();

// JSON-based route
router.post('/create-intent', createPaymentIntent);

// Export separately for raw body mount
export { router, stripeWebhook };