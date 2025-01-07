import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockData from "../mock-data";
import Event from "../components/Event";
import NumberOfEvents from "../components/NumberOfEvents";

describe("<NumberOfEvents /> component", () => {
  test("has number of events", () => {
    const NumberOfEventsComponent = render(<NumberOfEvents />);
    expect(NumberOfEventsComponent.queryByRole("input")).toBeInTheDocument();
  });
});
