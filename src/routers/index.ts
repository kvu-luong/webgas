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
  // check apikey: right version or partner

  // check permission: which package there use : normal, vip, super star.

  app.use(configs.commomConfig.app.apiVersionRoute, UserRouter);
  app.use(configs.commomConfig.app.apiVersionRoute, AccessRouter);
}

export default routes;
