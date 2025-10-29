import express from 'express';
import dotenv from 'dotenv';
import { ConnectMongoDB } from './config/mongoDB.js';
import reviewRoutes from './modules/review/routes/review.routes.js';
import logger from './utils/logger.js';


dotenv.config();
const app = express();
app.use(express.json());

ConnectMongoDB();

app.use('/api/v1/reviews', reviewRoutes);

const PORT = process.env.PORT || 8105;

app.listen(PORT, () => {
   logger.info(`✅ Review-Service --> Server Running on PORT ::: ${PORT}`);
});