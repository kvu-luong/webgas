import express, { Express, Request, Response, RequestHandler } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';

const app: Express = express();

// Initial middleware
app.use(morgan('combined'));
app.use(helmet());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  })
);
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000, // over 100kb will be compress
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
      }

      // fallback to standard filter function
      return compression.filter(req, res);
    },
  }) as RequestHandler
);

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 5000;

import { connectDB } from '@utils/dbConnect';
import { logger } from '@utils/logger';
import routes from './routers';

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
  });
};

export { startServer };

function next() {
  throw new Error('Function not implemented.');
}
