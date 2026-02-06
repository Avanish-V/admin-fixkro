export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchReviews = async (): Promise<Review[]> => {
  const response = await fetch(`${API_URL}/reviews`);
  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }
  const json = await response.json();
  return json.data || [];
};

export const createReview = async (data: CreateReviewRequest): Promise<Review> => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create review");
  }
  const json = await response.json();
  return json.data;
};

export const updateReview = async (id: string, data: CreateReviewRequest): Promise<Review> => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update review");
  }
  const json = await response.json();
  return json.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete review");
  }
};
