const { revokeTokens } = require("./handler");

module.exports.revoke = async (event) => {
  try {
    const result = await revokeTokens();
    return {
      statusCode: result.statusCode,
      body: result.body,
    };
  } catch (error) {
    console.error("Error in revoke function:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to revoke credentials.",
        details: error.message,
      }),
    };
  }
};
