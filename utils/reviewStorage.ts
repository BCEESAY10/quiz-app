import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const KEYS = {
  DISMISS_COUNT: "@app:review_dismiss_count",
  LAST_REVIEW_QUIZ_COUNT: "@app:last_review_quiz_count",
  DONT_ASK_AGAIN: "@app:review_dont_ask_again",
};

// Platform-agnostic storage
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      return window.localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      window.localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === "web") {
      window.localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
};

export const reviewStorage = {
  getDismissCount: async (): Promise<number> => {
    const count = await storage.getItem(KEYS.DISMISS_COUNT);
    return count ? parseInt(count, 10) : 0;
  },

  incrementDismissCount: async (): Promise<number> => {
    const currentCount = await reviewStorage.getDismissCount();
    const newCount = currentCount + 1;
    await storage.setItem(KEYS.DISMISS_COUNT, newCount.toString());
    return newCount;
  },

  resetDismissCount: async (): Promise<void> => {
    await storage.removeItem(KEYS.DISMISS_COUNT);
  },

  getLastReviewQuizCount: async (): Promise<number> => {
    const count = await storage.getItem(KEYS.LAST_REVIEW_QUIZ_COUNT);
    return count ? parseInt(count, 10) : 0;
  },

  setLastReviewQuizCount: async (count: number): Promise<void> => {
    await storage.setItem(KEYS.LAST_REVIEW_QUIZ_COUNT, count.toString());
  },

  getDontAskAgain: async (): Promise<boolean> => {
    const value = await storage.getItem(KEYS.DONT_ASK_AGAIN);
    return value === "true";
  },

  setDontAskAgain: async (value: boolean): Promise<void> => {
    await storage.setItem(KEYS.DONT_ASK_AGAIN, value.toString());
  },

  shouldShowReview: async (currentQuizCount: number): Promise<boolean> => {
    // Check if user opted out
    const dontAskAgain = await reviewStorage.getDontAskAgain();
    if (dontAskAgain) return false;

    // Check if dismissed too many times
    const dismissCount = await reviewStorage.getDismissCount();
    if (dismissCount >= 5) return false;

    // Check if it's a milestone (every 10 quizzes)
    if (currentQuizCount % 10 !== 0) return false;

    // Check if already reviewed at this milestone
    const lastReviewQuizCount = await reviewStorage.getLastReviewQuizCount();
    if (currentQuizCount <= lastReviewQuizCount) return false;

    return true;
  },

  markAsReviewed: async (currentQuizCount: number): Promise<void> => {
    await reviewStorage.setLastReviewQuizCount(currentQuizCount);
    await reviewStorage.resetDismissCount();
  },
};
