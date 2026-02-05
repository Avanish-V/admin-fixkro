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

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProductsByCategory = async (categoryId: number): Promise<ProductResponse[]> => {
    const response = await fetch(`${API_URL}/services?categoryId=${categoryId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const json = await response.json();
    return json.data || [];
};

export const createProduct = async (data: CreateProductRequest): Promise<ProductResponse> => {
    const response = await fetch(`${API_URL}/service`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to create product");
    }
    const json = await response.json();
    return json.data;
};

export const updateProduct = async (productId: number, data: UpdateProductRequest): Promise<ProductResponse> => {
    const response = await fetch(`${API_URL}/product/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to update product");
    }
    const json = await response.json();
    return json.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/product/${productId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete product");
    }
};
