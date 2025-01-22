// File: src/api.js
import mockData from "./mock-data.js";

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

export const getEnvVariable = (key) => {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
};

export const extractLocations = (events) => {
  return [...new Set(events.map((event) => event.location))];
};

export const getEvents = async () => {
  try {
    // Check environment variable
    const useMockData = import.meta.env.VITE_REACT_APP_USE_MOCK_DATA === "true";
    console.log("Using Mock Data:", useMockData);

    // Use mock data if the flag is set
    if (useMockData) {
      console.log("Returning mock data:", mockData);
      return mockData; // Mock data should be returned here
    }

    // Otherwise, fetch real events using API
    const token = await getAccessToken();
    if (!token) {
      console.error("Authorization token is missing.");
      throw new Error("Authorization token is missing.");
    }

    const url = `https://s8f26mlb4a.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${token}`;
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

export const getAccessToken = async () => {
  const redirectURI = getEnvVariable("VITE_REDIRECT_URI_LOCAL");
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");

  if (!code) {
    console.error("No 'code' found in the URL.");
    return null;
  }

  if (!redirectURI) {
    console.error("VITE_REDIRECT_URI_LOCAL is not defined in the environment.");
    return null;
  }

  try {
    const response = await fetch(`${redirectURI}/dev/api/get-access-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to fetch access token.");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    return null;
  }
};

// Log environment variables
logEnvironmentVariables();
