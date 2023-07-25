import ReasonCode from '@utils/reasonCode';
import StatusCode from '@utils/statusCode';
import { Response } from 'express';

class SuccessReponse {
  public message?: string;
  public statusCode: number;
  public metadata?: object | null;
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonCode.OK,
    metadata = {},
  }: {
    message?: string;
    statusCode: number;
    reasonStatusCode?: string;
    metadata?: object | null;
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res: Response) {
    return res.status(this.statusCode).json(this);
  }
}

export class OK extends SuccessReponse {
  constructor({
    message,
    statusCode,
    metadata,
  }: {
    message: string;
    statusCode: number;
    metadata?: object;
  }) {
    super({ message, statusCode, metadata });
  }
}

export class CREATED extends SuccessReponse {
  public options?: object;
  constructor({
    options,
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonCode.CREATED,
    metadata,
  }: {
    message?: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: object | null;
    options?: Record<string, number | string | null>;
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}
