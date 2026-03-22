const isLocal = import.meta.env.VITE_IS_LOCAL === "true";
const API_URL = isLocal
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PRODUCTION_API_URL;

export const apiClient = {
    fetch: async (endpoint: string, options: RequestInit = {}) => {
        const token = localStorage.getItem("admin_token");

        const headers: Record<string, string> = {
            ...(options.headers as Record<string, string>),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // Only set Content-Type to JSON if the body is not FormData
        if (!(options.body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401 || response.status === 403) {
            // Clear token and redirect to login if unauthorized
            localStorage.removeItem("admin_token");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        const json = await response.json();
        return { ok: response.ok, status: response.status, data: json };
    },

    get: (endpoint: string) => apiClient.fetch(endpoint, { method: "GET" }),

    post: (endpoint: string, data: any) =>
        apiClient.fetch(endpoint, {
            method: "POST",
            body: data instanceof FormData ? data : JSON.stringify(data)
        }),

    put: (endpoint: string, data: any) =>
        apiClient.fetch(endpoint, {
            method: "PUT",
            body: data instanceof FormData ? data : JSON.stringify(data)
        }),

    delete: (endpoint: string) =>
        apiClient.fetch(endpoint, { method: "DELETE" }),

    patch: (endpoint: string, data: any) =>
        apiClient.fetch(endpoint, {
            method: "PATCH",
            body: data instanceof FormData ? data : JSON.stringify(data)
        }),
};

