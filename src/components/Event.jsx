import React, { useState } from "react";
const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="event">
      <h2>{event.summary}</h2>
      <p>{event.startTime}</p>
      <p>{event.location}</p>
      <button onClick={toggleDetails}>
        {showDetails ? "hide detilas" : "show details"}
      </button>
      {showDetails && (
        <div className="details">
          <p>{event.description}</p>
        </div>
      )}
    </div>
  );
};

export default Event;
