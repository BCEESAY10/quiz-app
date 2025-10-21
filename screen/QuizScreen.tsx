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

// Types

// Mock quiz data
const MOCK_QUESTIONS: Record<string, Question[]> = {
  Science: [
    {
      id: 1,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Au", "Gd", "Ag"],
      correctAnswer: 1,
      category: "Science",
    },
    {
      id: 2,
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
      correctAnswer: 2,
      category: "Science",
    },
    {
      id: 3,
      question: "What planet is known as the Red Planet?",
      options: ["Venus", "Jupiter", "Mars", "Saturn"],
      correctAnswer: 2,
      category: "Science",
    },
    {
      id: 4,
      question: "What is the speed of light in vacuum?",
      options: ["299,792 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"],
      correctAnswer: 0,
      category: "Science",
    },
    {
      id: 5,
      question: "What is H2O commonly known as?",
      options: ["Oxygen", "Hydrogen", "Water", "Helium"],
      correctAnswer: 2,
      category: "Science",
    },
  ],
  Sports: [
    {
      id: 1,
      question: "How many players are on a soccer team?",
      options: ["9", "10", "11", "12"],
      correctAnswer: 2,
      category: "Sports",
    },
    {
      id: 2,
      question: "In which sport would you perform a slam dunk?",
      options: ["Tennis", "Basketball", "Volleyball", "Baseball"],
      correctAnswer: 1,
      category: "Sports",
    },
    {
      id: 3,
      question: "How many holes are there in a full round of golf?",
      options: ["9", "12", "18", "24"],
      correctAnswer: 2,
      category: "Sports",
    },
    {
      id: 4,
      question: "What is the maximum score in a single frame of bowling?",
      options: ["30", "20", "10", "15"],
      correctAnswer: 0,
      category: "Sports",
    },
    {
      id: 5,
      question: "Which country won the FIFA World Cup in 2018?",
      options: ["Brazil", "Germany", "France", "Argentina"],
      correctAnswer: 2,
      category: "Sports",
    },
  ],
  English: [
    {
      id: 1,
      question: "What is a synonym for 'happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correctAnswer: 1,
      category: "English",
    },
    {
      id: 2,
      question: "Which word is a noun?",
      options: ["Run", "Quickly", "Beautiful", "Table"],
      correctAnswer: 3,
      category: "English",
    },
    {
      id: 3,
      question: "What is the past tense of 'go'?",
      options: ["Goed", "Went", "Gone", "Going"],
      correctAnswer: 1,
      category: "English",
    },
    {
      id: 4,
      question: "Which sentence is grammatically correct?",
      options: [
        "She don't like pizza",
        "She doesn't likes pizza",
        "She doesn't like pizza",
        "She not like pizza",
      ],
      correctAnswer: 2,
      category: "English",
    },
    {
      id: 5,
      question: "What is an antonym for 'hot'?",
      options: ["Warm", "Cold", "Boiling", "Spicy"],
      correctAnswer: 1,
      category: "English",
    },
  ],
  History: [
    {
      id: 1,
      question: "In which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: 2,
      category: "History",
    },
    {
      id: 2,
      question: "Who was the first President of the United States?",
      options: [
        "Thomas Jefferson",
        "George Washington",
        "John Adams",
        "Benjamin Franklin",
      ],
      correctAnswer: 1,
      category: "History",
    },
    {
      id: 3,
      question: "What ancient wonder was located in Egypt?",
      options: [
        "Hanging Gardens",
        "Colossus",
        "Pyramids of Giza",
        "Lighthouse",
      ],
      correctAnswer: 2,
      category: "History",
    },
    {
      id: 4,
      question: "Which empire was ruled by Julius Caesar?",
      options: [
        "Greek Empire",
        "Roman Empire",
        "Persian Empire",
        "Ottoman Empire",
      ],
      correctAnswer: 1,
      category: "History",
    },
    {
      id: 5,
      question: "In which year did the Titanic sink?",
      options: ["1910", "1911", "1912", "1913"],
      correctAnswer: 2,
      category: "History",
    },
  ],
  Geography: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      category: "Geography",
    },
    {
      id: 2,
      question: "Which is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: 3,
      category: "Geography",
    },
    {
      id: 3,
      question: "What is the longest river in the world?",
      options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
      correctAnswer: 1,
      category: "Geography",
    },
    {
      id: 4,
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2,
      category: "Geography",
    },
    {
      id: 5,
      question: "What is the smallest country in the world?",
      options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      correctAnswer: 1,
      category: "Geography",
    },
  ],
  Math: [
    {
      id: 1,
      question: "What is 7 × 8?",
      options: ["54", "56", "64", "48"],
      correctAnswer: 1,
      category: "Math",
    },
    {
      id: 2,
      question: "What is the square root of 144?",
      options: ["10", "11", "12", "13"],
      correctAnswer: 2,
      category: "Math",
    },
    {
      id: 3,
      question: "What is 25% of 200?",
      options: ["25", "50", "75", "100"],
      correctAnswer: 1,
      category: "Math",
    },
    {
      id: 4,
      question: "What is the value of π (pi) approximately?",
      options: ["2.14", "3.14", "4.14", "5.14"],
      correctAnswer: 1,
      category: "Math",
    },
    {
      id: 5,
      question: "If x + 5 = 12, what is x?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2,
      category: "Math",
    },
  ],
};

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const category = params.category as string;

  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

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
          <Text style={styles.questionCounter}>
            Question {quizState.currentQuestionIndex + 1} of{" "}
            {quizState.questions.length}
          </Text>
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

          {/* Feedback */}
          {showAnswer && (
            <View
              style={[
                styles.feedbackCard,
                selectedAnswer === currentQuestion.correctAnswer
                  ? styles.feedbackCorrect
                  : styles.feedbackWrong,
              ]}>
              <Text style={styles.feedbackText}>
                {selectedAnswer === currentQuestion.correctAnswer
                  ? "🎉 Correct! Well done!"
                  : `❌ Wrong! The correct answer is: ${
                      currentQuestion.options[currentQuestion.correctAnswer]
                    }`}
              </Text>
            </View>
          )}
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
  questionCounter: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
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
  feedbackCard: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  feedbackCorrect: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  feedbackWrong: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  feedbackText: {
    fontSize: 15,
    color: "#2C3E50",
    lineHeight: 22,
  },
  footer: {
    padding: 20,
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
