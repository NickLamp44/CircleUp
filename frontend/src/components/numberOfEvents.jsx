import React, { Component } from "react";

class NumberOfEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      number: props.currentNOE,
    };

    this.handleInputChanged = this.handleInputChanged.bind(this);
  }

  handleInputChanged(event) {
    const value = event.target.value;
    const { setCurrentNOE, setErrorAlert } = this.props;

    this.setState({ number: value });

    if (isNaN(value) || value <= 0) {
      setErrorAlert("Enter a valid number");
    } else if (value > 32) {
      setErrorAlert("Only a maximum of 32 is allowed");
    } else {
      setErrorAlert("");
      setCurrentNOE(value);
    }
  }

  render() {
    const { number } = this.state;

    return (
      <div id="number-of-events">
        <label>
          Number of Events Shown:
          <input
            type="text"
            value={number}
            onChange={this.handleInputChanged}
            data-testid="numberOfEventsInput"
          />
        </label>
      </div>
    );
  }
}

export default NumberOfEvents;
