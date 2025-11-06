import { LeaderboardEntry, QuizRecord, Stats } from "@/types/home";

export const stats: Stats = {
  completed: 24,
  streak: 5,
  points: 1250,
};

export const recentQuizzes: QuizRecord[] = [
  { id: 1, category: "Science", score: 8, total: 10, date: "Today" },
  { id: 2, category: "Sports", score: 7, total: 10, date: "Yesterday" },
];

export const leaderboard: LeaderboardEntry[] = [
  { id: 1, name: "Sarah", points: 2100, rank: 1 },
  { id: 2, name: "Mike", points: 1890, rank: 2 },
  { id: 3, name: "You", points: 1250, rank: 3 },
];
