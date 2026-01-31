const requests = new Map();

/**
 * Simple in-memory rate limiter
 * limit: max requests
 * windowMs: time window
 */
function rateLimit(key, limit = 100, windowMs = 60_000) {
  const now = Date.now();
  const record = requests.get(key) || { count: 0, start: now };

  if (now - record.start > windowMs) {
    record.count = 1;
    record.start = now;
  } else {
    record.count += 1;
  }

  requests.set(key, record);

  return record.count <= limit;
}

module.exports = { rateLimit };
