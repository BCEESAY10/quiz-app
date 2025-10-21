import { MOCK_CATEGORY_STATS } from "@/mock/category-stats";
import { MOCK_QUIZ_HISTORY } from "@/mock/history";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScoresScreen() {
  const [selectedTab, setSelectedTab] = useState<"overview" | "history">(
    "overview"
  );

  // Calculate overall stats
  const totalQuizzes = MOCK_QUIZ_HISTORY.length;
  const totalScore = MOCK_QUIZ_HISTORY.reduce(
    (sum, quiz) => sum + quiz.score,
    0
  );
  const totalPossible = MOCK_QUIZ_HISTORY.reduce(
    (sum, quiz) => sum + quiz.totalQuestions,
    0
  );
  const overallAccuracy = Math.round((totalScore / totalPossible) * 100);
  const averageScore = Math.round(totalScore / totalQuizzes);

  // Get best performance
  const bestQuiz = MOCK_QUIZ_HISTORY.reduce((best, quiz) => {
    const currentPercentage = (quiz.score / quiz.totalQuestions) * 100;
    const bestPercentage = (best.score / best.totalQuestions) * 100;
    return currentPercentage > bestPercentage ? quiz : best;
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getScoreColor = (score: number, total: number): string => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "#4CAF50";
    if (percentage >= 60) return "#FF9800";
    return "#F44336";
  };

  const getPerformanceLabel = (percentage: number): string => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Great";
    if (percentage >= 70) return "Good";
    if (percentage >= 60) return "Fair";
    return "Needs Improvement";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Scores 📊</Text>
        <Text style={styles.headerSubtitle}>Track your progress</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "overview" && styles.tabActive]}
          onPress={() => setSelectedTab("overview")}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "overview" && styles.tabTextActive,
            ]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "history" && styles.tabActive]}
          onPress={() => setSelectedTab("history")}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "history" && styles.tabTextActive,
            ]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {selectedTab === "overview" ? (
          <View style={styles.content}>
            {/* Overall Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overall Performance</Text>
              <View style={styles.overallStatsContainer}>
                <View style={styles.overallStatCard}>
                  <Text style={styles.overallStatValue}>{totalQuizzes}</Text>
                  <Text style={styles.overallStatLabel}>Total Quizzes</Text>
                </View>
                <View style={styles.overallStatCard}>
                  <Text style={[styles.overallStatValue, { color: "#4CAF50" }]}>
                    {overallAccuracy}%
                  </Text>
                  <Text style={styles.overallStatLabel}>Accuracy</Text>
                </View>
                <View style={styles.overallStatCard}>
                  <Text style={[styles.overallStatValue, { color: "#5B48E8" }]}>
                    {averageScore}/10
                  </Text>
                  <Text style={styles.overallStatLabel}>Avg Score</Text>
                </View>
              </View>
            </View>

            {/* Best Performance */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Best Performance</Text>
              <View style={styles.bestPerformanceCard}>
                <View style={styles.bestPerformanceHeader}>
                  <Text style={styles.bestPerformanceCategory}>
                    {bestQuiz.category}
                  </Text>
                  <Text style={styles.bestPerformanceBadge}>🏆 Best</Text>
                </View>
                <View style={styles.bestPerformanceBody}>
                  <Text style={styles.bestPerformanceScore}>
                    {bestQuiz.score}/{bestQuiz.totalQuestions}
                  </Text>
                  <Text style={styles.bestPerformancePercentage}>
                    {Math.round(
                      (bestQuiz.score / bestQuiz.totalQuestions) * 100
                    )}
                    %
                  </Text>
                </View>
                <Text style={styles.bestPerformanceDate}>
                  {formatDate(bestQuiz.date)}
                </Text>
              </View>
            </View>

            {/* Category Performance */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance by Category</Text>
              {MOCK_CATEGORY_STATS.map((stat) => (
                <View key={stat.category} style={styles.categoryStatCard}>
                  <View style={styles.categoryStatHeader}>
                    <View style={styles.categoryStatLeft}>
                      <Text style={styles.categoryStatIcon}>{stat.icon}</Text>
                      <View>
                        <Text style={styles.categoryStatName}>
                          {stat.category}
                        </Text>
                        <Text style={styles.categoryStatQuizzes}>
                          {stat.totalQuizzes}{" "}
                          {stat.totalQuizzes === 1 ? "quiz" : "quizzes"}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.categoryStatAccuracy,
                        { color: stat.color },
                      ]}>
                      {stat.accuracy}%
                    </Text>
                  </View>
                  <View style={styles.categoryStatProgress}>
                    <View style={styles.categoryStatProgressBar}>
                      <View
                        style={[
                          styles.categoryStatProgressFill,
                          {
                            width: `${stat.accuracy}%`,
                            backgroundColor: stat.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.categoryStatFooter}>
                    <Text style={styles.categoryStatDetail}>
                      Best: {stat.bestScore}%
                    </Text>
                    <Text style={styles.categoryStatDetail}>
                      Avg: {stat.averageScore}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            {/* Quiz History */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Quizzes</Text>
              {MOCK_QUIZ_HISTORY.map((quiz) => {
                const percentage = Math.round(
                  (quiz.score / quiz.totalQuestions) * 100
                );
                const scoreColor = getScoreColor(
                  quiz.score,
                  quiz.totalQuestions
                );
                const performance = getPerformanceLabel(percentage);

                return (
                  <View key={quiz.id} style={styles.historyCard}>
                    <View style={styles.historyCardHeader}>
                      <View style={styles.historyCardLeft}>
                        <Text style={styles.historyCardCategory}>
                          {quiz.category}
                        </Text>
                        <Text style={styles.historyCardDate}>
                          {formatDate(quiz.date)}
                        </Text>
                      </View>
                      <View style={styles.historyCardRight}>
                        <Text
                          style={[
                            styles.historyCardScore,
                            { color: scoreColor },
                          ]}>
                          {quiz.score}/{quiz.totalQuestions}
                        </Text>
                        <Text style={styles.historyCardPercentage}>
                          {percentage}%
                        </Text>
                      </View>
                    </View>
                    <View style={styles.historyCardBody}>
                      <View style={styles.historyCardProgressBar}>
                        <View
                          style={[
                            styles.historyCardProgressFill,
                            {
                              width: `${percentage}%`,
                              backgroundColor: scoreColor,
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <View style={styles.historyCardFooter}>
                      <View style={styles.historyCardTag}>
                        <Text style={styles.historyCardTagText}>
                          {quiz.difficulty}
                        </Text>
                      </View>
                      <Text style={styles.historyCardTime}>
                        ⏱️ {quiz.timeSpent}
                      </Text>
                      <View
                        style={[
                          styles.historyCardBadge,
                          { backgroundColor: scoreColor + "20" },
                        ]}>
                        <Text
                          style={[
                            styles.historyCardBadgeText,
                            { color: scoreColor },
                          ]}>
                          {performance}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EAED",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#5B48E8",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7F8C8D",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
  },
  overallStatsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  overallStatCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  overallStatValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  overallStatLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 6,
    textAlign: "center",
  },
  bestPerformanceCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bestPerformanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bestPerformanceCategory: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  bestPerformanceBadge: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9800",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestPerformanceBody: {
    alignItems: "center",
    marginBottom: 12,
  },
  bestPerformanceScore: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  bestPerformancePercentage: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4CAF50",
    marginTop: 4,
  },
  bestPerformanceDate: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
  },
  categoryStatCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryStatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryStatLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryStatIcon: {
    fontSize: 28,
  },
  categoryStatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  categoryStatQuizzes: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 2,
  },
  categoryStatAccuracy: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryStatProgress: {
    marginBottom: 12,
  },
  categoryStatProgressBar: {
    height: 8,
    backgroundColor: "#E8EAED",
    borderRadius: 4,
    overflow: "hidden",
  },
  categoryStatProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  categoryStatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryStatDetail: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyCardLeft: {
    flex: 1,
  },
  historyCardCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  historyCardDate: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 2,
  },
  historyCardRight: {
    alignItems: "flex-end",
  },
  historyCardScore: {
    fontSize: 20,
    fontWeight: "bold",
  },
  historyCardPercentage: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 2,
  },
  historyCardBody: {
    marginBottom: 12,
  },
  historyCardProgressBar: {
    height: 6,
    backgroundColor: "#E8EAED",
    borderRadius: 3,
    overflow: "hidden",
  },
  historyCardProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  historyCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  historyCardTag: {
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  historyCardTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7F8C8D",
  },
  historyCardTime: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  historyCardBadge: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  historyCardBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 30,
  },
});
