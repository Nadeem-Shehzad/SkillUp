import Redis from 'ioredis';
import { logger } from "@skillup/common-utils";

const redis = new Redis({
  host: 'redis-19673.c100.us-east-1-4.ec2.redns.redis-cloud.com',
  port: 19673,
  username: 'default',
  password: '0Fb87gwAZHrp4lSj4FZtnyQU4gxPE1oj',
  maxRetriesPerRequest: null
});

redis.on('connect', () => {
  logger.info('✅ Connected to Redis Cloud via TLS.');
});

redis.on('error', (err) => {
  logger.error('❌ ioredis error:', err);
});


export default redis;