"use strict";

const { google } = require("googleapis");
const calendar = google.calendar("v3");

// Scopes for Google Calendar API
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events.public.readonly",
];

// Environment variables
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID, NODE_ENV } = process.env;

// Log environment variables for debugging
console.log("CLIENT_ID:", CLIENT_ID);
console.log("CLIENT_SECRET:", CLIENT_SECRET);
console.log("CALENDAR_ID:", CALENDAR_ID);
console.log("NODE_ENV:", NODE_ENV);

// Set redirect URIs dynamically based on the environment
const redirect_uris = [
  NODE_ENV === "production"
    ? process.env.REDIRECT_URI_PRODUCTION
    : process.env.REDIRECT_URI_LOCAL,
];

if (!redirect_uris[0]) {
  console.error("Redirect URI is missing or undefined!");
  throw new Error("Redirect URI is required but not set.");
}

console.log("Redirect URIs:", redirect_uris);

// Create an OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirect_uris[0].trim() // Trim to remove any trailing spaces or characters
);

// Utility to build a response
const buildResponse = (statusCode, body, origin = "*") => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://circle-up-brown.vercel.app",
  ];

  const responseOrigin = allowedOrigins.includes(origin) ? origin : "null";

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

// getAuthURL function
module.exports.getAuthURL = async (event) => {
  console.log("getAuthURL function started...");
  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "select_account",
    });

    console.log("Generated Auth URL:", authUrl);
    console.log("getAuthURL function completed successfully.");

    const origin = event.headers?.origin || "*";
    return buildResponse(200, { authUrl }, origin);
  } catch (error) {
    console.error(
      "Error in getAuthURL function:",
      error.stack || error.message
    );
    const origin = event.headers?.origin || "*";
    return buildResponse(
      500,
      { error: "Failed to generate Auth URL." },
      origin
    );
  }
};

// getAccessToken function
module.exports.getAccessToken = async (event) => {
  console.log("getAccessToken function started...");
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const { code } = JSON.parse(event.body || "{}");
    if (!code) {
      console.error("Missing authorization code in request body.");
      const origin = event.headers?.origin || "*";
      return buildResponse(
        400,
        { error: "Authorization code is required." },
        origin
      );
    }

    const { tokens } = await oAuth2Client.getToken(decodeURIComponent(code));
    console.log("Access tokens received:", tokens);

    console.log("getAccessToken function completed successfully.");
    const origin = event.headers?.origin || "*";
    return buildResponse(
      200,
      {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
      },
      origin
    );
  } catch (error) {
    console.error(
      "Error in getAccessToken function:",
      error.stack || error.message
    );
    const origin = event.headers?.origin || "*";
    return buildResponse(
      500,
      {
        error: "Failed to exchange authorization code for access token.",
        details: error.message || "Unknown error occurred.",
      },
      origin
    );
  }
};

// getCalendarEvents function
module.exports.getCalendarEvents = async (event) => {
  console.log("getCalendarEvents function started...");
  try {
    const access_token = event.pathParameters?.access_token;
    if (!access_token) {
      console.error("Access token is missing in the request.");
      const origin = event.headers?.origin || "*";
      return buildResponse(400, { error: "Access token is required." }, origin);
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
    console.log("getCalendarEvents function completed successfully.");
    const origin = event.headers?.origin || "*";
    return buildResponse(200, { events: data.items }, origin);
  } catch (error) {
    console.error(
      "Error in getCalendarEvents function:",
      error.stack || error.message
    );
    const origin = event.headers?.origin || "*";
    return buildResponse(
      500,
      {
        error: "Failed to fetch calendar events.",
        details: error.message || "Unknown error occurred.",
      },
      origin
    );
  }
};

// revokeTokens function
module.exports.revokeTokens = async (event) => {
  console.log("revokeTokens function started...");
  try {
    await oAuth2Client.revokeCredentials();
    console.log("OAuth credentials successfully revoked.");

    const origin = event.headers?.origin || "*";
    return buildResponse(
      200,
      {
        message: "OAuth credentials successfully revoked.",
      },
      origin
    );
  } catch (error) {
    console.error(
      "Error in revokeTokens function:",
      error.stack || error.message
    );
    const origin = event.headers?.origin || "*";
    return buildResponse(
      500,
      {
        error: "Failed to revoke credentials.",
        details: error.message,
      },
      origin
    );
  }
};
