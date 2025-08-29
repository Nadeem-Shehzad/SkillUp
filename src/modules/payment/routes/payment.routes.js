import express from 'express';
import { stripeWebhook } from '../controllers/payment.controller.js';

const router = express.Router();

export { router, stripeWebhook };