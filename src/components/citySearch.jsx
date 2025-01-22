import React, { Component } from "react";

class CitySearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSuggestions: false,
      query: "",
      suggestions: [],
    };

    this.handleInputChanged = this.handleInputChanged.bind(this);
    this.handleItemClicked = this.handleItemClicked.bind(this);
  }

  componentDidMount() {
    this.setState({ suggestions: this.props.allLocations });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allLocations !== this.props.allLocations) {
      this.setState({ suggestions: this.props.allLocations });
    }
  }

  handleInputChanged(event) {
    const value = event.target.value;
    const { allLocations } = this.props;

    const filteredLocations = allLocations
      ? allLocations.filter((location) =>
          location.toUpperCase().includes(value.toUpperCase())
        )
      : [];

    this.setState({
      query: value,
      suggestions: filteredLocations,
    });
  }

  handleItemClicked(event) {
    const value = event.target.textContent;

    this.setState({
      query: value,
      showSuggestions: false,
    });

    this.props.setCurrentCity(value); // Notify parent of the selected city
  }

  render() {
    const { showSuggestions, query, suggestions } = this.state;

    return (
      <div id="city-search">
        <input
          type="text"
          className="city"
          placeholder="Search for a city"
          value={query}
          onFocus={() => this.setState({ showSuggestions: true })}
          onChange={this.handleInputChanged}
        />
        {showSuggestions && (
          <ul className="suggestions">
            {suggestions.map((suggestion) => (
              <li onClick={this.handleItemClicked} key={suggestion}>
                {suggestion}
              </li>
            ))}
            <li key="See all cities" onClick={this.handleItemClicked}>
              <b>See All Selected Cities</b>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

export default CitySearch;
