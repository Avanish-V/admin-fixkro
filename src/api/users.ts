import { apiClient } from "./apiClient";

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
  status: boolean;
  ordersCount: number;
  address?: UserAddress;
}

export interface UsersListResponse {
  users: UserResponse[];
  totalCount: number;
}

export const fetchUsers = async (): Promise<UsersListResponse> => {
  const { ok, data } = await apiClient.get("/users");
  if (!ok || !data.success) {
    throw new Error(data.error?.message || "Failed to fetch users");
  }
  return data.data;
};

export const fetchUserById = async (id: string): Promise<UserResponse> => {
  const { ok, data } = await apiClient.get(`/users/${id}`);
  if (!ok || !data.success) {
    throw new Error(data.error?.message || "Failed to fetch user");
  }
  return data.data;
};
