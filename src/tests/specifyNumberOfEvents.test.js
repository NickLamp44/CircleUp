import { loadFeature, defineFeature } from "jest-cucumber";
const feature = loadFeature("./src/features/specifyNumberOfEvents.feature");
import { render, fireEvent, within } from "@testing-library/react";
import App from "../App";

defineFeature(feature, (test) => {
  let app;

  beforeEach(() => {
    app = render(<App />);
  });

  test("Default number of events is 32", ({ given, then }) => {
    given("the user has opened the app", () => {
      // Ensure App renders successfully
    });

    then("the number of events displayed should be 32", () => {
      const events = app.container.querySelectorAll(".event");
      expect(events.length).toBe(32); // Ensure App initializes with 32 events
    });
  });

  test("User can change the number of events", ({ given, when, then }) => {
    given("the user has opened the app", () => {
      // Ensure App renders successfully
    });

    when("the user sets the number of events to 10", () => {
      const input = app.container.querySelector("#number-of-events");
      fireEvent.change(input, { target: { value: "10" } });
    });

    then("10 events should be displayed", () => {
      const events = app.container.querySelectorAll(".event");
      expect(events.length).toBe(10); // Ensure App updates event count correctly
    });
  });
});
