import { Request } from 'express';
import { IApiKey } from '@models/apiKey.model';

export interface CustomRequest extends Request {
  objKey?: IApiKey;
  keyStoreId?: string;
}
