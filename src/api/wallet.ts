import { apiClient } from "./apiClient";

export interface WithdrawalRequest {
  id: string;
  technicianId: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  bankAccountId: string;
  createdAt: string;
  processedAt?: string;
  remarks?: string;
}

export const fetchAllWithdrawals = async (): Promise<WithdrawalRequest[]> => {
  const { ok, data } = await apiClient.get("/admin/wallet/withdrawals");
  if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch withdrawals");
  return data.data || [];
};

export const approveWithdrawal = async (id: string, remarks?: string): Promise<WithdrawalRequest> => {
  const { ok, data } = await apiClient.post(`/admin/wallet/withdrawals/${id}/approve`, null);
  if (!ok || !data.success) throw new Error(data.error?.message || "Failed to approve withdrawal");
  return data.data;
};

export const rejectWithdrawal = async (id: string, remarks?: string): Promise<WithdrawalRequest> => {
  const { ok, data } = await apiClient.post(`/admin/wallet/withdrawals/${id}/reject`, null);
  if (!ok || !data.success) throw new Error(data.error?.message || "Failed to reject withdrawal");
  return data.data;
};
