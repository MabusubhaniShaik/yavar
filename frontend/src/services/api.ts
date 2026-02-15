import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Schema {
  name: string;
  columns: Column[];
}

export interface Column {
  key: string;
  label: string;
  type: string;
  width: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Dataset {
  id: string;
  name: string;
}

// Get all available datasets
export const getDatasets = async (): Promise<Dataset[]> => {
  const response = await apiClient.get("/datasets");
  return response.data.datasets;
};

// Get schema for a dataset
export const getSchema = async (datasetId: string): Promise<Schema> => {
  const response = await apiClient.get(`/schema/${datasetId}`);
  return response.data.schema;
};

// Get data from endpoint (normal or slow)
export const getData = async (
  endpoint: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: string; // Expecting JSON string
  }
): Promise<PaginatedResponse<any>> => {
  const response = await apiClient.get(endpoint, { params });
  return response.data;
};

// Create a new record
export const createRecord = async (
  endpoint: string,
  data: any
): Promise<any> => {
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

// Update a record
export const updateRecord = async (
  endpoint: string,
  id: string,
  data: any
): Promise<any> => {
  const response = await apiClient.put(`${endpoint}/${id}`, data);
  return response.data;
};

// Bulk Update records
export const bulkUpdateRecords = async (
  endpoint: string,
  ids: string[],
  data: any
): Promise<any> => {
  const response = await apiClient.put(endpoint, { ids, data });
  return response.data;
};

// Delete a record
export const deleteRecord = async (
  endpoint: string,
  id: string
): Promise<any> => {
  const response = await apiClient.delete(`${endpoint}/${id}`);
  return response.data;
};

// Bulk Delete records
export const bulkDeleteRecords = async (
  endpoint: string,
  ids: string[]
): Promise<any> => {
  // Axios delete with body requires data property
  const response = await apiClient.delete(endpoint, { data: { ids } });
  return response.data;
};

export default apiClient;
