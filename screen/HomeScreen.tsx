import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useCategories } from "@/hooks/use-categories";
import {
  useLeaderboard,
  useScoreHistory,
  useScoreOverview,
} from "@/hooks/use-scores";
import { useAuth } from "@/provider/UserProvider";
import { Category, LeaderboardEntry, QuizRecord, Stats } from "@/types/home";
import { useRouter } from "expo-router";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Add type imports
import ReviewModal from "@/app/modal";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { IconRegistry } from "@/components/ui/shared/icons/icon-registry";
import { useReviewPrompt } from "@/hooks/use-review-prompt";
import { useAppTheme } from "@/provider/ThemeProvider";
import type { ViewProps } from "react-native";
import type { SafeAreaViewProps } from "react-native-safe-area-context";

// Define prop types for themed components
type ThemedViewProps = ViewProps & {
  children?: React.ReactNode;
  style?: any;
};

type SafeAreaProps = SafeAreaViewProps & {
  children?: React.ReactNode;
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useAppTheme();
  const userId = user?.id ?? "";

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isWideScreen = isWeb && width >= 768;

  const { data: categoriesData = [] } = useCategories();
  const { data: scoreOverview } = useScoreOverview(userId, !!userId);
  const { data: scoreHistory } = useScoreHistory(userId, 1, !!userId);
  const { data: leaderboardData } = useLeaderboard(1, 5);

  const userName = user?.fullName ?? "User";
  const quizzesCompleted =
    scoreOverview?.total_quizzes ?? user?.stats?.quizzesCompleted ?? 0;

  const {
    shouldShow,
    isChecking,
    handleDismiss,
    handleDontAskAgain,
    handleSubmitSuccess,
  } = useReviewPrompt(quizzesCompleted);

  const CATEGORY_META: Record<string, { icon: string; color: string }> = {
    science: { icon: "science", color: "#4CAF50" },
    sports: { icon: "sports", color: "#FF9800" },
    english: { icon: "english", color: "#2196F3" },
    geography: { icon: "geography", color: "#00BCD4" },
    history: { icon: "history", color: "#9C27B0" },
    literature: { icon: "literature", color: "#3F51B5" },
    arts: { icon: "arts", color: "#E91E63" },
    computer: { icon: "computer", color: "#607D8B" },
    maths: { icon: "maths", color: "#F44336" },
    math: { icon: "maths", color: "#F44336" },
  };

  const getCategoryMeta = (name: string, icon?: string) => {
    const key = (icon || name).toLowerCase();
    return CATEGORY_META[key] ?? { icon: "science", color: "#5B48E8" };
  };

  const categories: Category[] = categoriesData.map((category) => {
    const meta = getCategoryMeta(category.name, category.icon);
    return {
      id: category.id,
      name: category.name,
      icon: meta.icon,
      color: meta.color,
    };
  });

  const stats: Stats = {
    completed: scoreOverview?.total_quizzes ?? 0,
    points: scoreOverview?.total_points ?? 0,
    streak: scoreOverview?.streak ?? 0,
  };

  const recentQuizzes: QuizRecord[] =
    scoreHistory?.scores?.map((quiz) => ({
      id: quiz.id,
      category: quiz.category_name,
      score: quiz.score,
      total: quiz.total_questions,
      date: quiz.completed_at,
    })) ?? [];

  const leaderboard: LeaderboardEntry[] =
    leaderboardData?.leaderboard?.map((entry) => ({
      id: entry.user_id,
      name: entry.fullname,
      points: entry.total_points,
      rank: entry.rank,
    })) ?? [];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleCategorySelect = (category: Category) => {
    router.push({
      pathname: "/quiz",
      params: {
        categoryId: category.id,
        categoryName: category.name,
      },
    });
  };

  return (
    <ThemedView
      style={[{ backgroundColor: theme.background }, { flex: 1 }]}
      {...({} as ThemedViewProps)}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["top", "right", "left"]}
        {...({} as SafeAreaProps)}>
        <ScrollView
          style={[styles.scrollView, { backgroundColor: theme.background }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={isWideScreen && styles.wideContainer}>
          {/* Hero Section */}
          <ThemedView
            style={[
              styles.header,
              { backgroundColor: theme.background },
              isWeb && styles.headerWeb,
            ]}>
            <ThemedView style={{ backgroundColor: theme.background }}>
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
          </ThemedView>

          {/* Stats Dashboard */}
          <ThemedView
            style={[
              styles.statsContainer,
              { backgroundColor: theme.background },
              isWideScreen && styles.statsContainerWide,
            ]}>
            <ThemedView
              style={[
                styles.statCard,
                { backgroundColor: theme.background },
                isWideScreen && styles.statCardWide,
              ]}>
              <ThemedText style={[styles.statValue, { color: theme.tint }]}>
                {stats.completed}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.icon }]}>
                Completed
              </ThemedText>
            </ThemedView>

            <ThemedView
              style={[
                styles.statCard,
                { backgroundColor: theme.background },
                isWideScreen && styles.statCardWide,
              ]}>
              <ThemedText style={[styles.statValue, { color: theme.tint }]}>
                {stats.points}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.icon }]}>
                Points
              </ThemedText>
            </ThemedView>

            <ThemedView
              style={[
                styles.statCard,
                { backgroundColor: theme.background },
                isWideScreen && styles.statCardWide,
              ]}>
              <View style={styles.streakContainer}>
                <ThemedText style={[styles.statValue, { color: theme.tint }]}>
                  {stats.streak}
                </ThemedText>

                <IconSymbol
                  name="flame.fill"
                  color="#FF5722"
                  size={22}
                  style={{ marginLeft: 4 }}
                />
              </View>

              <ThemedText style={[styles.statLabel, { color: theme.icon }]}>
                Day Streak
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Categories Section */}
          <View style={{ width: "100%" }}>
            <ThemedView
              style={[
                styles.section,
                { backgroundColor: theme.background },
                isWideScreen && styles.sectionWide,
              ]}>
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Choose a Category
              </ThemedText>

              <ThemedView
                style={[
                  styles.categoriesGrid,
                  { backgroundColor: theme.background },
                  isWideScreen && styles.categoriesGridWide,
                ]}>
                {categories.map((category) => {
                  const IconComponent =
                    IconRegistry[category.icon as keyof typeof IconRegistry];

                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryCard,
                        {
                          borderLeftColor: category.color,
                          backgroundColor: theme.background,
                        },
                        isWideScreen && styles.categoryCardWide,
                      ]}
                      onPress={() => handleCategorySelect(category)}>
                      {IconComponent ? (
                        <IconComponent
                          width={48}
                          height={48}
                          fill={category.color}
                          style={styles.categoryIcon}
                        />
                      ) : null}
                      <ThemedText
                        style={[styles.categoryName, { color: theme.text }]}>
                        {category.name}
                      </ThemedText>
                      {typeof category.questions === "number" ? (
                        <ThemedText
                          style={[
                            styles.categoryQuestions,
                            { color: theme.icon },
                          ]}>
                          {category.questions} questions
                        </ThemedText>
                      ) : (
                        <ThemedText
                          style={[
                            styles.categoryQuestions,
                            { color: theme.icon },
                          ]}>
                          Tap to start
                        </ThemedText>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ThemedView>
            </ThemedView>
          </View>

          {/* Recent Activity & Leaderboard Row */}
          <View
            style={[
              styles.bottomSection,
              isWideScreen && styles.bottomSectionWide,
            ]}>
            {/* Recent Activity */}
            <ThemedView
              style={[
                styles.section,
                { backgroundColor: theme.background },
                isWideScreen && styles.sectionHalf,
              ]}>
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
                      {formatDate(quiz.date)}
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
                      style={[
                        styles.activityPercentage,
                        { color: theme.tint },
                      ]}>
                      {Math.round((quiz.score / quiz.total) * 100)}%
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              ))}
            </ThemedView>

            {/* Leaderboard Preview */}
            <ThemedView
              style={[
                styles.section,
                { backgroundColor: theme.background },
                isWideScreen && styles.sectionHalf,
              ]}>
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Leaderboard
              </ThemedText>

              {leaderboard.map((player) => (
                <ThemedView
                  key={player.id}
                  style={[
                    styles.leaderboardCard,
                    { backgroundColor: theme.background },
                    player.id === userId && styles.leaderboardHighlight,
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
                        player.id === userId && styles.leaderboardYou,
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
          </View>

          <ThemedView
            style={[
              styles.bottomPadding,
              { backgroundColor: theme.background },
            ]}
          />
        </ScrollView>

        {/* Review Modal - automatically shows at milestones */}
        {!isChecking && (
          <ReviewModal
            visible={shouldShow}
            onClose={handleDismiss}
            onSubmitSuccess={handleSubmitSuccess}
            onDontAskAgain={handleDontAskAgain}
          />
        )}
      </SafeAreaView>
    </ThemedView>
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
  wideContainer: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  menuButton: {
    padding: 4,
  },
  headerWeb: {
    paddingTop: 30,
    paddingBottom: 44,
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
  statsContainerWide: {
    paddingHorizontal: 20,
    gap: 16,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardWide: {
    padding: 20,
    minHeight: 100,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 20,
    width: "100%",
  },
  sectionWide: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
    marginTop: 34,
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
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoriesGridWide: {
    gap: 16,
    display: "flex",
    justifyContent: "flex-start",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  categoryCardWide: {
    width: "31%",
    padding: 20,
    minWidth: 220,
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
  bottomSection: {
    flexDirection: "column",
  },
  bottomSectionWide: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  sectionHalf: {
    flex: 1,
    paddingHorizontal: 0,
    marginTop: 28,
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
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
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
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
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
