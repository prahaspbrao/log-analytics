const redis = require("../redis/client");

const MAX_LOGS_PER_MINUTE = 1000;

async function rateLimit(apiKey) {
  const currentMinute = Math.floor(Date.now() / 60000);
  const key = `rate:${apiKey}:${currentMinute}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60);
  }

  if (count > MAX_LOGS_PER_MINUTE) {
    throw new Error("RATE_LIMIT_EXCEEDED");
  }
}

module.exports = rateLimit;
