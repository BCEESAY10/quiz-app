import { useQuery } from "@tanstack/react-query";
import { scoreApi } from "@/services/scoreApi";

export const useScoreOverview = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["scores", "overview", userId],
    queryFn: () => scoreApi.getOverview(userId),
    enabled: enabled && !!userId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useScoreHistory = (
  userId: string,
  page: number = 1,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["scores", "history", userId, page],
    queryFn: () => scoreApi.getHistory(userId, page),
    enabled: enabled && !!userId,
    placeholderData: (previousData) => previousData,
  });
};

export const useLeaderboard = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["leaderboard", page, limit],
    queryFn: () => scoreApi.getLeaderboard(page, limit),
    staleTime: 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData,
  });
};
