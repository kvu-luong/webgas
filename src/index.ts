const envConfig = require("dotenv").config();
console.log(`Environment configurations:`,envConfig.parsed);

import { startServer } from './server';
startServer().catch(console.error);