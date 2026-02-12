export type Category = {
  id: string;
  name: string;
  icon?: string;
  questions?: number;
  color?: string;
};

export type QuizRecord = {
  id: string;
  category: string;
  score: number;
  total: number;
  date: string;
  percentage?: number;
};

export type LeaderboardEntry = {
  id?: string;
  name: string;
  points: number;
  rank: number;
};

export type Stats = {
  completed: number;
  streak: number;
  points: number;
  longestStreak: number;
};
