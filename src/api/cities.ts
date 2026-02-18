import { apiClient } from "./apiClient";

export interface City {
    id: string;
    name: string;
    state: string;
    pincode: string;
    symbol: string;
    isActive: boolean;
    createdAt?: string;
}

export interface CityRequest {
    name: string;
    state: string;
    pincode: string;
    symbol: string;
    isActive: boolean;
}

export const citiesApi = {
    getAll: async () => {
        const { ok, data } = await apiClient.get("/cities");
        if (!ok) throw new Error("Failed to fetch cities");
        return data.data;
    },

    create: async (data: CityRequest) => {
        const result = await apiClient.post("/cities", data);
        if (!result.ok) throw new Error("Failed to create city");
        return result.data.data;
    },

    update: async (id: string, data: CityRequest) => {
        const result = await apiClient.put(`/cities/${id}`, data);
        if (!result.ok) throw new Error("Failed to update city");
        return result.data.data;
    },

    delete: async (id: string) => {
        const result = await apiClient.delete(`/cities/${id}`);
        if (!result.ok) throw new Error("Failed to delete city");
    },
};

