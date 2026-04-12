import { render, screen } from "@testing-library/react";
import LogTerminal from "./LogTerminal";

const mockLogs = [
  { timestamp: new Date().toISOString(), level: "info" as const, message: "Initializing..." },
  { timestamp: new Date().toISOString(), level: "success" as const, message: "Done!" },
  { timestamp: new Date().toISOString(), level: "error" as const, message: "Failed!" },
  { timestamp: new Date().toISOString(), level: "ai" as const, message: "Thinking..." },
  { timestamp: new Date().toISOString(), level: "warn" as const, message: "Warning..." },
];

describe("LogTerminal", () => {
  it("renders all log levels correctly", () => {
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    
    render(<LogTerminal logs={mockLogs} />);
    
    expect(screen.getByText("Initializing...")).toBeInTheDocument();
    expect(screen.getByText("Done!")).toBeInTheDocument();
    expect(screen.getByText("Failed!")).toBeInTheDocument();
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
    expect(screen.getByText("Warning...")).toBeInTheDocument();

    // Verify icons/labels
    expect(screen.getByText("[INFO]")).toBeInTheDocument();
    expect(screen.getByText("[ OK ]")).toBeInTheDocument();
    expect(screen.getByText("[ ERR]")).toBeInTheDocument();
    expect(screen.getByText("[ AI]")).toBeInTheDocument();
    expect(screen.getByText("[WARN]")).toBeInTheDocument();
  });

  it("renders empty state (only cursor)", () => {
    render(<LogTerminal logs={[]} />);
    // Should show the entry count
    expect(screen.getByText("0 entries")).toBeInTheDocument();
    // And the cursor prompt
    expect(screen.getByText("❯")).toBeInTheDocument();
  });

  it("calls scrollIntoView when logs change", () => {
    const scrollMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollMock;
    
    const { rerender } = render(<LogTerminal logs={[]} />);
    expect(scrollMock).toHaveBeenCalled();
    scrollMock.mockClear();

    rerender(<LogTerminal logs={mockLogs} />);
    expect(scrollMock).toHaveBeenCalledWith({ behavior: "smooth" });
  });
});
