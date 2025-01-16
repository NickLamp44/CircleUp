console.log("Environment Variables Loaded:");
console.log(
  "VITE_REDIRECT_URI_PRODUCTION:",
  import.meta.env.VITE_REDIRECT_URI_PRODUCTION
);
console.log(
  "VITE_REDIRECT_URI_LOCAL:",
  import.meta.env.VITE_REDIRECT_URI_LOCAL
);

import React, { useEffect, useState } from "react";
import EventList from "./components/eventList";
import CitySearch from "./components/citySearch";
import NumberOfEvents from "./components/numberOfEvents";
import { extractLocations, getEvents } from "./api";

const App = () => {
  const [authError, setAuthError] = useState("");
  const [allEvents, setAllEvents] = useState([]); // All events fetched from API
  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered events based on city
  const [currentNOE, setCurrentNOE] = useState(32); // Number of events to display
  const [allLocations, setAllLocations] = useState([]); // List of all unique locations
  const [currentCity, setCurrentCity] = useState("See all cities"); // Current city filter
  const [errorAlert, setErrorAlert] = useState(""); // Error alert messages

  // Check if code exists in URL and start OAuth if necessary
  useEffect(() => {
    const getAuthUrl = async () => {
      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.has("code")) {
        console.log(
          "Authorization code detected in URL:",
          urlParams.get("code")
        );
        return; // Skip OAuth redirect if code is already present
      }

      try {
        const response = await fetch(
          "https://s8f26mlb4a.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url"
        );
        const data = await response.json();

        if (data.authUrl) {
          window.location.href = data.authUrl; // Redirect to Google OAuth
        } else {
          setAuthError("Failed to retrieve OAuth URL. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching auth URL:", error);
        setAuthError("An error occurred while starting the OAuth process.");
      }
    };

    getAuthUrl();
  }, []);

  // Fetch events from the API on mount
  const fetchData = async () => {
    try {
      const events = await getEvents();
      if (!events) {
        setErrorAlert("Failed to fetch events. Please try again later.");
        return;
      }

      setAllEvents(events);
      setAllLocations(extractLocations(events));
      setErrorAlert(""); // Clear error alert
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrorAlert("An error occurred while fetching events.");
    }
  };

  // Update `filteredEvents` when `currentCity` or `currentNOE` changes
  useEffect(() => {
    const updateFilteredEvents = () => {
      const eventsToFilter =
        currentCity === "See all cities"
          ? allEvents
          : allEvents.filter((event) => event.location === currentCity);

      setFilteredEvents(eventsToFilter.slice(0, currentNOE)); // Apply city filter and limit
    };

    updateFilteredEvents();
  }, [allEvents, currentCity, currentNOE]); // Dependencies

  // Fetch events only after OAuth flow is complete
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("code")) {
      fetchData();
    }
  }, []);

  return (
    <div className="App">
      {authError && <div className="alert">{authError}</div>}
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents
        setErrorAlert={setErrorAlert}
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
      />
      {errorAlert && <div className="alert">{errorAlert}</div>}
      <EventList events={filteredEvents} />
    </div>
  );
};

export default App;
