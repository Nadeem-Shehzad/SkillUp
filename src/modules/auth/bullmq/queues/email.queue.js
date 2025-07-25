import { Queue } from 'bullmq';
import redisConnection from '../../../../config/index.js';


export const mailQueue = new Queue('emailQueue', {
  redisConnection
});