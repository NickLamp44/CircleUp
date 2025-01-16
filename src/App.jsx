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

  // Fetch events from the API on mount
  const fetchData = async () => {
    try {
      const events = await getEvents(); // Fetch events from API
      if (!events) {
        setErrorAlert("Failed to fetch events. Please try again later.");
        return;
      }

      setAllEvents(events); // Set all events
      setAllLocations(extractLocations(events)); // Extract unique locations
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

  // Fetch events on mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
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
