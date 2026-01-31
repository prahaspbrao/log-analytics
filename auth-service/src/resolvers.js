const crypto = require("crypto");
const getPrisma = require("./config");
const { rateLimit } = require("./rateLimiter");

module.exports = {
  Query: {
    validateApiKey: async (_, { apiKey }) => {
      const prisma = getPrisma();

      const key = await prisma.apiKey.findUnique({
        where: { apiKey },
      });

      return Boolean(key && key.isActive);
    },
  },

  Mutation: {
    generateApiKey: async (_, { serviceName }) => {
      const prisma = getPrisma();

      // basic rate limit for key generation
      if (!rateLimit("generate-api-key", 10, 60_000)) {
        throw new Error("Rate limit exceeded");
      }

      const apiKey = crypto.randomBytes(32).toString("hex");

      await prisma.apiKey.create({
        data: {
          serviceName,
          apiKey,
        },
      });

      return {
        success: true,
        message: "API key generated",
        apiKey,
      };
    },

    revokeApiKey: async (_, { serviceName }) => {
      const prisma = getPrisma();

      await prisma.apiKey.update({
        where: { serviceName },
        data: { isActive: false },
      });

      return {
        success: true,
        message: "API key revoked",
      };
    },
  },
};
