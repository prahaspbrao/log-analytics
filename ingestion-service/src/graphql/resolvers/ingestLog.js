const validateApiKey = require("../../services/authClient");
const rateLimit = require("../../middleware/rateLimiter");
const { LogSchema } = require("../../validation/log.schema");

const ingestLog = async (_, { input }, context) => {

  console.log("Headers received:", context.req.headers);
  
  // 1️⃣ Schema validation
  const parsed = LogSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Invalid log format" };
  }

  // 2️⃣ Extract API key
  const apiKey = context.apiKey;
  if (!apiKey) {
    return { success: false, message: "Missing API key" };
  }

  // 3️⃣ Validate API key via auth-service
  const authResult = await validateApiKey(apiKey);
  if (!authResult.valid) {
    return { success: false, message: "Invalid API key" };
  }

  // 4️⃣ Rate limiting (still per API key)
  await rateLimit(apiKey);

  // 5️⃣ Store log (Prisma Log model only)

  return {
    success: true,
    message: "Log stored successfully"
  };
};

module.exports = { ingestLog };
