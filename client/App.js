import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppNav from "./src/navigation/appNav.js";
import { AuthProvider } from "./src/context/authContext.js";
import { PaperProvider } from "react-native-paper";

// we make available the context info and the usage of paper components
export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
