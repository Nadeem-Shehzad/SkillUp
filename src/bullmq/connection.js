import Redis from 'ioredis';

const connection = new Redis({
  host: 'redis-19673.c100.us-east-1-4.ec2.redns.redis-cloud.com',
  port: 19673,
  username: 'default',
  password: '0Fb87gwAZHrp4lSj4FZtnyQU4gxPE1oj',
  maxRetriesPerRequest: null
});

connection.on('connect', () => {
  console.log('✅ Connected to Redis Cloud via TLS');
});

connection.on('error', (err) => {
  console.error('❌ ioredis error:', err);
});


export default connection;