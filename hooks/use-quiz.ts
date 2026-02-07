import { quizApi, QuizSubmitRequest } from "@/services/quizApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useStartQuiz = () => {
  return useMutation({
    mutationFn: (categoryId: string) => quizApi.startQuiz(categoryId),
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuizSubmitRequest) => quizApi.submitQuiz(data),
    onSuccess: () => {
      // Invalidate scores to refresh after quiz completion
      queryClient.invalidateQueries({ queryKey: ["scores"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
};

export const useQuestionsByCategory = (
  categoryId: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["questions", categoryId],
    queryFn: () => quizApi.getQuestionsByCategory(categoryId),
    enabled: enabled && !!categoryId,
  });
};
