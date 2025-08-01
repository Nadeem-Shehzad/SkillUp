import { Queue, Worker } from 'bullmq';
import redis from './redis.js'; // your redis connection


export const createQueue = (queueName) => {
   return new Queue(queueName, {
      connection: redis
   });
};


export const createWorker = (queueName, processor) => {
   return new Worker(queueName, processor, {
      connection: redis
   });
};