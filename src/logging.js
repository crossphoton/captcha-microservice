const winston = require("winston");
const expressWinston = require("express-winston");

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
});

/** @type {winston.LoggerOptions} */ const myWinstonOptions = {
  transports: [consoleTransport],
  defaultMeta: { service: "captcha-service" },
};

const logger = winston.createLogger(myWinstonOptions);
const middleware = expressWinston.logger(myWinstonOptions);

module.exports = { logger, middleware };
