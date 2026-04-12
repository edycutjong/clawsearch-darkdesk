import { GET } from "./route";
import { type NextRequest } from "next/server";import * as supabase from "@/lib/supabase";

// Mock next/server
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

// Mock supabase lib
jest.mock("@/lib/supabase", () => ({
  getSweepById: jest.fn(),
}));

describe("API: /api/sweep/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 404 if sweep is not found", async () => {
    (supabase.getSweepById as jest.Mock).mockResolvedValue({ data: null, error: null });
    const res = await GET({} as unknown as NextRequest, { params: Promise.resolve({ id: "non-existent" }) });
    expect(res.status).toBe(404);
  });

  it("returns 404 if supabase returns error", async () => {
    (supabase.getSweepById as jest.Mock).mockResolvedValue({ data: null, error: { message: "Fail" } });
    const res = await GET({} as unknown as NextRequest, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(404);
  });

  it("returns sweep and sorts logs by timestamp", async () => {
    const mockSweep = {
      id: "123",
      clawsearchdarkdesk_logs: [
        { created_at: "2026-04-12T10:00:00Z", message: "Late" },
        { created_at: "2026-04-12T08:00:00Z", message: "Early" },
        { created_at: "2026-04-12T09:00:00Z", message: "Mid" },
      ]
    };
    (supabase.getSweepById as jest.Mock).mockResolvedValue({ data: mockSweep, error: null });

    const res = await GET({} as unknown as NextRequest, { params: Promise.resolve({ id: "123" }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.clawsearchdarkdesk_logs[0].message).toBe("Early");
    expect(data.clawsearchdarkdesk_logs[1].message).toBe("Mid");
    expect(data.clawsearchdarkdesk_logs[2].message).toBe("Late");
  });

  it("returns sweep without logs gracefully", async () => {
    (supabase.getSweepById as jest.Mock).mockResolvedValue({ 
      data: { id: "123", clawsearchdarkdesk_logs: null }, 
      error: null 
    });
    const res = await GET({} as unknown as NextRequest, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(200);
  });

  it("handles catch block with 500 (Error object)", async () => {
    (supabase.getSweepById as jest.Mock).mockImplementation(() => {
      throw new Error("Typed Error");
    });
    const res = await GET({} as unknown as NextRequest, { params: Promise.resolve({ id: "123" }) });
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe("Typed Error");
  });

  it("handles catch block with 500 (non-Error throw)", async () => {
    (supabase.getSweepById as jest.Mock).mockImplementation(() => {
      throw "Unexpected String Error";
    });
    const res = await GET({} as unknown as NextRequest, { params: Promise.resolve({ id: "123" }) });
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");
  });
});
