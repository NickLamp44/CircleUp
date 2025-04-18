import React, { Component } from "react";
import { InfoAlert, WarningAlert, ErrorAlert } from "./components/alert";
import CitySearch from "./components/citySearch";
import EventList from "./components/eventList";
import NumberOfEvents from "./components/numberOfEvents";
import EventGenresChart from "./components/eventGenresChart";
import CityEventsChart from "./components/cityEventChart";
import {
  getAccessToken,
  getEvents,
  extractLocations,
  getAuthUrl,
  logEnvironmentVariables,
} from "./api";
import "./App.css";
class App extends Component {
  state = {
    allLocations: [],
    currentNOE: 32,
    events: [],
    filteredEvents: [],
    currentCity: "See all cities",
    infoAlert: "",
    warningAlert: "",
    errorAlert: "",
  };

  async componentDidMount() {
    // const token = await this.handleAuthentication();
    await this.fetchEvents(null);
  }

  handleAuthentication = async () => {
    debugger;
    try {
      const token = await getAccessToken();
      if (!token) {
        console.log("Redirecting to Google OAuth...");
        window.location.href = await getAuthUrl(); // Adjust based on your setup
      }
      return token;
    } catch (error) {
      window.alert("An error occurred while fetching the access token.", error);
    }
  };

  fetchEvents = async (token) => {
    try {
      const events = await getEvents(token);
      if (!events || events.length === 0) {
        throw new Error("No events found. Verify mock data or API response.");
      }

      this.setState({
        events,
        allLocations: extractLocations(events),
        filteredEvents: events,
        errorAlert: "",
      });
    } catch (error) {
      console.error("Error fetching events:", error.message);
      this.setErrorAlert(
        error.message || "An error occurred while fetching events."
      );
    }
  };

  setCurrentCity = (city) => {
    const { events } = this.state;
    this.setState({
      currentCity: city,
      filteredEvents:
        city === "See all cities"
          ? events
          : events.filter((event) => event.location === city),
    });
  };

  setInfoAlert = (message) => this.setState({ infoAlert: message });
  setWarningAlert = (message) => this.setState({ warningAlert: message });
  setErrorAlert = (message) => this.setState({ errorAlert: message });

  render() {
    const {
      allLocations,
      currentNOE,
      filteredEvents,
      infoAlert,
      warningAlert,
      errorAlert,
    } = this.state;

    return (
      <div className="App">
        <div className="alerts-container">
          <InfoAlert message={infoAlert} />
          <WarningAlert message={warningAlert} />
          <ErrorAlert message={errorAlert} />
        </div>
        <CitySearch
          allLocations={allLocations}
          setCurrentCity={this.setCurrentCity}
          setInfoAlert={this.setInfoAlert}
        />
        <NumberOfEvents
          currentNOE={currentNOE}
          setCurrentNOE={(number) => this.setState({ currentNOE: number })}
          setErrorAlert={this.setErrorAlert}
        />
        <div className="charts-container">
          <EventGenresChart events={filteredEvents} />
          <CityEventsChart
            allLocations={allLocations}
            events={filteredEvents}
          />
        </div>
        <EventList events={filteredEvents} />
      </div>
    );
  }
}

export default App;
