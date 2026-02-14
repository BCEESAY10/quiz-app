import { userApi } from "@/services/userApi";
import { useQuery } from "@tanstack/react-query";

export const useUserActivities = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "activities", userId],
    queryFn: () => userApi.getActivities(userId),
    enabled: enabled && !!userId,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true, // Refetch when app regains focus
    refetchInterval: 60 * 1000, // Refetch every 60 seconds for continuous updates
  });
};
