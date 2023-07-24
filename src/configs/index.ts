import { Config } from '@declareTypes/config';

const defaultConfigName = {
  appPrort: 4000,
  dbDevName: 'WebGasDev',
  dbDevHost: 'localhost',
  dbDevPort: 27017,
  dbProdName: 'WebGasProd',
  dbProdHost: 'localhost',
  dbProdPort: 27017,
};

const dev: Config = {
  app: {
    port: process.env.DEV_APP_PORT ? Number(process.env.DEV_APP_PORT) : defaultConfigName.appPrort,
  },
  db: {
    host: process.env.DEV_DB_HOST || defaultConfigName.dbDevHost,
    port: process.env.DEV_DB_PORT ? Number(process.env.DEV_DB_PORT) : defaultConfigName.dbDevPort,
    name: process.env.DEV_DB_NAME || defaultConfigName.dbDevName,
  },
};

const prod: Config = {
  app: {
    port: process.env.PROD_APP_PORT
      ? Number(process.env.PROD_APP_PORT)
      : defaultConfigName.appPrort,
  },
  db: {
    host: process.env.PROD_DB_HOST || defaultConfigName.dbProdHost,
    port: process.env.PROD_DB_PORT
      ? Number(process.env.PROD_DB_PORT)
      : defaultConfigName.dbProdPort,
    name: process.env.PROD_DB_NAME || defaultConfigName.dbProdName,
  },
};

const config: Record<string, Config> = { dev, prod };
const env = process.env.NODE_ENV || 'dev';

export default config[env];
