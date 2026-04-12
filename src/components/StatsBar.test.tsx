import { render, screen, act } from "@testing-library/react";
import StatsBar from "./StatsBar";

describe("Component: StatsBar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("renders all stat labels", async () => {
    await act(async () => {
      render(
        <StatsBar 
          totalPRs={10} 
          totalAstFixes={20} 
          totalAiFixes={30} 
          totalFiles={40} 
        />
      );
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText("PRs Opened")).toBeInTheDocument();
    expect(screen.getByText("AST Transforms")).toBeInTheDocument();
    expect(screen.getByText("AI Fixes")).toBeInTheDocument();
    expect(screen.getByText("Files Modified")).toBeInTheDocument();
  });

  it("animates counters to target values", async () => {
    render(
      <StatsBar 
        totalPRs={100} 
        totalAstFixes={0} 
        totalAiFixes={0} 
        totalFiles={0} 
      />
    );

    // Initial state should be 0
    expect(screen.getAllByText("0")).toHaveLength(4);

    // Advance timers to trigger animation
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // PRs should reach 100
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("cleans up intervals on unmount", async () => {
    const { unmount } = render(
      <StatsBar 
        totalPRs={10} 
        totalAstFixes={0} 
        totalAiFixes={0} 
        totalFiles={0} 
      />
    );
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    await act(async () => {
      unmount();
    });
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
