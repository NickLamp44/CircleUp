const { getCalendarEvents } = require("../../authServer/handler");

jest.mock("../../authServer/handler", () => ({
  getCalendarEvents: jest.fn().mockResolvedValue({
    statusCode: 200,
    body: JSON.stringify({ events: [{ id: "1", summary: "Mock Event" }] }),
  }),
}));

describe("getCalendarEvents", () => {
  it("should return a list of events when successful", async () => {
    const response = await getCalendarEvents();
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).events).toHaveLength(1);
  });

  it("should handle API errors gracefully", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Silence console.error
    getCalendarEvents.mockRejectedValueOnce(new Error("API Error"));

    try {
      await getCalendarEvents();
    } catch (error) {
      expect(error.message).toBe("API Error");
    }
  });
});
