const axios = require("axios");

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://auth-service:4002/graphql";

async function validateApiKey(apiKey) {
  const query = `
    query ($apiKey: String!) {
      validateApiKey(apiKey: $apiKey)
    }
  `;

  const response = await axios.post(AUTH_SERVICE_URL, {
    query,
    variables: { apiKey },
  });

  return response.data.data.validateApiKey;
}

module.exports = { validateApiKey };
