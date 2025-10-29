import Redis from 'ioredis';
import { logger } from "@skillup/common-utils";

const redis = new Redis({
  host: 'redis-15448.c82.us-east-1-2.ec2.redns.redis-cloud.com',
  port: 15448,
  username: 'default',
  password: 'a4UjzshlvRi1emtDUyDIGeDdc5cn4Q0R',
  maxRetriesPerRequest: null
});

redis.on('connect', () => {
  logger.info('✅ Connected to Redis Cloud via TLS.');
});

redis.on('error', (err) => {
  logger.error('❌ ioredis error:', err);
});


export default redis;