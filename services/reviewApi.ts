import { SubmitReviewData } from "@/types/review";

export const reviewApi = {
  submitReview: async (data: SubmitReviewData): Promise<void> => {
    // TODO: Replace with actual API endpoint when available
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit review");
    }
  },
};
