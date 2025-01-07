import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockData from "../mock-data";
import Event from "../components/Event";

describe("<Event /> component", () => {
  test("has summary", () => {
    const EventComponent = render(<Event event={mockData[0]} />);
    expect(EventComponent.queryByText(mockData[0].summary)).toBeInTheDocument();
  });

  test("has location", () => {
    const EventComponent = render(<Event event={mockData[0]} />);
    expect(
      EventComponent.queryByText(mockData[0].location)
    ).toBeInTheDocument();
  });

  test("has start time", () => {
    const EventComponent = render(<Event event={mockData[0]} />);
    expect(
      EventComponent.queryByText(mockData[0].start.dateTime)
    ).toBeInTheDocument();
  });

  test("has end time", () => {
    const EventComponent = render(<Event event={mockData[0]} />);
    expect(
      EventComponent.queryByText(mockData[0].end.dateTime)
    ).toBeInTheDocument();
  });

  test("No details by Default", async () => {
    const EventComponent = render(<Event event={mockData[0]} />);
    expect(EventComponent.queryByRole("description")).not.toBeInTheDocument();
  });

  test("has details because button is clicked", async () => {
    const EventComponent = render(<Event event={mockData[0]} />);
    await userEvent.click(EventComponent.queryByRole("button"));
    expect(EventComponent.queryByRole("description")).toBeInTheDocument();
  });
});
