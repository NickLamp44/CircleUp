"use strict";

const { google } = require("googleapis");
const calendar = google.calendar("v3");
const fetch = require("node-fetch");

// Scopes for Google Calendar API
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events.public.readonly",
];

// Validate environment variables
const requiredEnvVars = [
  "CLIENT_ID",
  "CLIENT_SECRET",
  "REDIRECT_URI_PRODUCTION",
  "REDIRECT_URI_LOCAL",
  "CALENDAR_ID",
  "NODE_ENV",
];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    throw new Error(`Environment variable ${varName} is not set.`);
  }
});

// Destructure environment variables
const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI_PRODUCTION,
  REDIRECT_URI_LOCAL,
  CALENDAR_ID,
  NODE_ENV,
} = process.env;

// Determine redirect URI dynamically based on the environment
const redirectURI =
  NODE_ENV === "production" ? REDIRECT_URI_PRODUCTION : REDIRECT_URI_LOCAL;

if (!redirectURI) {
  console.error("Redirect URI is missing or undefined!");
  throw new Error("Redirect URI is required but not set.");
}

console.log("Environment variables loaded:");
console.log("CLIENT_ID:", CLIENT_ID);
console.log("CLIENT_SECRET:", CLIENT_SECRET ? "****" : "Not Set");
console.log("NODE_ENV:", NODE_ENV);
console.log("Redirect URI:", redirectURI);

// Initialize the OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirectURI.trim()
);

// Utility to build a response
const buildResponse = (statusCode, body, origin = "*") => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://circle-up-brown.vercel.app",
  ];
  const responseOrigin = allowedOrigins.includes(origin) ? origin : "*";
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": responseOrigin,
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    },
    body: JSON.stringify(body),
  };
};

// Function to generate the Google Auth URL
module.exports.getAuthURL = async (event) => {
  console.log("getAuthURL function started...");

  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "select_account",
    });

    console.log("Generated Auth URL:", authUrl);

    const origin = event.headers?.origin || "*";
    return buildResponse(200, { authUrl }, origin);
  } catch (error) {
    console.error("Error in getAuthURL:", error.message);
    const origin = event.headers?.origin || "*";
    return buildResponse(
      500,
      { error: "Failed to generate Auth URL.", message: error.message },
      origin
    );
  }
};

// Function to exchange the code for an access token
module.exports.getAccessToken = async (event) => {
  console.log("getAccessToken function started...");

  try {
    const body = JSON.parse(event.body);
    const code = body.code;

    if (!code) {
      return buildResponse(400, { error: "Missing 'code' parameter." });
    }

    const params = new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: redirectURI.trim(),
      grant_type: "authorization_code",
    });

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Google API token exchange error:", result);
      throw new Error(
        result.error || "Failed to exchange code for access token"
      );
    }

    console.log("Access token response:", result);
    return buildResponse(200, { accessToken: result.access_token });
  } catch (error) {
    console.error("Error in getAccessToken function:", error.message);
    return buildResponse(500, {
      error: "Error exchanging code for token.",
      message: error.message,
    });
  }
};

// Function to fetch calendar events
module.exports.getCalendarEvents = async (event) => {
  console.log("getCalendarEvents function started...");

  try {
    const access_token = event.pathParameters?.access_token;

    if (!access_token) {
      return buildResponse(400, { error: "Access token is required." });
    }

    oAuth2Client.setCredentials({ access_token });

    const { data } = await calendar.events.list({
      calendarId: CALENDAR_ID,
      auth: oAuth2Client,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    console.log("Fetched calendar events:", data.items);

    return buildResponse(200, { events: data.items });
  } catch (error) {
    console.error("Error in getCalendarEvents function:", error.message);
    return buildResponse(500, {
      error: "Failed to fetch calendar events.",
      message: error.message,
    });
  }
};

// Function to revoke OAuth tokens
module.exports.revokeTokens = async (event) => {
  console.log("revokeTokens function started...");

  try {
    await oAuth2Client.revokeCredentials();
    console.log("OAuth credentials successfully revoked.");

    return buildResponse(200, {
      message: "OAuth credentials successfully revoked.",
    });
  } catch (error) {
    console.error("Error in revokeTokens function:", error.message);
    return buildResponse(500, {
      error: "Failed to revoke credentials.",
      message: error.message,
    });
  }
};
