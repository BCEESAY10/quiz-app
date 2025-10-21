import { Question } from "@/types/quiz";

/** Shuffle array using Fisher-Yates algorithm */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/** Get a randomized selection of questions (e.g., 5 per quiz) */
export const getRandomQuestions = (
  allQuestions: Question[],
  count = 5
): Question[] => {
  const shuffled = shuffleArray(allQuestions);
  return shuffled.slice(0, count);
};
