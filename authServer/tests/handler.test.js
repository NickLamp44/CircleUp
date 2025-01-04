const { getCalendarEvents } = require("..handler");
const { google } = require("googleapis");

// Mock the Google API
jest.mock("googleapis", () => {
  const mockCalendar = {
    events: {
      list: jest.fn(),
    },
  };
  return {
    google: {
      calendar: jest.fn(() => mockCalendar),
      auth: { OAuth2: jest.fn() },
    },
  };
});

describe("getCalendarEvents", () => {
  const mockEvent = {
    pathParameters: {
      access_token: "mockAccessToken",
    },
  };

  const mockCalendar = google.calendar();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of events when successful", async () => {
    const mockEvents = [
      { id: "1", summary: "Event 1" },
      { id: "2", summary: "Event 2" },
    ];
    mockCalendar.events.list.mockImplementation((_, callback) =>
      callback(null, { data: { items: mockEvents } })
    );

    const response = await getCalendarEvents(mockEvent);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).events).toEqual(mockEvents);
    expect(mockCalendar.events.list).toHaveBeenCalled();
  });

  it("should return an error when the API fails", async () => {
    const mockError = new Error("API Error");
    mockCalendar.events.list.mockImplementation((_, callback) =>
      callback(mockError, null)
    );

    const response = await getCalendarEvents(mockEvent);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toBe(
      "Failed to fetch calendar events"
    );
    expect(mockCalendar.events.list).toHaveBeenCalled();
  });
});
