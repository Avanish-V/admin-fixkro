import { apiClient } from "./apiClient";

export interface Address {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
}

export interface OrderResponse {
    id: number;
    orderId: string;
    customerId: string;
    serviceAddress: Address;
    productId: number;
    productTitle: string;
    applianceBrand?: string;
    applianceModel?: string;
    technicianId: number | null;
    technicianName: string | null;
    technicianPhoto: string | null;
    technicianUid: string | null;
    technicianPhone: string | null;
    price: number;
    tax: number;
    offerId?: number;
    couponCode?: string;
    discount?: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentMode?: string;
    scheduledAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
    cancellationReason?: string;
}

export const fetchAllOrders = async (): Promise<OrderResponse[]> => {
    const { ok, data } = await apiClient.get("/order/all");
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch orders");
    return data.data || [];
};

export const fetchOrder = async (orderId: number): Promise<OrderResponse> => {
    const { ok, data } = await apiClient.get(`/order/${orderId}`);
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch order");
    return data.data;
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<OrderResponse> => {
    const { ok, data } = await apiClient.fetch(`/order/${orderId}/status?status=${status}`, { method: "PATCH" });
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to update order status");
    return data.data;
};

export const cancelOrder = async (orderId: number, reason?: string): Promise<OrderResponse> => {
    const endpoint = reason
        ? `/order/${orderId}/cancel?reason=${encodeURIComponent(reason)}`
        : `/order/${orderId}/cancel`;
    const { ok, data } = await apiClient.post(endpoint, {});
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to cancel order");
    return data.data;
};

export const assignTechnician = async (orderId: number, technicianId: number): Promise<OrderResponse> => {
    const { ok, data } = await apiClient.post(`/order/${orderId}/assign-technician?technicianId=${technicianId}`, {});
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to assign technician");
    return data.data;
};

export const unassignTechnician = async (orderId: number): Promise<OrderResponse> => {
    const { ok, data } = await apiClient.post(`/order/${orderId}/unassign-technician`, {});
    if (!ok || !data.success) throw new Error(data.error?.message || "Failed to unassign technician");
    return data.data;
};

