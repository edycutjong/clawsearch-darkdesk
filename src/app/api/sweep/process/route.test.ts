jest.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      status: init?.status || 200,
      json: async () => data
    })
  }
}));

import { POST } from "./route";
import { type NextRequest } from "next/server";
import { insertLog, updateSweepStatus } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({
  insertLog: jest.fn(),
  updateSweepStatus: jest.fn(),
}));

// Mock setTimeout to speed up worker simulation
jest.useFakeTimers();

describe("POST /api/sweep/process", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it("returns 400 if sweepId is missing", async () => {
    const req = {
      json: async () => ({}),
    } as NextRequest;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("sweepId is required");
  });

  it("returns 500 if JSON parsing fails", async () => {
    const req = {
      json: async () => { throw new Error("JSON Error"); },
    } as unknown as NextRequest;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("JSON Error");
  });

  it("starts the worker and returns 200", async () => {
    const sweepId = "test-sweep-id";
    const req = {
      json: async () => ({ sweepId }),
    } as NextRequest;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("processing started");

    // Advance timers to trigger the first few steps of the worker
    // Step 1: cloning (starts immediately then sleeps 2000)
    await jest.runOnlyPendingTimersAsync();
    expect(updateSweepStatus).toHaveBeenCalledWith(sweepId, "cloning", {});
    expect(insertLog).toHaveBeenCalledWith(expect.objectContaining({ 
      sweep_id: sweepId, 
      level: "info", 
      message: "Starting container..." 
    }));

    // Step 2: AST (sleeps 3000)
    await jest.runOnlyPendingTimersAsync();
    await jest.runOnlyPendingTimersAsync();
    expect(updateSweepStatus).toHaveBeenCalledWith(sweepId, "ast", expect.any(Object));

    // Step 3: AI Loop
    await jest.runOnlyPendingTimersAsync();
    await jest.runOnlyPendingTimersAsync();
    await jest.runOnlyPendingTimersAsync();
    expect(updateSweepStatus).toHaveBeenCalledWith(sweepId, "ai_loop", expect.any(Object));

    // Finish everything
    await jest.runAllTimersAsync();
    expect(updateSweepStatus).toHaveBeenCalledWith(sweepId, "complete", expect.any(Object));
  });

  it("handles worker errors", async () => {
    const sweepId = "fail-sweep-id";
    (updateSweepStatus as jest.Mock).mockImplementationOnce(() => {
      throw new Error("DB Error String");
    });

    const req = {
      json: async () => ({ sweepId }),
    } as NextRequest;

    const response = await POST(req);
    expect(response.status).toBe(200);

    // Initial log of "cloning" will fail
    await jest.runAllTimersAsync();
    
    // Should have logged the error
    expect(insertLog).toHaveBeenCalledWith(expect.objectContaining({
      level: "error",
      message: expect.stringContaining("Worker error: DB Error String")
    }));
    expect(updateSweepStatus).toHaveBeenCalledWith(sweepId, "failed", expect.any(Object));
  });

  it("handles updateSweepStatus error branch coverage", async () => {
    const sweepId = "fail-update-id";
    (updateSweepStatus as jest.Mock).mockImplementationOnce(() => {
      throw { message: "DB Update Failed" };
    });

    const req = {
      json: async () => ({ sweepId }),
    } as NextRequest;

    await POST(req);
    await jest.runAllTimersAsync();

    expect(insertLog).toHaveBeenCalledWith(expect.objectContaining({
      level: "error",
      message: expect.stringContaining("Worker error: Unknown worker error")
    }));
  });

  it("handles catch block in POST with 500 (non-Error throw)", async () => {
    const req = {
      json: async () => { throw "Body Parse Error"; },
    } as unknown as NextRequest;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");
  });
});
