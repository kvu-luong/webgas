const pino = require('pino');
const day = require('dayjs');
const path = require('path');
const { logObject } = require('@utils/constant');
const projectRoot = path.resolve(__dirname, './');
const currentDay = day().format('DD_MM_YYYY');
const LOG_STATE:string|undefined = process.env.LOGGGER;

const consoleConfig = [
  {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:dd-mm-yyyy HH:MM:ss.l',
      ignore: 'pid,hostname',
      colorize: true,
    },
  },
];

console.log(`${projectRoot}/logs/${currentDay}/tracking.log`);
let writeLogConfig = [
  {
    target: consoleConfig[0]?.target,
    options: {
      ...consoleConfig[0]?.options,
      colorize: false,
      destination: `${projectRoot}/logs/${currentDay}/tracking.log`,
      append: true,
      mkdir: true,
    },
  },
];

writeLogConfig = LOG_STATE === logObject.on ? writeLogConfig : [];

const configuration = {
  transport: {
    targets: [...consoleConfig, ...writeLogConfig],
  },
};
export const logger = pino(configuration);
