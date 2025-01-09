"use strict";

const { google } = require("googleapis");
const calendar = google.calendar("v3");

// Scopes for Google Calendar API
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events.public.readonly",
];

// Environment variables
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID, NODE_ENV } = process.env;

// Set redirect URIs dynamically based on the environment
const redirect_uris =
  NODE_ENV === "production"
    ? ["https://circle-up-brown.vercel.app"]
    : ["http://localhost:3000"];

// Create an OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirect_uris[0].trim() // Trim to remove any trailing spaces or characters
);

// Utility to build a response
const buildResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
  body: JSON.stringify(body),
});

// getAuthURL function
module.exports.getAuthURL = async () => {
  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "select_account",
    });

    console.log("Generated Auth URL:", authUrl);

    return buildResponse(200, { authUrl });
  } catch (error) {
    console.error("Error generating Auth URL:", error);
    return buildResponse(500, { error: "Failed to generate Auth URL." });
  }
};

// getAccessToken function
module.exports.getAccessToken = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Parse the event body to extract the authorization code
    const { code } = JSON.parse(event.body || "{}");
    if (!code) {
      console.error("Missing authorization code in request body.");
      return buildResponse(400, { error: "Authorization code is required." });
    }

    // Exchange the authorization code for access tokens
    const { tokens } = await oAuth2Client.getToken(decodeURIComponent(code));
    console.log("Access tokens received:", tokens);

    return buildResponse(200, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    });
  } catch (error) {
    console.error("Error during token exchange:", error);
    return buildResponse(500, {
      error: "Failed to exchange authorization code for access token.",
      details: error.message || "Unknown error occurred.",
    });
  }
};

// getCalendarEvents function
module.exports.getCalendarEvents = async (event) => {
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

    return buildResponse(200, { events: data.items });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return buildResponse(500, {
      error: "Failed to fetch calendar events.",
      details: error.message || "Unknown error occurred.",
    });
  }
};
