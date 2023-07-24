import express, { Express, RequestHandler } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';

import { dbConnect } from '@utils/dbConnect';
import { logger } from '@utils/logger';
import { checkDBConnectOverLoad } from '@helpers/check.connect';
import routes from './routers';
import config from '@typeConfig/index';

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

//Routers
routes(app);

// DB
dbConnect;
checkDBConnectOverLoad();

// Setup server
const PORT: number = config.app.port;
const startServer = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    app.listen(PORT, async () => {
      logger.info(`App is running at PORT: ${PORT}`);

      resolve();
    });
  });
};

export { startServer };
