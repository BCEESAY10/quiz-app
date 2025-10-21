export type Category = {
  id: number;
  name: string;
  icon: string;
  questions: number;
  color: string;
};

export type QuizRecord = {
  id: number;
  category: string;
  score: number;
  total: number;
  date: string;
};

export type LeaderboardEntry = {
  id: number;
  name: string;
  points: number;
  rank: number;
};

export type Stats = {
  completed: number;
  streak: number;
  points: number;
};
