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

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllOrders = async (): Promise<OrderResponse[]> => {
    const response = await fetch(`${API_URL}/order/all`);
    if (!response.ok) {
        throw new Error("Failed to fetch all orders");
    }
    const json = await response.json();
    return json.data || [];
};

export const fetchOrder = async (orderId: number): Promise<OrderResponse> => {
    const response = await fetch(`${API_URL}/order/${orderId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch order details");
    }
    const json = await response.json();
    return json.data;
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<OrderResponse> => {
    const response = await fetch(`${API_URL}/order/${orderId}/status?status=${status}`, {
        method: "PATCH",
    });
    if (!response.ok) {
        throw new Error("Failed to update order status");
    }
    const json = await response.json();
    return json.data;
};

export const cancelOrder = async (orderId: number, reason?: string): Promise<OrderResponse> => {
    const url = new URL(`${API_URL}/order/${orderId}/cancel`);
    if (reason) url.searchParams.append("reason", reason);

    const response = await fetch(url.toString(), {
        method: "POST",
    });
    if (!response.ok) {
        throw new Error("Failed to cancel order");
    }
    const json = await response.json();
    return json.data;
};

export const assignTechnician = async (orderId: number, technicianId: number): Promise<OrderResponse> => {
    const response = await fetch(`${API_URL}/order/${orderId}/assign-technician?technicianId=${technicianId}`, {
        method: "POST",
    });
    if (!response.ok) {
        throw new Error("Failed to assign technician");
    }
    const json = await response.json();
    return json.data;
};
