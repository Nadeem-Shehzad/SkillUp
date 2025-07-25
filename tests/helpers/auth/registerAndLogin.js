import request from 'supertest';
import path from 'path';
import app from '../../../src/app.js';


export const registerAndLogin = async ({
   email = 'john@example.com',
   password = '12345678',
   name = 'John Doe',
   imagePath = './tests/fixtures/test.image.jpg' }
   = {}) => {

   // register user    
   await request(app)
      .post('/api/auth/register')
      .field('name', name)
      .field('email', email)
      .field('password', password)
      .attach('image', path.resolve(imagePath));

   // login user to get token
   const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

   const accessToken = loginRes.body.data.accessToken;
   const refreshToken = loginRes.body.data.refreshToken;

   return { accessToken, refreshToken }; // return token   
}