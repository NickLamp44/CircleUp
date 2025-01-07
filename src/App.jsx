import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CitySearch from "./CitySearch";
import EventList from "./EventList";

const App = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    if (accessToken) {
      setToken(accessToken);
      fetchEvents(accessToken);
    }
  }, [searchParams]);

  const fetchEvents = async (accessToken) => {
    const response = await fetch(
      `https://afbpzo8aj0.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${accessToken}`
    );
    const data = await response.json();
    setEvents(data.events);
  };

  return (
    <div>
      <h1>Event Search</h1>
      {token ? (
        <>
          <CitySearch />
          <EventList events={events} />
        </>
      ) : (
        <p>Please authorize to search for events.</p>
      )}
    </div>
  );
};

export default App;
