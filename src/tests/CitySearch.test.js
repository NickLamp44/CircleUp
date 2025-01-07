import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CitySearch from "../components/CitySearch";

describe("<CitySearch /> component", () => {
  test("renders the suggestion text in the textbox upon clicking on the suggestion", async () => {
    const allLocations = ["Berlin, Germany", "Paris, France", "London, UK"];
    render(<CitySearch allLocations={allLocations} />);

    const user = userEvent.setup();
    const cityTextBox = screen.getByRole("textbox", { name: /city/i });

    await user.type(cityTextBox, "Berlin");

    const berlinSuggestion = screen.getByText("Berlin, Germany");
    await user.click(berlinSuggestion);

    expect(cityTextBox).toHaveValue("Berlin, Germany");
  });
});
