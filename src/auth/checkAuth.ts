import { findApiKeyById } from '@services/apiKey';
import { NextFunction, Response } from 'express';
import configs from '@typeConfig/index';
import { Errors } from '@utils/error';
import { ForbiddenError, InternalError, PermissionDeniedError } from '@core/error.response';
import { CustomRequest } from 'global';

export const apiKeyMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = req.headers[configs.header.API_KEY]?.toString();
    if (!key) {
      new ForbiddenError(Errors.FORBIDDEN.message).send(res);
      return;
    }

    const objKey = await findApiKeyById(key);
    if (!objKey) {
      new ForbiddenError(Errors.FORBIDDEN.message).send(res);
      return;
    }

    req.objKey = objKey;
    next();
  } catch (error) {
    new InternalError(Errors.INTERNAL_SERVER_ERROR.message);
    return;
  }
};

export const permissionMiddleware = (
  permission: string
): ((req: CustomRequest, res: Response, next: NextFunction) => void) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req?.objKey) {
      return new PermissionDeniedError(Errors.PERMISSION_DENIED.message).send(res);
    }

    console.log('permission::', req?.objKey?.permissions);
    const validPermission = req?.objKey?.permissions.includes(permission);
    if (!validPermission) {
      return new PermissionDeniedError(Errors.PERMISSION_DENIED.message).send(res);
    }

    next();
  };
};
