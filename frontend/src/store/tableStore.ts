import { create } from "zustand";
import type { Schema } from "../services/api";

export interface TableState {
  // Current dataset selection
  selectedDataset: string | null;
  setSelectedDataset: (dataset: string | null) => void;

  // Endpoint variant (normal or slow)
  isSlowEndpoint: boolean;
  setIsSlowEndpoint: (isSlow: boolean) => void;

  // Schema
  schema: Schema | null;
  setSchema: (schema: Schema | null) => void;

  // Data
  data: any[];
  setData: (data: any[]) => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isSchemaLoading: boolean;
  setIsSchemaLoading: (loading: boolean) => void;

  // Selection
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  toggleSelectId: (id: string) => void;
  clearSelection: () => void;

  // Advanced Filters
  advancedFilters: {
    logic: "AND" | "OR";
    conditions: {
      field: string;
      operator: string;
      value: any;
    }[];
  };
  setAdvancedFilters: (filters: TableState["advancedFilters"]) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Column widths (user preferences)
  columnWidths: Record<string, number>;
  setColumnWidth: (columnKey: string, width: number) => void;
  resetColumnWidths: () => void;

  // View mode
  viewMode: "full" | "split";
  setViewMode: (mode: "full" | "split") => void;

  // CRUD modal states
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  editingRecord: any | null;
  setEditingRecord: (record: any | null) => void;
  
  // Bulk Edit modal state
  isBulkEditModalOpen: boolean;
  setIsBulkEditModalOpen: (open: boolean) => void;

  // Refresh trigger
  refreshTrigger: number;
  refresh: () => void;

  // Helper to get current endpoint
  getCurrentEndpoint: () => string;
}

export const useTableStore = create<TableState>((set, get) => ({
  // Initial state
  selectedDataset: null,
  isSlowEndpoint: false,
  schema: null,
  data: [],
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  isLoading: false,
  isSchemaLoading: false,
  searchQuery: "",
  selectedIds: [],
  advancedFilters: {
    logic: "AND",
    conditions: [],
  },
  columnWidths: {},
  viewMode: "full",
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isBulkEditModalOpen: false,
  editingRecord: null,
  refreshTrigger: 0,

  // Actions
  setSelectedDataset: (dataset) =>
    set({ selectedDataset: dataset, currentPage: 1, selectedIds: [], advancedFilters: { logic: "AND", conditions: [] } }),
  setIsSlowEndpoint: (isSlow) =>
    set({ isSlowEndpoint: isSlow, currentPage: 1, selectedIds: [] }),
  setSchema: (schema) => set({ schema }),
  setData: (data) => set({ data }),
  setCurrentPage: (page) => set({ currentPage: page, selectedIds: [] }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1, selectedIds: [] }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsSchemaLoading: (loading) => set({ isSchemaLoading: loading }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1, selectedIds: [] }),
  
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  toggleSelectId: (id) => set((state) => {
    const isSelected = state.selectedIds.includes(id);
    return {
      selectedIds: isSelected
        ? state.selectedIds.filter((i) => i !== id)
        : [...state.selectedIds, id],
    };
  }),
  clearSelection: () => set({ selectedIds: [] }),
  
  setAdvancedFilters: (filters) => set({ advancedFilters: filters, currentPage: 1, selectedIds: [] }),

  refresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1, selectedIds: [] })),
  setColumnWidth: (columnKey, width) =>
    set((state) => ({
      columnWidths: { ...state.columnWidths, [columnKey]: width },
    })),
  resetColumnWidths: () => set({ columnWidths: {} }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setIsCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
  setIsEditModalOpen: (open) => set({ isEditModalOpen: open }),
  setIsBulkEditModalOpen: (open) => set({ isBulkEditModalOpen: open }),
  setEditingRecord: (record) => set({ editingRecord: record }),

  getCurrentEndpoint: () => {
    const state = get();
    if (!state.selectedDataset) return "";
    const baseEndpoint = `/${state.selectedDataset}`;
    return state.isSlowEndpoint ? `/slow${baseEndpoint}` : baseEndpoint;
  },
}));
