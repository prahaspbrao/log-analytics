const prisma = require("../../prisma/client");

module.exports = {
  Query: {
    _health: () => "OK",
  },

  Mutation: {
    ingestLog: async (_, args) => {
      await prisma.log.create({
        data: {
          ...args,
          timestamp: new Date(args.timestamp),
        },
      });

      return {
        success: true,
        message: "Log ingested successfully",
      };
    },

    ingestLogs: async (_, { logs }) => {
      await prisma.log.createMany({
        data: logs.map((log) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        })),
      });

      return {
        success: true,
        message: "Logs ingested successfully",
      };
    },
  },
};
