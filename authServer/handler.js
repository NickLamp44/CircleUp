"use strict";

const { google } = require("googleapis");
const calendar = google.calendar("v3");
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events.public.readonly",
];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;
const redirect_uris = ["https://circle-up-brown.vercel.app"];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirect_uris[0]
);

// getAuthURL function
module.exports.getAuthURL = async () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "select_account",
  });

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      authUrl,
    }),
  };
};

// getAccessToken function
module.exports.getAccessToken = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Parse the event body to extract the authorization code
    const { code } = JSON.parse(event.body || "{}");
    if (!code) {
      console.error("Missing authorization code in request body.");
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Authorization code is required." }),
      };
    }

    // Decode the authorization code
    const decodedCode = decodeURIComponent(code);
    console.log("Decoded authorization code:", decodedCode);

    // Exchange the authorization code for access tokens
    const { tokens } = await oAuth2Client.getToken(decodedCode);
    console.log("Access tokens received:", tokens);

    // Return the tokens in the response
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
      }),
    };
  } catch (error) {
    console.error("Error during token exchange:", error);

    // Return an error response
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Failed to exchange authorization code for access token.",
        details: error.message || "Unknown error occurred.",
      }),
    };
  }
};

// getCalendarEvents function
module.exports.getCalendarEvents = async (event) => {
  const access_token = event.pathParameters.access_token;

  oAuth2Client.setCredentials({ access_token });

  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        calendarId: CALENDAR_ID, // Google Calendar ID
        auth: oAuth2Client, // OAuth2 client for authentication
        timeMin: new Date().toISOString(), // Fetch events starting from now
        singleEvents: true, // Expand recurring events
        orderBy: "startTime", // Sort events by start time
      },
      (error, response) => {
        if (error) {
          reject({
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
              error: "Failed to fetch calendar events",
              details: error.message || "Unknown error",
            }),
          });
        } else {
          resolve(response);
        }
      }
    );
  })
    .then((results) => {
      // When the promise resolves, return the list of events
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          events: results.data.items, // Return events in the body
        }),
      };
    })
    .catch((error) => {
      // Handle any errors
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          error: "Failed to fetch calendar events",
          details: error.message || "Unknown error",
        }),
      };
    });
};
