import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound Component", () => {
  it("renders 404 message and home link", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to Base/i })).toBeInTheDocument();
  });
});
