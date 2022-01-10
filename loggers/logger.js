/* eslint-disable no-shadow */
const { format, createLogger, transports } = require('winston');

const { timestamp, combine, json, errors } = format;

const logger = createLogger({
  format: combine(timestamp(), errors({ stack: true }), json()),
  // defaultMeta: { service: 'user-service' },
  transports: [new transports.Console(), new transports.File({ filename: 'logger/prod-loggings.log' })],
});

module.exports = logger;
