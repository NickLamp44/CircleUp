import React, { Component } from "react";

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
    };

    this.toggleDetails = this.toggleDetails.bind(this);
  }

  toggleDetails() {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  }

  render() {
    const { event } = this.props;
    const { showDetails } = this.state;

    return (
      <li className="event">
        <div className="eventSummary">
          <h2>{event.summary}</h2>
          <p>{event.location}</p>
          <p>{event.created}</p>
        </div>
        {showDetails && (
          <div className="eventDetails">
            <p>{event.description}</p>
          </div>
        )}
        <button className="showDetailsButton" onClick={this.toggleDetails}>
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </li>
    );
  }
}

export default Event;
