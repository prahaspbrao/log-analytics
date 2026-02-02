const startProcessor = require("./processor");

(async () => {
  try {
    await startProcessor();
  } catch (err) {
    console.error("❌ Processor crashed", err);
    process.exit(1);
  }
})();
