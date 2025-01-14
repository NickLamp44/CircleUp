import mockData from "./mock-data";

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
 */
const removeQuery = () => {
  const { protocol, host, pathname } = window.location;
  const newUrl = `${protocol}//${host}${pathname}`;
  window.history.pushState("", "", newUrl);
};

/**
 * Verifies the validity of an access token with Google OAuth.
 * @param {string} accessToken - The access token to verify.
 * @returns {Promise<Object>} - Token validation response.
 */
const checkToken = async (accessToken) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error checking token:", error);
    return null;
  }
};

/**
 * Fetches events from the API or returns mock data for local development.
 * @returns {Promise<Array|null>} - Array of events or null if an error occurs.
 */
export const getEvents = async () => {
  try {
    if (window.location.href.startsWith("http://localhost")) {
      return mockData;
    }

    const token = await getAccessToken();
    if (token) {
      removeQuery();
      const url = `https://s8f26mlb4a.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${token}`;
      const response = await fetch(url);
      const result = await response.json();
      return result?.events || null;
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
};

/**
 * Exchanges an authorization code for an access token.
 * @param {string} code - The authorization code.
 * @returns {Promise<string|null>} - The access token or null if an error occurs.
 */
const getToken = async (code) => {
  try {
    const encodedCode = encodeURIComponent(code);
    const response = await fetch(
      `https://s8f26mlb4a.execute-api.us-east-1.amazonaws.com/dev/api/get-access-token${encodedCode}`
    );
    const { access_token } = await response.json();
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
    return access_token || null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

/**
 * Retrieves or requests an access token.
 * If a valid token is stored, it will be used. Otherwise, it fetches a new one.
 * @returns {Promise<string|null>} - The access token or null if an error occurs.
 */
export const getAccessToken = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const tokenCheck = accessToken && (await checkToken(accessToken));

    if (!accessToken || tokenCheck?.error) {
      localStorage.removeItem("access_token");

      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");

      if (!code) {
        const response = await fetch(
          "https://s8f26mlb4a.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url"
        );
        const result = await response.json();
        const { authUrl } = result;
        if (authUrl) {
          window.location.href = authUrl;
        }
        return null;
      }

      return await getToken(code);
    }

    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};
