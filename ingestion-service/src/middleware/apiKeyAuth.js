const axios = require("axios");

module.exports = async function apiKeyAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "API key missing" });
  }

  try {
    const response = await axios.post(
      "http://auth-service:4002/graphql",
      {
        query: `
          query ValidateApiKey($apiKey: String!) {
            validateApiKey(apiKey: $apiKey)
          }
        `,
        variables: { apiKey },
      }
    );

    const isValid = response.data?.data?.validateApiKey;

    if (!isValid) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    next();
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Auth service unavailable" });
  }
};
