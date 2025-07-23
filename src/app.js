import express from 'express';
import { authRoutes } from './modules/auth/index.js'
import { customErrorHandler } from './middlewares/errorHandler.js';
import cors from 'cors';
import fileUpload from 'express-fileupload';

// load workers
//import './bullmq/workerLoader.js';

const app = express();

// to get temp files like images
app.use(fileUpload({
  useTempFiles: true,
  limits: { fileSize: 50 * 2024 * 1024 }
}));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(customErrorHandler);

export default app;