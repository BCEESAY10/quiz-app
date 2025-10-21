import { StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Contact() {
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.title}>Contact Us</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
  },
});
