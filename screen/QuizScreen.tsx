import { MOCK_QUESTIONS } from "@/mock/questions";
import { Question, QuizState } from "@/types/quiz";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const category = params.category as string;

  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Timer configuration per category/question type
  const getQuestionTime = (question: Question): number => {
    if (question.category === "Math") {
      return 30;
    }

    if (
      question.category === "Science" &&
      (question.question.includes("speed") ||
        question.question.includes("calculate") ||
        question.question.includes("value"))
    ) {
      return 30;
    }

    return 15;
  };

  // Initialize quiz when category is provided
  useEffect(() => {
    if (category && MOCK_QUESTIONS[category]) {
      setQuizState({
        questions: MOCK_QUESTIONS[category],
        currentQuestionIndex: 0,
        selectedAnswers: new Array(MOCK_QUESTIONS[category].length).fill(null),
        score: 0,
        isCompleted: false,
      });
    }
  }, [category]);

  // Timer effect
  useEffect(() => {
    if (!quizState || quizState.isCompleted || showAnswer) {
      setTimerActive(false);
      return;
    }

    // Initialize timer for current question
    const questionTime = getQuestionTime(currentQuestion);
    setTimeLeft(questionTime);
    setTimerActive(true);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up! Auto-submit as wrong
          setTimerActive(false);
          setShowAnswer(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizState?.currentQuestionIndex, showAnswer]);

  // No quiz in progress
  if (!quizState) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>No Quiz in Progress</Text>
          <Text style={styles.emptyText}>
            Select a category from the home screen to start a new quiz!
          </Text>
        </View>
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

    setTimerActive(false);
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
      setTimerActive(false);
    }
  };

  const handleRestartQuiz = () => {
    setQuizState({
      questions: quizState.questions,
      currentQuestionIndex: 0,
      selectedAnswers: new Array(quizState.questions.length).fill(null),
      score: 0,
      isCompleted: false,
    });
    setShowAnswer(false);
  };

  const selectedAnswer =
    quizState.selectedAnswers[quizState.currentQuestionIndex];

  // Quiz completed - Show results
  if (quizState.isCompleted) {
    const percentage = Math.round(
      (quizState.score / quizState.questions.length) * 100
    );
    const passed = percentage >= 60;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.resultsContainer}>
          <View style={styles.resultsCard}>
            <Text style={styles.resultsIcon}>{passed ? "🎉" : "📚"}</Text>
            <Text style={styles.resultsTitle}>
              {passed ? "Congratulations!" : "Keep Learning!"}
            </Text>
            <Text style={styles.resultsSubtitle}>Quiz Completed</Text>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Your Score</Text>
              <Text style={styles.scoreValue}>
                {quizState.score}/{quizState.questions.length}
              </Text>
              <Text style={styles.scorePercentage}>{percentage}%</Text>
            </View>

            <View style={styles.resultStats}>
              <View style={styles.resultStatItem}>
                <Text style={styles.resultStatValue}>{quizState.score}</Text>
                <Text style={styles.resultStatLabel}>Correct</Text>
              </View>
              <View style={styles.resultStatItem}>
                <Text style={[styles.resultStatValue, styles.wrongColor]}>
                  {quizState.questions.length - quizState.score}
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
    );
  }

  // Quiz in progress
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.quizContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.categoryBadge}>{category}</Text>
          <View style={styles.questionCounterAndTimer}>
            <Text style={styles.questionCounter}>
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
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {/* Question */}
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showCorrect = showAnswer && isCorrect;
              const showWrong = showAnswer && isSelected && !isCorrect;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && !showAnswer && styles.optionSelected,
                    showCorrect && styles.optionCorrect,
                    showWrong && styles.optionWrong,
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
                      ]}>
                      {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Action Button */}
        <View style={styles.footer}>
          {!showAnswer ? (
            <TouchableOpacity
              style={[
                styles.actionButton,
                selectedAnswer === null && styles.actionButtonDisabled,
              ]}
              onPress={handleSubmitAnswer}
              disabled={selectedAnswer === null}>
              <Text style={styles.actionButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
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
    backgroundColor: "#F5F7FA",
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EAED",
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
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
    lineHeight: 28,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
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
    fontSize: 16,
    color: "#2C3E50",
  },
  optionTextBold: {
    fontWeight: "600",
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8EAED",
  },
  actionButton: {
    backgroundColor: "#5B48E8",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#5B48E8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
