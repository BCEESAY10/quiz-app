export interface User {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  stats?: {
    quizzesCompleted: number;
    totalPoints: number;
    streak: number;
  };
}
