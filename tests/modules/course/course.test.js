
import request from 'supertest';
import path from 'path';
import {
   describe,
   it,
   beforeAll,
   expect,
   jest,
   afterAll,
   beforeEach
} from '@jest/globals';

import fs from 'fs';

import { redis } from '../../../src/config/index.js';
import { registerAndLogin } from '../../helpers/auth/registerAndLogin.js';
import { Instructor } from '../../../src/modules/instructor/models/instructor.model.js';
import { addCourse } from '../../helpers/courses/addCourse.js';
import { Course } from '../../../src/modules/course/models/course.model.js';
import { CourseContent } from '../../../src/modules/course/models/courseContent.model.js';


jest.setTimeout(60_000); // time for test

const baseUrl = '/api/v1/courses';

let app;
let addedCourses = [];
let instructorId;
let courseId;
let token;

beforeAll(async () => {
   app = (await import('../../../src/app.js')).default;
});

beforeEach(async () => {
   const { accessToken, userId } = await registerAndLogin();
   token = accessToken;

   //console.log('🔐 Token UserID from registerAndLogin:', userId);

   const instructor = await Instructor.create({
      _id: userId,
      user: userId,
      bio: 'Experienced backend developer',
      expertise: ['Node.js', 'MongoDB'],
   });

   //console.log('📚 Instructor Created with UserID:', instructor.user.toString());

   const createdCourses = await Course.create([
      { title: 'Course 1', description: 'CC', category: 'programming', price: 1000, instructor: instructor._id },
      { title: 'Course 2', description: 'CC', category: 'programming', price: 1000, instructor: instructor._id },
      { title: 'Course 3', description: 'CC', category: 'programming', price: 1000, instructor: instructor._id }
   ]);

   courseId = createdCourses[0]._id;
   instructorId = instructor._id;
});


describe('add-course', () => {

   it('should add course', async () => {
      const { accessToken, refreshToken, userId } = await registerAndLogin();

      const instructor = await Instructor.create({
         user: userId,
         bio: 'Experienced backend developer',
         expertise: ['Node.js', 'MongoDB'],
      });

      const res = await request(app)
         .post('/api/v1/courses/')
         .set('Authorization', `Bearer ${accessToken}`)
         .field('title', 'Microservices')
         .field('description', 'Microservices Intro')
         .field('category', 'programming')
         .field('level', 'beginner')
         .field('price', 1000)
         .field('discount', 10)
         .field('language', 'English')
         .field('totalLectures', 5)
         .field('instructor', instructor._id.toString())
         .field('isPublished', true)
         .field('tags', 'JavaScript')
         .field('tags', 'Node.js')
         .attach('thumbnail', path.resolve('./tests/fixtures/test.image.jpg'));

      if (res.statusCode !== 201) {
         console.error('❌ Test failed with response:', JSON.stringify(res.body, null, 2));
      }

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Microservices');
      expect(res.body.data.thumbnail.url).toBe('https://mocked.cloudinary.com/image.jpg')
   });
});


describe('GET /api/v1/courses', () => {

   it('should return all added courses', async () => {
      const res = await request(app)
         .get('/api/v1/courses?page=1&limit=2');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.meta.page).toBe(1);
   });
});


describe('GET /api/v1/courses/all-instructors', () => {

   beforeEach(async () => {
      const { userId: userId1 } = await registerAndLogin();
      const { userId: userId2 } = await registerAndLogin();

      const instructors = await Instructor.create([
         { user: userId1, bio: 'Experienced Frontend developer', expertise: ['React.js', 'Redux'], },
         { user: userId2, bio: 'Experienced backend developer', expertise: ['Node.js', 'MongoDB'], },
      ]);
   });

   it('should return all added instructors', async () => {
      const res = await request(app)
         .get(`${baseUrl}/all-instructors?page=1&limit=2`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.meta.page).toBe(1);
   });
});


describe('GET /api/v1/courses/instructor/:id', () => {

   it('should return all courses of instructor', async () => {
      const res = await request(app)
         .get(`${baseUrl}/instructor/${instructorId}?page=1&limit=2`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.meta.page).toBe(1);
   });
});


