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

export const fetchProductsByCategory = async (categoryId: number): Promise<ProductResponse[]> => {
    const { ok, data } = await apiClient.get(`/services?categoryId=${categoryId}`);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch products");
    return data.data || [];
};

export const fetchAllProducts = async (): Promise<ProductResponse[]> => {
    const { ok, data } = await apiClient.get("/services/all");
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch all products");
    return data.data || [];
};

export const createProduct = async (data: CreateProductRequest): Promise<ProductResponse> => {
    const { ok, data: resData } = await apiClient.post("/service", data);
    if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to create product");
    return resData.data;
};

export const updateProduct = async (productId: number, data: UpdateProductRequest): Promise<ProductResponse> => {
    const { ok, data: resData } = await apiClient.put(`/product/${productId}`, data);
    if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to update product");
    return resData.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
    const { ok, data } = await apiClient.delete(`/product/${productId}`);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to delete product");
};

