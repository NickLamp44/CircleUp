import React, { useState } from "react";

const NumberOfEvents = () => {
  const [number, setNumber] = useState(32); // Default number of events

  return (
    <div>
      <label htmlFor="number-of-events">Number of Events:</label>
      <input
        id="number-of-events"
        type="number"
        aria-label="number of events"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
    </div>
  );
};

export default NumberOfEvents;
