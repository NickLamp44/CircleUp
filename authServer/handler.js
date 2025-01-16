"use strict";

const { google } = require("googleapis");
const calendar = google.calendar("v3");
const fetch = require("node-fetch");

// Scopes for Google Calendar API
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events.public.readonly",
];

// Environment variables
const {
  CLIENT_SECRET,
  CLIENT_ID,
  CALENDAR_ID,
  NODE_ENV,
  REDIRECT_URI_PRODUCTION,
  REDIRECT_URI_LOCAL,
} = process.env;

// Log environment variables for debugging
console.log("CLIENT_ID:", CLIENT_ID);
console.log("CLIENT_SECRET:", CLIENT_SECRET);
console.log("CALENDAR_ID:", CALENDAR_ID);
console.log("NODE_ENV:", NODE_ENV);

// Set redirect URIs dynamically based on the environment
const redirectURI =
  NODE_ENV === "production" ? REDIRECT_URI_PRODUCTION : REDIRECT_URI_LOCAL;

if (!redirectURI) {
  console.error("Redirect URI is missing or undefined!");
  throw new Error("Redirect URI is required but not set.");
}

console.log("Redirect URI:", redirectURI);

// Create an OAuth2 client
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

// getAuthURL function
module.exports.getAuthURL = async (event) => {
  console.log("getAuthURL function started...");
  try {
    console.log(
      "Redirect URI during OAuth URL generation:",
      oAuth2Client.redirectUri
    );
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "select_account",
    });

    console.log("Generated Auth URL:", authUrl);
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
  const body = JSON.parse(event.body);
  const code = body.code;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing 'code' parameter" }),
    };
  }

  const tokenURL = "https://oauth2.googleapis.com/token";
  const redirect_uri =
    process.env.NODE_ENV === "production"
      ? process.env.REDIRECT_URI_PRODUCTION
      : process.env.REDIRECT_URI_LOCAL;
  console.log("Redirect URI being sent in token exchange:", redirect_uri);

  const params = new URLSearchParams({
    code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: redirect_uri.trim(),
    grant_type: "authorization_code",
  });

  try {
    const response = await fetch(tokenURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Google API error:", result); // Log error to CloudWatch
      throw new Error(
        result.error || "Failed to exchange code for access token"
      );
    }

    console.log("Access token response:", result);
    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken: result.access_token }),
    };
  } catch (error) {
    console.error("Error in getAccessToken function:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error exchanging code for token",
        error: error.message,
      }),
    };
  }
};
// getCalendarEvents function
module.exports.getCalendarEvents = async (event) => {
  console.log("getCalendarEvents function started...");
  try {
    const access_token = event.pathParameters?.access_token;
    if (!access_token) {
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
      { error: "Failed to fetch calendar events." },
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
      { message: "OAuth credentials successfully revoked." },
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
      { error: "Failed to revoke credentials." },
      origin
    );
  }
};
