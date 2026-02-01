const { z } = require("zod");

const LogLevelEnum = z.enum([
  "INFO",
  "WARN",
  "ERROR",
  "DEBUG"
]);

const LogSchema = z.object({
  timestamp: z.string().datetime(),
  level: LogLevelEnum,
  service: z.string().min(2),
  message: z.string().min(1),
  metadata: z.record(z.any()).optional()
});

module.exports = {
  LogSchema,
  LogLevelEnum
};
