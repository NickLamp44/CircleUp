import { render, fireEvent } from "@testing-library/react";
import App from "../App";

test("An event element is collapsed by default", () => {
  const { container } = render(<App />);
  const details = container.querySelector(".event .eventDetails");
  expect(details).toBeNull(); // Ensure details are hidden
});

test("User can expand event details", () => {
  const { container } = render(<App />);
  const button = container.querySelector(".event .showDetailsButton");
  expect(button).toBeInTheDocument(); // Ensure button exists
  fireEvent.click(button);

  const details = container.querySelector(".event .eventDetails");
  expect(details).toBeInTheDocument(); // Ensure details are visible
});

test("User can collapse event details", () => {
  const { container } = render(<App />);
  const button = container.querySelector(".event .showDetailsButton");
  fireEvent.click(button); // Expand details

  const collapseButton = container.querySelector(".event .hideDetailsButton");
  expect(collapseButton).toBeInTheDocument(); // Ensure collapse button exists
  fireEvent.click(collapseButton);

  const details = container.querySelector(".event .eventDetails");
  expect(details).toBeNull(); // Ensure details are hidden again
});
