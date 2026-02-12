import { apiClient } from "./api.config";

export interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string | number;
  timer: number;
  score: number;
}

export interface QuizStartRequest {
  category_id: string;
}

export interface QuizStartResponse {
  category: string;
  questions: Question[];
}

export interface QuizSubmitRequest {
  category_id: string;
  answers: {
    question_id: string;
    selected_option: string;
  }[];
  time_taken?: number;
}

export interface QuizSubmitResponse {
  score: string;
  percentage: number;
  correct_answers: number;
  wrong_answers: number;
  comment: string;
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
