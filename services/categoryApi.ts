import { apiClient } from "./api.config";

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
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  },
};
