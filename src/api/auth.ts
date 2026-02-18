import { apiClient } from "./apiClient";

export interface LoginResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: {
        id: string;
        email: string;
    };
}

export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const { ok, data } = await apiClient.post("/auth/login", { email, password });

        // data is the ApiResponse object: { success: boolean, data: T, error: ... }
        if (!ok || !data.success) {
            throw new Error(data.error?.message || data.message || "Login failed");
        }

        const loginData = data.data as LoginResponse;
        if (!loginData || !loginData.accessToken) {
            throw new Error("Invalid response from server: Missing access token");
        }

        // Save token to localStorage
        localStorage.setItem("admin_token", loginData.accessToken);

        return loginData;
    },

    logout: () => {
        localStorage.removeItem("admin_token");
        window.location.href = "/login";
    },

    getToken: () => {
        return localStorage.getItem("admin_token");
    },
};
