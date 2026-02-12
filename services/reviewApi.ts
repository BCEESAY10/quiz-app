import { SubmitReviewData } from "@/types/review";
import { apiClient } from "./api.config";

export interface SubmitReviewResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

export const reviewApi = {
  submitReview: async (
    data: SubmitReviewData,
  ): Promise<SubmitReviewResponse> => {
    const response = await apiClient.post<SubmitReviewResponse>("/reviews", {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },
};
