const redis = require("./redisClient");
const prisma = require("./prisma"); // 👈 IMPORTANT

const STREAM = process.env.LOG_STREAM || "logs-stream";
const GROUP = process.env.CONSUMER_GROUP || "log-processors";
const CONSUMER = process.env.CONSUMER_NAME || "processor-1";
const BLOCK_MS = 5000;
const BATCH_SIZE = 5;

async function createConsumerGroup() {
  try {
    await redis.xgroup("CREATE", STREAM, GROUP, "$", "MKSTREAM");
    console.log(`✅ Consumer group '${GROUP}' created`);
  } catch (err) {
    if (err.message.includes("BUSYGROUP")) {
      console.log(`ℹ️ Consumer group '${GROUP}' already exists`);
    } else {
      throw err;
    }
  }
}

function parseFields(fields) {
  const obj = {};
  for (let i = 0; i < fields.length; i += 2) {
    obj[fields[i]] = fields[i + 1];
  }
  return obj;
}

async function startProcessor() {
  await createConsumerGroup();
  console.log(`🚀 Log processor started as ${CONSUMER}`);

  while (true) {
    try {
      const response = await redis.xreadgroup(
        "GROUP",
        GROUP,
        CONSUMER,
        "BLOCK",
        BLOCK_MS,
        "COUNT",
        BATCH_SIZE,
        "STREAMS",
        STREAM,
        ">"
      );

      if (!response) continue;

      const [, messages] = response[0];

      for (const [id, fields] of messages) {
        const log = parseFields(fields);

        console.log("📥 Processing log:", log);

        try {
          // ✅ WRITE TO DATABASE
          await prisma.log.create({
            data: {
              serviceName: log.serviceName,
              environment: log.environment,
              logLevel: log.logLevel,
              message: log.message,
              timestamp: new Date(log.timestamp),
              metadata: log.metadata ? JSON.parse(log.metadata) : null,
            },
          });

          // ✅ ACK ONLY AFTER DB SUCCESS
          await redis.xack(STREAM, GROUP, id);
          console.log("✅ Log persisted & ACKed:", id);

        } catch (dbErr) {
          console.error("❌ DB write failed, not ACKing:", dbErr.message);
          // message stays pending for retry
        }
      }
    } catch (err) {
      console.error("❌ Processing loop error:", err.message);
    }
  }
}

module.exports = startProcessor;
