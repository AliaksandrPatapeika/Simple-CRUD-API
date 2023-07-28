import dotenv from 'dotenv';
import http, { IncomingMessage, ServerResponse } from 'http';
import { DataBase } from '../database';
import { ERROR_MESSAGES, HTTP_STATUS, UUID_V4_REGEX } from '../constants';
import { getRequestData, validateUserData } from '../utils';
import { User, UserWithoutId } from '../types';

dotenv.config();

// Create the HTTP server and handle incoming requests
const app = (database: DataBase) =>
  http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      // Handle '/api/users' endpoint
      if (req.url === '/api/users') {
        if (req.method === 'GET') {
          getAllUsers(res, database);
        } else if (req.method === 'POST') {
          await createUser(req, res, database);
        }
      }
      // Handle '/api/users/:id' endpoint
      else if (req.url?.startsWith('/api/users')) {
        if (req.url?.match(UUID_V4_REGEX)) {
          const userId = req.url.split('/')[3];
          const user = database.getUser(userId);

          if (!user) {
            handleNotFoundError(res, ERROR_MESSAGES.RECORD_NOT_FOUND(userId));
          } else {
            if (req.method === 'GET') {
              getUserById(res, database, userId);
            } else if (req.method === 'PUT') {
              await updateUserById(req, res, database, userId);
            } else if (req.method === 'DELETE') {
              deleteUserById(res, database, userId);
            }
          }
        } else {
          handleBadRequestError(res, ERROR_MESSAGES.INVALID_USER_ID);
        }
      }
      // Handle unknown routes
      else {
        handleNotFoundError(res, ERROR_MESSAGES.UNKNOWN_ROUTE);
      }
    } catch (error) {
      handleInternalServerError(
        res,
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.UNKNOWN_ERROR_MESSAGE,
      );
    }
  });

// Handle the HTTP response with the specified status and message
const handleResponse = (
  res: ServerResponse,
  status: number,
  message: string,
) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(message);
};

// Get all users from the database
const getAllUsers = (res: ServerResponse, database: DataBase) => {
  handleResponse(res, HTTP_STATUS.OK, JSON.stringify(database.users));
};

// Create a new user
const createUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  database: DataBase,
) => {
  // Retrieve request data
  const userDataRaw = await getRequestData(req);
  const userData: UserWithoutId = JSON.parse(userDataRaw);

  // Validate the user data
  const isValidData = validateUserData(userData);

  if (!isValidData) {
    handleBadRequestError(res, ERROR_MESSAGES.INVALID_REQUEST_DATA);
    return;
  }

  // Create the new user
  const newUser = database.createUser(userData);
  handleResponse(res, HTTP_STATUS.CREATED, JSON.stringify(newUser));
};

// Get a user by ID
const getUserById = (
  res: ServerResponse,
  database: DataBase,
  userId: string,
) => {
  const user = database.getUser(userId);
  handleResponse(res, HTTP_STATUS.OK, JSON.stringify(user));
};

// Update a user by ID
const updateUserById = async (
  req: IncomingMessage,
  res: ServerResponse,
  database: DataBase,
  userId: string,
) => {
  // Retrieve request data
  const userDataRaw = await getRequestData(req);
  const userData: UserWithoutId = JSON.parse(userDataRaw);

  // Validate the user data
  const isValidData = validateUserData(userData);

  if (!isValidData) {
    handleBadRequestError(res, ERROR_MESSAGES.INVALID_REQUEST_DATA);
    return;
  }

  // Update the user
  const updatedUserData: User = { id: userId, ...userData };
  const updatedUser = database.updateUser(updatedUserData);

  if (!updatedUser) {
    handleNotFoundError(res, ERROR_MESSAGES.RECORD_NOT_FOUND(userId));
    return;
  }

  handleResponse(res, HTTP_STATUS.OK, JSON.stringify(updatedUser));
};

// Delete a user by ID
const deleteUserById = (
  res: ServerResponse,
  database: DataBase,
  userId: string,
) => {
  database.deleteUser(userId);
  handleResponse(res, HTTP_STATUS.NO_CONTENT, '');
};

// Handle a bad request error
const handleBadRequestError = (res: ServerResponse, message: string) => {
  handleResponse(res, HTTP_STATUS.BAD_REQUEST, JSON.stringify({ message }));
};

// Handle a not found error
const handleNotFoundError = (res: ServerResponse, message: string) => {
  handleResponse(res, HTTP_STATUS.NOT_FOUND, JSON.stringify({ message }));
};

// Handle an internal server error
const handleInternalServerError = (res: ServerResponse, message: string) => {
  handleResponse(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    JSON.stringify({ message }),
  );
};

export { app };
