import { useState } from "react";

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <li>
      <p>{event.summary}</p>

      <p>{event.start?.dateTime}</p>
      <p>{event.end?.dateTime}</p>
      <p>{event.location}</p>
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Hide details" : "Show details"}
      </button>
      {showDetails ? <p role="description">{event.description}</p> : <></>}
    </li>
  );
};

export default Event;
