import React from "react";
import Event from "../components/Event";
import { mockData } from "../mock-data";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const event = mockData[0];

describe("<Event /> component", () => {
  beforeEach(() => {
    render(<Event event={event} />);
  });

  test("renders the event title", () => {
    expect(screen.getByText(event.summary)).toBeInTheDocument();
  });

  test("renders the event start time", () => {
    expect(screen.getByText(event.startTime)).toBeInTheDocument();
  });

  test("renders event location", () => {
    expect(screen.getByText(event.location)).toBeInTheDocument();
  });

  test('renders "show details" button', () => {
    expect(screen.getByText("show details")).toBeInTheDocument();
  });

  test("details are collapsed by default", () => {
    const details = screen.queryByText(event.description);
    expect(details).not.toBeInTheDocument();
  });

  test('shows the details section when the user clicks on the "show details" button', async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show details");
    await user.click(button);
    expect(screen.getByText(event.description)).toBeInTheDocument();
  });

  test('hides event details when user clicks on "hide details" button', async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show details");
    await user.click(button); // expand
    await user.click(screen.getByText("hide details")); // collapse
    const details = screen.queryByText(event.description);
    expect(details).not.toBeInTheDocument();
  });
});
