import { render, screen } from "@testing-library/react";
import NumberOfEvents from "../components/NumberOfEvents";

describe("<NumberOfEvents /> component", () => {
  test("renders the number of events input field", () => {
    render(<NumberOfEvents />);
    const inputElement = screen.getByRole("spinbutton", {
      name: /number of events/i,
    });
    expect(inputElement).toBeInTheDocument();
  });
});
