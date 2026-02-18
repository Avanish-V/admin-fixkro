import { apiClient } from "./apiClient";

export interface Offer {
    id: string;
    couponCode: string;
    shortDescription?: string;
    categoryId: string | null;
    categoryName: string | null;
    productId: string | null;
    productName: string | null;
    discountType: "FIXED" | "PERCENTAGE";
    discountValue: number;
    expiryDate: string;
    limit: number;
    userType: "FIRST_USER" | "REGULAR";
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
    updatedAt: string;
}

export interface CreateOfferRequest {
    couponCode: string;
    shortDescription?: string;
    categoryId: string | null;
    productId: string | null;
    discountType: "FIXED" | "PERCENTAGE";
    discountValue: number;
    expiryDate: string;
    limit: number;
    userType: "FIRST_USER" | "REGULAR";
}

export const fetchOffers = async (): Promise<Offer[]> => {
    const { ok, data } = await apiClient.get("/offers");
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch offers");
    return data.data || [];
};

export const fetchOfferById = async (id: string): Promise<Offer> => {
    const { ok, data } = await apiClient.get(`/offers/${id}`);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch offer");
    return data.data;
};

export const createOffer = async (data: CreateOfferRequest): Promise<Offer> => {
    const { ok, data: resData } = await apiClient.post("/offers", data);
    if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to create offer");
    return resData.data;
};

export const updateOffer = async (id: string, data: CreateOfferRequest): Promise<Offer> => {
    const { ok, data: resData } = await apiClient.put(`/offers/${id}`, data);
    if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to update offer");
    return resData.data;
};

export const toggleOfferStatus = async (id: string): Promise<Offer> => {
    const { ok, data } = await apiClient.fetch(`/offers/${id}/toggle`, { method: "PATCH" });
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to toggle offer status");
    return data.data;
};

export const deleteOffer = async (id: string): Promise<void> => {
    const { ok, data } = await apiClient.delete(`/offers/${id}`);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to delete offer");
};

