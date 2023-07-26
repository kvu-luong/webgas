import { Request } from 'express';
import { IApiKey } from '@models/apiKey.model';
import { IKeyStore } from '@models/keyStore.model';

export interface CustomRequest extends Request {
  objKey?: IApiKey;
  keyStoreId?: string;
  keyStoreObj?: IKeyStore;
  userId?: string;
  refreshToken?: string;
}
