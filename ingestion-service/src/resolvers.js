const redis = require("./redis/client.js");

module.exports = {
  Query: {
    _health: () => "OK",
  },

  Mutation: {
    ingestLog: async (_, args, context) => {
      try {
        const logEvent = {
          serviceName: args.serviceName,
          environment: args.environment,
          logLevel: args.logLevel,
          message: args.message,
          timestamp: args.timestamp,
          metadata: JSON.stringify(args.metadata || {}),
          apiKey: context.apiKey,
        };

        await redis.xadd(
          process.env.LOG_STREAM,
          "*",
          ...Object.entries(logEvent).flat()
        );

        return {
          success: true,
          message: "Log queued successfully",
        };
      } catch (err) {
        console.error("Redis enqueue failed", err);
        throw new Error("Log ingestion failed");
      }
    },

    ingestLogs: async (_, { logs }, context) => {
      try {
        const pipeline = redis.pipeline();

        for (const log of logs) {
          pipeline.xadd(
            process.env.LOG_STREAM,
            "*",
            "serviceName", log.serviceName,
            "environment", log.environment,
            "logLevel", log.logLevel,
            "message", log.message,
            "timestamp", log.timestamp,
            "metadata", JSON.stringify(log.metadata || {}),
            "apiKey", context.apiKey
          );
        }

        await pipeline.exec();

        return {
          success: true,
          message: "Logs queued successfully",
        };
      } catch (err) {
        console.error("Redis batch enqueue failed", err);
        throw new Error("Batch log ingestion failed");
      }
    },
  },
};
