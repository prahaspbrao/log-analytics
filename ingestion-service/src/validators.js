const VALID_LOG_LEVELS = ["INFO", "WARN", "ERROR", "DEBUG"];

function validateLog(log) {
  if (!VALID_LOG_LEVELS.includes(log.logLevel)) {
    throw new Error(`Invalid log level: ${log.logLevel}`);
  }

  if (isNaN(Date.parse(log.timestamp))) {
    throw new Error("Invalid timestamp");
  }
}

module.exports = { validateLog };
