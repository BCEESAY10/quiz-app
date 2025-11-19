import { reviewStorage } from "@/utils/reviewStorage";
import { useEffect, useState } from "react";

export function useReviewPrompt(quizzesCompleted: number) {
  const [shouldShow, setShouldShow] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkShouldShow();
  }, [quizzesCompleted]);

  const checkShouldShow = async () => {
    setIsChecking(true);
    const show = await reviewStorage.shouldShowReview(quizzesCompleted);
    setShouldShow(show);
    setIsChecking(false);
  };

  const handleDismiss = async () => {
    const newCount = await reviewStorage.incrementDismissCount();
    setShouldShow(false);

    // If dismissed 5 times, don't show again
    if (newCount >= 5) {
      await reviewStorage.setDontAskAgain(true);
    }
  };

  const handleDontAskAgain = async () => {
    await reviewStorage.setDontAskAgain(true);
    setShouldShow(false);
  };

  const handleSubmitSuccess = async () => {
    await reviewStorage.markAsReviewed(quizzesCompleted);
    setShouldShow(false);
  };

  return {
    shouldShow,
    isChecking,
    handleDismiss,
    handleDontAskAgain,
    handleSubmitSuccess,
  };
}
