import { Express, NextFunction, Request, Response } from 'express';
import configs from '@typeConfig/index';
import UserRouter from './user.index';
import AccessRouter from './access.index';
import { CustomError } from '@declareTypes/error';

function routes(app: Express) {
  app.get('/healthcheck', (_req: Request, res: Response) => {
    res.status(200).json({
      message: 'health check ok',
    });
  });

  app.use(configs.commomConfig.app.apiVersionRoute, UserRouter);
  app.use(configs.commomConfig.app.apiVersionRoute, AccessRouter);

  // Handle 404
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    const error: CustomError = new Error('Not Found');
    error.status = 404;
    next(error);
  });

  // Handle an unexpected error & listen to custom throw error message
  app.use((error: CustomError, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      statusCode,
      message: error.message || 'Internal Server Error',
    });
  });
}

export default routes;
