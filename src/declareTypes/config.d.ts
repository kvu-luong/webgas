export type AppConfig = {
  port: number;
};

export type DBConfig = {
  host: string;
  name: string;
  port: number;
};
export type Config = {
  app: AppConfig;
  db: DBConfig;
};
