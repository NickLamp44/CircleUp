import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CitySearch from "../components/CitySearch";

const suggestions = ["Berlin", "See all cities"];

describe("<CitySearch /> component", () => {
  test("updates list of suggestions correctly when user types in city textbox", async () => {
    render(<CitySearch suggestions={suggestions} />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/search for a city/i);

    await user.type(input, "Berlin");

    const suggestionItems = screen.queryAllByRole("listitem");
    expect(suggestionItems).toHaveLength(1); // Only Berlin matches
  });

  test("renders the suggestions text in the textbox upon clicking on the suggestion", async () => {
    render(<CitySearch suggestions={suggestions} />);
    const user = userEvent.setup();

    const suggestionItem = screen.getByText(/berlin/i);
    await user.click(suggestionItem);

    const input = screen.getByPlaceholderText(/search for a city/i);
    expect(input.value).toBe("Berlin");
  });
});
