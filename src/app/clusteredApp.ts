import cluster, { Worker } from 'cluster';
import { app } from './app';
import { cpus } from 'os';
import { DataBase } from '../database';
import { IncomingMessage } from 'http';
import { Socket } from 'net';

const PORT = process.env.PORT || 4000;

// Determine the available parallelism (number of CPU cores - 1)
const availableParallelism: number = cpus().length - 1;

// Function to create a worker process
const createWorker = (): Worker => {
  const worker: Worker = cluster.fork();

  // Handle restart message from the worker process
  worker.on('message', (message: string) => {
    if (message === 'restart') {
      console.log(`Worker process ${worker.process.pid} restarted`);
      createWorker();
    }
  });

  return worker;
};

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  const workers: Worker[] = [];
  for (let i = 0; i < availableParallelism; i++) {
    workers.push(createWorker());
  }

  let nextWorkerIndex = 0;

  const balancer = app(new DataBase());

  // Start the load balancer
  balancer.listen(PORT, () => {
    console.log(`Load balancer listening on port ${PORT}`);
  });

  // Handle incoming requests and distribute them among workers using round-robin algorithm
  balancer.on('request', (req) => {
    const worker: Worker = workers[nextWorkerIndex];
    const { method, url, headers } = req;

    // Serialize the necessary request data
    const serializedReq = JSON.stringify({ method, url, headers });

    worker.send(serializedReq);
    nextWorkerIndex = (nextWorkerIndex + 1) % workers.length;
  });

  // Handle exit event for worker processes
  cluster.on('exit', (worker: Worker, code: number, signal: string) => {
    console.log(
      `Worker process ${worker.process.pid} has exited with code ${code} and signal ${signal}`,
    );
  });
} else {
  const workerApp = app(new DataBase());

  workerApp.on('request', (serializedReq: string | IncomingMessage) => {
    let req: IncomingMessage;

    if (typeof serializedReq === 'string') {
      try {
        // Deserialize the necessary request data from the JSON string
        const { method, url, headers } = JSON.parse(serializedReq);
        req = new IncomingMessage(new Socket());
        req.method = method;
        req.url = url;
        req.headers = headers;
      } catch (error) {
        console.error('Error parsing serialized request:', error);
        return;
      }
    } else {
      req = serializedReq;
    }

    workerApp.emit('message', req);
  });

  process.on('message', (message: string) => {
    if (message === 'restart') {
      // Close the worker app and exit the process on restart message
      workerApp.close(() => {
        process.exit(0);
      });
    }
  });

  const portNumber = +PORT + (cluster.worker?.id || 0);

  // Start the worker app on a specific port
  workerApp.listen(portNumber, () => {
    console.log(`Worker process ${process.pid} started on port ${portNumber}`);
  });
}
