import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

// Mocked data
const mockEvents = [
  {
    id: "1",
    summary: "Event 1",
    location: "Berlin, Germany",
    description: "Description of Event 1",
  },
  {
    id: "2",
    summary: "Event 2",
    location: "Berlin, Germany",
    description: "Description of Event 2",
  },
  {
    id: "3",
    summary: "Event 3",
    location: "London, UK",
    description: "Description of Event 3",
  },
];
const mockLocations = ["Berlin, Germany", "London, UK"];

// Mock the API module
jest.mock("../api", () => ({
  getEvents: jest.fn(() => Promise.resolve(mockEvents)),
  extractLocations: jest.fn(() => mockLocations),
}));

describe("<App /> component", () => {
  let AppDOM;

  beforeEach(() => {
    AppDOM = render(<App />).container.firstChild;
  });

  test("renders list of events", () => {
    expect(AppDOM.querySelector("#event-list")).toBeInTheDocument();
  });

  test("renders CitySearch", () => {
    expect(AppDOM.querySelector("#city-search")).toBeInTheDocument();
  });

  test("renders NumberOfEvents", () => {
    expect(AppDOM.querySelector("#number-of-events")).toBeInTheDocument();
  });
});

describe("<App /> integration", () => {
  test("renders a list of events matching the city selected by the user", async () => {
    const user = userEvent.setup();
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;

    const CitySearchDOM = AppDOM.querySelector("#city-search");
    const CitySearchInput = within(CitySearchDOM).queryByRole("textbox");

    // Simulate typing "Berlin" and selecting the suggestion
    await user.type(CitySearchInput, "Berlin");
    const berlinSuggestionItem =
      within(CitySearchDOM).queryByText("Berlin, Germany");
    await user.click(berlinSuggestionItem);

    const EventListDOM = AppDOM.querySelector("#event-list");
    const allRenderedEventItems =
      within(EventListDOM).queryAllByRole("listitem");

    // Expect the filtered events to match the mock data for Berlin
    const berlinEvents = mockEvents.filter(
      (event) => event.location === "Berlin, Germany"
    );
    expect(allRenderedEventItems.length).toBe(berlinEvents.length);

    allRenderedEventItems.forEach((event) => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  });

  test("updates the number of events displayed when the user changes the number of events input", async () => {
    const user = userEvent.setup();
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;

    const NumberOfEventsDOM = AppDOM.querySelector("#number-of-events");
    const NumberOfEventsInput = within(NumberOfEventsDOM).queryByTestId(
      "numberOfEventsInput"
    );

    // Simulate changing the number of events to 2
    await user.type(NumberOfEventsInput, "{backspace}{backspace}2");

    const EventListDOM = AppDOM.querySelector("#event-list");
    const allRenderedEventItems =
      within(EventListDOM).queryAllByRole("listitem");

    // Expect only 2 events to be rendered
    expect(allRenderedEventItems.length).toBe(2);
  });
});
