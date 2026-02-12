export interface Question {
  id: string; // MongoDB _id
  question: string;
  options: string[];
  correctAnswer: number;
  timer: number;
  score: number;
  category?: string;
  categoryId?: string;
}

export interface QuizSubmissionResult {
  score: string;
  percentage: number;
  correct_answers: number;
  wrong_answers: number;
  comment: string;
}

export interface QuizState {
  category_id: string;
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  score: number;
  isCompleted: boolean;
  submissionResult?: QuizSubmissionResult;
}
