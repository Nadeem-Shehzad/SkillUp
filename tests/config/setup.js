// tests/setup.js
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Load .env.test
dotenv.config({ path: '.env.test' });

let mongo;

// Start in-memory MongoDB before tests run
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();

  // ✅ Set MONGO_URI before anything else
  process.env.MONGO_URI = mongo.getUri();

  // ✅ Connect mongoose yourself so your app doesn't throw
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean database between tests
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Disconnect after all tests
afterAll(async () => {
  if (mongo) await mongo.stop();
  await mongoose.connection.close();
});

// 🔁 Cloudinary mock globally
jest.unstable_mockModule('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: 'https://mocked.cloudinary.com/image.jpg',
      }),
    },
  },
}));