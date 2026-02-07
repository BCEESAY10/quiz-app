import { apiClient } from "./api.config";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  category_id: string;
}

export interface QuizStartRequest {
  category_id: string;
}

export interface QuizStartResponse {
  quiz_id: string;
  questions: Question[];
  time_limit?: number;
}

export interface QuizSubmitRequest {
  quiz_id: string;
  answers: {
    question_id: string;
    selected_answer: string;
  }[];
  time_taken?: number;
}

export interface QuizSubmitResponse {
  score: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  results: {
    question_id: string;
    is_correct: boolean;
    selected_answer: string;
    correct_answer: string;
  }[];
}

export const quizApi = {
  startQuiz: async (categoryId: string): Promise<QuizStartResponse> => {
    const response = await apiClient.get<QuizStartResponse>(
      `/quizzes/start?category_id=${categoryId}`,
    );
    return response.data;
  },

  submitQuiz: async (data: QuizSubmitRequest): Promise<QuizSubmitResponse> => {
    const response = await apiClient.post<QuizSubmitResponse>(
      "/quizzes/submit",
      data,
    );
    return response.data;
  },

  getQuestionsByCategory: async (categoryId: string): Promise<Question[]> => {
    const response = await apiClient.get<Question[]>(
      `/questions/category/${categoryId}`,
    );
    return response.data;
  },
};
