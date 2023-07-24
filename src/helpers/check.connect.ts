import { logger } from '@utils/logger';
import mongoose from 'mongoose';
import os from 'os';
import process from 'process';

const _5_SECONDS = 5000;
const NUMBER_CONNECTION_CONCURRENT = 5;

export const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections::${numConnection}`);
};

export const checkDBConnectOverLoad = () => {
  setInterval(() => {
    console.log(os.hostname());
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const heapMemoryUsage = process.memoryUsage().heapUsed;
    const heapMemoryTotalUsage = process.memoryUsage().heapTotal;

    const maxConnections = numCores * NUMBER_CONNECTION_CONCURRENT;

    console.log(`Active connections::${numConnection}`);
    console.log(`Memory usage::${memoryUsage / 1024 / 1024} MB`);
    console.log(`Total heap memory::${heapMemoryTotalUsage / 1024} KB`);
    console.log(`Heap memory usage::${heapMemoryUsage / 1024} KB`);

    if (numConnection > maxConnections) {
      logger.warn(`Connection overload detected`);
      // Todo: notify
    }
  }, _5_SECONDS);
};
