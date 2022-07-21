const { MongoClient } = require('mongodb');
require('dotenv').config();

export const connectDB = async () => {
  const dbUri = process.env['dbURI'];
  try {
    await MongoClient.connect(dbUri);
    console.log('DB connected');
  } catch (error) {
    console.error('Could not connect to db');
    process.exit(1);
  }
};
