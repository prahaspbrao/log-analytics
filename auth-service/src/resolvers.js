const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");

module.exports = {
  Mutation: {
    generateApiKey: async (_, { serviceName }) => {
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

  Query: {
    validateApiKey: async (_, { apiKey }) => {
      const key = await prisma.apiKey.findUnique({
        where: { apiKey },
      });

      return !!(key && key.isActive);
    },
  },
};
