export type AppConfig = {
  port: number;
  apiVersionRoute: string;
};

export type DBConfig = {
  host: string;
  name: string;
  port: number;
};

export type JWT = {
  access_secret: string;
  access_expiration: string;
  refresh_secret: string;
  refresh_expiration: string;
};

export type Config = {
  app: AppConfig;
  db: DBConfig;
  jwt: JWT;
};
