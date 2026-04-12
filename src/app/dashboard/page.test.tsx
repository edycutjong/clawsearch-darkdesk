import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "./page";
import * as supabaseLib from "@/lib/supabase";

let realtimeCallback: () => void;
const mockChannel: Record<string, jest.Mock> = {
  on: jest.fn((event: string, filter: Record<string, unknown>, cb: () => void): Record<string, jest.Mock> => {
    if (event === "postgres_changes") realtimeCallback = cb;
    return mockChannel;
  }),
  subscribe: jest.fn().mockReturnThis(),
};

jest.mock("@/lib/supabase", () => ({
  supabase: {
    channel: jest.fn(() => mockChannel),
    removeChannel: jest.fn(),
  },
}));


describe("Page: Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders loading state initially", async () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves
    render(<DashboardPage />);
    expect(screen.getByText(/Loading active sweeps/)).toBeInTheDocument();
  });

  it("renders empty state if no sweeps", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    });

    await act(async () => {
      render(<DashboardPage />);
    });

    expect(screen.getByText("No active sweeps found")).toBeInTheDocument();
  });

  it("fetches and displays sweeps", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "1",
          repo_url: "url",
          repo_name: "test/repo",
          status: "complete",
          pr_url: null,
          files_changed: 5,
          ast_fixes: 10,
          ai_fixes: 2,
          started_at: new Date().toISOString(),
          completed_at: null,
        }
      ]
    });

    await act(async () => {
      render(<DashboardPage />);
    });

    expect(screen.getByText("test/repo")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument(); // AST fixes in StatsBar
  });

  it("subscribes to realtime changes and unfetch on mount, unsubscribes on unmount", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => [] });
    
    const { unmount } = render(<DashboardPage />);
    
    expect(supabaseLib.supabase.channel).toHaveBeenCalledWith("clawsearchdarkdesk_sweeps_changes");
    expect(mockChannel.subscribe).toHaveBeenCalled();

    unmount();
    expect(supabaseLib.supabase.removeChannel).toHaveBeenCalledWith(mockChannel);
  });

  it("handles starting a new sweep", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => [] });
    
    await act(async () => {
      render(<DashboardPage />);
    });

    const input = screen.getByPlaceholderText("https://github.com/org/repo");
    const button = screen.getByRole("button", { name: /Sweep/ });

    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    await act(async () => {
      fireEvent.change(input, { target: { value: "https://github.com/org/repo" } });
      fireEvent.click(button);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/sweep", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ repoUrl: "https://github.com/org/repo" })
    }));
  });

  it("handles error in start sweep", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => [] });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    
    await act(async () => {
      render(<DashboardPage />);
    });

    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("https://github.com/org/repo"), { target: { value: "https://github.com/test/repo" } });
      fireEvent.click(screen.getByRole("button", { name: /Sweep/i }));
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it("refetches on realtime changes", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => [] });
    
    await act(async () => {
      render(<DashboardPage />);
    });

    // Clear initial fetch
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({ 
      ok: true, 
      json: async () => [{ 
        id: "new", 
        repo_name: "new", 
        repo_url: "https://github.com/new/repo",
        status: "queued" 
      }] 
    });

    // Trigger realtime
    await act(async () => {
      realtimeCallback();
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/sweep");
    expect(screen.getByText("new")).toBeInTheDocument();
  });

  it("handles API error response on initial load", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ error: "API Error" })
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await act(async () => {
      render(<DashboardPage />);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it("handles API error response on realtime refetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    });

    await act(async () => {
      render(<DashboardPage />);
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ error: "Refetch Error" })
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await act(async () => {
      realtimeCallback();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it("handles failed sweep POST (res.ok is false)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    });

    await act(async () => {
      render(<DashboardPage />);
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("https://github.com/org/repo"), { target: { value: "https://github.com/test/repo" } });
      fireEvent.click(screen.getByRole("button", { name: /Sweep/i }));
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it("renders error state when fetch fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500
    });

    await act(async () => {
      render(<DashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Error Loading Sweeps")).toBeInTheDocument();
      expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText(/Try Again/i));
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
