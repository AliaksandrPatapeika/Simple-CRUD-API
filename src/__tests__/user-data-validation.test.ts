import request from 'supertest';
import { app } from '../app';
import { DataBase } from '../database';
import { ERROR_MESSAGES } from '../constants';

const DB = new DataBase();
const server = app(DB);

describe('User Data Validation Tests', () => {
  const agent = request.agent(server);

  describe('POST request to api/users without username', () => {
    test('should respond with status 400 and an error message', async () => {
      const response = await agent
        .post('/api/users')
        .send({ age: 34, hobbies: [] })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual(
        ERROR_MESSAGES.INVALID_REQUEST_DATA,
      );
    });
  });

  describe('POST request to api/users without age', () => {
    test('should respond with status 400 and an error message', async () => {
      const response = await agent
        .post('/api/users')
        .send({ username: 'Alex', hobbies: [] })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual(
        ERROR_MESSAGES.INVALID_REQUEST_DATA,
      );
    });
  });

  describe('POST request to api/users without hobbies', () => {
    test('should respond with status 400 and an error message', async () => {
      const response = await agent
        .post('/api/users')
        .send({ username: 'Alex', age: 36 })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual(
        ERROR_MESSAGES.INVALID_REQUEST_DATA,
      );
    });
  });

  describe('POST request to api/users with wrong username type', () => {
    test('should respond with status 400 and an error message', async () => {
      const response = await agent
        .post('/api/users')
        .send({ username: 123, age: 36, hobbies: ['reading', 'swimming'] })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual(
        ERROR_MESSAGES.INVALID_REQUEST_DATA,
      );
    });
  });

  describe('POST request to api/users with wrong age type', () => {
    test('should respond with status 400 and an error message', async () => {
      const response = await agent
        .post('/api/users')
        .send({ username: 123, age: '36', hobbies: ['reading', 'swimming'] })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual(
        ERROR_MESSAGES.INVALID_REQUEST_DATA,
      );
    });
  });

  describe('POST request to api/users with wrong hobbies (not an Array)', () => {
    test('should respond with status 400 and an error message', async () => {
      const response = await agent
        .post('/api/users')
        .send({ username: 123, age: 36, hobbies: 'reading, swimming' })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual(
        ERROR_MESSAGES.INVALID_REQUEST_DATA,
      );
    });
  });

  describe('POST request to api/users with wrong hobbies type (not a string[])', () => {
    test('should respond with status 400 and an error message', async () => {
      const response = await agent
        .post('/api/users')
        .send({
          username: 123,
          age: 36,
          hobbies: [123456, 'reading', 'swimming'],
        })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual(
        ERROR_MESSAGES.INVALID_REQUEST_DATA,
      );
    });
  });
});
