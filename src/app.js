import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import { Server as SocketIOserver } from 'socket.io';
import { createServer } from 'http';

import { authRoutes } from './modules/auth/index.js';
import { instructorRoutes } from './modules/instructor/index.js';
import { studentRoutes } from './modules/student/index.js';
import { courseRoutes } from './modules/course/index.js';
import { enrollmentRoutes } from './modules/enrollment/index.js';
import { ReviewRoutes } from './modules/review/index.js';
import { adminRoute } from './modules/admin/index.js';
import { OrderRoutes } from './modules/order/index.js';
import { paymentRoutes, stripeWebhook } from './modules/payment/index.js';

import { setSocketInstance } from './socket/socketInstance.js';
import { setupSocket } from './socket/index.js'

import { globalRateLimiter } from './middlewares/rateLimiters.js';
import { customErrorHandler } from './middlewares/errorHandler.js';

// load workers
import './bullmq/workerLoader.js';


const app = express();
const server = createServer(app);


app.use(helmet());
app.use(globalRateLimiter);

// to get temp files like images
app.use(fileUpload({
  useTempFiles: true,
  limits: { fileSize: 50 * 2024 * 1024 }
}));

app.use(cors());

// Webhook needs raw body
app.post(
  '/api/v1/payment/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

const io = new SocketIOserver(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

setSocketInstance(io);
setupSocket(io);

app.use(express.json());

app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/instructors', instructorRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);
app.use('/api/v1/reviews', ReviewRoutes);
app.use('/api/v1/order', OrderRoutes);
app.use('/api/v1/payment', paymentRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(customErrorHandler);

export default server;