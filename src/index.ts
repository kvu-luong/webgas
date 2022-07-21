const { connectDB } = require('./utils/dbConnect');
const { logger } = require('./utils/logger');
import routes from './routers';

const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env['PORT'];

app.listen(port, async () => {
  logger.info(`App is running at port: ${port}`);
  await connectDB();

  routes(app);
});
