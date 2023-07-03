import request from 'supertest';
import { app } from '../app';
import { DataBase } from '../database';
import { ERROR_MESSAGES } from '../constants';

const DB = new DataBase();
const server = app(DB);

describe('User Error Handling Tests', () => {
  const agent = request.agent(server);

  describe('Request to an unknown route', () => {
    test('should respond with status 404 and error message', async () => {
      const response = await agent.get('/some/route');

      expect(response.body.message).toEqual(ERROR_MESSAGES.UNKNOWN_ROUTE);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('Get user with invalid user ID', () => {
    test('should respond with status 400 and error message', async () => {
      const response = await agent.get('/api/users/invalid-id');

      expect(response.body.message).toEqual(ERROR_MESSAGES.INVALID_USER_ID);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Update user with invalid user ID', () => {
    test('should respond with status 400 and error message', async () => {
      const response = await agent.put('/api/users/invalid-id');

      expect(response.body.message).toEqual(ERROR_MESSAGES.INVALID_USER_ID);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Delete user with invalid user ID', () => {
    test('should respond with status 400 and error message', async () => {
      const response = await agent.del('/api/users/invalid-id');

      expect(response.body.message).toEqual(ERROR_MESSAGES.INVALID_USER_ID);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Create user without sending data', () => {
    test('should respond with status 500', async () => {
      const response = await agent.post('/api/users');

      expect(response.statusCode).toBe(500);
    });
  });
});
