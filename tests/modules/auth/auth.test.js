// File: tests/modules/auth/auth.test.js
import request from 'supertest';
import path from 'path';
import {
   describe,
   it,
   beforeAll,
   expect,
   jest,
   afterAll
} from '@jest/globals';

import { registerAndLogin } from '../../helpers/auth/registerAndLogin.js';
import { redis } from '../../../src/config/index.js';
import jwt from 'jsonwebtoken';
import User from '../../../src/modules/auth/models/auth.model.js';
import mongoose from 'mongoose';



let app;

beforeAll(async () => {
   app = (await import('../../../src/app.js')).default;
});


describe('register', () => {
   jest.setTimeout(15_000); // to allow image upload and DB interaction

   const email = 'john@example.com';

   it('should register a user successfully with an image', async () => {
      const res = await request(app)
         .post('/api/auth/register')
         .field('name', 'John Doe')
         .field('email', email)
         .field('password', '12345678')
         .attach('image', path.resolve('./tests/fixtures/test.image.jpg'));

      // Assertions
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('john@example.com');
      expect(res.body.data.image.url).toBe('https://mocked.cloudinary.com/image.jpg');
   });


   it('should fail if email is already registered', async () => {

      await request(app)
         .post('/api/auth/register')
         .field('name', 'John Doe')
         .field('email', email)
         .field('password', '12345678')
         .attach('image', path.resolve('./tests/fixtures/test.image.jpg'));

      const res = await request(app)
         .post('/api/auth/register')
         .field('name', 'John Doe')
         .field('email', email)
         .field('password', '12345678')
         .attach('image', path.resolve('./tests/fixtures/test.image.jpg'));

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email Already Registered!');
   });


   it('Should fail if name or email or password missing.', async () => {
      const res = await request(app)
         .post('/api/auth/register')
         .field('name', 'John Doe')
         .field('password', '12345678')
         .attach('image', path.resolve('./tests/fixtures/test.image.jpg'));

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email Required.');
   });
});


describe('login', () => {
   const email = 'john@example.com';
   const password = '12345678';

   it('should login user and return token', async () => {

      const { accessToken, refreshToken } = await registerAndLogin({ email, password });

      expect(typeof accessToken).toBe('string');
      expect(accessToken.length).toBeGreaterThan(10);
   });
});


describe('me', () => {
   it('should return user info when token is valid.', async () => {
      const { accessToken, refreshToken } = await registerAndLogin();

      const res = await request(app)
         .get('/api/auth/me')
         .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Current User');
      expect(res.body.data.name).toBe('John Doe');
      expect(res.body.data.email).toBe('john@example.com');
   });
});


describe('update-password', () => {
   it('Should update password.', async () => {
      const { accessToken, refreshToken } = await registerAndLogin();

      const res = await request(app)
         .put('/api/auth/change-password')
         .set('Authorization', `Bearer ${accessToken}`)
         .send({ oldPassword: '12345678', password: '112233' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Password Updated.');
   });
});


describe('update-profile', () => {
   it('Should update user profile.', async () => {
      const { accessToken, refreshToken } = await registerAndLogin();

      const res = await request(app)
         .put('/api/auth/update-profile')
         .set('Authorization', `Bearer ${accessToken}`)
         .send({ name: 'John Cena' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User Profile Updated.');
      expect(res.body.data.name).toBe('John Cena');
   });
});


describe('verify-email', () => {
   it('should send account verification email.', async () => {
      const res = await request(app)
         .post('/api/auth/verify-email')
         .send({ email: 'test@gmail.com' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('email sent!');
   });
});


describe.only('verify-otp', () => {

   const testEmail = 'test@gmail.com';
   const testCode = '123456';

   beforeAll(async () => {
      await User.deleteMany({});
      await redis.del(`verify:${testEmail}`);

      const createdUser = await User.create({
         name: 'Test User',
         email: testEmail,
         password: '123456',
         isVerified: false,
      });

      console.log('Inserted Test User:', createdUser);

      await redis.set(`verify:${testEmail}`, testCode, 'EX', 300);
   });

   afterAll(async () => {
      await redis.del(`verify:${testEmail}`);
      await User.deleteMany({});
      await mongoose.connection.close(); 
   });

   it('should verify otp', async () => {
      const res = await request(app)
         .post('/api/auth/verify-otp')
         .send({ email: testEmail, code: testCode });

      console.log('🧪 API Response:', res.body);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Email verified successfully!');
      expect(res.body.data).toBe(null);

      const updatedUser = await User.findOne({ email: testEmail });
      expect(updatedUser.isVerified).toBe(true);

      const redisKey = await redis.get(`verify:${testEmail}`);
      expect(redisKey).toBeNull();
   });

   it('should not verify otp (wrong code)', async () => {
      await redis.set(`verify:${testEmail}`, testCode, 'EX', 300);

      const res = await request(app)
         .post('/api/auth/verify-otp')
         .send({ email: testEmail, code: '000000' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
   });
});


describe('forgot-password', () => {

   it('should send email to reset password.', async () => {

      await registerAndLogin();
      const testEmail = 'john@example.com';

      const res = await request(app)
         .post('/api/auth/forgot-password')
         .send({ email: testEmail });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Please check your mail inbox. and reset your password!');
   });
});


describe('reset-password', () => {

   const token = 'rqJUQrHnXCo8TL56IH3kP5PoAhVBiHyt';
   const testEmail = 'john@example.com';
   const password = '111111';

   beforeAll(async () => {
      await redis.set(`forgotPassword:${testEmail}`, token, 'EX', 300);
   });

   afterAll(async () => {
      await redis.del(`forgotPassword:${testEmail}`);
      //await redis.quit();
   });

   it('should send email to reset password.', async () => {

      await registerAndLogin();

      const res = await request(app)
         .post(`/api/auth/reset-password?token=${token}`)
         .send({ email: testEmail, newPassword: password });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Your Password has been reset.');
   });
});


describe('logout', () => {

   let userId;
   let token;

   beforeAll(async () => {
      const { accessToken, refreshToken } = await registerAndLogin();
      token = accessToken;
      const decoded = jwt.decode(accessToken);
      userId = decoded.user.id;
      await redis.set(`rfToken:${userId}`, refreshToken, "EX", 300);
   });

   afterAll(async () => {
      await redis.del(`rfToken:${userId}`);
      //await redis.quit();
   });

   it('should logout user', async () => {

      const res = await request(app)
         .post('/api/auth/logout')
         .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User LogedOut.');

      const redisData = await redis.get(`rfToken:${userId}`);
      expect(redisData).toBeNull();
   });
});