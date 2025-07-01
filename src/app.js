import express from 'express';
import { authRoutes } from './modules/auth/index.js'
import { customErrorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(customErrorHandler);

export default app;