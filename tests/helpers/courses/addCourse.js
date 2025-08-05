import request from 'supertest';
import path from 'path';
import app from '../../../src/app.js';
import { Instructor } from '../../../src/modules/instructor/models/instructor.model.js';
import { registerAndLogin } from '../auth/registerAndLogin.js';

export const addCourse = async ({
   title = 'Microservices',
   description = 'Microservices Intro',
   category = 'programming',
   level = 'beginner',
   price = 1000,
   discount = 10,
   language = 'English',
   totalLectures = 5,
   isPublished = true,
   thumbnail = './tests/fixtures/test.image.jpg' }
   = {}) => {

   const { accessToken, refreshToken, userId } = await registerAndLogin();

   const instructor = await Instructor.create({
      user: userId,
      bio: 'Experienced backend developer',
      expertise: ['Node.js', 'MongoDB'],
   });

   const tags = ['Javascript', 'Nodejs'];

   const res = await request(app)
      .post('/api/v1/courses/')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('title', title)
      .field('description', description)
      .field('category',category )
      .field('level', level)
      .field('price', price)
      .field('discount', discount)
      .field('language', language)
      .field('totalLectures', totalLectures)
      .field('instructor', instructor._id.toString())
      .field('isPublished', isPublished)
      .field('tags', tags)
      .attach('thumbnail', path.resolve(thumbnail));

   const course = res.body.data;
   return { course };   
}