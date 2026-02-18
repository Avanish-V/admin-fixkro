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

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/dashboard`;

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error("Failed to fetch dashboard stats");
    const json = await response.json();
    return json.data;
};
