import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import {
  getDatasets,
  getSchema,
  getData,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../api";

vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn().mockReturnThis(),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      defaults: {
        adapter: vi.fn(),
      },
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() },
      },
    },
  };
});

describe("API Service", () => {
  const apiClient = axios.create();

  it("should fetch datasets", async () => {
    const mockDatasets = [{ id: "1", name: "Test" }];
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { datasets: mockDatasets },
    });

    const result = await getDatasets();
    expect(result).toEqual(mockDatasets);
    expect(apiClient.get).toHaveBeenCalledWith("/datasets");
  });

  it("should fetch schema", async () => {
    const mockSchema = { name: "Test", columns: [] };
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { schema: mockSchema },
    });

    const result = await getSchema("test-id");
    expect(result).toEqual(mockSchema);
    expect(apiClient.get).toHaveBeenCalledWith("/schema/test-id");
  });

  it("should fetch data with params", async () => {
    const mockResponse = { success: true, data: [], pagination: {} };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockResponse });

    const params = { page: 1, limit: 10 };
    const result = await getData("/test", params);

    expect(result).toEqual(mockResponse);
    expect(apiClient.get).toHaveBeenCalledWith("/test", { params });
  });

  it("should create a record", async () => {
    const mockRecord = { id: "1", name: "New" };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockRecord });

    const result = await createRecord("/test", { name: "New" });
    expect(result).toEqual(mockRecord);
    expect(apiClient.post).toHaveBeenCalledWith("/test", { name: "New" });
  });

  it("should update a record", async () => {
    const mockRecord = { id: "1", name: "Updated" };
    vi.mocked(apiClient.put).mockResolvedValueOnce({ data: mockRecord });

    const result = await updateRecord("/test", "1", { name: "Updated" });
    expect(result).toEqual(mockRecord);
    expect(apiClient.put).toHaveBeenCalledWith("/test/1", { name: "Updated" });
  });

  it("should delete a record", async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce({
      data: { success: true },
    });

    const result = await deleteRecord("/test", "1");
    expect(result).toEqual({ success: true });
    expect(apiClient.delete).toHaveBeenCalledWith("/test/1");
  });
});
