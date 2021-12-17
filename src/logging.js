const winston = require("winston");

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
});

/** @type {winston.LoggerOptions} */ const myWinstonOptions = {
  transports: [consoleTransport],
  defaultMeta: { service: "my-service-name" },
};

const logger = winston.createLogger(myWinstonOptions);

module.exports = logger;