describe('POST /api/v1/courses/publish/:courseId', () => {

   it('should publish course', async () => {
      const res = await request(app)
         .post(`${baseUrl}/publish/${courseId}`)
         .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe(`Course Published.`);
   });
});


describe('POST /api/v1/courses/unpublish/:courseId', () => {

   it('should unPublish course', async () => {
      const res = await request(app)
         .post(`${baseUrl}/unpublish/${courseId}`)
         .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe(`Course unPublished.`);
   });
});


describe('PUT /api/v1/courses/:id', () => {

   it('should update course', async () => {
      const res = await request(app)
         .put(`${baseUrl}/${courseId}`)
         .set('Authorization', `Bearer ${token}`)
         .send({ title: 'Coding' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe(`Course Updated.`);
   });
});


describe('DELETE /api/v1/courses/:id', () => {

   it('should delete course', async () => {
      const res = await request(app)
         .delete(`${baseUrl}/${courseId}`)
         .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe(`Course Deleted.`);
   });
});


describe.only('POST /api/v1/courses/add-content', () => {

   it('should add content to course', async () => {
      const videoPath = path.resolve('./tests/fixtures/test.dummy.mp4');

      if (!fs.existsSync(videoPath)) {
         throw new Error('Dummy video file not found!');
      }

      const res = await request(app)
         .post(`${baseUrl}/add-content`)
         .set('Authorization', `Bearer ${token}`)
         .field('courseId', courseId.toString())
         .field('title', 'Basics')
         .field('duration', '1h')
         .attach('video', videoPath);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Course content added.');
      // expect(res.body.data.video).toEqual({
      //    id:'mocked-video-id',
      //    url: 'https://mocked.cloudinary.com/video.mp4'
      // });
   });
});


describe('GET /api/v1/courses/all-contents/:courseId', () => {

   it('should get content of course', async () => {

      // await request(app)
      //    .post(`${baseUrl}/add-content`)
      //    .set('Authorization', `Bearer ${token}`)
      //    .field('courseId', courseId.toString())
      //    .field('title', 'Basics')
      //    .field('duration', '1h');

      const res = await request(app)
         .get(`${baseUrl}/all-contents/${courseId}?page=1&limit=2`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Course Contents');
      expect(res.body.meta.page).toBe(1);
   });
});


describe('GET /api/v1/courses/content/:id', () => {

   let createdContent;
   beforeEach(async () => {
      createdContent = await CourseContent.create(
         {
            courseId,
            title: 'Course-1 content',
            duration: '1h'
         },
      );
   });

   it('should get single content of course', async () => {

      const res = await request(app)
         .get(`${baseUrl}/content/${createdContent._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Course Content');
   });
});


describe('GET /api/v1/courses/search-courses', () => {

   const title = 'Course 1';

   it('should search added course', async () => {

      const res = await request(app)
         .get(`${baseUrl}/search-courses?search=${title}&page=1&limit=2`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe(`Searched Courses.`);
      expect(res.body.meta.page).toBe(1);
   });
});


describe('GET /api/v1/courses/search-category', () => {

   const category = 'programming';

   it('should search course on category base', async () => {

      const res = await request(app)
         .get(`${baseUrl}/search-category?search=${category}&page=1&limit=2`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe(`Searched Category Course.`);
      expect(res.body.meta.page).toBe(1);
   });
});


describe('PUT /api/v1/courses/update-content/:id', () => {

   let createdContent;
   beforeEach(async () => {
      createdContent = await CourseContent.create(
         {
            courseId,
            title: 'Course-1 content',
            duration: '1h'
         },
      );
   });

   it('should update content', async () => {

      const title = 'Course-1 data';

      const res = await request(app)
         .put(`${baseUrl}/update-content/${createdContent._id}`)
         .set('Authorization', `Bearer ${token}`)
         .send({ title });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Course content updated.');
      expect(res.body.data.title).toBe(title);
   });
});