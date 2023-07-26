const envConfig = require('dotenv').config();
console.log(`Environment configurations:`, envConfig.parsed);

import configs from './configs';
import { app } from './server';
const PORT: number = configs.commomConfig.app.port;
app.listen(PORT, () => console.log(`Server is running on port::${PORT}`));
