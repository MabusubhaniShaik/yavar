import { useEffect } from "react";
import { useTableStore } from "../store/tableStore";
import { getSchema, getData } from "../services/api";

export const useDataFetching = () => {
  const {
    selectedDataset,
    setSelectedDataset,
    isSlowEndpoint,
    setIsSlowEndpoint,
    setSchema,
    setData,
    setIsLoading,
    setIsSchemaLoading,
    setTotalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    advancedFilters,
    setAdvancedFilters,
    getCurrentEndpoint,
    refreshTrigger,
  } = useTableStore();

  // 1. Initial sync from URL to Store
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Dataset
    const ds = params.get("dataset");
    if (ds) setSelectedDataset(ds);
    
    // Page
    const p = params.get("page");
    if (p) setCurrentPage(parseInt(p));
    
    // Page Size
    const ps = params.get("limit");
    if (ps) setPageSize(parseInt(ps));

    // Search
    const s = params.get("search");
    if (s) setSearchQuery(s);
    
    // Filters
    const f = params.get("filters");
    if (f) {
      try {
        setAdvancedFilters(JSON.parse(decodeURIComponent(f)));
      } catch (e) {
        console.error("Failed to parse filters from URL", e);
      }
    }

    // Slow mode
    const slow = params.get("slow");
    if (slow === "true") setIsSlowEndpoint(true);
  }, []);

  // 2. Sync Store to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedDataset) params.set("dataset", selectedDataset);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (pageSize !== 10) params.set("limit", pageSize.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (advancedFilters.conditions.length > 0) {
      params.set("filters", encodeURIComponent(JSON.stringify(advancedFilters)));
    }
    if (isSlowEndpoint) params.set("slow", "true");

    const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [selectedDataset, currentPage, pageSize, searchQuery, advancedFilters, isSlowEndpoint]);

  // Fetch schema when dataset changes
  useEffect(() => {
    if (!selectedDataset) {
      setSchema(null);
      return;
    }

    const fetchSchema = async () => {
      setIsSchemaLoading(true);
      try {
        const schema = await getSchema(selectedDataset);
        setSchema(schema);
      } catch (error) {
        console.error("Failed to fetch schema:", error);
      } finally {
        setIsSchemaLoading(false);
      }
    };

    fetchSchema();
  }, [selectedDataset]);

  // Fetch data when endpoint, page, or search changes
  useEffect(() => {
    if (!selectedDataset) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const endpoint = getCurrentEndpoint();
        const response = await getData(endpoint, {
          page: currentPage,
          limit: pageSize,
          search: searchQuery || undefined,
          // Only send filters if there are conditions
          filters: advancedFilters.conditions.length > 0 ? JSON.stringify(advancedFilters) : undefined,
        });

        setData(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    selectedDataset,
    isSlowEndpoint,
    currentPage,
    pageSize,
    searchQuery,
    advancedFilters,
    refreshTrigger,
  ]);
};
