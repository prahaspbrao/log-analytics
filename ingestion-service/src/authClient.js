const axios = require("axios");

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://auth-service:4002/graphql";

async function validateApiKey(apiKey) {
  const query = `
    query ValidateApiKey($apiKey: String!) {
      validateApiKey(apiKey: $apiKey)
    }
  `;

  let response;
  try {
    response = await axios.post(AUTH_SERVICE_URL, {
      query,
      variables: { apiKey },
    });
  } catch (err) {
    console.error("Auth service network error:", err.message);
    return false;
  }

  // 🔴 CRITICAL: handle GraphQL errors
  if (!response.data) {
    console.error("No response data from auth service");
    return false;
  }

  if (response.data.errors) {
    console.error("Auth service GraphQL errors:", response.data.errors);
    return false;
  }

  if (!response.data.data) {
    console.error("Auth service returned null data");
    return false;
  }

  if (typeof response.data.data.validateApiKey !== "boolean") {
    console.error(
      "Unexpected auth service response:",
      response.data.data
    );
    return false;
  }

  return response.data.data.validateApiKey;
}

module.exports = { validateApiKey };
