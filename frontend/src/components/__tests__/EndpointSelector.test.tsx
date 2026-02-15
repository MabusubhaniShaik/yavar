import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EndpointSelector } from "../EndpointSelector";
import { useTableStore } from "../../store/tableStore";

// Mock the store
vi.mock("../../store/tableStore", () => ({
  useTableStore: vi.fn(),
}));

describe("EndpointSelector", () => {
  const mockStore = {
    selectedDataset: null,
    isSlowEndpoint: false,
    setSelectedDataset: vi.fn(),
    setIsSlowEndpoint: vi.fn(),
    setCurrentPage: vi.fn(),
  };

  it("should render dataset options", () => {
    vi.mocked(useTableStore).mockReturnValue(mockStore);
    render(<EndpointSelector />);

    expect(screen.getByText("Netflix Shows")).toBeDefined();
    expect(screen.getByText("Sample Sales Data")).toBeDefined();
  });

  it("should call setSelectedDataset on click", () => {
    vi.mocked(useTableStore).mockReturnValue(mockStore);
    render(<EndpointSelector />);

    const button = screen.getByText("Netflix Shows");
    fireEvent.click(button);

    expect(mockStore.setSelectedDataset).toHaveBeenCalledWith("netflix");
  });

  it("should toggle slow endpoint", () => {
    vi.mocked(useTableStore).mockReturnValue({
      ...mockStore,
      selectedDataset: "netflix",
    });
    render(<EndpointSelector />);

    const button = screen.getByText(/Simulate Slow Network/i);
    fireEvent.click(button);

    expect(mockStore.setIsSlowEndpoint).toHaveBeenCalled();
  });
});
