import { Queue } from 'bullmq';
import { redis } from '../../../../config/index.js';


export const mailQueue = new Queue('emailQueue', {
  connection: redis
});