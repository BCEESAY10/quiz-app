import { Toast } from "@/components/ui/toast";
import { useAppTheme } from "@/provider/ThemeProvider";
import { useAuth } from "@/provider/UserProvider";
import { reviewApi } from "@/services/reviewApi";
import { ReviewModalProps } from "@/types/review";
import { ToastState } from "@/types/toast";
import { useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const isWebWide = isWeb && width > 768;

export default function ReviewModal({
  visible,
  onClose,
  onSubmitSuccess,
  onDontAskAgain,
}: ReviewModalProps) {
  const { theme } = useAppTheme();
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setToast({
        message: "Please select a rating",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewApi.submitReview({
        userName: user?.fullName || "Anonymous",
        userEmail: user?.email || "",
        rating,
        feedback: feedback.trim(),
      });

      setToast({
        message: "Thank you for your feedback!",
        type: "success",
      });

      // Reset form
      setRating(0);
      setFeedback("");

      // Close modal after short delay
      setTimeout(() => {
        onSubmitSuccess();
      }, 1500);
    } catch (error) {
      setToast({
        message: "Failed to submit review. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDontAskAgain = () => {
    setRating(0);
    setFeedback("");
    onDontAskAgain();
  };

  const handleMaybeLater = () => {
    setRating(0);
    setFeedback("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleMaybeLater}>
      <Pressable style={styles.overlay} onPress={handleMaybeLater}>
        <Pressable
          style={[
            styles.container,
            { backgroundColor: theme.background },
            isWebWide && styles.containerWeb,
          ]}
          onPress={(e) => e.stopPropagation()}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.tint }]}>
                We&apos;d love your feedback! 💭
              </Text>
              <Text style={[styles.subtitle, { color: theme.icon }]}>
                Help us improve your quiz experience
              </Text>
            </View>

            {/* Star Rating */}
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingLabel, { color: theme.text }]}>
                How would you rate this Quiz?
              </Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleStarPress(star)}
                    style={styles.starButton}>
                    <Text
                      style={[
                        styles.starText,
                        star <= rating && styles.starTextFilled,
                      ]}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Feedback Input */}
            <View style={styles.feedbackContainer}>
              <Text style={[styles.feedbackLabel, { color: theme.text }]}>
                Tell us about your experience (Optional)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.icon,
                  },
                ]}
                placeholder="Share your thoughts, suggestions, or any issues you've encountered..."
                placeholderTextColor={theme.icon}
                multiline
                numberOfLines={4}
                value={feedback}
                onChangeText={setFeedback}
                textAlignVertical="top"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: theme.primaryButton.background },
                  isSubmitting && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}>
                <Text
                  style={[
                    styles.submitButtonText,
                    { color: theme.primaryButton.text },
                  ]}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Text>
              </TouchableOpacity>

              <View style={styles.secondaryButtons}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleMaybeLater}
                  disabled={isSubmitting}>
                  <Text
                    style={[styles.secondaryButtonText, { color: theme.icon }]}>
                    Maybe Later
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleDontAskAgain}
                  disabled={isSubmitting}>
                  <Text
                    style={[styles.secondaryButtonText, { color: theme.icon }]}>
                    Don&apos;t Ask Again
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Toast */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 16,
    padding: 24,
    maxHeight: "90%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  containerWeb: {
    maxWidth: 600,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  starButton: {
    padding: 4,
  },
  starText: {
    fontSize: 38,
    color: "#D1D5DB",
  },
  starTextFilled: {
    color: "#F59E0B",
  },
  feedbackContainer: {
    marginBottom: 24,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    ...Platform.select({
      web: {
        outline: "none",
      },
    }),
  },
  buttonsContainer: {
    gap: 12,
  },
  submitButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
