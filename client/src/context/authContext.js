import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Provider as PaperProvider,
  ActivityIndicator,
  Text,
  Snackbar,
} from "react-native-paper";
import { View, StyleSheet, Alert } from "react-native";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(""); // To store user info

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const onDismissSnackBar = () => setSnackbarVisible(false);

  useEffect(() => {
    // loads the token from storage if available
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setAuthToken(token);
          console.log("token in loadtoken", token);
          // decoding token for authenticity if needed
        }
      } catch (error) {
        console.error("Failed to load auth token:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  // recieve the token from server and set it to storage
  const signIn = async (token, navigation) => {
    try {
      await AsyncStorage.setItem("authToken", token);
      setAuthToken(token);

      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to save auth token:", error);
      Alert.alert("Error", "Could not save login session.");
    }
  };

  // removes the token from the storage and resets the navigation stack
  const signOut = async (navigation) => {
    try {
      await AsyncStorage.removeItem("authToken");
      setAuthToken("");
      setUser("");
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    } catch (error) {
      console.error("Failed to remove auth token:", error);
      Alert.alert("Error", "Could not log out.");
    }
  };

  const authContextValue = {
    authToken,
    signIn,
    signOut,
    isLoading,
    user,
    setUser,
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" animating={true} color="#6200ee" />
        <Text>Loading app...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  snackbar: {
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
});
