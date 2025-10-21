import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // Mock data - replace with actual data from your state/API
  const userName = "BCeesay";
  const stats = {
    completed: 24,
    streak: 5,
    points: 1250,
    accuracy: 87,
  };

  const categories = [
    { id: 1, name: "Science", icon: "🧪", questions: 50, color: "#4CAF50" },
    { id: 2, name: "Sports", icon: "⚽", questions: 45, color: "#FF9800" },
    { id: 3, name: "English", icon: "📚", questions: 60, color: "#2196F3" },
    { id: 4, name: "History", icon: "🏛️", questions: 40, color: "#9C27B0" },
    { id: 5, name: "Geography", icon: "🌍", questions: 55, color: "#00BCD4" },
    { id: 6, name: "Math", icon: "🔢", questions: 48, color: "#F44336" },
  ];

  const recentQuizzes = [
    { id: 1, category: "Science", score: 8, total: 10, date: "Today" },
    { id: 2, category: "Sports", score: 7, total: 10, date: "Yesterday" },
  ];

  const leaderboard = [
    { id: 1, name: "Sarah", points: 2100, rank: 1 },
    { id: 2, name: "Mike", points: 1890, rank: 2 },
    { id: 3, name: "You", points: 1250, rank: 3 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.header}>
          <Text style={styles.logo}>🧠 QuizMaster</Text>
          <Text style={styles.welcome}>Welcome back, {userName}! 👋</Text>
          <Text style={styles.tagline}>Test your knowledge today</Text>
        </View>

        {/* Stats Dashboard */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.streak}🔥</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        {/* Primary CTA */}
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>🎯 Start New Quiz</Text>
        </TouchableOpacity>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  { borderLeftColor: category.color },
                ]}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryQuestions}>
                  {category.questions} questions
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentQuizzes.map((quiz) => (
            <View key={quiz.id} style={styles.activityCard}>
              <View style={styles.activityLeft}>
                <Text style={styles.activityCategory}>{quiz.category}</Text>
                <Text style={styles.activityDate}>{quiz.date}</Text>
              </View>
              <View style={styles.activityRight}>
                <Text style={styles.activityScore}>
                  {quiz.score}/{quiz.total}
                </Text>
                <Text style={styles.activityPercentage}>
                  {Math.round((quiz.score / quiz.total) * 100)}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Leaderboard Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          {leaderboard.map((player) => (
            <View
              key={player.id}
              style={[
                styles.leaderboardCard,
                player.name === "You" && styles.leaderboardHighlight,
              ]}>
              <View style={styles.leaderboardLeft}>
                <Text style={styles.leaderboardRank}>#{player.rank}</Text>
                <Text
                  style={[
                    styles.leaderboardName,
                    player.name === "You" && styles.leaderboardYou,
                  ]}>
                  {player.name}
                </Text>
              </View>
              <Text style={styles.leaderboardPoints}>{player.points} pts</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View Full Leaderboard →</Text>
          </TouchableOpacity>
        </View>

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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1A1A1A",
  },
  welcome: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
    color: "#2C3E50",
  },
  tagline: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
    color: "#7F8C8D",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  statLabel: {
    fontSize: 11,
    color: "#7F8C8D",
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: "#5B48E8",
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 14,
    shadowColor: "#5B48E8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  categoryQuestions: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityLeft: {
    flex: 1,
  },
  activityCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  activityDate: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 4,
  },
  activityRight: {
    alignItems: "flex-end",
  },
  activityScore: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B48E8",
  },
  activityPercentage: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 2,
  },
  leaderboardCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leaderboardHighlight: {
    backgroundColor: "#F0EDFF",
    borderWidth: 2,
    borderColor: "#5B48E8",
  },
  leaderboardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leaderboardRank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7F8C8D",
    width: 35,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  leaderboardYou: {
    color: "#5B48E8",
  },
  leaderboardPoints: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B48E8",
  },
  viewAllButton: {
    marginTop: 8,
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5B48E8",
    textAlign: "center",
  },
  bottomPadding: {
    height: 30,
  },
});
