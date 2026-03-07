import { apiClient } from "./apiClient";

export const uploadFile = async (file: File, folder: string = "general"): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await apiClient.post("/files/upload", formData);

    if (!response.ok) {
        throw new Error(response.data.error?.message || "Failed to upload file");
    }

    return response.data.data;
};
