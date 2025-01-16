console.log(
  "VITE_REDIRECT_URI_LOCAL:",
  import.meta.env.VITE_REDIRECT_URI_LOCAL
);
console.log(
  "VITE_REDIRECT_URI_PRODUCTION:",
  import.meta.env.VITE_REDIRECT_URI_PRODUCTION
);

import mockData from "./mock-data.js";

/**
 * Extracts unique locations from the given events.
 * @param {Array} events - Array of event objects.
 * @returns {Array} - Array of unique locations.
 */
export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
  return [...new Set(extractedLocations)];
};

/**
 * Removes query parameters from the URL.
 * This ensures a cleaner URL after processing the query parameters.
 */
const removeQuery = () => {
  const { protocol, host, pathname } = window.location;
  const newUrl = `${protocol}//${host}${pathname}`;
  window.history.pushState("", "", newUrl);
};

/**
 * Fetches events from the API or returns mock data for local development.
 * @returns {Promise<Array|null>} - Array of events or null if an error occurs.
 */
export const getEvents = async () => {
  console.log("Window location origin:", window.location.origin);

  try {
    // Check if mock data should be used
    const useMockData = import.meta.env.VITE_REACT_APP_USE_MOCK_DATA === "true";
    console.log("Mock Data Toggle:", useMockData);

    if (useMockData) {
      return mockData;
    }

    // Retrieve access token
    const token = await getAccessToken();
    if (token) {
      removeQuery(); // Clean up the URL
      const url = `https://s8f26mlb4a.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${token}`;
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch events.");
      }

      return result?.events || null;
    }
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return null;
  }
};

/**
 * Retrieves or requests an access token.
 * If a valid token is stored, it will be used. Otherwise, it fetches a new one.
 * @returns {Promise<string|null>} - The access token or null if an error occurs.
 */
export const getAccessToken = async () => {
  const redirectURI = import.meta.env.VITE_REDIRECT_URI_LOCAL;
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

    const data = await response.json();

    if (!response.ok) {
      console.error("Error from token API:", data.error || "Unknown error");
      return null;
    }

    console.log("Access token retrieved successfully:", data.accessToken);
    localStorage.setItem("access_token", data.accessToken); // Store token locally
    return data.accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    return null;
  }
};
