import { apiClient } from "./apiClient";

export interface ProfessionalResponse {
    id: number;
    firebaseUid: string;
    name: string;
    photo: string;
    mobile: string;
    address: string;
    expertise: string[];
    aadhar: string;
    status: string;
}

export interface CreateProfessionalRequest {
    firebaseUid: string;
    name: string;
    photo: string;
    mobile: string;
    address: string;
    expertise: string[];
    aadhar: string;
}

export interface UpdateProfessionalRequest {
    firebaseUid: string;
    name: string;
    photo: string;
    mobile: string;
    address: string;
    expertise: string[];
    aadhar: string;
    status: string;
}

export const fetchProfessionals = async (): Promise<ProfessionalResponse[]> => {
    const { ok, data } = await apiClient.get("/admin/professionals");
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch professionals");
    return data.data || [];
};

export const fetchProfessionalById = async (id: number): Promise<ProfessionalResponse> => {
    const { ok, data } = await apiClient.get(`/admin/professionals/${id}`);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch professional");
    return data.data;
};

export const searchProfessionals = async (query: string): Promise<ProfessionalResponse[]> => {
    const { ok, data } = await apiClient.get(`/admin/professionals/search?query=${query}`);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to search professionals");
    return data.data || [];
};

export const createProfessional = async (data: CreateProfessionalRequest): Promise<ProfessionalResponse> => {
    const { ok, data: resData } = await apiClient.post("/admin/professionals", data);
    if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to create professional");
    return resData.data;
};

export const updateProfessional = async (id: number, data: UpdateProfessionalRequest): Promise<ProfessionalResponse> => {
    const { ok, data: resData } = await apiClient.put(`/admin/professionals/${id}`, data);
    if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to update professional");
    return resData.data;
};

export const deleteProfessional = async (id: number): Promise<void> => {
    const { ok, data } = await apiClient.delete(`/admin/professionals/${id}`);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to delete professional");
};

export const uploadFile = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const { ok, data } = await apiClient.post("/files/upload", formData);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to upload file");
    return data.data;
};

