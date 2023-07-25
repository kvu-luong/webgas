import { Response } from 'express';
import StatusCode from '@utils/statusCode';
import ReasonStatusCode from '@utils/reasonCode';

export class ErrorResponse extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
  send(res: Response) {
    return res.status(this.statusCode).json(this);
  }
}

export class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
    super(message, statusCode);
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
    super(message, statusCode);
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

export class NotFoudError extends ErrorResponse {
  constructor(message = ReasonStatusCode.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
    super(message, statusCode);
  }
}
export class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}
export class InternalError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.INTERNAL_SERVER_ERROR,
    statusCode = StatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}

export class PermissionDeniedError extends ErrorResponse {
  constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
    super(message, statusCode);
  }
}
