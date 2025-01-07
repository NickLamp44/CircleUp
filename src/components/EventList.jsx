import React from "react";

const EventList = ({ events = [] }) => {
  return (
    <ul id="event-list">
      {events.map((event) => (
        <li key={event.id} className="event">
          <h2>{event.title}</h2>
          <p>{event.location}</p>
        </li>
      ))}
    </ul>
  );
};

export default EventList;
