import React from "react";
import NumberOfEvents from "../components/NumberOfEvents";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<NumberOfEvents /> component", () => {
  let onNumberChangeMock;

  beforeEach(() => {
    onNumberChangeMock = jest.fn();
    render(<NumberOfEvents onNumberChange={onNumberChangeMock} />);
  });

  test("renders the number of events input box", () => {
    const inputElement = screen.getByRole("spinbutton");
    expect(inputElement).toBeInTheDocument();
  });

  test("has a default value of 32", () => {
    const inputElement = screen.getByRole("spinbutton");
    expect(inputElement).toHaveValue(32);
  });

  test("updates value when user types in the input box", async () => {
    const inputElement = screen.getByRole("spinbutton");
    const user = userEvent.setup();

    await user.clear(inputElement);
    await user.type(inputElement, "20");

    expect(inputElement).toHaveValue(20);
    expect(onNumberChangeMock).toHaveBeenCalledWith(20);
  });

  test("reverts to default value if invalid input is provided", async () => {
    const inputElement = screen.getByRole("spinbutton");
    const user = userEvent.setup();

    await user.clear(inputElement);
    await user.type(inputElement, "-5");

    expect(inputElement).toHaveValue(32);
    expect(onNumberChangeMock).not.toHaveBeenCalledWith(-5);
  });
});
