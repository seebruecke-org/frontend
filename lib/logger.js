import { createLogger, format, transports } from 'winston';

const { combine, timestamp, json, prettyPrint } = format;

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json(), prettyPrint()),
  transports: [
    new transports.Console({
      prettyPrint: true
    })
  ]
});

export default logger;
