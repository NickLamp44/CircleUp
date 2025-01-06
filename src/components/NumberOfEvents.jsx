import React, { useState } from "react";

const NumberOfEvents = ({ onNumberChange }) => {
  const [value, setValue] = useState(32);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);

    if (isNaN(newValue) || newValue <= 0) {
      setValue(32); // Revert to default value
    } else {
      setValue(newValue);
      onNumberChange(newValue);
    }
  };

  return (
    <div>
      <label htmlFor="numberOfEvents">Number of Events:</label>
      <input
        id="numberOfEvents"
        type="number"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default NumberOfEvents;
