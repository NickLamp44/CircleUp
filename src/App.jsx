import React, { useEffect, useState } from "react";
import EventList from "./components/eventList";
import CitySearch from "./components/citySearch";
import NumberOfEvents from "./components/numberOfEvents";
import { extractLocations, getEvents } from "./api";

const App = () => {
  const [allEvents, setAllEvents] = useState([]); // All events fetched from API
  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered events based on city
  const [currentNOE, setCurrentNOE] = useState(32); // Number of events to display
  const [allLocations, setAllLocations] = useState([]); // List of all unique locations
  const [currentCity, setCurrentCity] = useState("See all cities"); // Current city filter
  const [errorAlert, setErrorAlert] = useState(""); // Error alert messages
  const [authError, setAuthError] = useState(""); // OAuth-related error messages
  const [accessToken, setAccessToken] = useState(""); // OAuth access token

  // Step 1: Detect "code" in the URL and exchange it for an access token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log("Authorization code detected in URL:", code);

      const fetchAccessToken = async () => {
        try {
          const response = await fetch(
            "https://s8f26mlb4a.execute-api.us-east-1.amazonaws.com/dev/api/get-access-token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code }),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to exchange code: ${response.statusText}`);
          }

          const data = await response.json();
          console.log("Access Token Response:", data);

          if (data.accessToken) {
            setAccessToken(data.accessToken); // Save access token for future API calls
            window.history.replaceState({}, document.title, "/"); // Clean up URL
          } else {
            throw new Error("No access token returned.");
          }
        } catch (error) {
          console.error("Error fetching access token:", error);
          setAuthError(
            "Failed to retrieve access token. Please try again later."
          );
        }
      };

      fetchAccessToken();
    }
  }, []);

  // Step 2: Fetch events using the access token
  useEffect(() => {
    if (!accessToken) {
      return; // Only fetch events if we have a valid access token
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://s8f26mlb4a.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${accessToken}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Events fetched:", data.events);

        setAllEvents(data.events); // Set all events
        setAllLocations(extractLocations(data.events)); // Extract unique locations
        setErrorAlert(""); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching events:", error);
        setErrorAlert("An error occurred while fetching events.");
      }
    };

    fetchData();
  }, [accessToken]);

  // Step 3: Filter events when city or NOE changes
  useEffect(() => {
    const updateFilteredEvents = () => {
      const eventsToFilter =
        currentCity === "See all cities"
          ? allEvents
          : allEvents.filter((event) => event.location === currentCity);

      setFilteredEvents(eventsToFilter.slice(0, currentNOE));
    };

    updateFilteredEvents();
  }, [allEvents, currentCity, currentNOE]);

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
