const Redis = require("ioredis");
const { v4: uuidv4 } = require("uuid");
const { createJWTToken } = require("./jwt");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB,
  username: process.env.REDIS_USERNAME,
});

async function store(solution) {
  sessionId = uuidv4();
  await redis.setex(sessionId, process.env.CAPTCHA_TIMEOUT || 5 * 60, solution);

  return sessionId;
}

async function verify(/** @type {string} */ sessionId, solution) {
  const storedSolution = await redis.get(sessionId);

  return storedSolution === solution ? createJWTToken({ sessionId }) : null;
}

module.exports = { store, verify };
