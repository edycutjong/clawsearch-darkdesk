import { render, screen, act, waitFor } from "@testing-library/react";
import SweepDetailPage from "./page";

// Mock 'use' hook from React 19
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    use: <T,>(promise: T | Promise<T>) => {
      if (promise && typeof (promise as Promise<T>).then === "function") {
        return { id: "sweep-123" };
      }
      return promise;
    },
  };
});

describe("Page: SweepDetail", () => {
  let mockParams: Promise<{ id: string }>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    global.fetch = jest.fn();
    mockParams = Promise.resolve({ id: "sweep-123" });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders loading state", async () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<SweepDetailPage params={mockParams} />);
    expect(screen.getByText(/Loading Sweep Data/)).toBeInTheDocument();
  });

  it("renders 404 if sweep not found", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404
    });

    await act(async () => {
      render(<SweepDetailPage params={mockParams} />);
    });

    // Wait for the mock fetch to fail and loading to become false
    await waitFor(() => {
      expect(screen.getByText("Sweep Not Found")).toBeInTheDocument();
    });
  });

  it("fetches data and starts polling", async () => {
    const mockData = {
      id: "sweep-123",
      repo_url: "url",
      repo_name: "test/repo",
      status: "ast",
      pr_url: "https://github.com/pr",
      files_changed: 5,
      ast_fixes: 10,
      ai_fixes: 0,
      started_at: new Date(Date.now() - 120000).toISOString(),
      completed_at: new Date().toISOString(),
      clawsearchdarkdesk_logs: [
        { created_at: new Date().toISOString(), level: "info", message: "Test log" }
      ]
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData
    });

    await act(async () => {
      render(<SweepDetailPage params={mockParams} />);
    });

    expect(screen.getAllByText("test/repo")[0]).toBeInTheDocument();
    
    // Duration '2m'
    expect(screen.getByText("2m")).toBeInTheDocument();

    // Verify polling
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("handles fetch errors in polling", async () => {
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "sweep-123",
        url: "https://github.com/test",
        status: "processing",
        progress: 10,
        logs: ["Processing started..."]
      })
    });
      
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    
    await act(async () => {
      render(<SweepDetailPage params={mockParams} />);
    });

    await act(async () => {
      jest.advanceTimersByTime(1001);
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("renders with null sweep when fetch fails with 404", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404
    });

    await act(async () => {
      render(<SweepDetailPage params={mockParams} />);
    });

    expect(screen.getByText("Sweep Not Found")).toBeInTheDocument();
  });

  it("handles sweep with no completedAt for duration metric", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "1",
        repo_name: "test",
        status: "cloning",
        started_at: new Date().toISOString(),
        completed_at: null,
        clawsearchdarkdesk_logs: []
      })
    });

    await act(async () => {
      render(<SweepDetailPage params={mockParams} />);
    });

    // Duration should show the default suffix "—"
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("handles fast sweep (duration < 1m)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "1",
        repo_name: "test",
        status: "complete",
        started_at: new Date().toISOString(),
        completed_at: new Date(Date.now() + 1000).toISOString(), // 1s later, round to 0m
        clawsearchdarkdesk_logs: []
      })
    });

    await act(async () => {
      render(<SweepDetailPage params={mockParams} />);
    });

    expect(screen.getByText("< 1m")).toBeInTheDocument();
  });

  it("fetches data and returns if res.ok is false but status is not 404", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500
    });

    await act(async () => {
      render(<SweepDetailPage params={mockParams} />);
    });
    
    // It will fall back to Sweep Not Found because loading=false and sweep=null
    expect(screen.getByText("Sweep Not Found")).toBeInTheDocument();
  });
});
