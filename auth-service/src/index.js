const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

// 🔽 ADD THIS
const validateApiKey = require("./routes/validateApiKey");

async function startServer() {
  console.log("🚀 Starting Auth Service...");

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "Auth service healthy" });
  });

  // 🔽 ADD THIS (internal REST endpoint)
  app.post("/internal/validate-api-key", validateApiKey);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4002;
  app.listen(PORT, () => {
    console.log(`🔐 Auth Service running on port ${PORT}`);
  });
}

// 🔥 THIS LINE IS CRITICAL
startServer();
