import { StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.title}>About</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginTop: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
