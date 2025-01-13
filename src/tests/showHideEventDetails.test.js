import { loadFeature, defineFeature } from "jest-cucumber";
import { render, fireEvent, screen } from "@testing-library/react";
import App from "../App";

const feature = loadFeature("./src/features/showHideEventDetails.feature");

defineFeature(feature, (test) => {
  let app;

  beforeEach(() => {
    app = render(<App />);
  });

  test("An event element is collapsed by default", ({ given, then }) => {
    given("the user has opened the app", () => {
      // App already rendered in beforeEach
    });

    then("the event details should be hidden", () => {
      const details = app.container.querySelector(".event .eventDetails");
      expect(details).toBeNull(); // Event details should not be visible
    });
  });

  test("User can expand event details", ({ given, when, then }) => {
    given("the user has opened the app", () => {
      // App already rendered in beforeEach
    });

    when('the user clicks the "Show Details" button', () => {
      const button = app.container.querySelector(".event .showDetailsButton");
      expect(button).toBeInTheDocument(); // Ensure button exists
      fireEvent.click(button);
    });

    then("the event details should be visible", () => {
      const details = app.container.querySelector(".event .eventDetails");
      expect(details).toBeInTheDocument(); // Event details should be visible
    });
  });

  test("User can collapse event details", ({ given, when, then }) => {
    given("the event details are visible", () => {
      const button = app.container.querySelector(".event .showDetailsButton");
      fireEvent.click(button); // Expand details
    });

    when('the user clicks the "Hide Details" button', () => {
      const button = app.container.querySelector(".event .showDetailsButton");
      expect(button).toBeInTheDocument(); // Ensure button exists
      fireEvent.click(button); // Collapse details
    });

    then("the event details should be hidden", () => {
      const details = app.container.querySelector(".event .eventDetails");
      expect(details).toBeNull(); // Event details should not be visible
    });
  });
});
