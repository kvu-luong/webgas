import express, { Express } from 'express';
const app: Express = express();

const PORT: number =  process.env.PORT ? Number(process.env.PORT) : 5000;

import { connectDB } from '@utils/dbConnect';
import { logger } from '@utils/logger';
import routes from "./routers"


//Routers
routes(app);

const startServer = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    app.listen(PORT, async () => {
      logger.info(`App is running at PORT: ${PORT}`);
      
      // DB
      await connectDB();
      
      resolve();
    });
  })
}

export { startServer };