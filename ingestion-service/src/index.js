const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const apiKeyAuth = require("./middleware/apiKeyAuth.js")

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

async function startServer() {
  console.log("🚀 Starting Ingestion Service...");

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_, res) =>
    res.json({ status: "Ingestion service healthy" })
  );

  // 🔒 PROTECT GRAPHQL ENDPOINT
  app.use("/graphql", apiKeyAuth);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      apiKey: req.headers["x-api-key"],
    }),
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () =>
    console.log(`📥 Ingestion Service running on port ${PORT}`)
  );
}


startServer();
