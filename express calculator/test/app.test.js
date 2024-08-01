
const request = require('supertest');
const app = require('../app');

describe('GET /mean', () => {
   it('should return the mean of the numbers', async () => {
       const response = await request(app).get('/mean?nums=1,2,3,4,5');
       expect(response.statusCode).toBe(200);
       expect(response.body).toEqual({ operation: 'mean', value: 3 });
   });

   it('should return an error for invalid numbers', async () => {
       const response = await request(app).get('/mean?nums=1,foo,3');
       expect(response.statusCode).toBe(400);
       expect(response.body).toEqual({ error: 'foo is not a number' });
   });

   it('should return an error for missing numbers', async () => {
       const response = await request(app).get('/mean');
       expect(response.statusCode).toBe(400);
       expect(response.body).toEqual({ error: 'nums are required' });
   });
});

describe('GET /median', () => {
   it('should return the median of the numbers', async () => {
       const response = await request(app).get('/median?nums=1,2,3,4,5');
       expect(response.statusCode).toBe(200);
       expect(response.body).toEqual({ operation: 'median', value: 3 });
   });
});

describe('GET /mode', () => {
   it('should return the mode of the numbers', async () => {
       const response = await request(app).get('/mode?nums=1,2,2,3,4,5');
       expect(response.statusCode).toBe(200);
       expect(response.body).toEqual({ operation: 'mode', value: [2] });
   });
});

describe('GET /all', () => {
   it('should return the mean, median, and mode of the numbers', async () => {
       const response = await request(app).get('/all?nums=1,2,3,4,5');
       expect(response.statusCode).toBe(200);
       expect(response.body).toEqual({ operation: 'all', mean: 3, median: 3, mode: [1, 2, 3, 4, 5] });
   });
});
