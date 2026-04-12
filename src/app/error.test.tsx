import { render, screen, fireEvent } from "@testing-library/react";
import GlobalError from "./error";

describe("GlobalError", () => {
  it("renders error message and reset button", () => {
    const error = new Error("Test error") as Error & { digest?: string };
    const reset = jest.fn();
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    
    render(<GlobalError error={error} reset={reset} />);
    
    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
    // Verify static text from component
    expect(screen.getByText(/The ClawSearchDarkDesk engine encountered an unexpected error/)).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith("Global boundary caught:", error);
    
    fireEvent.click(screen.getByText("Try again"));
    expect(reset).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
