import { StyleSheet, Text, View } from "react-native";

type AvatarProps = {
  fullName: string;
};

export const Avatar = ({ fullName }: AvatarProps) => {
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#5B48E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
