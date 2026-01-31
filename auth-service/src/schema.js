const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type ApiKey {
    serviceName: String!
    apiKey: String!
    isActive: Boolean!
  }

  type AuthResponse {
    success: Boolean!
    message: String!
    apiKey: String
  }

  type Query {
    validateApiKey(apiKey: String!): Boolean!
  }

  type Mutation {
    generateApiKey(serviceName: String!): AuthResponse!
    revokeApiKey(serviceName: String!): AuthResponse!
  }
`;

module.exports = typeDefs;
