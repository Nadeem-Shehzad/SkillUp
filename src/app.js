import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';

import { globalRateLimiter } from './middlewares/rateLimiters.js';
import { authRoutes } from './modules/auth/index.js';
import { instructorRoutes } from './modules/instructor/index.js';
import { studentRoutes } from './modules/student/index.js';
import { courseRoutes } from './modules/course/index.js';

import { customErrorHandler } from './middlewares/errorHandler.js';

// load workers
//import './bullmq/workerLoader.js';

const app = express();

app.use(helmet());
app.use(globalRateLimiter);

// to get temp files like images
app.use(fileUpload({
  useTempFiles: true,
  limits: { fileSize: 50 * 2024 * 1024 }
}));

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/instructors', instructorRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/courses', courseRoutes);

app.use(customErrorHandler);

export default app;