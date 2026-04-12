import { render, screen } from "@testing-library/react";
import Loading from "./loading";

describe("Loading Component", () => {
  it("renders loading text", () => {
    render(<Loading />);
    expect(screen.getByText("Loading AI engine...")).toBeInTheDocument();
  });
});
