import { apiClient } from "./apiClient";
import { ProductDescription } from "./categories";

export interface ProductResponse {
    categoryId: number;
    productId: number;
    title: string;
    imageUrl: string;
    serviceType: string;
    status: boolean;
    price: number;
    descriptions: ProductDescription[];
}

export interface CreateProductRequest {
    categoryId: number;
    title: string;
    imageUrl: string;
    serviceType: string;
    status: boolean;
    price: number;
    descriptions: ProductDescription[];
}

export interface UpdateProductRequest {
    categoryId: number;
    title: string;
    imageUrl: string;
    serviceType: string;
    status: boolean;
    price: number;
    descriptions: ProductDescription[];
}

export const fetchProductsByCategory = async (categoryId: number, status?: string): Promise<ProductResponse[]> => {
    let url = `/services?categoryId=${categoryId}`;
    if (status) url += `&status=${status}`;
    const { ok, data } = await apiClient.get(url);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch products");
    return data.data || [];
};

export const fetchAllProducts = async (status?: string): Promise<ProductResponse[]> => {
    let url = "/admin/services/all";
    if (status) url += `?status=${status}`;
    const { ok, data } = await apiClient.get(url);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch all products");
    return data.data || [];
};

export const createProduct = async (data: CreateProductRequest): Promise<ProductResponse> => {
    const { ok, data: resData } = await apiClient.post("/service", data);
    if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to create product");
    return resData.data;
};

export const updateProduct = async (productId: number, data: UpdateProductRequest): Promise<ProductResponse> => {
    const { ok, data: resData } = await apiClient.put(`/admin/product/${productId}`, data);
    if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to update product");
    return resData.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
    const { ok, data } = await apiClient.delete(`/admin/product/${productId}`);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to delete product");
};

export const toggleProductStatus = async (productId: number, status: boolean): Promise<ProductResponse> => {
    const { ok, data } = await apiClient.patch(`/admin/product/${productId}/status?status=${status}`, {});
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to toggle status");
    return data.data;
};

