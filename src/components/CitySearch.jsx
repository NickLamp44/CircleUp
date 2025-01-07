import React, { useState } from "react";

const CitySearch = ({ allLocations }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    setSuggestions(
      allLocations.filter((location) =>
        location.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion); // Set full suggestion text
    setSuggestions([]); // Clear suggestions
  };

  return (
    <div id="city-search">
      <input
        type="text"
        className="city"
        value={query}
        onChange={handleInputChange}
        aria-label="city"
      />
      <ul className="suggestions">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            role="listitem"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CitySearch;
