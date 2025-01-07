import React, { useState } from "react";

const NumberOfEvents = ({ onNumberChange }) => {
  const [numberOfEvents, setNumberOfEvents] = useState(32);

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setNumberOfEvents(value);
      onNumberChange(value);
    } else {
      setNumberOfEvents(32);
    }
  };

  return (
    <div id="numberOfEvents">
      <label htmlFor="number">Number of Events:</label>
      <input
        id="number"
        type="number"
        value={numberOfEvents}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default NumberOfEvents;
