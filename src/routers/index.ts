import { Express, Request, Response } from 'express';
import configs from '@typeConfig/index';
import UserRouter from './user';
import AccessRouter from './access';

function routes(app: Express) {
  app.get('/healthcheck', (_req: Request, res: Response) => {
    res.status(200).json({
      message: 'health check ok',
    });
  });

  app.use(configs.commomConfig.app.apiVersionRoute, UserRouter);
  app.use(configs.commomConfig.app.apiVersionRoute, AccessRouter);
}

export default routes;
