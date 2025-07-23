import { Queue } from 'bullmq';
import connection from '../../../../bullmq/connection.js';

export const welcomeEmailQueue = new Queue('emailQueue', {
  connection
});