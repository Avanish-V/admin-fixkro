import { apiClient } from "./apiClient";

export interface PartResponse {
  partId: number;
  name: string;
  price: number;
  status: boolean;
}

export interface CreatePartRequest {
  name: string;
  price: number;
  status: boolean;
}

export interface UpdatePartRequest {
  name: string;
  price: number;
  status: boolean;
}

export const fetchParts = async (): Promise<PartResponse[]> => {
  const { ok, data } = await apiClient.get("/parts");
  if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch parts");
  return data.data || [];
};

export const createPart = async (part: CreatePartRequest): Promise<PartResponse> => {
  const { ok, data } = await apiClient.post("/part", part);
  if (!ok || !data.success) throw new Error(data.error?.message || "Failed to create part");
  return data.data;
};

export const updatePart = async (partId: number, part: UpdatePartRequest): Promise<PartResponse> => {
  const { ok, data } = await apiClient.put(`/part/${partId}`, part);
  if (!ok || !data.success) throw new Error(data.error?.message || "Failed to update part");
  return data.data;
};

export const deletePart = async (partId: number): Promise<void> => {
  const { ok, data } = await apiClient.delete(`/part/${partId}`);
  if (!ok || !data.success) throw new Error(data.error?.message || "Failed to delete part");
};
