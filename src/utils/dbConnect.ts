const { MongoClient } = require('mongodb');

export const connectDB = async () => {
  const DB_URI: string|undefined = process.env.DB_URI;

  try {
    await MongoClient.connect(DB_URI);
    console.log('DB connected');
  } catch (error) {
    console.error('Could not connect to db');
  }
};
