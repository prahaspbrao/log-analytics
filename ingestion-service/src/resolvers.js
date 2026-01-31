const getPrisma = require("./config");
const { validateLog } = require("./validators");
const { validateApiKey } = require("./authClient");

module.exports = {
  Mutation: {
    ingestLog: async (_, args, context) => {
      if (!context.apiKey) throw new Error("API key missing");

      const isValid = await validateApiKey(context.apiKey);
      if (!isValid) throw new Error("Invalid API key");

      validateLog(args);

      const prisma = getPrisma();
      await prisma.log.create({
        data: { ...args, timestamp: new Date(args.timestamp) },
      });

      return { success: true, message: "Log stored successfully" };
    },

    ingestLogs: async (_, { logs }, context) => {
      if (!context.apiKey) throw new Error("API key missing");

      const isValid = await validateApiKey(context.apiKey);
      if (!isValid) throw new Error("Invalid API key");

      logs.forEach(validateLog);

      const prisma = getPrisma();
      await prisma.log.createMany({
        data: logs.map((l) => ({
          ...l,
          timestamp: new Date(l.timestamp),
        })),
      });

      return { success: true, message: "Logs stored successfully" };
    },
  },
};
