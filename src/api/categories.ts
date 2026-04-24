import { apiClient } from "./apiClient";

export interface ProductDescription {
  title: string;
  shortDescription: string;
}

export interface CategoryResponse {
  categoryId: number;
  title: string;
  iconType: string;
  iconValue: string;
  themeColor: string;
  status: string;
}

export interface CreateCategoryRequest {
  title: string;
  iconType: string;
  iconValue: string;
  themeColor: string;
  status: string;
}

export const fetchCategories = async (): Promise<CategoryResponse[]> => {
  const { ok, data } = await apiClient.get("/categories");
  if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch categories");
  return data.data || [];
};

export const createCategory = async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
  const { ok, data: resData } = await apiClient.post("/admin/category", data);
  if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to create category");
  return resData.data;
};

export const updateCategory = async (categoryId: number, data: CreateCategoryRequest): Promise<CategoryResponse> => {
  const { ok, data: resData } = await apiClient.put(`/admin/category/${categoryId}`, data);
  if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to update category");
  return resData.data;
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  const { ok, data } = await apiClient.delete(`/admin/category/${categoryId}`);
  if (!ok || !data.success) throw new Error(data.error?.message || "Failed to delete category");
};

