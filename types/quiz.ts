export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category?: string;
  categoryId?: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  score: number;
  isCompleted: boolean;
}
