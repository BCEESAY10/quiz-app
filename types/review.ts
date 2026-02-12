export interface SubmitReviewData {
  userName: string;
  userEmail: string;
  rating: number;
  feedback: string;
}

export interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  onDontAskAgain: () => void;
}
