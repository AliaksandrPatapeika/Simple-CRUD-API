# Simple-CRUD-API
NodeJS CRUD API

## How to Run the Project

1. Clone the repository with the following command: `git clone https://github.com/AliaksandrPatapeika/Simple-CRUD-API.git`
2. Open the project directory.
3. Install all required packages by running the following command: `npm install`

   Note: Node.js is required and can be downloaded from <https://nodejs.org/en/>.
4. Use the following commands:

- `start:dev`: Runs the development version of the API using nodemon for automatic reloading on file changes.
- `start:prod`: Builds the production version by compiling TypeScript files into the `dist` folder and then runs the built files using Node.js.
- `start:multi`: Runs a multi-threaded server using the Node.js Cluster API, with load balancing to distribute requests across instances.
- `test`: Runs tests using Jest.
- `test:watch`: Runs tests in watch mode, allowing them to automatically rerun on file changes.
- `format`: Formats all TypeScript files using Prettier.
- `lint`: Lints all TypeScript files using ESLint and automatically fixes any fixable issues.

## Implementation Details

1. Implemented endpoint `api/users`:
- **GET** `api/users` is used to retrieve all user records from the database.
- **GET** `api/users/{userId}` is used to retrieve a specific user record by ID.
- **POST** `api/users` is used to create a new user record.
- **PUT** `api/users/{userId}` is used to update an existing user record.
- **DELETE** `api/users/{userId}` is used to delete a user record.
2. User records consist of the following properties:
- `id`: Unique identifier (UUID) generated on the server side.
- `username`: User's name (string, required).
- `age`: User's age (number, required).
- `hobbies`: User's hobbies (array of strings or empty array, required).
3. Requests to non-existing endpoints will be handled with a `404 Not Found` response.
4. Errors on the server side will be handled with a `500 Internal Server Error` response.
5. The `port` on which the application is running should be stored in a `.env` file.
6. There are two modes of running the application: development and production.
- Development mode: Use `npm run start:dev` to run the API with nodemon for automatic reloading during development.
- Production mode: Use `npm run start:prod` to build the production version and run the compiled files.
7. Unit tests are implemented using Jest. At least three test scenarios should be included, covering different API endpoints and error cases.
8. Horizontal scaling is implemented using the Node.js Cluster API. The `npm run start:multi` script starts multiple instances of the application, equal to the available parallelism minus one, with each instance listening on a different port. Requests are automatically load balanced across the instances.
