const prisma = require("./config");
const { validateLog } = require("./validators");

module.exports = {
  Query: {
    _health: () => "Ingestion GraphQL is healthy",
  },

  Mutation: {
    ingestLog: async (_, args) => {
      validateLog(args);

      await prisma.log.create({
        data: {
          serviceName: args.serviceName,
          environment: args.environment,
          logLevel: args.logLevel,
          message: args.message,
          timestamp: new Date(args.timestamp),
          metadata: args.metadata,
        },
      });

      return {
        success: true,
        message: "Single log stored successfully",
      };
    },

    ingestLogs: async (_, { logs }) => {
      logs.forEach(validateLog);

      const formattedLogs = logs.map((log) => ({
        ...log,
        timestamp: new Date(log.timestamp),
      }));

      await prisma.log.createMany({ data: formattedLogs });

      return {
        success: true,
        message: `${logs.length} logs stored successfully`,
      };
    },
  },
};
