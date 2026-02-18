import { apiClient } from "./apiClient";
import { OrderResponse } from "./orders";

export interface ChartData {
    name: string;
    revenue: number;
    orders: number;
}

export interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    activeServices: number;
    totalProfessionals: number;
    completedToday: number;
    inProgress: number;
    pending: number;
    growthRate: string;
    revenueData: ChartData[];
    recentOrders: OrderResponse[];
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const { ok, data } = await apiClient.get("/dashboard/stats");
    if (!ok || !data.success) {
        throw new Error(data.error?.message || "Failed to fetch dashboard stats");
    }
    return data.data;
};

