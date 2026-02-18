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

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchOffers = async (): Promise<Offer[]> => {
    const response = await fetch(`${API_URL}/offers`);
    if (!response.ok) {
        throw new Error("Failed to fetch offers");
    }
    const json = await response.json();
    return json.data || [];
};

export const fetchOfferById = async (id: string): Promise<Offer> => {
    const response = await fetch(`${API_URL}/offers/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch offer");
    }
    const json = await response.json();
    return json.data;
};

export const createOffer = async (data: CreateOfferRequest): Promise<Offer> => {
    const response = await fetch(`${API_URL}/offers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to create offer");
    }
    const json = await response.json();
    return json.data;
};

export const updateOffer = async (id: string, data: CreateOfferRequest): Promise<Offer> => {
    const response = await fetch(`${API_URL}/offers/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to update offer");
    }
    const json = await response.json();
    return json.data;
};

export const toggleOfferStatus = async (id: string): Promise<Offer> => {
    const response = await fetch(`${API_URL}/offers/${id}/toggle`, {
        method: "PATCH",
    });
    if (!response.ok) {
        throw new Error("Failed to toggle offer status");
    }
    const json = await response.json();
    return json.data;
};

export const deleteOffer = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/offers/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete offer");
    }
};
