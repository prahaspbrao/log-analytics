const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "Ingestion service healthy" });
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () => {
    console.log(`🚀 Ingestion Service running on port ${PORT}`);
  });
}

startServer();
