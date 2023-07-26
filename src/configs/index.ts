import { Config } from '@declareTypes/config';

const defaultConfigName = {
  appPrort: 4000,
  dbDevName: 'WebGasDev',
  dbDevHost: 'localhost',
  dbDevPort: 27017,
  dbProdName: 'WebGasProd',
  dbProdHost: 'localhost',
  dbProdPort: 27017,
  apiVersionRoute: '/v1/api',
};

const dev: Config = {
  app: {
    port: process.env.DEV_APP_PORT ? Number(process.env.DEV_APP_PORT) : defaultConfigName.appPrort,
    apiVersionRoute: defaultConfigName.apiVersionRoute,
  },
  db: {
    host: process.env.DEV_DB_HOST || defaultConfigName.dbDevHost,
    port: process.env.DEV_DB_PORT ? Number(process.env.DEV_DB_PORT) : defaultConfigName.dbDevPort,
    name: process.env.DEV_DB_NAME || defaultConfigName.dbDevName,
  },
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET || 'accessSecret',
    access_expiration: process.env.JWT_ACCESS_EXPIRATION || '1h',
    refresh_secret: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
    refresh_expiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
  },
};

const prod: Config = {
  app: {
    port: process.env.PROD_APP_PORT
      ? Number(process.env.PROD_APP_PORT)
      : defaultConfigName.appPrort,
    apiVersionRoute: defaultConfigName.apiVersionRoute,
  },
  db: {
    host: process.env.PROD_DB_HOST || defaultConfigName.dbProdHost,
    port: process.env.PROD_DB_PORT
      ? Number(process.env.PROD_DB_PORT)
      : defaultConfigName.dbProdPort,
    name: process.env.PROD_DB_NAME || defaultConfigName.dbProdName,
  },
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET || 'accessSecret',
    access_expiration: process.env.JWT_ACCESS_EXPIRATION || '1h',
    refresh_secret: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
    refresh_expiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
  },
};

const config: Record<string, Config> = { dev, prod };
const env = process.env.NODE_ENV || 'dev';

const ROLE_SHOP = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITER: 'EDITOR',
  ADMIN: 'ADMIN',
};

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
  REFRESH_TOKEN: 'x-token-id',
};

export default {
  commomConfig: config[env],
  userRole: ROLE_SHOP,
  header: HEADER,
};
