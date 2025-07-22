import request from 'supertest';
import app from '../../src/app.js';


export const testRequest = async ({ method, route, payload }) => {
   let res;

   if (method === 'get' || method === 'delete') {
      res = await request(app)[method](route);
   } else {
      res = await request(app)[method](route).send(payload);
   }

   return res;
};


export const testPOSTRequest = async ({ route, payload, statusCode = 201, status = true, message, customChecks }) => {
   const res = await testRequest({ method: 'post', route, payload });

   expect(res.statusCode).toBe(statusCode);
   expect(res.body.success).toBe(status);
   expect(res.body.message).toBe(message);

   expect(res.body).toHaveProperty('data');

   if (customChecks) {
      customChecks(res);
   }

   return res;
}