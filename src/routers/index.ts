import { Express, NextFunction, Request, Response } from 'express';
import configs from '@typeConfig/index';
import UserRouter from './user.index';
import AccessRouter from './access.index';
import ProductRouter from './product.index';
import CommentRouter from './comment.index';
import { CustomError } from '@declareTypes/error';
import { Errors } from '@utils/error';

function routes(app: Express) {
  app.get('/healthcheck', (_req: Request, res: Response) => {
    res.status(200).json({
      message: 'health check ok',
    });
  });

  app.use(configs.commonConfig.app.apiVersionRoute + '/user', UserRouter);
  app.use(configs.commonConfig.app.apiVersionRoute + '/product', ProductRouter);
  app.use(configs.commonConfig.app.apiVersionRoute + '/shop', AccessRouter);
  app.use(configs.commonConfig.app.apiVersionRoute + '/comment', CommentRouter);
  // Handle 404
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    const { statusCode, message } = Errors.NOT_FOUND;
    const error: CustomError = new Error(message);
    error.statusCode = statusCode;
    next(error);
  });

  // Handle an unexpected error & listen to custom throw error message
  app.use((error: CustomError, _req: Request, res: Response) => {
    const { statusCode: defaultStatusCode, message } = Errors.INTERNAL_SERVER_ERROR;
    const statusCode = error.statusCode || defaultStatusCode;
    return res.status(statusCode).json({
      statusCode,
      message: error.message || message,
    });
  });
}

export default routes;
