import { Express, Request, Response } from 'express';
import UserRouter from './user';

function routes(app: Express) {
  app.get('/healthcheck', (_req: Request, res: Response) => {
    res.status(200).json({
      message: 'health check ok',
    });
  });
  app.use('/', UserRouter);
}

export default routes;
