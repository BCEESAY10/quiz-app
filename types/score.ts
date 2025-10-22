export interface QuizScore {
  id: number;
  category: string;
  score: number;
  totalQuestions: number;
  date: string;
  timeSpent: string;
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
