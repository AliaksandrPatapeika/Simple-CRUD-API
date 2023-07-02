import { IncomingMessage } from 'http';
import { UserWithoutId } from '../types';

/**
 * Retrieves the request data from an IncomingMessage object.
 * @param req The IncomingMessage object representing the request.
 * @returns A promise that resolves to the request data as a string.
 */
function getRequestData(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      resolve(body);
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Validates user data based on specific criteria.
 * @param user The user data to validate.
 * @returns A boolean indicating whether the user data is valid.
 */
function validateUserData({ username, age, hobbies }: UserWithoutId): boolean {
  const isUsernameValid =
    typeof username === 'string' && username.trim() !== '';
  const isAgeValid = typeof age === 'number' && !isNaN(age) && age > 0;
  const areHobbiesValid =
    Array.isArray(hobbies) &&
    hobbies.every((elem) => typeof elem === 'string' && elem.trim() !== '');

  return isUsernameValid && isAgeValid && areHobbiesValid;
}

export { getRequestData, validateUserData };
