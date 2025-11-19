export interface User {
  fullName: string;
  email: string;
  password: string;
  stats?: {
    quizzesCompleted: number;
    totalPoints: number;
    streak: number;
  };
}
