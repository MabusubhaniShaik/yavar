import { describe, it, expect, beforeEach } from "vitest";
import { useTableStore } from "../tableStore";

describe("tableStore", () => {
  beforeEach(() => {
    const {
      setSelectedDataset,
      setIsSlowEndpoint,
      resetColumnWidths,
      setViewMode,
      setIsCreateModalOpen,
      setIsEditModalOpen,
      setEditingRecord,
    } = useTableStore.getState();

    setSelectedDataset(null);
    setIsSlowEndpoint(false);
    resetColumnWidths();
    setViewMode("full");
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingRecord(null);
  });

  it("should generate correct endpoint with getCurrentEndpoint (Branch Coverage)", () => {
    const { setSelectedDataset, setIsSlowEndpoint, getCurrentEndpoint } =
      useTableStore.getState();

    // Branch 1: !state.selectedDataset
    setSelectedDataset(null);
    expect(getCurrentEndpoint()).toBe("");

    // Branch 2: selectedDataset is set, isSlowEndpoint is false
    setSelectedDataset("netflix");
    setIsSlowEndpoint(false);
    expect(getCurrentEndpoint()).toBe("/netflix");

    // Branch 3: selectedDataset is set, isSlowEndpoint is true
    setIsSlowEndpoint(true);
    expect(getCurrentEndpoint()).toBe("/slow/netflix");
  });

  it("should columnWidths work correctly", () => {
    const { setColumnWidth, resetColumnWidths } = useTableStore.getState();
    setColumnWidth("title", 300);
    expect(useTableStore.getState().columnWidths["title"]).toBe(300);
    resetColumnWidths();
    expect(useTableStore.getState().columnWidths).toEqual({});
  });

  it("should setViewMode work", () => {
    const { setViewMode } = useTableStore.getState();
    setViewMode("split");
    expect(useTableStore.getState().viewMode).toBe("split");
  });

  it("should modal actions work", () => {
    const { setIsCreateModalOpen, setIsEditModalOpen, setEditingRecord } =
      useTableStore.getState();

    setIsCreateModalOpen(true);
    expect(useTableStore.getState().isCreateModalOpen).toBe(true);

    const record = { id: 1 };
    setEditingRecord(record);
    setIsEditModalOpen(true);
    expect(useTableStore.getState().editingRecord).toBe(record);
    expect(useTableStore.getState().isEditModalOpen).toBe(true);
  });
});
