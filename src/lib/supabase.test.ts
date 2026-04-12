import { createClient } from "@supabase/supabase-js";
import { getSweepById, insertSweep, updateSweepStatus } from "./supabase";

// Mock Supabase client
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(),
}));

describe("Supabase Utils", () => {
  const mockFrom = jest.fn();
  const mockSelect = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockEq = jest.fn();
  const mockOrder = jest.fn();
  const mockDelete = jest.fn();
  const mockSingle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup chained mock structure
    const chain = {
      select: mockSelect.mockReturnThis(),
      insert: mockInsert.mockReturnThis(),
      update: mockUpdate.mockReturnThis(),
      delete: mockDelete.mockReturnThis(),
      eq: mockEq.mockReturnThis(),
      order: mockOrder.mockReturnThis(),
      single: mockSingle,
    };

    (createClient as jest.Mock).mockReturnValue({
      from: mockFrom.mockReturnValue(chain),
    });
  });

  it("getSweepById fetches a single sweep joined with logs", async () => {
    const mockData = { id: "123", repo_name: "test-repo", clawsearchdarkdesk_logs: [] };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const { data } = await getSweepById("123");

    expect(mockFrom).toHaveBeenCalledWith("clawsearchdarkdesk_sweeps");
    expect(mockSelect).toHaveBeenCalledWith("*, clawsearchdarkdesk_logs ( * )");
    expect(mockEq).toHaveBeenCalledWith("id", "123");
    expect(data?.id).toBe("123");
  });

  it("insertSweep inserts a new sweep record", async () => {
    const mockRow = { repo_url: "url", repo_name: "name", status: "queued" as const };
    const mockSaved = { id: "new-id", ...mockRow };
    mockSingle.mockResolvedValue({ data: mockSaved, error: null });

    const { data } = await insertSweep(mockRow);

    expect(mockFrom).toHaveBeenCalledWith("clawsearchdarkdesk_sweeps");
    expect(mockInsert).toHaveBeenCalledWith(mockRow);
    expect(data?.id).toBe("new-id");
  });

  it("updateSweepStatus updates status and extra fields", async () => {
    mockEq.mockResolvedValue({ error: null });

    await updateSweepStatus("123", "complete", { pr_url: "url" });

    expect(mockFrom).toHaveBeenCalledWith("clawsearchdarkdesk_sweeps");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "complete", pr_url: "url" });
    expect(mockEq).toHaveBeenCalledWith("id", "123");
  });

  it("getAllSweeps fetches all sweeps ordered by date", async () => {
    (mockOrder as jest.Mock).mockResolvedValue({ data: [], error: null });

    await import("./supabase").then(m => m.getAllSweeps());

    expect(mockFrom).toHaveBeenCalledWith("clawsearchdarkdesk_sweeps");
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
  });

  it("insertLog inserts a log entry", async () => {
    (mockInsert as jest.Mock).mockResolvedValue({ error: null });

    await import("./supabase").then(m => m.insertLog({ sweep_id: "1", level: "info", message: "msg" }));

    expect(mockFrom).toHaveBeenCalledWith("clawsearchdarkdesk_logs");
    expect(mockInsert).toHaveBeenCalledWith({ sweep_id: "1", level: "info", message: "msg" });
  });

  it("createServerClient returns a supabase client", async () => {
    const { createServerClient } = await import("./supabase");
    const client = createServerClient();
    expect(createClient).toHaveBeenCalled();
    expect(client).toBeDefined();
  });

  it("deleteLogsBySweepId handles error gracefully", async () => {
    const { deleteLogsBySweepId } = await import("./supabase");
    mockEq.mockResolvedValue({ error: { message: "Delete error" } });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    
    await deleteLogsBySweepId("123");
    
    expect(mockFrom).toHaveBeenCalledWith("clawsearchdarkdesk_logs");
    expect(mockEq).toHaveBeenCalledWith("sweep_id", "123");
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error deleting logs"), expect.any(Object));
    consoleSpy.mockRestore();
  });

  it("deleteLogsBySweepId handles success", async () => {
    const { deleteLogsBySweepId } = await import("./supabase");
    mockEq.mockResolvedValue({ error: null });
    
    const { error } = await deleteLogsBySweepId("123");
    
    expect(mockFrom).toHaveBeenCalledWith("clawsearchdarkdesk_logs");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("sweep_id", "123");
    expect(error).toBeNull();
  });

  it("updateSweepStatus updates status without extra fields", async () => {
    mockEq.mockResolvedValue({ error: null });

    await updateSweepStatus("123", "failed");

    expect(mockFrom).toHaveBeenCalledWith("clawsearchdarkdesk_sweeps");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "failed" });
    expect(mockEq).toHaveBeenCalledWith("id", "123");
  });
});
