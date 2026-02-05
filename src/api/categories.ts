export interface ProductDescription {
  title: string;
  shortDescription: string;
}

export interface CategoryResponse {
  categoryId: number;
  title: string;
  iconType: string;
  iconValue: string;
  themeColor: string;
  status: string;
}

export interface CreateCategoryRequest {
  title: string;
  iconType: string;
  iconValue: string;
  themeColor: string;
  status: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCategories = async (): Promise<CategoryResponse[]> => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  const json = await response.json();
  return json.data || [];
};

export const createCategory = async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
  const response = await fetch(`${API_URL}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create category");
  }
  const json = await response.json();
  return json.data;
};

export const updateCategory = async (categoryId: number, data: CreateCategoryRequest): Promise<CategoryResponse> => {
  const response = await fetch(`${API_URL}/category/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update category");
  }
  const json = await response.json();
  return json.data;
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/category/${categoryId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
};
