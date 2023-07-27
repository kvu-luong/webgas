import express, { Express, RequestHandler } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';

import { dbConnect } from '@utils/dbConnect';
import routes from './routers';
import { apiKeyMiddleware, permissionMiddleware } from '@auth/checkAuth';

const app: Express = express();

// Initial middleware
app.use(morgan('combined'));
app.use(helmet());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  }),
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
  }) as RequestHandler,
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(apiKeyMiddleware);
app.use(permissionMiddleware('normal'));

//Routers
routes(app);

// DB
dbConnect;

export { app };
