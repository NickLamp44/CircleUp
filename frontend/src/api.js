import mockData from "./mock-data.js";
const one_aws_proxy = "https://s8f26mlb4a.execute-api.us-east-1.amazonaws.com";
// Utility function for environment variable fetching
export const getEnvVariable = (key) => {
  return import.meta.env[key] || process.env[key] || undefined;
};

export const extractLocations = (events) => {
  return [...new Set(events.map((event) => event.location))];
};
export const getAuthUrl = async () => {
  let aws_proxy =
    "https://ex3tscbdi5lgo7r34pwq2526zm0mumsr.lambda-url.us-east-1.on.aws/";
  let response = await fetch(aws_proxy);
  let data = await response.json();
  return data.authUrl;
};
export const getAccessToken = async () => {
  debugger;
  const token = localStorage.getItem("access_token");

  // If a token is present, return it (could implement expiry checks here)
  if (token) {
    console.log("Access token found in localStorage.");
    return token;
  }
  console.log(
    "Access token not found in localStorage, retrieve from aws function."
  );

  // Determine correct redirect URI
  // const redirectURI =
  //   import.meta.env.MODE === "production"
  //     ? import.meta.env.VITE_REDIRECT_URI_PRODUCTION
  //     : import.meta.env.VITE_REDIRECT_URI_LOCAL;

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");

  if (!code) {
    console.error(
      "No 'code' found in the URL. Cannot retrieve acccess token. Reauthenticating..."
    );
    return null;
  }

  console.log("Fetching access token from AWS...");
  const aws_token_proxy = `${one_aws_proxy}/dev/api/get-access-token`;
  const response = await fetch(`${aws_token_proxy}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to fetch access token.");
  }
  console.log("Access token fetched successfully.");
  const data = await response.json();
  localStorage.setItem("access_token", data.accessToken);
  return data.accessToken;
};

export const getEvents = async (token) => {
  try {
    const useMockData = import.meta.env.VITE_REACT_APP_USE_MOCK_DATA === "true";
    if (true) {
      console.log("Returning mock data:", mockData);
      return mockData;
    }

    if (!token) {
      console.error("Authorization token is missing.");
      throw new Error("Authorization token is missing.");
    }

    const url = `${one_aws_proxy}/dev/api/get-events/${token}`;
    const response = await fetch(url);

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to fetch events from API.");
    }

    const result = await response.json();
    return result?.events || [];
  } catch (error) {
    console.error("Error in getEvents:", error.message);
    return null;
  }
};

// Log key environment variables
export const logEnvironmentVariables = () => {
  console.log("Environment Variables:");
  console.log(
    "VITE_REDIRECT_URI_LOCAL:",
    getEnvVariable("VITE_REDIRECT_URI_LOCAL")
  );
  console.log(
    "VITE_REDIRECT_URI_PRODUCTION:",
    getEnvVariable("VITE_REDIRECT_URI_PRODUCTION")
  );
  console.log(
    "VITE_REACT_APP_USE_MOCK_DATA:",
    getEnvVariable("VITE_REACT_APP_USE_MOCK_DATA")
  );
};

logEnvironmentVariables();
