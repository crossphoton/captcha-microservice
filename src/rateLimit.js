const { RateLimiterRedis } = require("rate-limiter-flexible");
const { redisClient } = require("./store");

// Rate limiter
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "captcha-rate-limit",
  points: process.env.RATE_LIMIT_POINTS || 5,
  duration: process.env.RATE_LIMIT_DURATION || 1,
});

// Rate limit middleware
const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Too Many Requests");
    });
};

module.exports = rateLimiterMiddleware;
