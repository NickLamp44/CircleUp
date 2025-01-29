import React, { Component } from "react";
import Event from "./event";

class EventList extends Component {
  render() {
    const { events } = this.props;

    return (
      <ul id="event-list">
        {events &&
          events.map((event) => <Event key={event.id} event={event} />)}
      </ul>
    );
  }
}

export default EventList;
