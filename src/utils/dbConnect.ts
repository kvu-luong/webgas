import mongoose, { ConnectOptions } from 'mongoose';
import { countConnect } from '@helpers/check.connect';
import configs from '@typeConfig/index';

// Mongo connection
const DB_URI = `mongodb://${configs.commonConfig.db.host}:${configs.commonConfig.db.port}/${configs.commonConfig.db.name}`;
type MongoConnectFunction = () => void;
const mongoConnectDB: MongoConnectFunction = (): void => {
  if (process.env.NODE_ENV === 'dev') {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
  }

  const options: ConnectOptions = {
    maxPoolSize: 50,
  };

  mongoose
    .connect(DB_URI, options)
    .then(() => {
      console.log('Connected Mongodb Success');
      countConnect();
    })
    .catch((err) => console.log(`Error Connect ${err}`));
};

const connectDBStrategies: Record<string, MongoConnectFunction> = {
  mongodb: mongoConnectDB,
};

class Database {
  private static instance: Database;

  private constructor() {
    this.connect();
  }

  private connect(type: string = 'mongodb'): void {
    return connectDBStrategies[type]();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const dbConnect = Database.getInstance();
export { dbConnect };
