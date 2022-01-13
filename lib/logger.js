import { createLogger, format, transports } from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const { combine, timestamp, json, prettyPrint } = format;
const LOGTAIL_TOKEN = process.env.LOGTAIL_TOKEN;
let logtail;
const appliedTransports = [];

if (LOGTAIL_TOKEN && process.env.NODE_ENV === 'production') {
  logtail = new Logtail(process.env.LOGTAIL_TOKEN);

  appliedTransports.push(new LogtailTransport(logtail));
} else {
  appliedTransports.push(
    new transports.Console({
      prettyPrint: true
    })
  );
}

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json(), prettyPrint()),
  transports: appliedTransports
});

export default logger;
