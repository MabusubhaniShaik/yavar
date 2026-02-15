import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DynamicTable } from "../DynamicTable";
import { useTableStore } from "../../store/tableStore";
import * as api from "../../services/api";

vi.mock("../../store/tableStore", () => ({
  useTableStore: vi.fn(),
}));

vi.mock("../../services/api", () => ({
  deleteRecord: vi.fn(),
}));

// Mock window.confirm and alert globally for happy-dom if they don't exist
if (typeof window.confirm === "undefined") {
  window.confirm = vi.fn();
}
if (typeof window.alert === "undefined") {
  window.alert = vi.fn();
}

describe("DynamicTable", () => {
  const mockStore = {
    data: [{ _id: "1", title: "Test Netflix" }],
    schema: {
      name: "Netflix",
      columns: [{ key: "title", label: "Title", type: "string", width: 200 }],
    },
    isLoading: false,
    isSchemaLoading: false,
    columnWidths: {},
    setData: vi.fn(),
    getCurrentEndpoint: vi.fn().mockReturnValue("/netflix"),
    setEditingRecord: vi.fn(),
    setIsEditModalOpen: vi.fn(),
    selectedIds: [] as string[],
    setSelectedIds: vi.fn(),
    toggleSelectId: vi.fn(),
    clearSelection: vi.fn(),
    setIsBulkEditModalOpen: vi.fn(),
    refresh: vi.fn(),
    advancedFilters: { logic: "AND", conditions: [] },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call handleEdit when edit button is clicked", () => {
    vi.mocked(useTableStore).mockReturnValue(mockStore);
    render(<DynamicTable />);

    const editButton = screen.getByRole("button", { name: /Edit/i });
    fireEvent.click(editButton);

    expect(mockStore.setEditingRecord).toHaveBeenCalledWith(mockStore.data[0]);
    expect(mockStore.setIsEditModalOpen).toHaveBeenCalledWith(true);
  });

  it("should call handleDelete and update data when delete is confirmed", async () => {
    vi.mocked(useTableStore).mockReturnValue(mockStore);
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.mocked(api.deleteRecord).mockResolvedValue({ success: true } as any);

    render(<DynamicTable />);

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(api.deleteRecord).toHaveBeenCalledWith("/netflix", "1");

    await waitFor(() => {
      expect(mockStore.refresh).toHaveBeenCalled();
    });
  });

  it("should not call delete if cancelled", () => {
    vi.mocked(useTableStore).mockReturnValue(mockStore);
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<DynamicTable />);
    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(api.deleteRecord).not.toHaveBeenCalled();
    expect(confirmSpy).toHaveBeenCalled();
  });

  it("should handle record with id instead of _id", async () => {
    const recordWithId = { id: "2", title: "Test ID" };
    vi.mocked(useTableStore).mockReturnValue({
      ...mockStore,
      data: [recordWithId],
    });
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.mocked(api.deleteRecord).mockResolvedValue({ success: true } as any);

    render(<DynamicTable />);
    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(api.deleteRecord).toHaveBeenCalledWith("/netflix", "2");
  });

  it("should handle error in deleteRecord", async () => {
    vi.mocked(useTableStore).mockReturnValue(mockStore);
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.mocked(api.deleteRecord).mockRejectedValue(new Error("Delete failed"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<DynamicTable />);
    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
    });
  });

  it("should render loading skeleton rows", () => {
    vi.mocked(useTableStore).mockReturnValue({ ...mockStore, isLoading: true });
    render(<DynamicTable />);
    const rows = screen.getAllByRole("row");
    // Header + 5 skeleton rows
    expect(rows.length).toBe(6);
  });
});
