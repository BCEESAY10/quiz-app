import { apiClient } from "./api.config";

export interface BestPerformance {
  category: string;
  score: number;
  percentage: number;
  date: string;
}

export interface ScoreOverview {
  total_quizzes: number;
  accuracy: number;
  average_score: number;
  best_performance: BestPerformance;
}

export interface QuestionDetail {
  question: string;
  selectedOption: string;
  isCorrect: boolean;
}

export interface QuizCategory {
  _id: string;
  name: string;
}

export interface ScoreHistoryItem {
  _id: string;
  user: string;
  category: QuizCategory;
  questions: QuestionDetail[];
  score: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  takenAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScoreHistoryResponse {
  page: number;
  total: number;
  items: ScoreHistoryItem[];
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
      `/user/${userId}/quiz-overview`,
    );
    return response.data;
  },

  getHistory: async (
    userId: string,
    page: number = 1,
  ): Promise<ScoreHistoryResponse> => {
    const response = await apiClient.get<ScoreHistoryResponse>(
      `/user/${userId}/quiz-history?page=${page}`,
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
