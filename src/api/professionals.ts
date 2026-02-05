export interface ProfessionalResponse {
    id: number;
    name: string;
    photo: string;
    mobile: string;
    address: string;
    expertise: string[];
    aadharCard: string;
    idPhoto: string;
    status: string;
    completedJobs: number;
    rating: number;
}

export interface CreateProfessionalRequest {
    name: string;
    photo: string;
    mobile: string;
    address: string;
    expertise: string[];
    aadharCard: string;
    idPhoto: string;
}

export interface UpdateProfessionalRequest {
    name: string;
    photo: string;
    mobile: string;
    address: string;
    expertise: string[];
    aadharCard: string;
    idPhoto: string;
    status: string;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/professionals`;

export const fetchProfessionals = async (): Promise<ProfessionalResponse[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch professionals");
    const json = await response.json();
    return json.data || [];
};

export const fetchProfessionalById = async (id: number): Promise<ProfessionalResponse> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch professional");
    const json = await response.json();
    return json.data;
};

export const searchProfessionals = async (query: String): Promise<ProfessionalResponse[]> => {
    const response = await fetch(`${API_URL}/search?query=${query}`);
    if (!response.ok) throw new Error("Failed to search professionals");
    const json = await response.json();
    return json.data || [];
};

export const createProfessional = async (data: CreateProfessionalRequest): Promise<ProfessionalResponse> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create professional");
    const json = await response.json();
    return json.data;
};

export const updateProfessional = async (id: number, data: UpdateProfessionalRequest): Promise<ProfessionalResponse> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update professional");
    const json = await response.json();
    return json.data;
};

export const deleteProfessional = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete professional");
};

export const uploadFile = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/files/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload file");
    const json = await response.json();
    return json.data;
};
