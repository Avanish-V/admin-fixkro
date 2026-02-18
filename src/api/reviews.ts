import { apiClient } from "./apiClient";

export interface Review {
  id: string;
  productId: string;
  orderId?: string;
  productName: string;
  customerName: string;
  rating: number;
  technicianRating: number;
  isRecommended: boolean;
  impressions: string[];
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  orderId?: string;
  customerName: string;
  rating: number;
  technicianRating: number;
  isRecommended: boolean;
  impressions: string[];
  comment: string;
}

export const fetchReviews = async (): Promise<Review[]> => {
  const { ok, data } = await apiClient.get("/reviews");
  if (!ok || !data.success) throw new Error(data.error?.message || "Failed to fetch reviews");
  return data.data || [];
};

export const createReview = async (data: CreateReviewRequest): Promise<Review> => {
  const { ok, data: resData } = await apiClient.post("/reviews", data);
  if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to create review");
  return resData.data;
};

export const updateReview = async (id: string, data: CreateReviewRequest): Promise<Review> => {
  const { ok, data: resData } = await apiClient.put(`/reviews/${id}`, data);
  if (!ok || !resData.success) throw new Error(resData.error?.message || "Failed to update review");
  return resData.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  const { ok, data } = await apiClient.delete(`/reviews/${id}`);
  if (!ok || !data.success) throw new Error(data.error?.message || "Failed to delete review");
};

