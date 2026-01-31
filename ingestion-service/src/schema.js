const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar JSON

  type Log {
    id: ID
    serviceName: String!
    environment: String!
    logLevel: String!
    message: String!
    timestamp: String!
    metadata: JSON
  }

  type IngestResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    _health: String
  }

  type Mutation {
    ingestLog(
      serviceName: String!
      environment: String!
      logLevel: String!
      message: String!
      timestamp: String!
      metadata: JSON
    ): IngestResponse!

    ingestLogs(logs: [LogInput!]!): IngestResponse!
  }

  input LogInput {
    serviceName: String!
    environment: String!
    logLevel: String!
    message: String!
    timestamp: String!
    metadata: JSON
  }
`;
