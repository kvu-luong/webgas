import statusCode from './statusCode';

export const Errors = {
  NOT_FOUND: {
    message: 'NOT_FOUND',
    statusCode: statusCode.NOT_FOUND,
  },
  INVALID_ROLE: {
    message: 'INVALID_ROLE',
    statusCode: statusCode.FORBIDDEN,
  },
  FORBIDDEN: {
    message: 'FORBIDDEN',
    statusCode: statusCode.FORBIDDEN,
  },
  PERMISSION_DENIED: {
    message: 'PERMISSION_DENIED',
    statusCode: statusCode.UNAUTHORIZED,
  },
  INVALID_CREDENTIAL: {
    message: 'INVALID_CREDENTIAL',
    statusCode: statusCode.BAD_REQUEST,
  },
  ACCOUNT_DOES_NOT_EXIST: {
    message: 'ACCOUNT_DOES_NOT_EXIST',
    statusCode: statusCode.BAD_REQUEST,
  },
  INVALID_EMAIL: {
    message: 'INVALID_EMAIL',
    statusCode: statusCode.UNPROCESSABLE_ENTITY,
  },
  NOT_SET_PASSWORD_YET: {
    message: 'NOT_SET_PASSWORD_YET',
    statusCode: statusCode.UNPROCESSABLE_ENTITY,
  },
  ACCESS_DENIED: {
    message: 'ACCESS_DENIED',
    statusCode: statusCode.FORBIDDEN,
  },
  INTERNAL_SERVER_ERROR: {
    message: 'INTERNAL_SERVER_ERROR',
    statusCode: statusCode.INTERNAL_SERVER_ERROR,
  },
};
