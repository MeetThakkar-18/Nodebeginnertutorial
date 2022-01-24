const { format, createLogger, transports } = require('winston');

const { timestamp, combine, json, errors } = format;

const logger = createLogger({
  format: combine(timestamp(), errors({ stack: true }), json()),
  // defaultMeta: { service: 'user-service' },
  transports: [new transports.Console(), new transports.File({ filename: 'loggers/loggings.log' })],
});

module.exports = logger;
