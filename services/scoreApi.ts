import { apiClient } from "./api.config";

export interface ScoreOverview {
  total_quizzes: number;
  total_points: number;
  average_score: number;
  best_category?: string;
  streak?: number;
}

export interface ScoreHistory {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  category_name: string;
  completed_at: string;
}

export interface ScoreHistoryResponse {
  scores: ScoreHistory[];
  pagination: {
    page: number;
    total_pages: number;
    total_count: number;
  };
}

export interface LeaderboardEntry {
  rank?: number;
  _id: string;
  fullname: string;
  totalPoints: number;
}

export interface LeaderboardResponse {
  page: number;
  users: LeaderboardEntry[];
}

export const scoreApi = {
  getOverview: async (userId: string): Promise<ScoreOverview> => {
    const response = await apiClient.get<ScoreOverview>(
      `/scores/overview/${userId}`,
    );
    return response.data;
  },

  getHistory: async (
    userId: string,
    page: number = 1,
  ): Promise<ScoreHistoryResponse> => {
    const response = await apiClient.get<ScoreHistoryResponse>(
      `/scores/history/${userId}?page=${page}`,
    );
    return response.data;
  },

  getLeaderboard: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<LeaderboardResponse> => {
    const response = await apiClient.get<LeaderboardResponse>(
      `/leaderboard?page=${page}&limit=${limit}`,
    );
    return response.data;
  },
};
