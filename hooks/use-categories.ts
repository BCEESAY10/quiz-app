import { categoryApi } from "@/services/categoryApi";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
