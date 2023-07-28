import request from 'supertest';
import { app } from '../app';
import { DataBase } from '../database';
import { ERROR_MESSAGES } from '../constants';

const DB = new DataBase();
const server = app(DB);

describe('User Functionality Tests', () => {
  const agent = request.agent(server);
  const newUser = {
    username: 'Alex',
    age: 36,
    hobbies: ['reading', 'swimming'],
  };

  describe('GET request to api/users', () => {
    test('should return an empty array', async () => {
      const response = await agent.get('/api/users');
      expect(response.body).toEqual([]);
      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST request to api/users', () => {
    test('should create a new user', async () => {
      const response = await agent
        .post('/api/users')
        .send(newUser)
        .set('Accept', 'application/json');

      expect(response.body.username).toEqual(newUser.username);
      expect(response.body.age).toEqual(newUser.age);
      expect(response.body.hobbies).toEqual(newUser.hobbies);
      expect(response.statusCode).toBe(201);
    });
  });

  describe('GET request to api/users/{userId}', () => {
    test('should return the created user by its ID', async () => {
      const response = await agent
        .post('/api/users')
        .send(newUser)
        .set('Accept', 'application/json');

      const id = response.body.id;

      const getResponse = await agent.get(`/api/users/${id}`);

      expect(getResponse.body).toEqual(response.body);
      expect(getResponse.statusCode).toBe(200);
    });
  });

  describe('PUT request to api/users/{userId}', () => {
    test('should update the user with the same ID', async () => {
      const { body } = await agent
        .post('/api/users')
        .send(newUser)
        .set('Accept', 'application/json');

      const updateUser = {
        ...body,
        age: 50,
      };

      const response = await agent
        .put(`/api/users/${body.id}`)
        .send(updateUser)
        .set('Accept', 'application/json');

      expect(response.body.id).toEqual(updateUser.id);
      expect(response.body.username).toEqual(updateUser.username);
      expect(response.body.age).toEqual(updateUser.age);
      expect(response.body.hobbies).toEqual(updateUser.hobbies);
      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE request to api/users/{userId}', () => {
    test('should delete the user with the specified ID', async () => {
      const { body } = await agent
        .post('/api/users')
        .send(newUser)
        .set('Accept', 'application/json');

      const response = await agent.del(`/api/users/${body.id}`);

      expect(response.statusCode).toBe(204);
    });
  });

  describe('GET request to api/users/{userId}', () => {
    test(`should return status code 404 and error message when getting a deleted user by ID`, async () => {
      const { body } = await agent
        .post('/api/users')
        .send(newUser)
        .set('Accept', 'application/json');

      await agent.del(`/api/users/${body.id}`);

      const response = await agent.get(`/api/users/${body.id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual(
        ERROR_MESSAGES.RECORD_NOT_FOUND(body.id),
      );
    });
  });
});
