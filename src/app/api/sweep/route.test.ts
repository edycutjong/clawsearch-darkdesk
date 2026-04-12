import { POST, GET } from "./route";
import { type NextRequest } from "next/server";
import * as supabase from "@/lib/supabase";

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
  insertSweep: jest.fn(),
  insertLog: jest.fn(),
  getAllSweeps: jest.fn(),
}));

describe("API: /api/sweep", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  describe("POST", () => {
    it("returns 400 if repoUrl is missing", async () => {
      const req = { json: jest.fn().mockResolvedValue({}) } as unknown as NextRequest;
      const res = await POST(req);
      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.error).toBe("repoUrl is required");
    });

    it("extracts repo name correctly from valid URL", async () => {
      (supabase.insertSweep as jest.Mock).mockResolvedValue({ 
        data: { id: "1", repo_url: "https://github.com/org/repo" }, 
        error: null 
      });
      (supabase.insertLog as jest.Mock).mockResolvedValue({ error: null });

      const req = { 
        json: jest.fn().mockResolvedValue({ repoUrl: "https://github.com/org/repo" }),
        nextUrl: { origin: "http://localhost:3000" }
      } as unknown as NextRequest;

      await POST(req);
      expect(supabase.insertSweep).toHaveBeenCalledWith(expect.objectContaining({
        repo_name: "org/repo"
      }));
    });

    it("handles invalid URL for name extraction gracefully", async () => {
      (supabase.insertSweep as jest.Mock).mockResolvedValue({ 
        data: { id: "1", repo_url: "not-a-url" }, 
        error: null 
      });
      const req = { 
        json: jest.fn().mockResolvedValue({ repoUrl: "not-a-url" }),
        nextUrl: { origin: "http://localhost:3000" }
      } as unknown as NextRequest;
      await POST(req);
      expect(supabase.insertSweep).toHaveBeenCalledWith(expect.objectContaining({
        repo_name: "not-a-url"
      }));
    });

    it("returns 500 if supabase insert fails", async () => {
      const spy = jest.spyOn(console, "error").mockImplementation();
      (supabase.insertSweep as jest.Mock).mockResolvedValue({ data: null, error: { message: "DB Error" } });
      const req = { json: jest.fn().mockResolvedValue({ repoUrl: "test" }) } as unknown as NextRequest;
      const res = await POST(req);
      expect(res.status).toBe(500);
      spy.mockRestore();
    });

    it("triggers background worker and returns 201 on success", async () => {
      (supabase.insertSweep as jest.Mock).mockResolvedValue({ 
        data: { id: "sweep-123", repo_url: "test" }, 
        error: null 
      });
      const req = { 
        json: jest.fn().mockResolvedValue({ repoUrl: "test" }),
        nextUrl: { origin: "http://localhost" }
      } as unknown as NextRequest;
      
      const res = await POST(req);
      expect(res.status).toBe(201);
      expect(global.fetch).toHaveBeenCalledWith("http://localhost/api/sweep/process", expect.any(Object));
    });

    it("handles fetch failure in background worker trigger", async () => {
      const spy = jest.spyOn(console, "error").mockImplementation();
      (supabase.insertSweep as jest.Mock).mockResolvedValue({ data: { id: "123" }, error: null });
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network fail"));
      
      const req = { 
        json: jest.fn().mockResolvedValue({ repoUrl: "test" }),
        nextUrl: { origin: "http://localhost" }
      } as unknown as NextRequest;
      
      const res = await POST(req);
      expect(res.status).toBe(201); // Still 201 because it's fire-and-forget
      spy.mockRestore();
    });

    it("handles general catch block (Error object)", async () => {
      const error = new Error("Specific Error");
      const req = { json: jest.fn().mockRejectedValue(error) } as unknown as NextRequest;
      const res = await POST(req);
      const data = await res.json();
      expect(res.status).toBe(500);
      expect(data.error).toBe("Specific Error");
    });

    it("handles general catch block (non-Error object)", async () => {
      const req = { json: jest.fn().mockRejectedValue("Oops") } as unknown as NextRequest;
      const res = await POST(req);
      const data = await res.json();
      expect(res.status).toBe(500);
      expect(data.error).toBe("Internal Server Error");
    });

    it("extracts repo name correctly from URL with only one part", async () => {
      (supabase.insertSweep as jest.Mock).mockResolvedValue({ 
        data: { id: "1", repo_url: "https://github.com/org" }, 
        error: null 
      });
      const req = { 
        json: jest.fn().mockResolvedValue({ repoUrl: "https://github.com/org" }),
        nextUrl: { origin: "http://localhost:3000" }
      } as unknown as NextRequest;

      await POST(req);
      expect(supabase.insertSweep).toHaveBeenCalledWith(expect.objectContaining({
        repo_name: "https://github.com/org"
      }));
    });
  });

  describe("GET", () => {
    it("returns all sweeps on success", async () => {
      (supabase.getAllSweeps as jest.Mock).mockResolvedValue({ data: [{ id: "1" }], error: null });
      const res = await GET();
      const data = await res.json();
      expect(data).toHaveLength(1);
    });

    it("returns 500 on supabase error", async () => {
      const spy = jest.spyOn(console, "error").mockImplementation();
      (supabase.getAllSweeps as jest.Mock).mockResolvedValue({ data: null, error: { message: "Error" } });
      const res = await GET();
      expect(res.status).toBe(500);
      spy.mockRestore();
    });
  });
});
