import request from 'supertest';
import path from 'path';
import app from '../../../src/app.js';


export const registerAndLogin = async ({
   email = 'john@example.com',
   password = '12345678',
   name = 'John Doe',
   role = 'instructor',
   imagePath = './tests/fixtures/test.image.jpg' }
   = {}) => {

   // register user    
   await request(app)
      .post('/api/v1/auth/register')
      .field('name', name)
      .field('email', email)
      .field('password', password)
      .field('role',role)
      .attach('image', path.resolve(imagePath));

   // login user to get token
   const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password });

   const accessToken = loginRes.body.data.accessToken;
   const refreshToken = loginRes.body.data.refreshToken;
   const userId = loginRes.body.data.userId;

   return { accessToken, refreshToken, userId }; // return token   
}