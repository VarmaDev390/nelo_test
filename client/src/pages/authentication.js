// import React from "react";

// function Auth({ navigation }) {}

// export default Auth;

import React, { useState, useEffect, createContext, useContext } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  Provider as PaperProvider,
  TextInput,
  Button,
  Text,
  Snackbar,
} from "react-native-paper";
import { AuthContext } from "../context/authContext.js";
import Constants from "expo-constants";

// single page for both login and register based on isRegister state varaible
export default function Auth({ navigation }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
  const { signIn } = useContext(AuthContext);

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      const endpoint = isRegister ? "register" : "login";
      const body = isRegister ? { name, email, password } : { email, password };
      console.log("url", `${API_BASE_URL}/auth/${endpoint}`);
      const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        showSnackbar(
          isRegister ? "Registration successful!" : "Login successful!"
        );
        // call sigin to store the token
        await signIn(data.token, navigation);

        // Navigation will be handled by AuthProvider's state change
      } else {
        showSnackbar(data.msg || "Authentication failed. Please try again.");
        console.error("Auth error:", data.msg);
      }
    } catch (error) {
      console.error("Network or server error:", error);
      showSnackbar("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>{isRegister ? "Register" : "Login"}</Text>
      {isRegister && (
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          autoCapitalize="words"
        />
      )}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleAuth}
        loading={loading}
        disabled={loading}
        style={styles.authButton}
      >
        {isRegister ? "Register" : "Login"}
      </Button>
      <Button
        mode="text"
        onPress={() => setIsRegister(!isRegister)}
        disabled={loading}
        style={styles.toggleButton}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "Dismiss",
          onPress: () => setSnackbarVisible(false),
        }}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#eef2f6", // Light background for auth
  },
  authTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#34495e",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
  authButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleButton: {
    marginTop: 15,
  },

  snackbar: {
    marginBottom: 20, // Position above FAB if present
    backgroundColor: "#333",
  },
});
