import { render, waitFor, within } from "@testing-library/react";
import EventList from "../components/eventList";
import { getEvents } from "../api";
import App from "../App";

// Mock event data
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
    location: "London, UK",
    description: "Description of Event 2",
  },
];

// Mock location extraction
const mockLocations = ["Berlin, Germany", "London, UK"];

// Mock the API module
jest.mock("../api", () => ({
  getEvents: jest.fn(() => Promise.resolve(mockEvents)),
  extractLocations: jest.fn(() => mockLocations),
}));

describe("<EventList /> component", () => {
  let EventListComponent;

  beforeEach(() => {
    EventListComponent = render(<EventList />);
  });

  test('has an element with "list" role', () => {
    expect(EventListComponent.queryByRole("list")).toBeInTheDocument();
  });

  test("renders correct number of events", async () => {
    // Render with mock events
    const allEvents = await getEvents();
    EventListComponent.rerender(<EventList events={allEvents} />);
    expect(EventListComponent.getAllByRole("listitem")).toHaveLength(
      allEvents.length
    );
  });
});

describe("<EventList /> integration", () => {
  test("renders a list of events when the app is mounted and rendered", async () => {
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;
    const EventListDOM = AppDOM.querySelector("#event-list");

    await waitFor(() => {
      const EventListItems = within(EventListDOM).queryAllByRole("listitem");
      expect(EventListItems.length).toBeGreaterThan(0);
    });
  });
});
