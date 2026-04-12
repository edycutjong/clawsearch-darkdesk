import { render, screen } from "@testing-library/react";
import SweepCard from "./SweepCard";
import { Sweep } from "@/lib/database.types";

describe("SweepCard", () => {
  const mockSweep: Sweep = {
    id: "123",
    repoName: "solana-pay",
    repoUrl: "https://github.com/solana-labs/solana-pay",
    status: "ai_loop",
    prUrl: null,
    filesChanged: 5,
    astFixes: 12,
    aiFixes: 1,
    logs: [],
    startedAt: new Date().toISOString(),
    completedAt: null,
  };

  it("renders repository information correctly", () => {
    render(<SweepCard sweep={mockSweep} />);
    expect(screen.getByText("solana-pay")).toBeInTheDocument();
    expect(screen.getByText("solana-labs/solana-pay")).toBeInTheDocument();
  });

  it("displays correct status badge", () => {
    render(<SweepCard sweep={mockSweep} />);
    expect(screen.getByText("AI Loop")).toBeInTheDocument();
  });

  it("shows stats for AST and AI fixes", () => {
    render(<SweepCard sweep={mockSweep} />);
    expect(screen.getByText("12")).toBeInTheDocument(); // AST fixes
    expect(screen.getByText("1")).toBeInTheDocument();  // AI fixes
    expect(screen.getByText("5")).toBeInTheDocument();  // files
  });

  it("shows PR link only when available", () => {
    const { rerender } = render(<SweepCard sweep={mockSweep} />);
    expect(screen.queryByText("PR opened")).not.toBeInTheDocument();

    const completeSweep = { 
      ...mockSweep, 
      status: "complete" as const, 
      prUrl: "https://github.com/pr/1" 
    };
    rerender(<SweepCard sweep={completeSweep} />);
    expect(screen.getByText("PR opened")).toBeInTheDocument();
  });

  it("shows Done badge when status is complete", () => {
    const completedSweep: Sweep = {
      ...mockSweep,
      status: "complete",
      completedAt: "2024-01-01T12:00:00Z",
    };
    render(<SweepCard sweep={completedSweep} />);
    expect(screen.getByText(/Done/i)).toBeInTheDocument();
  });

  it("shows failed progress bar when status is failed", () => {
    const failedSweep: Sweep = {
      ...mockSweep,
      status: "failed",
    };
    render(<SweepCard sweep={failedSweep} />);
    expect(screen.getByText(/Failed/i)).toBeInTheDocument();
  });
});
