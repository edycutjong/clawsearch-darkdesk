import { render, screen, fireEvent } from "@testing-library/react";
import SweepInput from "./SweepInput";

describe("SweepInput", () => {
  it("renders the input and button", () => {
    render(<SweepInput onSubmit={jest.fn()} />);
    expect(screen.getByPlaceholderText("https://github.com/org/repo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start Sweep/i })).toBeInTheDocument();
  });

  it("calls onSubmit with the URL when form is submitted", () => {
    const mockOnSubmit = jest.fn();
    render(<SweepInput onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText("https://github.com/org/repo");
    const button = screen.getByRole("button", { name: /Start Sweep/i });

    fireEvent.change(input, { target: { value: "https://github.com/solana/pay" } });
    fireEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalledWith("https://github.com/solana/pay");
  });

  it("does not call onSubmit if input is empty", () => {
    const mockOnSubmit = jest.fn();
    render(<SweepInput onSubmit={mockOnSubmit} />);
    
    const button = screen.getByRole("button", { name: /Start Sweep/i });
    fireEvent.click(button);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("updates focus state styles", () => {
    render(<SweepInput onSubmit={jest.fn()} />);
    const input = screen.getByPlaceholderText("https://github.com/org/repo");
    const formContainer = input.closest("div");

    fireEvent.focus(input);
    expect(formContainer).toHaveClass("shadow-xl");
    
    fireEvent.blur(input);
    expect(formContainer).not.toHaveClass("shadow-xl");
  });
});
