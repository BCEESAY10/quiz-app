import { userApi } from "@/services/userApi";
import { useQuery } from "@tanstack/react-query";

export const useUserActivities = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "activities", userId],
    queryFn: () => userApi.getActivities(userId),
    enabled: enabled && !!userId,
    staleTime: 60 * 1000,
  });
};
