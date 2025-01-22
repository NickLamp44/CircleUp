import React, { Component } from "react";

class Alert extends Component {
  constructor(props) {
    super(props);
    this.color = null;
    this.bgColor = null;
  }

  getStyle() {
    return {
      color: this.color,
      backgroundColor: this.bgColor,
      borderWidth: "2px",
      borderStyle: "solid",
      fontWeight: "bolder",
      borderRadius: "7px",
      borderColor: this.color,
      textAlign: "center",
      fontSize: "12px",
      margin: "10px 0",
      padding: "10px",
    };
  }

  render() {
    const { message } = this.props;
    if (!message) return null;

    return (
      <div className="Alert" style={this.getStyle()}>
        <p>{message}</p>
      </div>
    );
  }
}

// Specific Alert Components
class InfoAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = "blue";
    this.bgColor = "lightblue";
  }
}

class WarningAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = "orange";
    this.bgColor = "lightyellow";
  }
}

class ErrorAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = "red";
    this.bgColor = "lightpink";
  }
}

export { InfoAlert, WarningAlert, ErrorAlert };
