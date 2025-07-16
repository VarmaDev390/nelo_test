import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Auth from "../pages/authentication.js";
import Home from "../pages/home.js";
import { AuthContext } from "../context/authContext.js";

const Stack = createStackNavigator();

const AppNav = () => {
  const { authToken, isLoading } = useContext(AuthContext);

  // While the token is being loaded from storage, show a loading screen.
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  return (
    // dynamic page display depending on the token availability
    <NavigationContainer>
      <Stack.Navigator initialRouteName={authToken ? "Home" : "Auth"}>
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppNav;
