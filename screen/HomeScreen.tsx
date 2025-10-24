import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Category, LeaderboardEntry, QuizRecord, Stats } from "@/types/home";
import { useRouter } from "expo-router";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  // ======== Mock data ==========
  const userName = "BCeesay";
  const stats: Stats = {
    completed: 24,
    streak: 5,
    points: 1250,
  };

  const categories: Category[] = [
    { id: 1, name: "Science", icon: "🧪", questions: 50, color: "#4CAF50" },
    { id: 2, name: "Sports", icon: "⚽", questions: 45, color: "#FF9800" },
    { id: 3, name: "English", icon: "📚", questions: 60, color: "#2196F3" },
    { id: 5, name: "Geography", icon: "🌍", questions: 55, color: "#00BCD4" },
    { id: 6, name: "Math", icon: "🔢", questions: 48, color: "#F44336" },
  ];

  const recentQuizzes: QuizRecord[] = [
    { id: 1, category: "Science", score: 8, total: 10, date: "Today" },
    { id: 2, category: "Sports", score: 7, total: 10, date: "Yesterday" },
  ];

  const leaderboard: LeaderboardEntry[] = [
    { id: 1, name: "Sarah", points: 2100, rank: 1 },
    { id: 2, name: "Mike", points: 1890, rank: 2 },
    { id: 3, name: "You", points: 1250, rank: 3 },
  ];

  const handleCategorySelect = (category: Category) => {
    router.push({
      pathname: "/quiz",
      params: { category: category.name },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "right", "left"]}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <ThemedView
          style={[styles.header, { backgroundColor: theme.background }]}>
          <ThemedText style={[styles.logo, { color: theme.text }]}>
            🧠 QuizMaster
          </ThemedText>
          <ThemedText style={[styles.welcome, { color: theme.tint }]}>
            Welcome back, {userName}! 👋
          </ThemedText>

          <ThemedText style={[styles.tagline, { color: theme.icon }]}>
            Test your knowledge today
          </ThemedText>
        </ThemedView>

        {/* Stats Dashboard */}
        <ThemedView
          style={[
            styles.statsContainer,
            { backgroundColor: theme.background },
          ]}>
          <ThemedView
            style={[styles.statCard, { backgroundColor: theme.background }]}>
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {stats.completed}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.icon }]}>
              Completed
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[styles.statCard, { backgroundColor: theme.background }]}>
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {stats.points}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.icon }]}>
              Points
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[styles.statCard, { backgroundColor: theme.background }]}>
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {stats.streak}🔥
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.icon }]}>
              Day Streak
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Primary CTA */}
        <ThemedView
          style={[
            styles.primaryButton,
            { backgroundColor: theme.primaryButton.background },
          ]}>
          <ThemedText
            style={[
              styles.primaryButtonText,
              { color: theme.primaryButton.text },
            ]}>
            Start New Quiz 👇
          </ThemedText>
        </ThemedView>

        {/* Categories Section */}
        <ThemedView
          style={[styles.section, { backgroundColor: theme.background }]}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Choose a Category
          </ThemedText>

          <ThemedView
            style={[
              styles.categoriesGrid,
              { backgroundColor: theme.background },
            ]}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  {
                    borderLeftColor: category.color,
                    backgroundColor: theme.background,
                  },
                ]}
                onPress={() => handleCategorySelect(category)}>
                <Text style={[styles.categoryIcon]}>{category.icon}</Text>
                <ThemedText
                  style={[styles.categoryName, { color: theme.text }]}>
                  {category.name}
                </ThemedText>
                <ThemedText
                  style={[styles.categoryQuestions, { color: theme.icon }]}>
                  {category.questions} questions
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Recent Activity */}
        <ThemedView
          style={[styles.section, { backgroundColor: theme.background }]}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Recent Activity
          </ThemedText>
          {recentQuizzes.map((quiz) => (
            <ThemedView
              key={quiz.id}
              style={[
                styles.activityCard,
                { backgroundColor: theme.background },
              ]}>
              <ThemedView
                style={[
                  styles.activityLeft,
                  { backgroundColor: theme.background },
                ]}>
                <ThemedText
                  style={[styles.activityCategory, { color: theme.text }]}>
                  {quiz.category}
                </ThemedText>
                <ThemedText
                  style={[styles.activityDate, { color: theme.icon }]}>
                  {quiz.date}
                </ThemedText>
              </ThemedView>
              <ThemedView
                style={[
                  styles.activityRight,
                  { backgroundColor: theme.background },
                ]}>
                <ThemedText
                  style={[styles.activityScore, { color: theme.text }]}>
                  {quiz.score}/{quiz.total}
                </ThemedText>
                <ThemedText
                  style={[styles.activityPercentage, { color: theme.tint }]}>
                  {Math.round((quiz.score / quiz.total) * 100)}%
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Leaderboard Preview */}
        <ThemedView
          style={[styles.section, { backgroundColor: theme.background }]}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Leaderboard
          </ThemedText>

          {leaderboard.map((player) => (
            <ThemedView
              key={player.id}
              style={[
                styles.leaderboardCard,
                { backgroundColor: theme.background },
                player.name === "You" && styles.leaderboardHighlight,
              ]}>
              <ThemedView
                style={[
                  styles.leaderboardLeft,
                  { backgroundColor: "transparent" },
                ]}>
                <ThemedText
                  style={[styles.leaderboardRank, { color: theme.icon }]}>
                  #{player.rank}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.leaderboardName,
                    { color: theme.text },
                    player.name === "You" && styles.leaderboardYou,
                  ]}>
                  {player.name}
                </ThemedText>
              </ThemedView>
              <ThemedText
                style={[styles.leaderboardPoints, { color: theme.text }]}>
                {player.points} pts
              </ThemedText>
            </ThemedView>
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <ThemedText style={[styles.viewAllText, { color: theme.tint }]}>
              View Full Leaderboard →
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView
          style={[styles.bottomPadding, { backgroundColor: theme.background }]}
        />
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

    ...(Platform.OS === "web" && {
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 40,
    }),
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
