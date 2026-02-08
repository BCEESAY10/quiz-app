export interface QuizScore {
  id: string;
  category: string;
  score: number;
  totalQuestions: number;
  date: string;
  timeSpent?: string;
  percentage?: number;
}

export interface CategoryStats {
  category: string;
  icon: string;
  totalQuizzes: number;
  bestScore: number;
  averageScore: number;
  accuracy: number;
  color: string;
}
