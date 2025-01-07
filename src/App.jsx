import React from "react";
import CitySearch from "./components/CitySearch";
import EventList from "./components/EventList";
import NumberOfEvents from "./components/NumberOfEvents";
import "./App.css";

const App = () => (
  <div className="App">
    <CitySearch />
    <EventList />
    <NumberOfEvents />
  </div>
);

export default App;
