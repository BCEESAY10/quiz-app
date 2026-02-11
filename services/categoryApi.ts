import { apiClient } from "./api.config";

export interface CategoryResponse {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<CategoryResponse[]>(
      "/public/categories",
    );
    // Normalize _id to id for consistency
    return response.data.map((category) => ({
      id: category._id,
      name: category.name,
      description: category.description,
      icon: category.icon,
    }));
  },
};
