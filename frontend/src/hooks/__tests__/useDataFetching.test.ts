import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useDataFetching } from "../useDataFetching";
import * as api from "../../services/api";
import { useTableStore } from "../../store/tableStore";

// Mock the API service
vi.mock("../../services/api", () => ({
  getSchema: vi.fn(),
  getData: vi.fn(),
  getDatasets: vi.fn(),
}));

describe("useDataFetching", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset store
    const { setSelectedDataset, setIsLoading, setData, setSchema } =
      useTableStore.getState();

    setSelectedDataset(null);
    setIsLoading(false);
    setData([]);
    setSchema(null);
  });

  it("should fetch schema and data when dataset is selected", async () => {
    const mockSchema = { name: "Test", columns: [] };
    const mockData = {
      success: true,
      data: [{ id: 1 }],
      pagination: { total: 1, totalPages: 1, page: 1, limit: 10 },
    };

    vi.mocked(api.getSchema).mockResolvedValueOnce(mockSchema);
    vi.mocked(api.getData).mockResolvedValueOnce(mockData);

    // Select dataset wrapped in act
    await act(async () => {
      useTableStore.getState().setSelectedDataset("test-ds");
    });

    await waitFor(() => {
      expect(api.getSchema).toHaveBeenCalledWith("test-ds");
      expect(api.getData).toHaveBeenCalledWith("/test-ds", expect.any(Object));
      expect(useTableStore.getState().schema).toEqual(mockSchema);
      expect(useTableStore.getState().data).toEqual(mockData.data);
    });
  });

  it("should handle errors during data fetching", async () => {
    vi.mocked(api.getSchema).mockResolvedValueOnce({
      name: "Test",
      columns: [],
    });
    vi.mocked(api.getData).mockRejectedValueOnce(new Error("Fetch failed"));

    renderHook(() => useDataFetching());

    await act(async () => {
      useTableStore.getState().setSelectedDataset("test-ds");
    });

    await waitFor(() => {
      expect(useTableStore.getState().isLoading).toBe(false);
    });
  });
});
