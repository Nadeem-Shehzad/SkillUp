// File: tests/modules/auth/auth.test.js
import request from 'supertest';
import path from 'path';
import { describe, it, beforeAll, expect, jest } from '@jest/globals';

import { testPOSTRequest } from '../../helpers/testRequest.js';
import { registerAndLogin } from '../../helpers/auth/registerAndLogin.js';


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

      const token = await registerAndLogin({ email, password });

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(10);
   });
});


describe('me', () => {
   it('should return user info when token is valid.', async () => {
      const token = await registerAndLogin();

      const res = await request(app)
         .get('/api/auth/me')
         .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Current User');
      expect(res.body.data.name).toBe('John Doe');
      expect(res.body.data.email).toBe('john@example.com');
   });
});


describe('update-password', () => {
   it('Should update password.', async () => {
      const token = await registerAndLogin();

      const res = await request(app)
         .put('/api/auth/change-password')
         .set('Authorization', `Bearer ${token}`)
         .send({ oldPassword: '12345678', password: '112233' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Password Updated.');
   });
});


describe.only('update-profile', () => {
   it('Should update user profile.', async () => {
      const token = await registerAndLogin();

      const res = await request(app)
         .put('/api/auth/update-profile')
         .set('Authorization', `Bearer ${token}`)
         .send({ name: 'John Cena' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User Profile Updated.');
      expect(res.body.data.name).toBe('John Cena');
   });
});