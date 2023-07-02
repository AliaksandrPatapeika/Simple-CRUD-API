import { app } from './app';
import { DataBase } from './database';

const database = new DataBase();
const PORT = process.env.PORT || 4000;
const server = app(database);

server
  .listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
  })
  .on('error', (error: Error) => {
    console.error(`Server failed to start: ${error.message}`);
  });

const closeServer = () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);
