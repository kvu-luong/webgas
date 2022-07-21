const { connectDB } = require('./utils/dbConnect');

const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env['PORT'];

app.listen(port, async () => {
  console.log('App is running');
  await connectDB();
});
