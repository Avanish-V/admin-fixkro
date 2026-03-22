import { apiClient } from "./apiClient";

export interface UserResponse {
  id: number;
  firebaseUid: String;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  role: 'USER' | 'ADMIN' | 'PROFESSIONAL';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  createdAt: string | null;
  updatedAt: string | null;
  // Temporary fields for compatibility with existing components
  avatar?: string;
}

export const fetchUsers = async (): Promise<UserResponse[]> => {
  const { ok, data } = await apiClient.get("/users");
  if (!ok || !data.success) {
    throw new Error(data.error?.message || "Failed to fetch users");
  }
  return data.data; // Backend returns List<UserResponse> wrapped in ApiResponse.success
};

export const fetchUserByUid = async (uid: string): Promise<UserResponse> => {
  const { ok, data } = await apiClient.get(`/users/${uid}`);
  if (!ok || !data.success) {
    throw new Error(data.error?.message || "Failed to fetch user");
  }
  return data.data;
};
