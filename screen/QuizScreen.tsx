import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useStartQuiz, useSubmitQuiz } from "@/hooks/use-quiz";
import { useAppTheme } from "@/provider/ThemeProvider";
import { Question, QuizState, QuizSubmissionResult } from "@/types/quiz";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const categoryId = useMemo(() => {
    const id = params.categoryId || params.category;
    return typeof id === "string" ? id : "";
  }, [params.categoryId, params.category]);

  const categoryName = useMemo(() => {
    const name = params.categoryName || params.category;
    return typeof name === "string" ? name : "General";
  }, [params.categoryName, params.category]);
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
  const isWeb = Platform.OS === "web";
  const isWideScreen = isWeb && width >= 768;

  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [timeoutNotice, setTimeoutNotice] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<QuizSubmissionResult | null>(null);
  const hasSubmittedRef = useRef(false);

  const startQuizMutation = useStartQuiz();
  const submitQuizMutation = useSubmitQuiz();

  const handleTimeUp = () => {
    if (!quizState) return;

    const newSelectedAnswers = [...quizState.selectedAnswers];
    newSelectedAnswers[quizState.currentQuestionIndex] = null;

    setQuizState({
      ...quizState,
      selectedAnswers: newSelectedAnswers,
    });

    setShowAnswer(true);
    setTimeoutNotice(true);
  };

  // ======== Initialize quiz when category is provided ==========
  useEffect(() => {
    const initializeQuiz = async () => {
      if (!categoryId) return;

      try {
        const response = await startQuizMutation.mutateAsync(categoryId);
        console.log("[Quiz] Start quiz response received");
        const normalizedQuestions: Question[] = response.questions.map(
          (question) => {
            // Handle correctAnswer - could be a string value or an index string
            let correctIndex: number;
            if (typeof question.correctAnswer === "number") {
              correctIndex = question.correctAnswer;
            } else if (!isNaN(Number(question.correctAnswer))) {
              // It's an index as a string (e.g., "0", "2")
              correctIndex = Number(question.correctAnswer);
            } else {
              // It's a string value - find the index
              correctIndex = question.options.findIndex(
                (option) => option === question.correctAnswer,
              );
            }

            return {
              id: question._id,
              question: question.question,
              options: question.options,
              correctAnswer: correctIndex >= 0 ? correctIndex : 0,
              timer: question.timer,
              score: question.score,
              category: categoryName,
              categoryId: categoryId,
            };
          },
        );

        console.log("[Quiz] Setting quiz state with category_id:", categoryId);
        setQuizState({
          category_id: categoryId,
          questions: normalizedQuestions,
          currentQuestionIndex: 0,
          selectedAnswers: new Array(normalizedQuestions.length).fill(null),
          score: 0,
          isCompleted: false,
        });
        hasSubmittedRef.current = false;
      } catch (error) {
        console.error("Failed to start quiz:", error);
      }
    };

    initializeQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, categoryName]);

  // Submit quiz when completed
  useEffect(() => {
    const submitResults = async () => {
      console.log(
        "[Quiz] Submission effect triggered - isCompleted:",
        quizState?.isCompleted,
        "category_id:",
        quizState?.category_id,
        "hasSubmitted:",
        hasSubmittedRef.current,
      );

      if (
        !quizState?.isCompleted ||
        !quizState?.category_id ||
        hasSubmittedRef.current
      ) {
        console.log(
          "[Quiz] Skipping submission - early return",
          "isCompleted:",
          quizState?.isCompleted,
          "category_id_empty:",
          !quizState?.category_id,
          "already_submitted:",
          hasSubmittedRef.current,
        );
        return;
      }

      console.log("[Quiz] Preparing to submit answers...");
      const answers = quizState.questions.map((question, index) => {
        const selectedIndex = quizState.selectedAnswers[index];
        const selectedOption =
          selectedIndex !== null ? question.options[selectedIndex] : "";

        return {
          question_id: question.id,
          selected_option: selectedOption,
        };
      });

      console.log("[Quiz] Submitting with answers:", answers);
      try {
        const response = await submitQuizMutation.mutateAsync({
          category_id: quizState.category_id,
          answers: answers,
        });

        console.log("[Quiz] Submission successful:", response);
        // Store the submission result from the API response
        setSubmissionResult({
          score: response.score,
          percentage: response.percentage,
          correct_answers: response.correct_answers,
          wrong_answers: response.wrong_answers,
          comment: response.comment,
        });
        hasSubmittedRef.current = true;
      } catch (error) {
        console.error("[Quiz] Failed to submit quiz:", error);
      }
    };

    submitResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState?.isCompleted, quizState?.category_id]);

  // Timer effect
  useEffect(() => {
    if (!quizState || quizState.isCompleted || showAnswer) {
      return;
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

    // Initialize timer for current question using backend value
    setTimeLeft(currentQuestion.timer);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up! Auto-submit as wrong
          if (quizState) {
            const newSelectedAnswers = [...quizState.selectedAnswers];
            newSelectedAnswers[quizState.currentQuestionIndex] = null;

            setQuizState({
              ...quizState,
              selectedAnswers: newSelectedAnswers,
            });

            setShowAnswer(true);
            setTimeoutNotice(true);
          }
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizState?.currentQuestionIndex, quizState?.isCompleted, showAnswer]);

  // ========= No quiz in progress ==========
  if (!quizState) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}>
        <ThemedView
          style={[styles.emptyState, { backgroundColor: theme.background }]}>
          <Text style={styles.emptyIcon}>📝</Text>
          <ThemedText style={[styles.emptyTitle, { color: theme.tint }]}>
            {startQuizMutation.isPending
              ? "Loading Quiz"
              : "No Quiz in Progress"}
          </ThemedText>
          <ThemedText style={[styles.emptyText, { color: theme.text }]}>
            {startQuizMutation.isPending
              ? "Fetching questions from the server..."
              : "Select a category from the home screen to start a new quiz!"}
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const progress =
    ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    if (showAnswer) return; // Prevent changing answer after showing result

    const newSelectedAnswers = [...quizState.selectedAnswers];
    newSelectedAnswers[quizState.currentQuestionIndex] = optionIndex;

    setQuizState({
      ...quizState,
      selectedAnswers: newSelectedAnswers,
    });
  };

  const handleSubmitAnswer = () => {
    const selectedAnswer =
      quizState.selectedAnswers[quizState.currentQuestionIndex];

    if (selectedAnswer === null) return;

    setShowAnswer(true);

    // Update score if correct
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setQuizState({
        ...quizState,
        score: quizState.score + 1,
      });
    }
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setTimeoutNotice(false);

    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: quizState.currentQuestionIndex + 1,
      });
    } else {
      // Quiz completed
      setQuizState({
        ...quizState,
        isCompleted: true,
      });
    }
  };

  const handleRestartQuiz = async () => {
    if (!categoryId) return;

    try {
      const response = await startQuizMutation.mutateAsync(categoryId);

      const normalizedQuestions = response.questions.map((question) => {
        let correctIndex: number;

        if (typeof question.correctAnswer === "number") {
          correctIndex = question.correctAnswer;
        } else if (!isNaN(Number(question.correctAnswer))) {
          correctIndex = Number(question.correctAnswer);
        } else {
          correctIndex = question.options.findIndex(
            (option) => option === question.correctAnswer,
          );
        }

        return {
          id: question._id,
          question: question.question,
          options: question.options,
          correctAnswer: correctIndex >= 0 ? correctIndex : 0,
          timer: question.timer,
          score: question.score,
          category: categoryName,
          categoryId: categoryId,
        };
      });

      setQuizState({
        category_id: categoryId,
        questions: normalizedQuestions,
        currentQuestionIndex: 0,
        selectedAnswers: new Array(normalizedQuestions.length).fill(null),
        score: 0,
        isCompleted: false,
      });

      setSubmissionResult(null);
      setShowAnswer(false);
      setTimeoutNotice(false);
      hasSubmittedRef.current = false;
    } catch (error) {
      console.error("Failed to restart quiz:", error);
    }
  };

  const selectedAnswer =
    quizState.selectedAnswers[quizState.currentQuestionIndex];

  // ========== Quiz completed - Show results ==========
  if (quizState.isCompleted) {
    const percentage =
      submissionResult?.percentage ??
      Math.round((quizState.score / quizState.questions.length) * 100);
    const passed = percentage >= 60;
    const correctAnswers = submissionResult?.correct_answers ?? quizState.score;
    const wrongAnswers =
      submissionResult?.wrong_answers ??
      quizState.questions.length - quizState.score;
    const scoreDisplay =
      submissionResult?.score ??
      `${quizState.score}/${quizState.questions.length}`;

    return (
      <ThemedView style={[{ backgroundColor: theme.background }, { flex: 1 }]}>
        <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
          <ScrollView
            style={[styles.scrollView, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.resultsContainer}>
            <View
              style={[
                styles.resultsCard,
                { backgroundColor: theme.background },
              ]}>
              <Text style={styles.resultsIcon}>{passed ? "🎉" : "📚"}</Text>
              <Text style={[styles.resultsTitle, { color: theme.tint }]}>
                {passed ? "Congratulations!" : "Keep Learning!"}
              </Text>
              <Text style={[styles.resultsSubtitle, { color: theme.text }]}>
                Quiz Completed
              </Text>

              <View
                style={[
                  styles.scoreContainer,
                  { backgroundColor: theme.background },
                ]}>
                <Text style={[styles.scoreLabel, { color: theme.text }]}>
                  Your Score
                </Text>
                <Text style={[styles.scoreValue, { color: theme.tint }]}>
                  {scoreDisplay}
                </Text>
                <Text style={[styles.scorePercentage, { color: theme.tint }]}>
                  {percentage}%
                </Text>
                {submissionResult?.comment && (
                  <Text style={[styles.scoreComment, { color: theme.text }]}>
                    {submissionResult.comment}
                  </Text>
                )}
              </View>

              <View style={styles.resultStats}>
                <View style={styles.resultStatItem}>
                  <Text style={styles.resultStatValue}>{correctAnswers}</Text>
                  <Text style={styles.resultStatLabel}>Correct</Text>
                </View>
                <View style={styles.resultStatItem}>
                  <Text style={[styles.resultStatValue, styles.wrongColor]}>
                    {wrongAnswers}
                  </Text>
                  <Text style={styles.resultStatLabel}>Wrong</Text>
                </View>
                <View style={styles.resultStatItem}>
                  <Text style={styles.resultStatValue}>
                    {quizState.questions.length}
                  </Text>
                  <Text style={styles.resultStatLabel}>Total</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.restartButton}
                onPress={handleRestartQuiz}>
                <Text style={styles.restartButtonText}>🔄 Try Again</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Quiz in progress
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.quizContainer,
          { backgroundColor: theme.background },
          isWideScreen && styles.quizContainerWide,
        ]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            isWeb && styles.webHeader,
            { backgroundColor: theme.background },
          ]}>
          <Text style={styles.categoryBadge}>{categoryName}</Text>
          <View style={styles.questionCounterAndTimer}>
            <Text style={[styles.questionCounter, { color: theme.text }]}>
              Question {quizState.currentQuestionIndex + 1} of{" "}
              {quizState.questions.length}
            </Text>

            <View style={styles.timerContainer}>
              <Text
                style={[
                  styles.timerText,
                  timeLeft <= 5 && styles.timerWarning,
                ]}>
                ⏱️ {timeLeft}s
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <ScrollView
          style={[styles.scrollView, { backgroundColor: theme.background }]}
          showsVerticalScrollIndicator={false}>
          {/* Question */}
          <View
            style={[
              styles.questionCard,
              { backgroundColor: theme.background },
            ]}>
            <Text style={[styles.questionText, { color: theme.text }]}>
              {currentQuestion.question}
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {timeoutNotice && (
              <Text style={styles.timeoutText}>
                ⏰ Time&apos;s up! Next question please.
              </Text>
            )}
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showCorrect =
                showAnswer && selectedAnswer !== null && isCorrect;
              const showWrong =
                showAnswer &&
                selectedAnswer !== null &&
                isSelected &&
                !isCorrect;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && !showAnswer && styles.optionSelected,
                    showCorrect && styles.optionCorrect,
                    showWrong && styles.optionWrong,
                    { backgroundColor: theme.background },
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={showAnswer}>
                  <View style={styles.optionContent}>
                    <View
                      style={[
                        styles.optionRadio,
                        isSelected && !showAnswer && styles.optionRadioSelected,
                        showCorrect && styles.optionRadioCorrect,
                        showWrong && styles.optionRadioWrong,
                      ]}>
                      {isSelected && !showAnswer && (
                        <View style={styles.optionRadioInner} />
                      )}
                      {showCorrect && <Text style={styles.checkmark}>✓</Text>}
                      {showWrong && <Text style={styles.crossmark}>✕</Text>}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        (showCorrect || showWrong) && styles.optionTextBold,
                        { color: theme.text },
                      ]}>
                      {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Add bottom spacing for web to prevent button overlap */}
          {isWeb && <View style={{ height: 100 }} />}
        </ScrollView>

        {/* Action Button */}
        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          {!showAnswer ? (
            <TouchableOpacity
              style={[
                styles.actionButton,
                selectedAnswer === null && styles.actionButtonDisabled,
                isWeb && styles.actionButtonWeb,
              ]}
              onPress={handleSubmitAnswer}
              disabled={selectedAnswer === null}>
              <Text style={styles.actionButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, isWeb && styles.actionButtonWeb]}
              onPress={handleNextQuestion}>
              <Text style={styles.actionButtonText}>
                {quizState.currentQuestionIndex < quizState.questions.length - 1
                  ? "Next Question →"
                  : "View Results"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 24,
  },
  quizContainer: {
    flex: 1,
  },
  quizContainerWide: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginTop: -16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EAED",
  },
  webHeader: {
    paddingVertical: 16,
    marginTop: 0,
  },
  categoryBadge: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5B48E8",
    backgroundColor: "#F0EDFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  questionCounterAndTimer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  timerContainer: {
    marginTop: 0,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B48E8",
    marginBottom: 8,
  },
  timerWarning: {
    color: "#F44336",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#E8EAED",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#5B48E8",
  },
  questionCard: {
    margin: 20,
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    lineHeight: 28,
  },
  timeoutText: {
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "#f44336",
    marginBottom: 8,
    padding: 5,
    borderRadius: 6,
  },

  optionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E8EAED",
    padding: 16,
  },
  optionSelected: {
    borderColor: "#5B48E8",
    backgroundColor: "#F0EDFF",
  },
  optionCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  optionWrong: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#BDC3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  optionRadioSelected: {
    borderColor: "#5B48E8",
  },
  optionRadioCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF50",
  },
  optionRadioWrong: {
    borderColor: "#F44336",
    backgroundColor: "#F44336",
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#5B48E8",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  crossmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: "#2C3E50",
  },
  optionTextBold: {
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8EAED",
  },
  actionButton: {
    backgroundColor: "#5B48E8",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#5B48E8",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: -32,
  },
  actionButtonWeb: {
    marginBottom: 0,
  },
  actionButtonDisabled: {
    backgroundColor: "#BDC3C7",
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultsContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  resultsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  resultsIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 32,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 24,
    paddingHorizontal: 40,
    backgroundColor: "#F0EDFF",
    borderRadius: 16,
    width: "100%",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#5B48E8",
  },
  scorePercentage: {
    fontSize: 24,
    fontWeight: "600",
    color: "#5B48E8",
    marginTop: 4,
  },
  scoreComment: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 12,
    fontStyle: "italic",
  },
  resultStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 32,
  },
  resultStatItem: {
    alignItems: "center",
  },
  resultStatValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  wrongColor: {
    color: "#F44336",
  },
  resultStatLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 4,
  },
  restartButton: {
    backgroundColor: "#5B48E8",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    shadowColor: "#5B48E8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  restartButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
