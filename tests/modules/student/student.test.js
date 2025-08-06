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

import { registerAndLogin } from '../../helpers/auth/registerAndLogin.js';
import { Course } from '../../../src/modules/course/models/course.model.js';
import { Student } from '../../../src/modules/student/models/student.model.js';
import { addCourses } from '../../helpers/courses/addCourses.js';
import { createInstructor } from '../../helpers/instructor/helper.instructor.js';
import { createStudent } from '../../helpers/students/helper.student.js';
import { Instructor } from '../../../src/modules/instructor/models/instructor.model.js';
import User from '../../../src/modules/auth/models/auth.model.js';


jest.setTimeout(80_000); // time: seconds for test

const baseUrl = '/api/v1/students';

let app;

let studentId;
let courseId;
let token;

beforeAll(async () => {
   app = (await import('../../../src/app.js')).default;
});

beforeEach(async () => {

   await User.deleteMany({});
   await Student.deleteMany({});
   await Instructor.deleteMany({});
   await Course.deleteMany({});


   const { userId: instID } = await registerAndLogin();
   const instructor = await createInstructor({ instID });
   const instructorId = instructor._id;

   const courses = await addCourses({ instructorId });
   courseId = courses[0]._id;

   const { accessToken, userId: stdID } = await registerAndLogin({ email: 'johnCena@example.com', role: 'student' });
   const student = await createStudent({ stdID });

   token = accessToken;
   studentId = student._id;
});


describe('POST /api/v1/students/bookmarks/:courseId', () => {
   it('should add course to bookmarks', async () => {
      const res = await request(app)
         .post(`${baseUrl}/bookmarks/${courseId}`)
         .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Course added to Bookmark.');
      expect(res.body.data.length).toBe(1);
   });
});


describe.only('GET /api/v1/students/bookmarks', () => {
   it('should get student bookmarks', async () => {

      await request(app)
         .post(`${baseUrl}/bookmarks/${courseId}`)
         .set('Authorization', `Bearer ${token}`);

      const res = await request(app)
         .get(`${baseUrl}/bookmarks`)
         .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('All Bookmark.');
      expect(res.body.data.bookmarks.length).toBe(1);
   });
});